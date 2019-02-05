// Js to connect UI with API

const signupBtn = document.querySelector('#registerbutton')
const signinBtn = document.querySelector('#loginbutton')

const signupResource = "https://sendit-v2-app.herokuapp.com/api/v2/auth/signup"
const signinResource = "https://sendit-v2-app.herokuapp.com/api/v2/auth/login"



function validatePass(){
    password = document.getElementById('psw').value
    pswRepeat = document.getElementById('psw2').value
    if (password == pswRepeat){
        return true;
    }else{
        return false;
    }
}

function signupUser(event){
    event.preventDefault();
    var username = document.getElementById('username').value
    var userEmail = document.getElementById('useremail').value
    var userPhone = document.getElementById('contactphone').value
    if (validatePass()){
        var password = document.getElementById('psw').value
    }else{
        console.log('Enter same value for passwords')
    }
    
    fetch(signupResource, {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            username: username,
            email: userEmail,
            contact_phone: userPhone,
            password: password
        })
    })
    .then((res) => {
        if (res.status == 201){
            window.location.href = 'login.html';
        }
        res.json().then((data)=> console.log(data));
    })
    .catch((error)=> console.log(error));
}

function signinUser(event){
    event.preventDefault();
    let userEmail = document.getElementById('useremail').value 
    let password = document.getElementById('psw').value
    
    fetch(signinResource, {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-type": 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            email: userEmail,
            password: password
        })
    })
    .then((res) => {
        if (res.status == 200){
            // window.location.href = 'dashboard.html';
            res.json().then((message) => {
                console.log(message);
                document.getElementById('message').innerHTML = `<p><span>${message.message}</span></p>`;
                let token = message.tokens.access_token;
                let refresh_token = message.tokens.refresh_token;
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('refresh_token', refresh_token);
                                     })}
        else{
            res.json().then((message)=> {
                console.log(message);
                document.getElementById('message').innerHTML = `<p>${message.message}</p>`;
            })
        }
    })
    .catch((error)=> console.log(error));
}


// Event listeners
documentTitle = document.querySelector('title').innerText;

if (documentTitle == "Register"){
    signupBtn.addEventListener('click', signupUser)
}

if (documentTitle == "Login"){
    signinBtn.addEventListener('click', signinUser)
}
