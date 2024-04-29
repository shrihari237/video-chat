const socket = io("/")
var peer = new Peer(undefined,{
    path:"/peerjs",host:"/",port:443
})
const user = prompt("Enter your name")

const myVideo = document.createElement("video")
myVideo.muted = true

let myStream;
navigator.mediaDevices.getUserMedia({audio:true,video:true})
.then((stream)=>{
    myStream = stream
    
    addVideoStream(myVideo,stream)
})
function addVideoStream(myVideo,stream){
    myVideo.srcObject = stream
    myVideo.addEventListener("loadedmetadata",()=>{
        myVideo.play()
        $("#video_grid").append(myVideo)
    })
}
$(function(){
    $('#show_chat').click(function(){
        $(".left-window").css("display","none")
        $(".right-window").css("display",'block')
        $(".header_back").css("display","block")
    })
    $('.header_back').click(function(){
        $(".left-window").css("display","block")
        $(".right-window").css("display",'none')
        $(".header_back").css("display","none")
    })
    $('#send').click(function(){
        if($("#chat_message").val().length != 0){
            socket.emit("message",$("#chat_message").val())
            $('#chat_message').val("")
        }
    })
    $("#chat_message").keydown(function(e){
        if(e.key == "Enter" && $("#chat_message").val().length != 0){
            socket.emit("message",$("#chat_message").val())
            $('#chat_message').val("")
        }
    })
    socket.on("createMessage",(message,userName)=>{
        $(".messages").append(
            `<div class="message">
            <b>
            <i class="far fa-user-circle"></i>
            <span>${userName==user?"Me":userName}</span>
            </b>
            <span>${message}</span></div>`
            
        )
    })
    peer.on("open",(id)=>{
         console.log("Room Id",ROOM_ID)
         console.log("Id",id)
        socket.emit("join-room",ROOM_ID,id,user)
    })
})