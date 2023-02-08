
const form = document.getElementById("login");

form.addEventListener("submit", function(event) {
	event.preventDefault();
	const email = form.elements.email.value;
	const password = form.elements.password.value;
	const data={email:email,password:password};
	
	fetch(`${hostname}/auth/api/login`, {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data) 
	})
	.then(response => {
		if(response.status===200){
			response.json()
			.then(data => {
				event.preventDefault();
				localStorage.setItem('token',data.token);
				window.location.href = '/todo';
			})
			.catch(error => console.error(error));
		}
		else if(response.status===401){
			const error = document.getElementById("error");
			error.innerHTML='Invalid email/password';
		}
		else if(response.status===500){
			const all=document.getElementById('all');
			all.innerHTML='Internal Server Error! Try again!';
		}
		else {
			const all=document.getElementById('all');
			all.innerHTML='Something went Wrong! Try again!';
		}
	})
	.catch(err => {
		console.error(err);
	});
	
});
