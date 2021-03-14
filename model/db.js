/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const mongoose = require('mongoose');
const db = mongoose.connect("mongodb://localhost:27017/people",{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false }, function (error) {
   if (error) {
       console.log("连接本地mongo数据库失败:" + error.message )
   }else {
    console.log("连接本地mongo数据库成功")

   }
});
module.exports=db;