const express = require("express")
const cookieSession = require("cookie-session")
const {json}=require("body-parser")
const cors = require('cors');
const db = require("./configs/db")
const merchantManagementRouter=require("./usermanagement/router/merchant")
const itemRouter=require("./routers/item.router")
const loanRouter=require("./routers/loan.router")
const app = express()
app.use(json())
app.use(
    cookieSession({
        signed:false,
        secure:true
    })
)
app.use(cors("*"))
app.use("/image",express.static("uploads"))
app.use('/api/merchant',merchantManagementRouter)
app.use('/api/items',itemRouter)
app.use('/api/loan',loanRouter)
const PORT=process.env.PORT
app.listen(5000,()=>{
    console.info(`Running On Port 5000`)
})