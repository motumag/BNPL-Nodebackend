const express = require("express")
const db = require("./configs/db")
const app = express()
app.get('/heloo', (req, res)=>{
    res.send("heloo world")
});
const PORT=process.env.PORT
app.listen(5000,()=>{
    console.info(`Running On Port 5000`)
})