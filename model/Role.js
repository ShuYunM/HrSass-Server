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
    name: {type: String}, // 名称
    description: { type:  String}, // 标识
    createTime: { type:String, default:sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')  }, // 创建时间
})
var Role = mongoose.model('Role', schema, 'Role'); // 第三个参数一定要指定User 因为mongoose自动找 Users复数形式

module.exports = Role;