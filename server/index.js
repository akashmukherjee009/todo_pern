const express= require("express")
const cors= require("cors")
const pool = require("./db")

const app= express()

//middleware
app.use(cors())
app.use(express.json())

//apps

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

app.post("/register", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await pool.query("SELECT * FROM user_details WHERE user_email = $1", [
        email
      ]);
  
      if (user.rows.length > 0) {
        return res.status(401).json("User already exist!");
      }
  
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
  
      let newUser = await pool.query(
        "INSERT INTO user_details (user_email, user_password) VALUES ($1, $2) RETURNING *",
        [email, bcryptPassword]
      );
  
      const jwtToken = jwtGenerator(newUser.rows[0].user_id);
  
      return res.json({ jwtToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await pool.query("SELECT * FROM user_details WHERE user_email = $1", [
        email
      ]);
  
      if (user.rows.length === 0) {
        return res.status(401).json("Invalid Credential");
      }
  
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
      );
  
      if (!validPassword) {
        return res.status(401).json("Invalid Credential");
      }
      const jwtToken = jwtGenerator(user.rows[0].user_id);
      return res.json({ jwtToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  
  app.post("/verify", (req, res) => {
    try {
      res.json(true);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });



app.listen(5000, ()=>{
    console.log("Hello world this is port 5000");
})