let studentModel = require("../models/studentModel.js")
let validation = require("../validations/validation.js")
let jwt = require("jsonwebtoken")
const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(401).send({ status: false, message: "token required" })
        token = token.split(" ")[1]
        jwt.verify(token, "PROJECT-6", function (error,decodedToken) {
            if (error) return res.status(401).send({ status: false, message: error.message })
            req.token = decodedToken
            next()
        })
    } catch(error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const authorization = async (req,res,next) => {
    try {
        let studentId = req.params.studentId

        if(!validation.isValidObjectId(studentId)) return res.status(403).send({status:false,message:"userId is invalid"})

        let findStudent = await studentModel.findOne({_id:studentId})
        if(!findStudent) return res.status(403).send({status:false,message:"no student exsists with this Id"})
        let userId = findStudent.userId

        let tokenUserId = req.token.userId
        if(userId!=tokenUserId) return res.status(403).send({status:false,message:"authorization failed"})
        next()

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {authentication,authorization}