const socket = io();


$(document).ready(()=> {
    var UserName=$('#getUsername').val();
    var admin=$('#getAdmin').val();
    if(UserName==admin){
        admin+= "(admin)"
        UserName=admin;
    }
    while(UserName =='' || UserName== null){
        UserName = prompt("Please enter your name!");
    }
        
    $('#yourName').html("<br/><span>Your name: " + UserName +" </span>");
    var key=$('#getKey').val();
    socket.emit('room',key);
    var permission = parseInt($('#permission').val());
            socket.emit('user-connect',UserName);
            socket.on('user-connect',obj =>{
                $('.tuan').remove();
                $('#messages').append($('<li>').text(obj.UserName +" joined"));
                let array = []
                obj.online.forEach(name=>{
                    array.push(name.UserName);
                    $('#person').append('<li class="tuan">'+name.UserName+'<div id="'+ name.UserName +'" class="icon-user"><img '+(permission==1?'style="display:none"':(name.UserName==admin?'style="display:none"':''))+' style = "width: 20px; height: 20px" src="../admin.png"></div></li>');
                });
                $('#ol').html(array.length);
            })
            socket.on('user-disconnect',obj =>{
                $('#messages').append($('<li>').text(obj.UserName +" left"));
                $('.tuan').remove();
                let array = []
                obj.online.forEach(name=>{
                    array.push(name.UserName);
                    $('#person').append('<li class="tuan">'+name.UserName+'<div id="'+ name.UserName +'" class="icon-user"><img '+(permission==1?'style="display:none"':(name.UserName==admin?'style="display:none"':''))+' style = "width: 20px; height: 20px" src="../admin.png"></div></li>');
                });
                $('#ol').html(array.length);
            })
        $('#chatbox').submit(()=>{
            socket.emit('client-send-data',UserName +":" + $('#m').val());
        $('#m').val('');
            return false;
        });
        socket.on('server-send-data', data =>{
            $('#messages').append($('<li>').text(data));
        });
        let mode= $("#getSelect").val();
        var editor = CodeMirror.fromTextArea($('#code')[0], {
            lineNumbers: true,
            lineWrapping: true,
            mode:mode,
            theme:'dracula',
            readOnly:permission,
        });
        editor.on('keyup',()=>{
            setTimeout(()=>{
                $.post('',{TextArea:editor.getValue()});
                socket.emit('realtime',editor.getValue());
            },3000);
        }); 
        $('#selectLang').change(()=>{
            if(permission==0)
                $.post('',{selectLang:$('#selectLang').val()},()=>{
                    socket.emit('langChange',{lang:$('#selectLang').val(),user:UserName});
                });
            else{
                alert("You don't have permission");
            }
        });
        socket.on('realtime',value=>{
            let cursorPos= editor.getCursor();
                editor.setValue(value);
            editor.setCursor(cursorPos);
        });
        socket.on('lang',obj=>{
            editor.setOption('mode',obj.lang);
            $('#selectLang').val(obj.lang);
            $('#messages').append($('<li>').text(obj.user +" changed language to "+$('#selectLang option:selected').text()));
        });
        $('#person').on('click','.icon-user',(id)=>{
            if(permission==0)
                socket.emit('addCTV',$(id.currentTarget).attr('id'));
        });
        socket.on('addCTV',admin=>{
            $('#messages').append($('<li>').text(admin+' was appointed as a collaborators'));
        })
        socket.on('CTV',()=>{
            permission=0;
            editor.setOption('readOnly',0);
        });

});
