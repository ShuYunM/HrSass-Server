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

 // 多级匹配 
router.use('/sys', system)
// 组织架构
router.use('/company', company)
// 员工
router.use('/employees', employees)

module.exports = router.routes();
