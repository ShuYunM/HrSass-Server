const utils = require('utility');//md5加密

module.exports = {
    // 检查手机号格式不正确
    checkMobile (value) {
       return  /^1[3-9]\d{9}$/.test(value)
    },
    // 检查密码
    checkPassword (value) {
        return  value.length >= 6 && value.length <= 16
    },
    // md5加密
    md5Str (value) {
       return utils.md5(value)
    },
    checkLength(value, min, max) {
        return  value.length >= min && value.length <= max
    },
}