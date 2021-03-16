const returnJSON = require('./json')
const router = require("koa-router")();
const CompanyModel = require('../../model/Company')
const { checkLength } = require('../../utils/validate')

router.get('/:id', async (ctx, next) => {
    const id = ctx.params.id
    let  json = { ...returnJSON } 
    if (id!== 'department') {
        json.data = {
            "id": "1",
            "name": "江苏传智播客教育科技股份有限公司",
            "managerId": "abc",
            "version": "12",
            "renewalDate": null,
            "expirationDate": null,
            "companyArea": null,
            "companyAddress": "北京市昌平区建材城西路金燕龙办公楼一层",
            "businessLicenseId": null,
            "legalRepresentative": "",
            "companyPhone": "400-618-9090",
            "mailbox": "bd@itcastcn",
            "companySize": null,
            "industry": null,
            "remarks": "传智播客官网-好口碑IT培训机构,一样的教育,不一样的品质",
            "auditState": "0",
            "state": 1,
            "balance": 0.0,
            "createTime": "2018-11-07T13:30:05.000+0000"
        }
        ctx.body = json
        return
    }
    await next()
})
// 获取企业组织架构列表
router.get('/department', async (ctx) => {
 let  json = { ...returnJSON } 
 let result = await CompanyModel.find()
 let depts  = result.map(item => ({
    id: item._id,
   pid: item.pid,
   companyId: item.companyId,
   name: item.name,
   code: item.code,
   managerId: item.managerId,
   manager: item.manager,
   introduce: item.introduce,
   createTime: item.createTime
 }))
 let root = await CompanyModel.findOne({ pid: -1 }) // 查找父标识为-1的根节点
 json.data = {
    companyId: root._id,
    companyName: root.name,
    companyManage: '',
    depts
 }
 json.message = "获取组织架构数据成功"
 ctx.body = json
})
// 新增组织架构
router.post('/department', async (ctx) => {
    let  json = { ...returnJSON } 
    const newDept = ctx.request.body
    if (newDept.code && newDept.introduce && newDept.manager && newDept.name) {
    const exitCode =  await CompanyModel.findOne({ code: newDept.code })
    if (exitCode) {
        // 存在重复的code
        json.message = "存在重复的code"
        json.success = false
        ctx.body = json
        return 
    } if(!checkLength(newDept.name, 2, 10)){
        json.message = "部门名称为2-10个字符"
        json.success = false
        ctx.body = json
        return 
    }
    if(!checkLength(newDept.introduce, 1, 30)){
        json.message = "部门介绍为1-30个字符"
        json.success = false
        ctx.body = json
        return 
     }
    let newObj = await CompanyModel.create(newDept) // 新增部门
     json.message = "部门新增成功"
     json.data = newObj
     ctx.body = json
    }else {
        json.message = "请检查必填项"
        json.success = false
        ctx.body = json
        return 
    }
 })
 // 新增组织架构
router.delete('/department/:id', async (ctx) => {
    let  json = { ...returnJSON } 
    const id = ctx.params.id
    await CompanyModel.findByIdAndDelete(id)
    json.message = "删除部门成功"
    ctx.body = json
 })
 // 查询组织架构详情
router.get('/department/:id', async (ctx) => {
    let  json = { ...returnJSON } 
    const id = ctx.params.id
    let item = await CompanyModel.findById(id)
    if (item) {
        json.data = {
            id: item._id,
            pid: item.pid,
            companyId: item.companyId,
            name: item.name,
            code: item.code,
            managerId: item.managerId,
            manager: item.manager,
            introduce: item.introduce,
            createTime: item.createTime
        }
        json.message = "查询部门详情成功"
    }else {
        json.message = "查询部门详情失败"
        json.success = false
    }
   
    ctx.body = json
 })
  // 更新组织架构详情
router.put('/department/:id', async (ctx) => {
    let  json = { ...returnJSON } 
    const id = ctx.params.id
    const newDept = ctx.request.body
    if (newDept.code && newDept.introduce && newDept.manager && newDept.name) {
        if(!checkLength(newDept.name, 2, 10)){
            json.message = "部门名称为2-10个字符"
            json.success = false
            ctx.body = json
            return 
        }
        if(!checkLength(newDept.introduce, 1, 30)){
            json.message = "部门介绍为1-30个字符"
            json.success = false
            ctx.body = json
            return 
         }
         await CompanyModel.findByIdAndUpdate(id, newDept )
         json.message = "更新部门详情成功"
     }
    ctx.body = json
 })
module.exports = router.routes()