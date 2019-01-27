// Js to connect UI with API

const signupBtn = document.querySelector('#registerbutton')

const signupResource = "https://sendit-v2-app.herokuapp.com/api/v2/auth/signup"



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


// Event listeners
documentTitle = document.querySelector('title').innerText;

if (documentTitle == "Register"){
    signupBtn.addEventListener('click', signupUser)
}
