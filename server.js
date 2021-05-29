const config = require("config");
const ChatServer  = require("./lib/chat-server")

const port = process.env.PORT || config.get('app.port');
// Chatroom

let numUsers = 0;
const getCurrentTime = () => {
    let date = new Date();
    let hour = date.getHours();
    if(hour < 10){
      hour = "0" + hour;
    }
    let min = date.getMinutes();
    let meredin = "am";
    if(hour >= 13){
      hour -= 12;
      meredin = "pm";
    }
    if(min < 10){
      min = "0" + min;
    }
    let str = hour + ":" + min + " " + meredin;
  
    return str;
};

const chatServer = new ChatServer({
    port
})

chatServer.start( socket => {
    chatServer.onMessage( socket, (newmsg) => {
        if(newmsg.type = config.get("chat.message_types.generic")) {
            chatServer.distributeMsg(socket, newmsg, _ => {
           })
        }

        if(newmsg.type == config.get('chat.message_types.private')) {
            chatServer.sendMessage(socket, newmsg, _ => {
            })
        }
    })

    chatServer.onJoin( socket, newUser => {
        let msg = {
            message: JSON.stringify({date: getCurrentTime(), type:"system", message:'joined the chat'}),
            username: newUser.username
        }
        chatServer.distributeMsg(socket, msg , () => {
        })
    }) 

    chatServer.onCreate(socket);
    
    chatServer.onLeave( socket, user => {
        let msg = {
            message: JSON.stringify({date: getCurrentTime(), type:"system", message:'left the chat'}),
            username: user.username
        }
        chatServer.distributeMsg(socket, msg, () => {

        })
    })
})