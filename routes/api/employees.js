const returnJSON = require('./json')
const router = require("koa-router")();
const UserInfoModel = require('../../model/UserInfo')
const JobModel = require('../../model/Job')
const { checkLength } = require('../../utils/validate')
const UUID = require('uuid')

router.get('/:id/personalInfo', async (ctx) => {
    const json = { ...returnJSON }
    const id = ctx.params.id
    if (id) {
       const user =  await  UserInfoModel.findOne({ userId: id })
       json.message = '查询员工个人信息成功'
       json.data = user || {}
    }else {
        json.success = false 
        json.message = '缺少查询必须的用户标识'
    }
    ctx.body = json
})
// 保存
router.put('/:id/personalInfo', async (ctx) => {
    const json = { ...returnJSON }
    const id = ctx.params.id
    const newUserInfo = ctx.request.body
    if (id && newUserInfo) {
       const user =  await  UserInfoModel.findOneAndUpdate({ userId: id }, newUserInfo)
       json.message = '更新员工个人信息成功'
       json.data = user || {}
    }else {
        json.success = false 
        json.message = '缺少查询必须的用户标识'
    }
    ctx.body = json
})
router.get('/:id/jobs', async (ctx) => {
    const json = { ...returnJSON }
    const id = ctx.params.id
    if (id) {
       const job =  await  JobModel.findOne({ userId: id })
       json.message = '查询员工岗位信息成功'
       json.data = job || {}
    }else {
        json.success = false 
        json.message = '缺少查询必须的用户标识'
    }
    ctx.body = json
})
router.put('/:id/jobs', async (ctx) => {
    const json = { ...returnJSON }
    const id = ctx.params.id
    const newJob = ctx.request.body
    if (id) {
       const job =  await  JobModel.findOneAndUpdate({ userId: id }, newJob)
       json.message = '更新员工岗位信息成功'
       json.data = job || {}
    }else {
        json.success = false 
        json.message = '缺少查询必须的用户标识'
    }
    ctx.body = json
})
module.exports = router.routes()