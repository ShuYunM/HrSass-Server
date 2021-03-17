const returnJSON = require('./json')
const router = require("koa-router")();
const UserModel = require('../../model/User')
const RoleModel = require('../../model/Role')
const UserInfoModel = require('../../model/UserInfo')
const JobModel = require('../../model/Job')
const PermissionModel = require('../../model/Permission')

const UUID = require('uuid')
const { checkMobile, checkPassword, md5Str, checkLength } = require("../../utils/validate");
router.post("/login", async (ctx, next) => {
    let { mobile, password } = ctx.request.body;
    let json = { ...returnJSON }
    if (!mobile || !password) {
        json.message = "用户名或密码不能为空"
        json.success = false
    }else {
       if (checkMobile(mobile) && checkPassword(password)) {
         // 查询数据
       const pass = md5Str(password)
       const people = await UserModel.findOne({ mobile, password: pass }).lean()     
       if(people) {
          console.log(mobile +": 登录成功")
          const token = UUID.v4() // 生成一个token
          json.message = "登录成功"
          json.success = true
          json.data = token
          // 设置session
          ctx.session.user = { token, ...people} // 设置用户的token
        }else {
          console.log("用户名或密码错误")
          json.message = "用户名或密码错误"
          json.success = false
        }
       }else {
        json.message = "用户名或者密码的格式不正确"
        json.success = false
       }
    }
    ctx.body = json
})
// 获取用户的基本资料
router.post("/profile", async (ctx, next) => {
  let json = { ...returnJSON }
  const roles =  await getPermissionPoints(ctx)
  json.data = {
    userId: ctx.session.user._id,
    mobile: ctx.session.user.mobile,
    username: ctx.session.user.username,
    roles,
    companyId: '1',
    company: '传智播客'
  }
  json.message = "获取资料成功"
  ctx.body = json
})
// 获取权限点数据
const  getPermissionPoints = async (ctx) => {
  let menus = [], points = []
  const user = await UserModel.findById(ctx.session.user._id)
  const permission = await PermissionModel.find()
  if (ctx.session.user.mobile === '13800000002') {
    // 如果是管理员 则拥有所有的权限
    menus = permission.filter(item => item.type === 1).map(item => item.code) // 所有的菜单的权限点
    points = permission.filter(item => item.type === 2).map(item => item.code) // 所有按钮的权限点
  }else {
    const roles = await RoleModel.find()
    let  pList = new Set() // 当前所有的权限点
    user.roleIds.forEach(roleId => {
      const currentRole = roles.find(item => item._id == roleId)
      if (currentRole) {
        currentRole.permIds.forEach(id => {
          pList.add(id)
        })
      }
    })
     pList = [...pList] // 转化成数组
     pList.forEach(id =>  {
     const pObj = permission.find(p => p._id == id)
      if (pObj) {
          if (pObj.type === 1) {
            menus.push(pObj.code)
          }
          if (pObj.type === 2) {
            points.push(pObj.code)
          }
      }
    })
  }
  return  {
    menus,
    points,
    apis: []
  }
}
// 获取员工的简单列表
router.get('/user/simple', async (ctx) => {
  let json = { ...returnJSON }
   const list = await UserModel.find({})
   json.data = list.map(item => ({ id: item._id, username: item.username  }))
  json.message = '获取员工简单列表成功 '
  ctx.body = json
})

// 获取员工列表
router.get('/user', async (ctx) => {
  let json = { ...returnJSON }
  let { page, pagesize } = ctx.query // 查询参数
  page = page || 1
  pagesize = pagesize || 10
  var skip = (parseInt(page) -1) * parseInt(pagesize);
  var limit = parseInt(pagesize);
  const total = await UserModel.estimatedDocumentCount()  // 总数
  let rows = await UserModel.find().skip(skip).limit(limit).lean()
  rows = rows.map(item => ({ 
    id: item._id, 
    mobile: item.mobile, 
    username: item.username, 
    password: item.password,
    enableState: item.enableState,
    createTime: item.createTime,
    companyId: item.companyId,
    companyName: item.companyName,
    departmentId: item.departmentId,
    timeOfEntry: item.timeOfEntry,
    formOfEmployment: item.formOfEmployment,
    workNumber: item.workNumber,
    formOfManagement: item.formOfManagement,
    workingCity: item.workingCity,
    correctionTime: item.correctionTime,
    inServiceStatus: item.inServiceStatus,
    departmentName: item.departmentName,
    level: item.level,
    staffPhoto: item.staffPhoto
   }))
    json.data = {
      total,
      rows
    }
    json.message = "获取员工列表成功"
  ctx.body = json
})

// 新增员工
// 新增组织架构
router.post('/user', async (ctx) => {
  let  json = { ...returnJSON } 
  const newUser = ctx.request.body
  if (newUser.timeOfEntry &&newUser.username && newUser.mobile && newUser.workNumber && newUser.formOfEmployment) {
  if(!checkLength(newUser.username, 2, 4)){
      json.message = "员工姓名为2-4个字符"
      json.success = false
      ctx.body = json
      return 
  }
   if(!checkMobile(newUser.mobile)){
    json.message = "手机号格式不正确"
    json.success = false
    ctx.body = json
    return 
 }
  newUser.password = md5Str('123456')
  let newObj = await UserModel.create(newUser) // 新增部门
  await UserInfoModel.create({
    userId: newObj._id, // 创建员工的关联数据
    username: newObj.username,
    mobile: newObj.mobile,
    timeOfEntry: newObj.timeOfEntry
  })
  await JobModel.create({ userId: newObj._id })
   json.message = "员工新增成功"
   json.data = newObj
   ctx.body = json
  }else {
      json.message = "请检查必填项"
      json.success = false
      ctx.body = json
      return 
  }
})
// 删除员工
router.delete('/user/:id', async (ctx) => {
  let  json = { ...returnJSON } 
  let id = ctx.params.id; // 获取用户id
  if (id) {
   const user = await UserModel.findById(id)
   if(user && user.mobile === '13800000002') {
    //  如果是删除的管理员
    json.success = false
    json.message = "超级管理员不能删除"
   }else {
    await UserModel.findByIdAndDelete(id)
    await UserInfoModel.findOneAndDelete({ userId: id })
    await JobModel.findOneAndDelete({ userId: id })

    json.message = "删除员工成功"
   }
  }else {
    json.message = "员工id不存在"
    json.success = false
  }
  ctx.body = json
})
// 员工导入
router.post('/user/batch', async (ctx) => {
  let  json = { ...returnJSON } 
  let newUserList = ctx.request.body
  if (newUserList && newUserList.length) {
     let isSame = false
     let sameMobile = ""
     const list = await UserModel.find()
     list.forEach(item => {
       let  haveMobile = newUserList.some(user => user.mobile === item.mobile)
       if(!isSame && haveMobile) {
         isSame = true
         sameMobile = item.mobile
       }
     })
     if (isSame) {
       json.success = false
       json.message = '当前系统已存在相同的手机号'+ sameMobile
       ctx.body = json
       return
     }else{
      newUserList = newUserList.map(item => ({ ...item, password: md5Str('123456')}))
      const userList =  await UserModel.insertMany(newUserList) // 插入多条基本数据的资料
      const userInfoList = userList.map(item => ({
        userId: item._id,    
        username: item.username,
        mobile: item.mobile,
        timeOfEntry: item.timeOfEntry }))
        // 批量插入员工基本资料数据
      const jobList = userList.map(item => ({  userId: item._id, }))
      await  UserInfoModel.insertMany(userInfoList)
      await  JobModel.insertMany(jobList) // 插入工作表
      json.message = "批量导入员工成功"
     }
  }else {
    json.message = "未导入任何数据"
  }
  ctx.body = json
})
// 获取用户的基本资料
router.get("/user/:id", async (ctx, next) => {
  let json = { ...returnJSON }
  let id = ctx.params.id; // 获取用户id
  if(id === 'simple') {
    return
  }
  const user = await UserModel.findById(id)
  if (user) {
    json.data = {
      id: user._id,
      mobile: user.mobile,
      username: user.username,
      password: user.password,
      enableState: user.enableState,
      createTime: user.createTime,
      timeOfEntry: user.timeOfEntry,
      workNumber: user.workNumber,
      formOfManagement: user.formOfManagement,
      workingCity:user.workingCity,
      correctionTime: user.correctionTime,
      inServiceStatus: user.inServiceStatus,
      departmentName: user.departmentName,
      staffPhoto: user.staffPhoto,
      roleIds: user.roleIds,
      companyId: '1',
      companyName: '传智播客'
    }
    json.message = "获取用户基本信息成功"
  }else {
    json.success = false 
    json.message = '获取用户基本信息失败'
  }
 
  ctx.body = json
})
// 给用户分配角色
router.put("/user/assignRoles", async (ctx, next) => {
  let json = { ...returnJSON }
  const { id, roleIds } = ctx.request.body
  const user = await UserModel.findById(id)
  if (user) {
      json.data =  await UserModel.findByIdAndUpdate(id, { roleIds  })
      json.message = '给用户分配角色成功'
  }else {
    json.success = false 
    json.message = '当前用户不存在'
  }
  ctx.body = json
})
// 保存用户的基本资料
router.put("/user/:id", async (ctx, next) => {
  let json = { ...returnJSON }
  let id = ctx.params.id; // 获取用户id
  let newUser = ctx.request.body
  const user = await UserModel.findById(id)
  if (user) {
     if(newUser.mobile !== user.mobile) {
      json.success = false 
      json.message = '手机号不能修改'
     }
     else {
       if(newUser.password !== user.password) {
         // 如果密码不等于原密码才去做加密 特殊处理
         newUser.password = md5Str(newUser.password)  // 更新密码
       }
      json.data =  await UserModel.findByIdAndUpdate(id, newUser)
      json.message = '保存用户基本信息成功'
     }
  }else {
    json.success = false 
    json.message = '当前用户不存在'
  }
  ctx.body = json
})
// 角色管理
// 获取所有角色列表
router.get("/role", async (ctx, next) => {
  let json = { ...returnJSON }
  let { page, pagesize } = ctx.query // 查询参数
  page = page || 1
  pagesize = pagesize || 10
  var skip = (parseInt(page) -1) * parseInt(pagesize);
  var limit = parseInt(pagesize);
  const total = await RoleModel.estimatedDocumentCount()  // 总数
  let rows = await RoleModel.find().skip(skip).limit(limit).lean()
  rows = rows.map(item => ({ id: item._id, name: item.name, description: item.description, companyId: item.companyId }))
    json.data = {
      total,
      rows
    }
    json.message = "获取角色列表成功"
  ctx.body = json
})
// 新增角色
router.post("/role", async (ctx, next) => {
  let json = { ...returnJSON }
  const newRole = ctx.request.body
  if (newRole.name && newRole.description) {
    let obj = await RoleModel.create(newRole)
    json.message = "新增角色成功"
    json.data = obj
  }else {
    json.message = "请检查必填项"
    json.success = false
  }    
  ctx.body = json
})
// 删除角色
router.delete("/role/:id", async (ctx, next) => {
  let  json = { ...returnJSON } 
    const id = ctx.params.id
    await RoleModel.findByIdAndDelete(id)
    json.message = "删除角色成功"
    ctx.body = json
})
// 获取角色详情
router.get("/role/:id", async (ctx, next) => {
  let  json = { ...returnJSON } 
    const id = ctx.params.id
    let item = await RoleModel.findById(id)
    if (item) {
      json.data = {
          id: item._id,
          name: item.name,
          description: item.description,
          companyId: item.companyId,
          permIds: item.permIds
      }
      json.message = "查询角色详情成功"
  }else {
      json.message = "查询角色详情失败"
      json.success = false
  }  
  ctx.body = json
})
// 给角色分配权限
router.put("/role/assignPrem", async (ctx, next) => {
  let  json = { ...returnJSON } 
    const { id, permIds  } = ctx.request.body
    if (id &&  permIds) {
     let obj =  await RoleModel.findByIdAndUpdate(id, { permIds  } )
       json.message = "分配权限成功"
   }else {
     json.success = false
     json.message = "角色Id和更新permIds不能为空"
   }
  ctx.body = json
})
// 更新角色详情
router.put("/role/:id", async (ctx, next) => {
  let  json = { ...returnJSON } 
    const id = ctx.params.id
    const newRole = ctx.request.body
    if (newRole.description &&  newRole.name) {
       await RoleModel.findByIdAndUpdate(id, newRole )
       json.message = "更新角色详情成功"
   }
  ctx.body = json
})

// 获取所有权限点
router.get("/permission", async (ctx, next) => {
  let json = { ...returnJSON }
  let rows = await PermissionModel.find()
  json.data = rows.map(item => ({ 
     id: item._id, name: item.name,
     description: item.description, 
     type: item.type, 
     code: item.code, 
     description: item.description, 
     pid: item.pid, 
     enVisible: item.enVisible
    }))
  json.message = "获取权限点成功"
  ctx.body = json
})
// 获取所有权限点
router.post("/permission", async (ctx, next) => {
  let json = { ...returnJSON }
  const newPermission = ctx.request.body
  if (newPermission && newPermission.name  && newPermission.code) {
   let obj = await PermissionModel.create(newPermission)
   json.data = obj
   json.message = "添加权限点成功"
  }else {
    json.success = false
    json.message = "权限点名称和标识不能为空"
  }
  ctx.body = json
})
// 删除权限点
router.delete("/permission/:id", async (ctx, next) => {
  let json = { ...returnJSON }
  const id = ctx.params.id
  if (id) {
   await PermissionModel.findByIdAndDelete(id)
   json.message = "删除权限点成功"
  }else {
    json.success = false
    json.message = "权限点标识不能为空"
  }
  ctx.body = json
})
// 获取权限点详情
router.get("/permission/:id", async (ctx, next) => {
  let json = { ...returnJSON }
  const id = ctx.params.id
  if (id) {
   const obj  = await PermissionModel.findById(id).lean()
   json.data = { ...obj, id: obj._id }
   json.message = "删除权限点成功"
  }else {
    json.success = false
    json.message = "权限点标识不能为空"
  }
  ctx.body = json
})
// 获取所有权限点
router.put("/permission/:id", async (ctx, next) => {
  let json = { ...returnJSON }
  const id = ctx.params.id
  const newPermission = ctx.request.body
  if (newPermission && newPermission.name  && newPermission.code) {
   let obj = await PermissionModel.findByIdAndUpdate(id, newPermission)
   json.data = obj
   json.message = "更新权限点成功"
  }else {
    json.success = false
    json.message = "权限点名称和标识不能为空"
  }
  ctx.body = json
})
module.exports = router.routes();
