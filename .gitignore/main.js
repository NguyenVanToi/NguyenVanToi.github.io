const socket = io('https://webrtc001.herokuapp.com/'); //tao socket server voi port: 3000
$('.div-content').hide();
//thong bao dang ky that bai
socket.on('DANG_KY_THAT_BAI', function () {
    alert('Chon username khac');

});
// lang nghe server va gui lai danh sach nguoi online
socket.on('ONLINE', function (arrUserInfo, u) {
    $('.div-content').show();
    $('.div-sign-up').hide();
   arrUserInfo.forEach(function (user) {
       const {name, peerId} = user;
       if(u.name != user.name) $("#ulUser").append(`<li id="${peerId}">${name}</li>`);
   });
    //hien thi nguoi dung moi
    socket.on('NGUOI_DUNG_MOI', function (user) {
        const {name, peerId} = user;
        $("#ulUser").append(`<li id="${peerId}">${name}</li>`);
    });
    //su kien ngat ket noi
    socket.on('NGAT_KET_NOI', function (peerId) {
        $(`#${peerId}`).remove();
    })
});


function  openStream() {
    const config = {audio:false,  video:true}; // su dung video, khong su dung audio
    return navigator.mediaDevices.getUserMedia(config)
}
// chay camera
function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;  //gan video vao stream object
    video.play();
}
var peer = new Peer({key: 'lwjd5qra8257b9'}); // su dung thu vien peerjs de tao peer nguoi dung
peer.on('open', function (id) {
    $('#my-peer').append(id); //show peer ra man hinh
    //sign up
    $("#btnSignUp").click(function () {
        const username = $("#txtUsername").val();
        socket.emit('DANG_KY', {name: username, peerId: id});
    });
});

//caller
 $("#btnCall").click(function () { // bat su kien call
     const id = $('#remoteId').val(); //lay ra peer cua nguoi can goi
     openStream().then(function (stream) {// hien stream cua local (nguoi goi)
         playStream('localStream', stream);
         const call = peer.call(id, stream); // bat dau goi
         call.on('stream', function (remoteStream) {
             playStream('remoteStream', remoteStream)
         });
     })
 });
 
 //receive

peer.on('call', function (call) {
    openStream().then(function (stream) {
        call.answer(stream); // tra loi cuoc goi
        playStream('localStream', stream); // hien stream cua local
        call.on('stream', function (remoteStream) {
            playStream('remoteStream', remoteStream)
        });

    })
});

//click vao danh sach de goi
$("#ulUser").on('click', 'li', function () {
    const id = $(this).attr('id'); // lay ra id cua nguoi dung trong li tag
    openStream().then(function (stream) {// hien stream cua local (nguoi goi)
        playStream('localStream', stream);
        const call = peer.call(id, stream); // bat dau goi
        call.on('stream', function (remoteStream) {
            playStream('remoteStream', remoteStream)
        });
    })
});
