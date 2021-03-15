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
    userId: {type: String},
    age: { type: String },
    archivingOrganization: { type: String },
    areThereAnyMajorMedicalHistories: { type: String },
	bankCardNumber: { type: String },
    birthday: { type: String },	
    bloodType: { type: String },	
    certificateOfAcademicDegree: { type: String },
	companyId: { type: String },	
    constellation: { type: String },
    contactTheMobilePhone: { type: String },
    dateOfBirth: { type: String },	
    dateOfResidencePermit: {type: String },
    departmentName: { type: String },
    doChildrenHaveCommercialInsurance: { type: String },
    domicile: { type: String },
    educationalType: { type: String  },
    emergencyContact: { type: String },	
    emergencyContactNumber:	{ type: String },		
    englishName: { type: String },	
    enrolmentTime: { type: String },
    graduateSchool: { type: String },
    graduationCertificate: { type: String },
    graduationTime: { type: String },	
    homeCompany: { type: String },	
    idCardPhotoBack: { type: String },	
    idCardPhotoPositive: { type: String },
    idNumber: { type: String },	
    isThereAnyCompetitionRestriction: { type: String },	
    major: { type: String },		
    maritalStatus: { type: String },	
    mobile: { type: String },			
    nation: { type: String },			
    nationalArea: { type: String },			
    nativePlace: { type: String },			
    openingBank: { type: String },			
    passportNo: { type: String },			
    personalMailbox: { type: String },			
    placeOfResidence: { type: String },	
    politicalOutlook: { type: String },	
    postalAddress: { type: String },	
    proofOfDepartureOfFormerCompany: { type: String },
	providentFundAccount: { type: String },
	qq: { type: String },
	remarks: { type: String },
	residenceCardCity: { type: String },
    residencePermitDeadline: { type: String },
    resume: { type: String },
    sex: { type: String },
    socialSecurityComputerNumber: { type: String },
    staffPhoto: { type: String },	
    stateOfChildren: { type: String },	
    theHighestDegreeOfEducation: { type: String },	
    timeOfEntry: { type: String },	
    timeToJoinTheParty: { type: String },	
    title: { type: String },	
    username: { type: String },		
    wechat: { type: String },		
    zodiac: { type: String },		
})
var UserInfo = mongoose.model('UserInfo', schema, 'UserInfo'); // 第三个参数一定要指定User 因为mongoose自动找 Users复数形式

module.exports = UserInfo;