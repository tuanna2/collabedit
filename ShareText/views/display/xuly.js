const socket = io();


$(document).ready(()=> {
    var UserName=$('#getUsername').val();
    if(UserName =='' || UserName== null){
        UserName = prompt("Please enter your name!");
    }
    else{
        UserName += "(admin)";
    }
    $('#yourName').html("<br/><span>Your name: " + UserName +" </span>");
    var key=$('#getKey').val();
    socket.emit('room',key);
    var permission = parseInt($('#permission').val());
            socket.emit('user-connect',UserName);
            socket.on('user-connect',obj =>{
                $('#messages').append($('<li>').text(obj.UserName +" joined"));
                let array = []
                obj.online.forEach(name=>{
                    array.push(name.UserName);
                });
                $('#online').val(array);
                $('#ol').html(array.length);
            })
            socket.on('user-disconnect',obj =>{
                $('#messages').append($('<li>').text(obj.UserName +" left"));
                let array = []
                obj.online.forEach(name=>{
                    array.push(name.UserName);
                });
                $('#online').val(array);
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
        editor.on('changes',()=>{
            setTimeout(()=>{
                $.post('',{TextArea:editor.getValue()});
                socket.emit('realtime',editor.getValue());
            },2000);
        }); 
        $('#selectLang').change(()=>{
            if(permission==0)
                $.post('',{selectLang:$('#selectLang').val()},()=>{
                    socket.emit('langChange',$('#selectLang').val())
                })
        })
        socket.on('realtime',value=>{
            if(permission==1)
                editor.setValue(value);
        });
        socket.on('lang',lang=>{
            editor.setOption('mode',lang);
            $('#selectLang').val(lang);
            $('#messages').append($('<li>').text("Admin changed language to "+$('#selectLang option:selected').text()));
        });
});
