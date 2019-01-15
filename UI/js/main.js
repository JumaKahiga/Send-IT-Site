const signUpButton = document.getElementById('registerbutton');

function newUser(){
	let output;
	fetch('https://send-it-site.herokuapp.com/api/v2/auth/signup', {
		mode: 'cors',
		method: 'POST',
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify({
			username: document.getElementById('username').value,
			email: document.getElementById('useremail').value,
			contact_phone: document.getElementById('contactphone').value,
			password: document.getElementById('password').value
		})
	})
	.then((res) => {
		if (res.ok){
			return res.json().then((data) => {
				output = `<p style="background: #004e00;color: white;text-align: center;padding: 20px;font-size: 1.3em;font-family: 'Boogaloo', cursive;">${data.message}</p>`;
				return document.getElementById('registrationmessage').innerHTML = output;
				// message = '${data.Message}':
				// return document.getElementById('registrationmessage').innerHTML = message;
			})
		}
	})
}

if (signUpButton){
    signUpButton.addEventListener('click', newUser);
}