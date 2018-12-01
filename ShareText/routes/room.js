class room{
    constructor(io,socket,key,active_users){
        this.io=io;
        this.socket=socket;
        this.key=key;
        this.active_users=active_users;
        this.listenOnRoom();
    }
    listenOnRoom(){
        this.socket.on('user-connect',UserName =>{
            this.active_users.push({"id": this.socket.id,"UserName":UserName,"key":this.key});
            let objRoom =this.active_users.filter(obj=>{
                return obj.key == this.key; //return object info room
            });
            this.io.to(this.key).emit('user-connect',{UserName:UserName,online:objRoom});
            this.socket.on('disconnect',()=>{
                this.active_users.splice(this.active_users.findIndex(v=>v.id == this.socket.id),1); //pop user
                let objRoom =this.active_users.filter(obj=>{
                    return obj.key == this.key; 
                });
                this.io.to(this.key).emit('user-disconnect',{UserName:UserName,online:objRoom});
            });
        });
        //chatbox:
        this.socket.on('client-send-data', data => {
            this.io.to(this.key).emit('server-send-data', data);
            });
        //shareText:
        this.socket.on('realtime',value =>{
            this.socket.broadcast.to(this.key).emit('realtime',value);
        });
        //change language:
        this.socket.on('langChange',lang=>{
            this.io.to(this.key).emit('lang',lang);
        });
        //add ctv:
        this.socket.on('addCTV',img=>{
            let id = img.slice(3);
            let ctv=this.active_users.filter(obj=>{
                return obj.id == id;
            });
            this.io.to(this.key).emit('addCTV',ctv[0].UserName);
            this.socket.broadcast.to(id).emit('CTV');
        });
        //build code: 
        this.socket.on('compiler',data=>this.io.to(this.key).emit('compiler',data));
        //call video:
        this.socket.on('user-calling',obj=>{
            let user =this.active_users.filter(obj1=>{
                return obj1.id == obj.to;
            });
            this.socket.broadcast.to(user[0].id).emit('user-calling',obj);
        });
        this.socket.on('decline',phone=>{
            this.socket.broadcast.to(phone).emit('decline');
        });
    }
}
module.exports=room;