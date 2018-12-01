const room = require('./room');
class socket{
    constructor(io){
        this.active_users =[];
        io.on('connection',socket =>{
            socket.on('room',key=>{
                socket.join(key);
                new room(io,socket,key,this.active_users);
            });
        });
    }
}

module.exports=socket;