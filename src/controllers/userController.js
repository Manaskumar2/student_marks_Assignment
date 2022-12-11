const userModel = require("../models/userModel")
const validation = require("../validations/validation.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {

    try {
        data = req.body
        let { fullName, phone, email, password } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "Provide all details to create account" })

        if (!validation.isValid(fullName)) return res.status(400).send({ status: false, message: "enter your fullname" })
        fullName = fullName.toLowerCase()
        data.fullName = fullName
        if (!validation.isValidfullName(fullName)) return res.status(400).send({ status: false, message: "enter a valid full name" })

        if (!validation.isValid(phone)) return res.status(400).send({ status: false, message: "enter your phone number" })
        if (!validation.isValidPhone(phone)) return res.status(400).send({ status: false, message: "enter valid phone number" })
        const findPhone = await userModel.findOne({ phone: phone })
        if (findPhone) return res.status(409).send({ status: false, message: "account already exsists with this phone number provide a new one" })

        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "enter your emailId" })
        email = email.toLowerCase()
        data.email = email
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "enter valid emailId" })
        const findEmail = await userModel.findOne({ email: email })
        if (findEmail) return res.status(409).send({ status: false, message: "account already exsists with this emaildId provide a new one" })

        if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "enter the phone number" })
        if (!validation.isValidPassword(password)) return res.status(400).send({ status: false, message: "enter valid password" })
        let saltRounds = 10
        let hash = bcrypt.hashSync(password, saltRounds)
        data.password = hash

        const createUser = await userModel.create(data)
        res.status(201).send({ status: true, data: createUser })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        let data = req.body
        let { emailOrPhone, password } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "Provide all details to login" })

        emailOrPhone= emailOrPhone.toLowerCase()
        data.emailOrPhonee = emailOrPhone
        let findUser = await userModel.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] })
        if (!findUser) return res.status(400).send({ status: false, message: "No account exsists with this email or phone" })

        let verifyPassword = await bcrypt.compare(password, findUser.password)
        if (!verifyPassword) return res.status(400).send({ status: false, message: "enter your correct password to login" })

        let token = jwt.sign({ userId: findUser._id }, "PROJECT-6", { expiresIn: "600s" })

        return res.status(201).send({ status: true, userId:findUser._id,message: token })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createUser, loginUser }