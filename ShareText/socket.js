class socket{
    constructor(io){
        this.active_users =[];
        io.on('connection',socket =>{
            socket.on('room',key=>{
                socket.join(key);
                socket.on('user-connect',UserName =>{
                    this.active_users.push({"id": socket.id,"UserName":UserName,"key":key});
                    // io.in(key).clients((err,clients) => {
                    //     console.log(clients); //so nguoi trong room
                    // });
                    let objRoom =this.active_users.filter(obj=>{
                        return obj.key == key; //return object info room
                    });
                    io.to(key).emit('user-connect',{UserName:UserName,online:objRoom});
                    socket.on('disconnect',()=>{
                        this.active_users.splice(this.active_users.findIndex(v=>v.id == socket.id),1); //pop user
                        let objRoom =this.active_users.filter(obj=>{
                            return obj.key == key; 
                        });
                        io.to(key).emit('user-disconnect',{UserName:UserName,online:objRoom});
                    });
                });
                //chatbox:
                socket.on('client-send-data', data => {
                    io.to(key).emit('server-send-data', data);
                  });
                //shareText:
                socket.on('realtime',value =>{
                    socket.broadcast.to(key).emit('realtime',value);
                });
                //change language:
                socket.on('langChange',lang=>{
                    io.to(key).emit('lang',lang);
                });
                //add :
                socket.on('addCTV',img=>{
                    let id = img.slice(3);
                    let ctv=this.active_users.filter(obj=>{
                        return obj.id == id;
                    });
                    io.to(key).emit('addCTV',ctv[0].UserName);
                    socket.broadcast.to(id).emit('CTV');
                });
                //build code: 
                socket.on('compiler',data=>io.to(key).emit('compiler',data));
                //call video:
                socket.on('user-calling',obj=>{
                    let user =this.active_users.filter(obj1=>{
                        return obj1.id == obj.to;
                    });
                    socket.broadcast.to(user[0].id).emit('user-calling',obj);
                });
                socket.on('decline',phone=>{
                    socket.broadcast.to(phone).emit('decline');
                })
            });
        });
    }
}

module.exports=socket;