const express = require("express")
const cookieSession = require("cookie-session")
const {json}=require("body-parser")
const db = require("./configs/db")
const merchantManagementRouter=require("./usermanagement/router/merchant")
const app = express()
app.use(json())
app.use(
    cookieSession({
        signed:false,
        secure:true
    })
)
app.use('/api/merchant',merchantManagementRouter)
const PORT=process.env.PORT
app.listen(5000,()=>{
    console.info(`Running On Port 5000`)
})