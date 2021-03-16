/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email shuiruohanyu@foxmail.com
 *
 */
var mongoose = require('mongoose')

var schema = new mongoose.Schema({
    name: { type: String }, // 用户名
    type: {type: Number}, // 手机号
    code: { type:  String}, // 密码
    description: { type: String }, // 用户Id
    pid: { type: String },
    enVisible: { type:String } // 聘用形式
})
var Permission = mongoose.model('Permission', schema, 'Permission'); // 第三个参数一定要指定User 因为mongoose自动找 Users复数形式

module.exports = Permission;