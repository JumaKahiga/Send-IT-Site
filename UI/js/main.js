// Js to connect UI with API


const signupBtn = document.querySelector('#registerbutton')
const signinBtn = document.querySelector('#loginbutton')
const orderBtn = document.querySelector('#orderbutton')

const signupResource = "https://sendit-v2-app.herokuapp.com/api/v2/auth/signup"
const signinResource = "https://sendit-v2-app.herokuapp.com/api/v2/auth/login"
const adminDashboardResource = "https://sendit-v2-app.herokuapp.com/api/v2/parcels"
const newOrderResource = "https://sendit-v2-app.herokuapp.com/api/v2/parcel"



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
            res.json().then((message) => {
                document.getElementById('message').innerHTML = `<p><span>${message.message}</span></p>`;
                let token = message.tokens.access_token;
                let refresh_token = message.tokens.refresh_token;
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('refresh_token', refresh_token);
                let decodedToken = tokenDecode(token);
                let userRole = decodedToken.identity.user_role;
                let userId = decodedToken.identity.user_id;
                let userName = decodedToken.identity.username;
                sessionStorage.setItem('user_role', userRole);
                sessionStorage.setItem('user_id', userId);
                sessionStorage.setItem('username', userName);
                window.location.href = 'dashboard.html';
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

function tokenDecode(token){
    let base64url = token.split('.')[1];
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
    
}

function orderPage(userRole){
    if (userRole == 2){
        return "order_details.html"
    }
    else if (userRole == 1){
        return "order_details_admin.html"
    }
}

function dashboard(event){
    event.preventDefault();
    let token = sessionStorage.getItem('token')
    let refreshToken = sessionStorage.getItem('refresh_token')
    let userRole = sessionStorage.getItem('user_role')
    let userId = sessionStorage.getItem('user_id')
    let userName = sessionStorage.getItem('username')
    let newResource = undefined
    const userDashboardResource = `https://sendit-v2-app.herokuapp.com/api/v2/users/${userId}/parcels`
    
    if (userRole == 2){
        newResource = userDashboardResource
    }
    else if (userRole == 1){
        newResource = adminDashboardResource
    }
    
    fetch(newResource, {
        mode: 'cors',
        method: 'GET',
        headers: {
            "Accept": 'application/json',
            "Content-type": 'application/json; charset=UTF-8',
            "Authorization": `Bearer ${token}`
        }
    })
    .then((res) =>{
        if (res.ok){
            res.json()
                .then((data) => {console.log(data)
            if (data.length == 0){
                document.getElementById('d_table').innerHTML = '<p>No orders available</p>';
            }
            else{
                document.getElementById('username').innerHTML = data[0].client_name;
                let parcel_data = data;
                parcelTable(parcel_data)
            }})
        }
    })
    
    let parcelTable = (parcel_data) =>{
        parcel_data.forEach(parcel => {
            let orderLink = orderPage(userRole);
            let singleOrder = document.createElement("tr");
                singleOrder.innerHTML = `
                            <td><a href=${orderLink}>${parcel.parcel_id}</a></td>
                            <td>${parcel.package_desc}</td>
                            <td>${parcel.recipient_name}</td>
                            <td>${parcel.location}</td>
                            <td>${parcel.destination}</td>
                            <td>${parcel.pickup_date}</td>
                            <td>${parcel.status}</td> `
            document.getElementById('d_table').appendChild(singleOrder);
        })
    }
    

}

function createOrder(event){
    event.preventDefault();
    let token = sessionStorage.getItem('token')
    let refreshToken = sessionStorage.getItem('refresh_token')
    let userName = sessionStorage.getItem('username')
    
    let recipientName = document.getElementById("recipient").value
    let destination = document.getElementById("destination").value 
    let location = document.getElementById("location").value
    let packageDesc = document.getElementById("package_desc").value
    let pickupDate = document.getElementById("pickup_date").value
    
    fetch(newOrderResource, {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-type": 'application/json; charset=UTF-8',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            client_name: userName,
            recipient_name: recipientName,
            package_desc: packageDesc,
            location: location,
            destination: destination,
            pickup_date: pickupDate
        })  
    })
    .then((res) => {
        if (res.status == 201){
            window.location.href = "order_details.html"
        }
        res.json().then((data)=> console.log(data))
    })
    .catch((error) => console.log(error));
}

// Event listeners
documentTitle = document.querySelector('title').innerText;

if (documentTitle == "Register"){
    signupBtn.addEventListener('click', signupUser)
}

if (documentTitle == "Login"){
    signinBtn.addEventListener('click', signinUser)
}

if (documentTitle == "Dashboard"){
    window.addEventListener('load', dashboard);
}

if (documentTitle == "New Order"){
    orderBtn.addEventListener('click', createOrder)
}