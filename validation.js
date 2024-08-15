const joi = require('joi');

// const taskSchema = mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: [true, "Please enter a task name"]
//         },
//         description: {
//             type: String,
//             required: [true, "Please enter description of task"]
//         },
//         status: {
//             type: Boolean,
//             required: [true, "Please specify completion status"]
//         }
//     }
// )

const todoValidation = data => {
    const schema = joi.object({
        title: joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),
        description: joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),
        status: joi.string()
        // status: joi.boolean()
        .required() // Include status validation
    }).unknown();

    return schema.validate(data);
}

module.exports.todoValidation = todoValidation;
