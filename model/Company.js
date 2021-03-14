/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email shuiruohanyu@foxmail.com
 *
 */
var mongoose = require('mongoose')
var db = require('./db.js')
const sd = require('silly-datetime')
var schema = new mongoose.Schema({
    pid: { type: String }, // 父标识
    companyId: {type: String }, // 公司标识
    name: {type: String}, // 名称
    code: { type:  String}, // 标识
    id: { type: String }, // 用户Id
    managerId: {type: String}, // 管理者id
    manager: { type: String }, // 管理者名称
    introduce: { type: String }, // 介绍
    createTime: { type:String, default:sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')  }, // 创建时间
})
var Company = mongoose.model('Company', schema, 'Company'); // 第三个参数一定要指定User 因为mongoose自动找 Users复数形式

module.exports = Company;