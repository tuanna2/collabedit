$(document).ready(()=> {
    var UserName=$('#getUsername').val();
    var per =$('#permission').val();
    permission = parseInt(per);
    if(UserName =='' || UserName== null){
        UserName = prompt("Please enter your name!");
    }
    else{
        UserName += "(admin)";
    }
    $('#yourName').html("<br/><span>Your name: " + UserName +" </span>");

    const socket = io();
        socket.emit('user-connecst',UserName);
        socket.on('user-connect',UserName =>{
            $('#messages').append($('<li>').text(UserName +" joined"));
        })
        socket.on('user-disconnect',UserName =>{
            $('#messages').append($('<li>').text(UserName +" left"));
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
            let text = {
                TextArea:editor.getValue()
            }
            socket.emit('realtime',editor.getValue());
            $.post('',text);
        },2000);
    }); 
    $('#selectLang').change(()=>{
        editor.setOption({mode:$('#selectLang').val()})
        
        if(permission==0)
            $.post('',{selectLang:$('#selectLang').val()})
    }) 
    socket.on('realtime',value=>{
        if(permission==1)
            editor.setValue(value);
    });
});