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

var schema = new mongoose.Schema({
    username: { type: String }, // 用户名
    mobile: {type: String}, // 手机号
    password: { type:  String}, // 密码
    id: { type: String }, // 用户Id
    workNumber: { type: String },
    formOfEmployment: { type:String }, // 聘用形式
    timeOfEntry: { type: String }, // 入职时间 
    correctionTime: { type: String }, // 转正时间
    departmentName: { type: String }, // 部门
    departmentId: { type: String } // 部门id

})
var User = mongoose.model('User', schema, 'User'); // 第三个参数一定要指定User 因为mongoose自动找 Users复数形式

module.exports = User;