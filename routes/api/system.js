const returnJSON = require('./json')
const router = require("koa-router")();
const UserModel = require('../../model/User')
const RoleModel = require('../../model/Role')

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
          json.success = true
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
  json.data = {
    userId: ctx.session.user._id,
    mobile: ctx.session.user.mobile,
    username: ctx.session.user.username,
    roles: {
      menus: []
    }
  }
  json.message = "获取资料成功"
  ctx.body = json
})
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
// 员工导入
router.post('/user/batch', async (ctx) => {
  let  json = { ...returnJSON } 
  const newUserList = ctx.request.body
  if (newUserList && newUserList.length) {
     let isSame = false
     let sameMobile = ""
     newUserList.forEach(async item => {
       let  obj = await UserModel.findOne({ mobile: item.mobile })
       if(!isSame && obj) {
         isSame = true
         sameMobile = item.mobile
       }
     })
     if (isSame) {
       json.success = false
       json.message = '当前系统已存在相同的手机号'+ sameMobile
       ctx.body = json
       return
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
      
    }
    json.message = "获取用户基本信息成功"
  }else {
    json.success = false 
    json.message = '获取用户基本信息失败'
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
          companyId: item.companyId
      }
      json.message = "查询角色详情成功"
  }else {
      json.message = "查询角色详情失败"
      json.success = false
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
module.exports = router.routes();
