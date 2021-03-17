/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require("koa-router")();
const system = require("./system"); // 系统级接口
const company = require("./company"); // 组织架构接口
const employees = require("./employees"); // 员工查询接口
const attendanceData = require("../../model/attendance"); // 考勤静态数据
const approvalData = require("../../model/approval"); // 审批静态数据

 // 多级匹配 
router.use('/sys', system)
// 组织架构
router.use('/company', company)
// 员工
router.use('/employees', employees)

// 线上接口处理
router.get('/attendances', async (ctx) => {
   ctx.body = attendanceData
})
router.post('/cfg/atte/item', async (ctx) => {
    ctx.body = {"success":true,"code":10000,"message":"操作成功！","data":{"id":"1230865458989043712","companyId":"1","departmentId":"1175310929766055936","morningStartTime":"00:05:00","morningEndTime":"08:45:00","afternoonStartTime":"09:00:00","afternoonEndTime":"08:45:00","createBy":null,"createDate":null,"updateBy":null,"updateDate":null,"remarks":null}}
})
router.put('/user/process/instance/:page/:pageSize', async ctx => {
  ctx.body = approvalData
})
module.exports = router.routes();
