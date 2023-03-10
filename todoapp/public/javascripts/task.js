var postTask= function(){
	
	var n = document.querySelector('input[name="taskName"]').value;
    var p = document.querySelector('input[name="priority"]').value;
	if(n.length!==0 && p.length!==0)
	{
		var data = { name: n, priority: p };
		const token = localStorage.getItem('token');
		if(token===null)
			loginFirst();
		else {
			
			fetch(`${hostname}/todo/tasks/create`, {
				method: 'POST', 
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify(data) 
			})
			.then(response => {
				if(response.status===201)
					loadTasks();
				else if(response.status===401)
					loginFirst();
				else if(response.status===500)
					serverError();
				else if(response.status===400){
					const error=document.getElementById('error');
					error.innerHTML='Enter valid values in both fields';
				}
				else 
					somethingElse();
			})
			.catch(error => console.error(error));
		}
	}
};

var serverError=function(){
	const all=document.getElementById('all');
	all.innerHTML='Internal Server Error! Try again!';
};

var somethingElse=function(){
	const all=document.getElementById('all');
	all.innerHTML='Something went Wrong! Try again!';
};

var taskInput = function () {
	
    var newTask = document.createElement('INPUT');
	newTask.setAttribute('type','text');
	newTask.setAttribute("required", "");
	newTask.setAttribute('name','taskName');
	newTask.setAttribute('placeholder','Task name');
	
	var priority = document.createElement('INPUT');
	priority.setAttribute('type','number');
	priority.required=true;
	priority.setAttribute('min',1);
	priority.setAttribute('max',9);
	priority.setAttribute('name','priority');
	priority.setAttribute('placeholder','Priority');
	
	var submitTask = document.createElement('BUTTON');
	submitTask.innerHTML='Add task';
	submitTask.setAttribute('name','Add task');
	submitTask.addEventListener("click",postTask);
	
	var newT = document.getElementById('new');
	newT.innerHTML="";
	newT.appendChild(newTask);
	newT.appendChild(priority);
	newT.appendChild(submitTask);
};

var put=function(statu,val){
	var p = val;
	const token = localStorage.getItem('token');
	if(token===null)
		loginFirst();
	else {
		fetch(`${hostname}/todo/tasks/update`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				'_id': p,
				'status':statu,
			})
		})
		.then(response => {
			if(response.status===204)
				loadTasks();
			else if(response.status===401)
				loginFirst();
			else if(response.status===500)
				serverError();
			else 
				somethingElse();
		})
		.catch(error => console.error(error));
	}
};

var complete=function(p){
	put('Completed',p);
};

var incomplete=function(p){
	put('Incomplete',p);
};

var cancel=function(p){
	put('Cancelled',p);
};


var del=function(p){
	const token = localStorage.getItem('token');
	if(token===null)
		loginFirst();
	else {
		fetch(`${hostname}/todo/tasks/delete`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({
				'_id': p,
			})
		})
		.then(response => {
			if(response.status===204)
				loadTasks();
			else if(response.status===401)
				loginFirst();
			else if(response.status===500)
				serverError();
			else 
				somethingElse();
		})
		.catch(error => console.error(error));
	}
};


var loginFirst=function(){
	const all=document.getElementById("all");
	all.innerHTML="";
	const error = document.getElementById("error");
	error.innerHTML=`<a href="${hostname}/auth/login">Login</a> First`;
};


var loadTasks=function(){
	const token = localStorage.getItem('token');
	if(token===null){
		loginFirst();
	}
	else {
		fetch(`${hostname}/todo/tasks?sort=priority&order=DESC`,{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		})
		.then(response => {
			if(response.status===200){
				response.json()
				.then(data => {
					var newT = document.getElementById('tasks');
					newT.innerHTML="";
					
					var ol = document.createElement("OL");
					for(i in data.tasks){
						var t=document.createElement("LI");
						task=data.tasks[i]
						
						
						var T=task.name+' ( '+task.priority+' ) [ ';
						if(task.status==='Completed'){
							T+='&#x2713';
						}
						else if(task.status==='Cancelled'){
							T+='&#x2717';
						}
						T+=']&nbsp;&nbsp;&nbsp;&nbsp;';
						t.innerHTML=T;
						
						if(task.status !== 'Cancelled'){
							
							var statusButton = document.createElement('BUTTON');
							statusButton.setAttribute('value',task._id);
							statusButton.setAttribute('name','status');
							
							if(task.status==='Completed')
							{
								statusButton.addEventListener('click', (event) => {
									incomplete(event.target.value);
								});
								statusButton.innerHTML='Incomplete';
							}
							else 
							{
								statusButton.addEventListener('click', (event) => {
									complete(event.target.value);
								});
								statusButton.innerHTML='Completed';
							}
							t.appendChild(statusButton);
							
							statusButton = document.createElement('BUTTON');
							statusButton.innerHTML='Cancel';
							statusButton.setAttribute('value',task._id);
							statusButton.addEventListener('click', (event) => {
								cancel(event.target.value);
							});
							statusButton.setAttribute('name','status');
							t.appendChild(statusButton);
						}
						
						var statusButton = document.createElement('BUTTON');
						statusButton.innerHTML='Delete';
						statusButton.setAttribute('value',task._id);
						statusButton.setAttribute('name','delete');
						statusButton.addEventListener('click', (event) => {
							del(event.target.value);
						});
						t.appendChild(statusButton);
						
						ol.appendChild(t);
					}
					newT.appendChild(ol);
					var addTaskButton = document.createElement('BUTTON');
					addTaskButton.innerHTML='+Add new task';
					addTaskButton.setAttribute('name','newTask');
					addTaskButton.addEventListener("click",taskInput);
					
					var newT = document.getElementById('new');
					newT.innerHTML="";
					newT.appendChild(addTaskButton);
				});
			}
			else if(response.status===401)
				loadTasks();
			else if(response.status===500)
				serverError();
			else 
				somethingElse();
		})
		.catch(error => console.error(error));
	}
	
};

var logout=function(){
	event.preventDefault();
	localStorage.removeItem('token');
	window.location.href = '/';
};


window.onload = function() {
	loadTasks();
};
