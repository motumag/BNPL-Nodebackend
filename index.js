const express = require("express")
const cookieSession = require("cookie-session")
const {json}=require("body-parser")
const db = require("./configs/db")
const app = express()
app.use(json())

app.use(
    cookieSession({
        signed:false,
        secure:true
    })
)
app.get('/heloo', (req, res)=>{
    res.send("heloo world")
});
const PORT=process.env.PORT
app.listen(5000,()=>{
    console.info(`Running On Port 5000`)
})