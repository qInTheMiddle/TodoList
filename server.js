const express = require('express')
const mongoose = require('mongoose')
const Task = require('./models/taskModel')
const path = require('path')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


app.use(express.json())

//routes

app.get('/', (req, res) => {
    res.send('Hello NODE API')
})

app.get('/blog', (req, res) => {
    res.send('Hello Blog My name is Hamood')
})

// the correct method is to connect then listen
// app.listen(3000, ()=> {
//     console.log("Node API app is running on port 3000")
// })

app.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/tasks/:id', async(req, res) => {
    try {
        const {id} = req.params
        const task = await Task.findById(id)
        res.status(200).json(task)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.post('/tasks', async(req, res) => {
    // console.log(req.body)
    // res.send(req.body)
    try {
        const task = await Task.create(req.body)
        res.status(200).json(task)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

// update a task
app.put('/tasks/:id', async(req, res) =>{
    try {
        const {id} = req.params
        const task = await Task.findByIdAndUpdate(id, req.body)
        if(!task){
            return res.status(404).json({message: `cannot find any task with ID ${id}`})
        }
        const updatedTask = await Task.findById(id)
        res.status(200).json(updatedTask)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// delete a task    

app.delete('/tasks/:id', async(req, res) => {
    try {
        const {id} = req.params
        const task = await Task.findByIdAndDelete(id)
        if(!task){
            return res.status(404).json({message: `cannot find any task with ID ${id}`})
        }
        res.status(200).json(task)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Moongoose: 'strictQuery' switched to 'false'
mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://qutaibaalmadhagi:RaY6RbSba1ugKLTL@todoapi.pfciykq.mongodb.net/?retryWrites=true&w=majority&appName=TodoAPI')
.then(() => {
    console.log('connected to MongoDB')
    app.listen(3000, ()=> {
        console.log("Node API app is running on port 3000")
    })
    
}).catch((error) => {
    console.log(error)
})
