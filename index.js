import express from "express";


const app = express();

app.use(express.json())

const arr = [ 
    
]


app.get("/",(req,res) => {
    res.send("HEllo WOrld")
})

app.get("/me", (req,res) => {
    res.send(`Your query ID is ${req.query.id}`)
} )

app.get("/:id",(req,res) => {
    const {id} = req.params
    res.send(`Your ID is ${id}`)
})

app.post("/me",(req,res) => {
    const {id,name} = req.body
    res.send(JSON.stringify({id,name}))
})



app.listen(1337, () => {
    console.log("Server started at 1337")
})