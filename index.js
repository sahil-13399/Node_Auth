import express from "express";
import jwt from 'jsonwebtoken'

const app = express();

app.use(express.json())

const arr = []
const set = new Set();
const secretKeyForJWT = "FDaFdsFDafsFdasfFDSAsd";


app.post("/login",(req,res) => {
    const {username,password} = req.body;

    if(!set.has(username)) {
        res.status(401).json({message:"Incorrect username and password"})
    } else {
        res.status(200).json({"auth-token" : generateAccessToken(username)})
    }

})

function generateAccessToken(username) {
    return jwt.sign({username}, secretKeyForJWT, { expiresIn: '1h' });
  }

app.post("/register",(req,res) => {
    const {username} = req.body
    if(set.has(username)) {
        res.status(400).json({"message" : "Username already exists"})
    } else {
        arr.push(req.body)
        set.add(username)
        res.status(200).json({message : "Successfully registered"})
    }
})

app.get("/profiles", (req,res) => {
    const usersDataCopy = JSON.parse(JSON.stringify(arr));

    for(let i = 0; i < usersDataCopy.length; i++) {
        delete usersDataCopy[i].password
    }

    res.status(200).json(usersDataCopy)
} )

app.put("/profile",(req,res) => {
    const {username,password,college,name} = req.body;

    const token = req.header('auth-token')

    if(!token) return res.status(401).json('Unauthorize user')

    try {
        const decoded = jwt.verify(token,secretKeyForJWT);
        console.log(decoded)
    } catch (error) {
        res.status(400).json('Token not valid')
    }
    let isValid = false;
    let requestedUserIndexInGlobalArray = -1;
    for (let i = 0; i < arr.length; i ++) {
        const currentUser = arr[i];
        if(currentUser.username == username && currentUser.password == password) {
            isValid = true;
            requestedUserIndexInGlobalArray = i;
        }
    }

    if(!isValid) {
        res.status(401).json({message : "Incorrect password or username entered"})
    } else {
        arr[requestedUserIndexInGlobalArray].username = username;
        arr[requestedUserIndexInGlobalArray].password = password;
        arr[requestedUserIndexInGlobalArray].college = college;
        arr[requestedUserIndexInGlobalArray].name = name;
        res.status(200).json({message : "Updated user details"})
    }

})


app.listen(7050, () => {
    console.log("Server started at 7050")
})