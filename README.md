# ShhTalk-Server
The online chat server codebase for the Anonymous Group Chat android application [ShhTalk](https://github.com/manupillai308/ShhTalk).


## About

This chat server is built using Node.js and uses Socket-IO for communication between clients. 
The codebase is heavenly inspired by this [blog](https://blog.logrocket.com/working-chat-server-in-node/) post from [Fernando Doglio](https://www.fdoglio.com/). 
The server is responsible for [ShhTalk](https://play.google.com/store/apps/details?id=com.shhtalk) mobile application online chat room feature. 
The online chat room feature enables shhTalk users to create anonymous group chat rooms over the internet. 
The functionality is implemented using SocketIO. The mobile application(Java Client) connects to (following a WebSocket Protocol) this chat server, 
which handles the communication between multiple connected clients, like exchanging messages and alerting users in a group chat about certain events e.g a user leaving or joining the group.

In a nutshell, **ShhTalk-Server** is a general purpose minimal production-ready chat server application.


## For Developers

A complete understanding of the working and implementation can be found from this [blog](https://blog.logrocket.com/working-chat-server-in-node/) post as mentioned earlier. The only **dependency** to this codebase is [Socket-IO](https://socket.io/docs/v4/server-installation/).

## License

The majority of the codebase is reproducible in its own sense hence a License is pointless. But since this is a part of ShhTalk, this project is also licensed under the terms of the GNU General Public License v3.0. See the [LICENSE](/LICENSE.md) file for license rights and limitations.

