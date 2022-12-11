const studentModel = require("../models/studentModel.js")
const validation = require("../validations/validation.js")

const createStudent = async (req, res) => {

    try {
        const data = req.body
        let { fullName, subject, marks,userId } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "Enter details to create student mark record" })

        if (!validation.isValid(fullName)) return res.status(400).send({ status: false, message: "enter fullname of the student" })
        fullName = fullName.toLowerCase()
        data.fullName = fullName
        if (!validation.isValidfullName(fullName)) return res.status(400).send({ status: false, message: "enter a valid full name" })

        if (!validation.isValid(subject)) return res.status(400).send({ status: false, message: "enter subject name" })
        subject = subject.toLowerCase()
        data.subject = subject
        if (!["physics", "chemistry", "maths", "english"].includes(subject)) return res.status(400).send({ status: false, message: "provide a correct subject name" })


        if (!validation.isValid(marks)) return res.status(400).send({ status: false, message: "enter secured mark of the student" })
        if (!typeof (marks) == Number || (marks < 0 || marks > 100)) return res.status(400).send({ status: false, message: "provide a valid mark" })

        if (!validation.isValid(userId)) return res.status(400).send({ status: false, message: "enter the userId" })
        if (!validation.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid userId" })

        if(userId!=req.token.userId) return res.status(400).send({ status: false, message: "can not create student record with another userId" })

        const findStudent = await studentModel.findOne({ fullName: fullName, subject: subject,userId:userId })
        if (findStudent) {
            const updateStudent = await studentModel.findOneAndUpdate({ fullName: fullName, subject: subject,userId:userId }, { $inc: { marks: marks } }, { new: true })
            return res.status(200).send({ status: true, data: updateStudent })
        }

        const createStudent = await studentModel.create(data)

        return res.status(201).send({ status: true, data: createStudent })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

const getStudentlist = async (req, res) => {
    try {
        data = req.query
        let { fullName, subject } = data

        if (validation.isValid(fullName)) {
            fullName = fullName.toLowerCase()
            data.fullName = fullName
            if (!validation.isValidfullName(fullName)) return res.status(400).send({ status: false, message: "enter a valid full name" })
        }

        if (validation.isValid(subject)) {
            subject = subject.toLowerCase()
            data.subject = subject
            if (!["physics", "chemistry", "maths", "english"].includes(subject)) return res.status(400).send({ status: false, message: "provide a correct subject name" })
        }

        const findStudent = await studentModel.find({ ...data, isDeleted: false })
        if (findStudent.length == 0) return res.status(400).send({ status: false, message: "There is no document with the given fillter" })

        return res.status(400).send({ status: false, data: findStudent })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateStudent = async (req, res) => {
    try {

        let data = req.body
        let studentId = req.params.studentId
        let { fullName, subject, marks } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "Enter details to update" })

        if (validation.isValid(fullName)) {
            fullName = fullName.toLowerCase()
            data.fullName = fullName
            if (!validation.isValidfullName(fullName)) return res.status(400).send({ status: false, message: "enter a valid full name" })
        }

        if (validation.isValid(subject)) {
            subject = subject.toLowerCase()
            data.subject = subject
            if (!["physics", "chemistry", "maths", "english"].includes(subject)) return res.status(400).send({ status: false, message: "provide a correct subject name" })
        }
        if (marks) {
            if (!typeof (marks) == Number || (marks < 0 || marks > 100)) return res.status(400).send({ status: false, message: "provide a valid mark" })
        }

        if (!validation.isValidObjectId(studentId)) return res.status(400).send({ status: false, message: "invalid studentId" })
        let findStudent = await studentModel.findOne({ _id: studentId })
        if (!findStudent) return res.status(400).send({ status: false, message: "no student exsists with this id" })

        let updateStudent = await studentModel.findOneAndUpdate({ _id: studentId }, { $set: { fullName: fullName, subject: subject, marks: marks } }, { new: true })

        res.status(200).send({ status: true, message: "successfully updated", data: updateStudent })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteStudent = async (req, res) => {
    try {

        let studentId = req.params.studentId

        if (!validation.isValidObjectId(studentId)) return res.status(400).send({ status: false, message: "invalid studentId" })
        let findStudent = await studentModel.findOne({ _id: studentId, isDeleted: false })
        if (!findStudent) return res.status(400).send({ status: false, message: "no student exsists with this id" })

        await studentModel.findOneAndUpdate({ _id: studentId }, { isDeleted: true })
        res.status(200).send({ status: true, message: "successfully deleted" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createStudent, getStudentlist, updateStudent,deleteStudent }