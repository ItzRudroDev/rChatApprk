// ✔️
const socket = io();

const msgInp = document.getElementById('msg_inp');
const sendBtn = document.getElementById('send_btn');
const chatArea = document.getElementById('chat_area');
const placeHolderDiv = document.getElementById('placeHolder_div');
const themeBtn = document.getElementById('themeBtn');
const enc_dec_togBtn = document.getElementById('enc_dec_togBtn');
const reloadBtn = document.getElementById('reloadBtn');
const onlineNowBtn = document.getElementById('onlineNowBtn');
const rulesBtn = document.getElementById('rulesBtn');
const themeMod = document.getElementById('themeMod');
const enc_dec_mod = document.getElementById('enc_dec_mod');
const cssRoot = document.querySelector(':root');
const notifiSound = new Audio('sound.mp3');
let online_users = 0;

let usernameVal = prompt("Enter your username");

if (usernameVal !== null) {
    usernameVal = usernameVal.trim();
    usernameVal = usernameVal.toUpperCase();
}
if (usernameVal == "" || usernameVal == undefined || usernameVal == 'SYSTEM') {
    usernameVal = "Anonymous";
}

if (usernameVal.length>8){
    usernameVal = "Anonymous";
}

socket.emit('new-user-joined', usernameVal);

socket.on('user-joined', name => {
    sendAlert(name,'joined');
    online_users++;
});

socket.on('receive', data => {
    sendMsg(data.message, 'incoming', data.name);
});

socket.on('left', name => {
    sendAlert(name,'left');
    online_users--;
});

let isThemeDay = true;
let isChatDecrypted = true;

let placeHolderDivDisp = true;
msgInp.addEventListener('keypress', (e) => {
    if (e.charCode == 13) {
        const msgVal = msgInp.value;
        const position = 'outgoing';
        const msgValFinal = msgVal.trim();
        if (msgValFinal !== "" && msgValFinal !== undefined) {
            sendMsg(msgVal, position , usernameVal);
            socket.emit('send',msgValFinal);
        }
    }
});

sendBtn.addEventListener('click', () => {
    const msgVal = msgInp.value;
    const position = 'outgoing';
    const msgValFinal = msgVal.trim();
    if (msgValFinal !== "" && msgValFinal !== undefined) {
        sendMsg(msgVal, position , usernameVal);
        socket.emit('send',msgValFinal);
    }
});

const sendMsg = (e,p,n) => {
    const elem = document.createElement('div');
    const elem_p = document.createElement('p');
    const elem_msg = document.createElement('div')
    elem_msg.innerHTML = `${e}`;
    elem_p.innerHTML = `${n}`
    elem.classList.add('messageCont');
    elem_p.classList.add('username_'+p);
    elem_msg.classList.add('msg_'+p);
    elem.appendChild(elem_p);
    elem.appendChild(elem_msg);
    chatArea.appendChild(elem);
    msgInp.value = "";
    chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
    if(p=='incoming') {
        notifiSound.play();
    }
}

const sendAlert = (name,status) => {
    const elem = document.createElement('div');
    elem.innerHTML = `${name} ${status} the chat`;
    elem.classList.add('joinleaveAlert');
    chatArea.appendChild(elem);
    chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
    notifiSound.play();
}

themeBtn.addEventListener('click', () => {
    if (isThemeDay == true) {
        themeMod.classList.replace('fa-sun', 'fa-moon');
        themeMod.title = 'Night mode';
        cssRoot.style.setProperty('--dark', '#fff');
        cssRoot.style.setProperty('--white', '#000');
        cssRoot.style.setProperty('--chatCol', 'rgb(29, 29, 29)');
        cssRoot.style.setProperty('--bgCol', '#fff');
        isThemeDay = false;
    } else {
        themeMod.classList.replace('fa-moon', 'fa-sun');
        themeMod.title = 'Day mode';
        cssRoot.style.setProperty('--dark', '#000');
        cssRoot.style.setProperty('--white', '#fff');
        cssRoot.style.setProperty('--chatCol', 'rgb(230, 229, 229)');
        cssRoot.style.setProperty('--bgCol', 'rgb(17, 115, 243)');
        isThemeDay = true;
    }
});

enc_dec_togBtn.addEventListener('click', () => {
    if (isChatDecrypted == true) {
        enc_dec_mod.classList.replace('fa-eye', 'fa-eye-slash');
        enc_dec_mod.title = 'Encrypted';
        chatArea.style.opacity = '0';
        isChatDecrypted = false;
    } else {
        enc_dec_mod.classList.replace('fa-eye-slash', 'fa-eye');
        enc_dec_mod.title = 'Decrypted';
        chatArea.style.opacity = '1';
        isChatDecrypted = true;
    }
});

reloadBtn.addEventListener('click', () => {
    window.location.reload();
});

onlineNowBtn.addEventListener('click', ()=> {
    swal(online_users);
});

rulesBtn.addEventListener('click', () => {
    swal("Basic Rules!",
        "If your name is blank or if you name yourself 'system' and if your name extends 8 charecters it will be automaticaly renamed to 'Anonymous'. We request you to be honest as it is a public place. If you face any error or if you want to contact with the customer care visit 'contactrk.netlify.app' --Thank you for reading - Rudro "
     );
});