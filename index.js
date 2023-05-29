const express = require("express")
const cookieSession = require("cookie-session")
const {json}=require("body-parser")
const db = require("./configs/db")
const userManagementRouter=require("./usermanagement/router/user")
const app = express()
app.use(json())
app.use(
    cookieSession({
        signed:false,
        secure:true
    })
)
app.use('/api/users',userManagementRouter)

const PORT=process.env.PORT
app.listen(5000,()=>{
    console.info(`Running On Port 5000`)
})