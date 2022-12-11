const mongoose = require("mongoose")

const isValid = (value) => {
    if(typeof value === "undefined" || typeof value === "null") return false;
    if(typeof value === "string" && value.trim().length == 0) return false;
    return true; 
}

const isValidBody = function(reqBody) {
    return Object.keys(reqBody).length==0
}

const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
}

const isValidfullName = function(fullName) {
    return /^[a-zA-Z ]/.test(fullName)
}

const isValidPhone = function(phone) {
    return /^[6-9]\d{9}$/.test(phone)
}

const isValidEmail = function(email) {
    return  /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(email)
}

const isValidPassword = function(password) {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password)
}

module.exports = {isValid,isValidBody,isValidObjectId,isValidfullName,isValidPhone,isValidEmail,isValidPassword}