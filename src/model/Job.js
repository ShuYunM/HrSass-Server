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
    userId: {type: String},	
    adjustmentAgedays: {type: String},
    adjustmentOfLengthOfService: {type: String},
    closingTimeOfCurrentContract:{type: String},
    companyId: {type: String},
    contractDocuments: {type: String},
    contractPeriod: {type: String},
    correctionEvaluation:{type: String},
    currentContractStartTime:{type: String},
    firstContractTerminationTime: {type: String},
    hrbp: {type: String},
    initialContractStartTime: {type: String},
    otherRecruitmentChannels: {type: String},
    post: {type: String},
    rank: {type: String},
    recommenderBusinessPeople: {type: String},
    recruitmentChannels: {type: String},
    renewalNumber: {type: String},
    reportId: {type: String},
    reportName: {type: String},
    socialRecruitment: {type: String},
    stateOfCorrection: {type: String},
    taxableCity:{type: String},
    workMailbox: {type: String},
    workingCity: {type: String},
    workingTimeForTheFirstTime: {type: String},
})
var Job = mongoose.model('Job', schema, 'Job'); // 第三个参数一定要指定User 因为mongoose自动找 Users复数形式

module.exports = Job;