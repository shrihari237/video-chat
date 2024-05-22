const express = require("express")
const app = express()
const server = require("http").Server(app)
const {v4:uuidv4} = require("uuid")

//server.listen(process.env.PORT || 3030)
const io = require("socket.io")(server,{
    cors:{
        origin:"*"
    }
})
const {ExpressPeerServer} = require("peer")
const peerServer  = ExpressPeerServer(server,{debug:true})

app.use("/peerjs",peerServer)
var nodeMailer = require('nodemailer')

app.use(express.json())
const transporter = nodeMailer.createTransport({
    port:465,
    host:"smtp.gmail.com",
    auth:{
        user:"shrihariholey@gmail.com",
        pass:"oyze ketw xqch ywfv"
    },
    secure:true
})

app.set("view engine","ejs")
app.use(express.static("public"))


app.get('/',(req,res) =>{
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res)=>{
    res.render("index",{roomId:req.params.room})
})

app.post("/send-mail",(req,res)=>{
    const to = req.body.to
    const url = req.body.url

    const mailData = {
        from:"shrihariholey@gmail.com",
        to:to,
        subject:"Join video chat with me!",
        html:`<p>Hey there,</p>
        <p>Come and join me for a video chat here -${url}</p>`
    }

    transporter.sendMail(mailData,(error,info)=>{
        if(error){
            console.log(error)
        }
        else{
            res.status(200).send({message:"Invitation sent",message_id:info.messageId})
        }
    })
})

io.on("connection",(socket)=>{
    socket.on("join-room",(roomId,userId,userName)=>{
        socket.join(roomId)
        io.to(roomId).emit("user-connected",userId)
        socket.on("message",(message)=>{
            io.to(roomId).emit("createMessage",message,userName)
        })
    })

})

server.listen(3030)
