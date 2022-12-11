const express = require("express")
const mongoose = require("mongoose")
const router = require("./routes/router.js")
const multer = require("multer")

const app = express()
app.use(express.json())
app.use(multer().any())

mongoose.connect("mongodb+srv://manaskumar:iFVJhjYrsH7iars8@cluster0.s4pqkzd.mongodb.net/PROJECT-6?retryWrites=true&w=majority",{
    useNewUrlParser:true
})

.then(()=>console.log("mongodb connected"))
.catch(err=>console.log(err))

app.use("/",router)

app.listen(3000,function(){
    console.log("Express app running on Port 3000")
})