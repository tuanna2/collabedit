const socket = io();


$(document).ready(()=> {
    var UserName=$('#getUsername').val();
    var admin=$('#getAdmin').val();
    if(UserName==admin){
        admin+= "(admin)";
        UserName=admin;
    }
    while(UserName =='' || UserName== null){
        UserName = prompt("Please enter your name!");
    }
    if($('#getSelect').val()=='text'){
        $('#compiler').css('display','none');
        $('#ioput').css('display','none');
    }
    $('#yourName').html("<br/><span>Your name: " + UserName +" </span>");
    var key=$('#getKey').val();
    socket.emit('room',key);
    var permission = parseInt($('#permission').val());
        //connect
        socket.emit('user-connect',UserName);
        socket.on('user-connect',obj =>{
            $('.tuan').remove();
            $('#messages').append($('<li>').text(obj.UserName +" joined"));
            let array = [];
            obj.online.forEach(name=>{
                array.push(name.UserName);
                $('#person').append('<li class="tuan">'+name.UserName+'<div class="icon-user"><img id='+ name.id +' class ="icon-phone" style="width:20px;height:20px;'+(name.id==socket.id?'display:none':'')+'" src="../phone.png"><img  id='+ name.id +' class="icon-ctv" '+(permission==1?'style="display:none"':(name.UserName==admin?'style="display:none"':''))+' style = "width: 20px; height: 20px" src="../admin.png"></div></li>');
            });
            $('#ol').html(array.length);
        });
        //disconect
        socket.on('user-disconnect',obj =>{
            $('#messages').append($('<li>').text(obj.UserName +" left"));
            $('.tuan').remove();
            let array = [];
            obj.online.forEach(name=>{
                array.push(name.UserName);
                $('#person').append('<li class="tuan">'+name.UserName+'<div class="icon-user"><img id='+ name.id +' class ="icon-phone" style="width:20px;height:20px;'+(name.id==socket.id?'display:none':'')+'" src="../phone.png"><img  id='+ name.id +' class="icon-ctv" '+(permission==1?'style="display:none"':(name.UserName==admin?'style="display:none"':''))+' style = "width: 20px; height: 20px" src="../admin.png"></div></li>');
            });
            $('#ol').html(array.length);
        })

        //chatbox
        $('#chatbox').submit(()=>{
            socket.emit('client-send-data',UserName +":" + $('#m').val());
            $('#m').val('');
            return false;
        });
        socket.on('server-send-data', data =>{
            $('#messages').append($('<li>').text(data));
        });

        //setup code editor
        let mode= $("#getSelect").val();
        var editor = CodeMirror.fromTextArea($('#code')[0], {
            lineNumbers: true,
            lineWrapping: true,
            mode:mode,
            theme:'dracula',
            readOnly:permission,
        });

        //listen event change code
        editor.on('keyup',()=>{
            setTimeout(()=>{
                $.post('',{TextArea:editor.getValue()});
                socket.emit('realtime',editor.getValue());
            },3000);
        }); 
        socket.on('realtime',value=>{
            let cursorPos= editor.getCursor();
                editor.setValue(value);
            editor.setCursor(cursorPos);
        });
        
        //change language
<<<<<<< HEAD
        $('#selectLang').change(()=>{
=======
        $('#selectLang').change((data)=>{
>>>>>>> 8ecc4674cfd56012a8eeb8529e91b7ce722df5fd
            if(permission==0){
                $.post('',{selectLang:$('#selectLang').val()},()=>{
                    socket.emit('langChange',{lang:$('#selectLang').val(),user:UserName});
                });
                if($('#selectLang').val()=='text'){
                    $('#compiler').css('display','none');
                    $('#ioput').css('display','none');
                }
                else{
                    $('#compiler').css('display','block');
                    $('#ioput').css('display','block');
                }
            }
            else{
                alert("You don't have permission");
            }
        });
        socket.on('lang',obj=>{
            editor.setOption('mode',obj.lang);
            $('#selectLang').val(obj.lang);
            $('#messages').append($('<li>').text(obj.user +" changed language to "+$('#selectLang option:selected').text()));
        });

        //add ctv
        $('#person').on('click','.icon-ctv',(id)=>{
            if(permission==0){
                socket.emit('addCTV',$(id.currentTarget).attr('id'));
                $('#'+$(id.currentTarget).attr('id')).css('display','none');
            };
        });
        socket.on('addCTV',ctv=>{
            $('#messages').append($('<li>').text(ctv+' was appointed as a collaborators'));
        })
        socket.on('CTV',()=>{
            permission=0;
            editor.setOption('readOnly',0);
            $('#compiler').css('display','block');
            $('#input').removeAttr("disabled");
        });

        //build code
        $('#compiler').click(()=>{
            $('#compiler').attr('disabled','disabled');
            $("#compiler").html('Running....');
            $("#compiler").css('background-color','#666');
            $.post('https://api.judge0.com/submissions',
            {
                source_code:editor.getValue(),
                language_id:$('#selectLang').val()=='clike'?10:$('#selectLang').val()=='python'?34:$('#selectLang').val()=='javascript'?29:43,
                stdin:$('#input').val()
            },token=>{
                setTimeout(()=>{
                    $.get('https://api.judge0.com/submissions/'+token.token,data=>{
                    if(data.stdout != null){
                        $('#console').val(data.stdout);
                    }
                    else{
                        $('#console').val("Status: " +data.status.description +"\nMessage: "+data.message +"\nCompile output:" +data.compile_output);
                    }
                    socket.emit('compiler',{input:$('#input').val(),output:$('#console').val()});
                    $("#compiler").html('Run');
                    $('#compiler').removeAttr("disabled");
                    $("#compiler").css('background-color','#333');
                })
                },5000)
            });
            return false;
        })
        socket.on('compiler',data=>{
            $('#input').val(data.input);
            $('#console').val(data.output);
        });
        
        //call video
        $('#person').on('click','.icon-phone',(id)=>{
            $('#vid-box').html('Waiting');
            $('.icon-phone').css('display','none');
            let phone = window.phone = PHONE({
                number        : socket.id,
                publish_key   : 'pub-c-c8ba4c14-9fcc-45d2-83ba-e6c239c9a07d',
                subscribe_key : 'sub-c-556451c6-e324-11e8-89eb-46b5aa81648a',
            });	
            phone.ready(function(){ $('#username').css('background','#55ff5b') });
            phone.receive(function(session){
                session.connected(function(session) { $('#vid-box').html(session.video);$('#end').css('display','block');
            });
                session.ended(function(session) { $('#vid-box').html('');$('#end').css('display','none');
                $('.icon-phone').css('display','block');
            });
            });
            socket.emit('user-calling',{from:UserName,phone:socket.id,to:$(id.currentTarget).attr('id')});
        });

        socket.on('user-calling',user=>{
            $('#vid-box').html('<div id="calling-box"><p>'+user.from+' calling you</p><button id="accept">ACCEPT</button><button id="decline">DECLINE</button></div>');
            $('#accept').click(()=>{
                $('.icon-phone').css('display','none');
                $('#vid-box').html('Waiting');
                let phone = window.phone = PHONE({
                    number        : socket.id,
                    publish_key   : 'pub-c-c8ba4c14-9fcc-45d2-83ba-e6c239c9a07d',
                    subscribe_key : 'sub-c-556451c6-e324-11e8-89eb-46b5aa81648a',
                });	
                phone.ready(function(){ $('#username').css('background','#55ff5b') });
                phone.receive(function(session){
                    session.connected(function(session) { $('#vid-box').html(session.video);$('#end').css('display','block');

                });
                    session.ended(function(session) { $('#vid-box').html(''); 
                    $('#end').css('display','none');
                    $('.icon-phone').css('display','block');
                    });
                });
                setTimeout(()=>{
                    phone.dial(user.phone,get_xirsys_servers());
                },4000);
                return false;
            });
            $('#decline').click(()=>{
                socket.emit('decline',user.phone);
                $('#vid-box').html('');
                return false;
            })
        });
        $('#end').click(()=>{
            phone.hangup();
            $('#end').css('display','none');
            $('.icon-phone').css('display','block');
            return false;
        });
        socket.on('decline',()=>{
            $('#vid-box').html('<p>Cannot call,Please try again</p>');
            setTimeout(()=>{
                $('#vid-box').html('');
                $('.icon-phone').css('display','block');
            },3000);
        });
    function get_xirsys_servers() {
        var servers;
        $.ajax({
            type: 'POST',
            url: 'https://service.xirsys.com/getIceServers',
            data: {
                room: 'default',
                application: 'default',
                domain: 'tuanna2.herokuapp.com',
                ident: 'tuanna2',
                secret: '77d9f18c-e7f9-11e8-bda6-0242ac110003',
            },
            success: function(res) {
                res = JSON.parse(res);
                if (!res.e) servers = res.d.iceServers;
            },
            async: false
        });
        return servers;
    }
});
