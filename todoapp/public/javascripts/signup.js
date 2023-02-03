
const form = document.getElementById("signup");

form.addEventListener("submit", function(event) {
	event.preventDefault();
	const name = form.elements.name.value;
	const email = form.elements.email.value;
	const password = form.elements.password.value;
	const data={name:name,email:email,password:password};
	
	fetch('http://127.0.0.1:3000/auth/api/signup', {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data) 
	})
	.then(response => response.json())
	.then(data => {
		event.preventDefault();
		window.location.href = `/todo?token=${data.token}`;
	}).catch(error => console.error(error));
	
});
