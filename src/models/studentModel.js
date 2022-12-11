const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        enum: ["maths", "physics", "chemistry", "english"]
    },
    marks: {
        type: Number,
        required: true
    },
    userId:{
        type:ObjectId,
        required:true,
        ref:"user"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("studenlist", studentSchema)