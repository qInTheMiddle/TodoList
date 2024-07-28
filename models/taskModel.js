const mongoose = require('mongoose')

const taskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please enter a task name"]
        },
        description: {
            type: String,
            required: [true, "Please enter description of task"]
        },
        status: {
            type: Boolean,
            required: [true, "Please specify completion status"]
        }
    }
)


const Task = mongoose.model('Task', taskSchema)

module.exports = Task