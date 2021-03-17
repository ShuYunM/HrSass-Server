var process = require('child_process');
process.exec(" mongorestore -h 127.0.0.1:27017 -d  people ./src/doc/database --drop", function (error, stdout, stderr) {
  if (error) {
      console.log("执行重置数据库失败, 异常信息:" + error.message)
  }else {
      console.log("执行数据库重置成功！")
  }
})