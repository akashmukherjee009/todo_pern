const express= require("express")
const cors= require("cors")
const pool = require("./db")

const app= express()

//middleware
app.use(cors())
app.use(express.json())

//routes

//create
app.post('/todos', async (req,res)=>{
    try {
        const {description}= req.body
        const newTodo= await pool.query("insert into todo (description) values ($1) returning *",
        [description]
        )
        
    } catch (error) {
        console.error(error.message)
    }
})
// read
app.get('/todos',async (req,res)=>{
    try {
        const allTodo= await pool.query("select * from todo")
        res.json(allTodo.rows)
    } catch (error) {
        console.error(error.message)
    }
})
// read a todo
app.get('/todos/:id',async (req,res)=>{
    try {
        const {id}=  req.params 
        const allTodo= await pool.query("select * from todo where id= $1",[id])
        res.json(allTodo.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})
//update
app.put('/todos/:id',async (req,res)=>{
    try {
        const {id}=  req.params 
        const {description}= req.body
        const editTodo= await pool.query("update todo set description=$2 where id= $1",[id,description])
        res.json("todo updated!!!!!!!!")
    } catch (error) {
        console.error(error.message)
    }
})
//delete
app.delete('/todos/:id',async (req,res)=>{
    try {
        const {id}=  req.params 
        const deleteTodo= await pool.query("delete from todo where id= $1",[id])
        res.json("Task deleted!!!!!!")
    } catch (error) {
        console.error(error.message)
    }
})



app.listen(5000, ()=>{
    console.log("Hello world this is port 5000");
})