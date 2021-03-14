const returnJSON = require('./json')
const router = require("koa-router")();
const CompanyModel = require('../../model/Company')
const { checkLength } = require('../../utils/validate')
const UUID = require('uuid')


module.exports = router.routes()