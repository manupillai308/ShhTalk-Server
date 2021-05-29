let express = require('express');
let config = require("config")
let app = express();
let socketIO = require("socket.io")
let http = require('http')

class ChatServer {

    constructor(opts) {
        this.server = http.createServer(app);
        this.io = socketIO(this.server);
        this.opts = opts 
        this.usernames = ["Sansa","Mowgli","Cricket","Banjo","Diezel Ky","Kal-El","Satchel","Egypt"," Buddy Bear",
        "Tiamii","Bluebell Madonna","Fifibelle","Apple","Destry","Tu Morrow","North","Sunday","Jermajesty",
        "Tokyo","Levaeh","Adeline","Audi","Alucard","Sparrow","Correspondent","Seven","Puma","Camera","Bandit",
        "Hashtag","Facebook","Mustard","Cherry","Summer Rain","River Rose","Nutella","Daisy Boo","Free","Megaa Omari"];

        this.roomMaps = new Map()
    }

    start(cb) {
        this.server.listen(this.opts.port, () => {
            console.log("Up and running...")
            this.io.on('connection', socket => {
                cb(socket)
            })
        });
    }

    sendMessage(socket, msgObj, done) {
        let target = msgObj.target
        // this.userMaps[target].emit(config.get("chat.events.NEWMSG"), msgObj)
        throw Error("Not implemented");
        done()
    }

    onCreate(socket){
        socket.on(config.get('chat.events.CREATEROOM'), (data) => {
            const id = this.getRandomId();

            const usernames = new Map();
            const username = this.getRandomName(usernames);
            usernames.set(username, null);

            socket.roomid = id;
            socket.username = username;

            this.roomMaps.set(id, {name: data.roomname, users: 1, usernames:usernames});
            socket.join(id);
            socket.emit(config.get('chat.events.ROOMID'), {roomid:id, username, roomname:data.roomname});
        })

    }
    onJoin(socket, cb) {
        socket.on(config.get('chat.events.JOINROOM'), (data) => {
            if(!this.roomMaps.has(data.roomid)){
                socket.emit(config.get('chat.events.JOINERROR'), {
                    error:true,
                    message: "Room does not exist"
                })
                return;
            }

            socket.roomid = data.roomid;
            const username = this.getRandomName(this.roomMaps.get(data.roomid).usernames);
            this.roomMaps.get(data.roomid).usernames.set(username, null);
            socket.username = username;

            this.roomMaps.get(data.roomid).users += 1;

            socket.join(data.roomid);
            socket.emit(config.get('chat.events.ROOMID'), {username, roomid:data.roomid, roomname:this.roomMaps.get(data.roomid).name});
            cb({
                username: socket.username, 
                roomid: socket.roomid
            })
        })
    }

    onLeave(socket, cb){
        socket.on('disconnect', (reason) => {
            if(!socket.roomid){
                return;
            }
            cb({
                username: socket.username,
                roomid: socket.roomid
            })
            socket.leave(socket.roomid);
            this.roomMaps.get(socket.roomid).users -= 1;
            this.roomMaps.get(socket.roomid).usernames.delete(socket.username);
            if(this.roomMaps.get(socket.roomid).users <= 0){
                this.roomMaps.delete(socket.roomid);
            }
        });
    }

    distributeMsg(socket, msg, done) {
        socket.to(socket.roomid).emit(config.get('chat.events.NEWMSG'), msg);
        done()
    }

    onMessage(socket, cb) {
        socket.on(config.get('chat.events.NEWMSG'), (data) => {
            let room = socket.roomid
            if(!socket.roomid) {
                socket.emit(config.get('chat.events.NEWMSG'), {
                    error: true, 
                    msg: "You're not part of a room yet"
                })
                return;
            }

            let newMsg = {
                room: room,
                type: config.get("chat.message_types.generic"),
                username: socket.username,
                message: data
            }

            return cb(newMsg)
        });

        socket.on(config.get('chat.events.PRIVATEMSG'), (data) => {
            let room = socket.roomid

            let captureTarget = /(@[a-zA-Z0-9]+)(.+)/
            let matches = data.match(captureTarget)
            let targetUser = matches[1]

            let newMsg = {
                room: room,
                type: config.get("chat.message_types.private"),
                username: socket.username,
                message: matches[2].trim(),
                target: targetUser
            }
            return cb(newMsg)
        })
    }
    getRandomInt(high) {
        return Math.floor(Math.random() * (high - 0) + 0);
    }
    
    generateId(){
        let id = "";
        for(let i=0; i<6;i++){
            id+=this.getRandomInt(10);
        }
        return id;
    }
    
    getRandomId(){
        while(true){
            const id = this.generateId();
            if(!this.roomMaps.has(id))
                return id;
        }
    }
    
    getRandomName(usernames){
        while(true){
            const username = this.usernames[this.getRandomInt(this.usernames.length)];
            if(!usernames.has(username))
                return username;
        }
    }
}


module.exports = ChatServer;