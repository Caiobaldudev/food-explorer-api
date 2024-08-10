const express = require("express");

const app = express();
app.use(express.json())

const PORT = 3333;

app.get("/", (req, res) => {
  res.send('Hello world!')
})

app.post("/users", (req,res) => {
  const {name, email, password} = req.body
	res.json({name,email, password})
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
