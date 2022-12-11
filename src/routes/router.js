const express = require("express")
const router = express.Router()

const { createUser, loginUser } = require("../controllers/userController")
const {createStudent,getStudentlist,updateStudent,deleteStudent} = require("../controllers/studentController.js")
const {authentication,authorization} = require("../middlewares/auth.js")



router.get("/test", function (req, res) {
    res.send("testing successfull")
})

router.post("/registerUser", createUser)
router.post("/loginUser", loginUser)

router.post("/registerStudent",authentication,createStudent)
router.get("/getstudentlist",authentication,getStudentlist)
router.put("/updateStudent/:studentId",authentication,authorization,updateStudent)
router.delete("/deleteStudent/:studentId",authentication,authorization,deleteStudent)

module.exports = router