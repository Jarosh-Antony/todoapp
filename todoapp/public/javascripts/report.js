var counts={};
var tasks=[];

var getCounts=function(){
	
	fetch('http://127.0.0.1:3000/report/count/'+userID)
	.then(response => response.json())
	.then(data => {
		counts=data;
		getTaskSummary();
	})
	.catch(error => console.error(error));
	
};


var getTaskSummary=function(){
	
	fetch('http://127.0.0.1:3000/todo/tasks/'+userID+'?status=Completed&sort=priority&order=DESC')
	.then(response => response.json())
	.then(data => {
		var t={};
		t.name='Completed';
		t.task=data;
		tasks.push(t);
		
		
		fetch('http://127.0.0.1:3000/todo/tasks/'+userID+'?status=Incomplete&sort=priority&order=DESC')
		.then(response => response.json())
		.then(data => {
			var t={};
			t.name='Incomplete';
			t.task=data;
			tasks.push(t);
			
			
			fetch('http://127.0.0.1:3000/todo/tasks/'+userID+'?status=Cancelled&sort=priority&order=DESC')
			.then(response => response.json())
			.then(data => {
				var t={};
				t.name='Cancelled';
				t.task=data;
				tasks.push(t);
				
				renderReport();
				
				
			})
			.catch(error => console.error(error));
			
		})
		.catch(error => console.error(error));
		
		
		
	})
	.catch(error => console.error(error));
	
	
	
};


var renderReport=function(){
	var report = document.getElementById('report');
	report.innerHTML="";
	
	var pendingH = document.createElement('H3');
	pendingH.innerHTML='Pending Tasks      ( ';
	
	var cancelledH = document.createElement('H3');
	cancelledH.innerHTML='Cancelled Tasks      ( ';
	
	var completedH = document.createElement('H3');
	completedH.innerHTML='Completed Tasks      ( ';
	
	var deletedH = document.createElement('H3');
	deletedH.innerHTML='Deleted Tasks      ( ';
	
	var pending = document.createElement('DIV');
	var cancelled = document.createElement('DIV');
	var completed = document.createElement('DIV');
	var deleted = document.createElement('DIV');
	
	console.log(counts.count);
	for(i of counts.count){
		if(i._id==='Cancelled'){
			cancelledH.innerHTML+=i.count+" )\n";
		}
		else if(i._id==='Completed'){
			completedH.innerHTML+=i.count+" )\n";
		}
		else if(i._id==='Incomplete'){
			pendingH.innerHTML+=i.count+" )\n";
		}
		else if(i._id==='Deleted'){
			deletedH.innerHTML+=i.count+" )\n";
		}
	}
	
	pending.appendChild(pendingH);
	completed.appendChild(completedH);
	cancelled.appendChild(cancelledH);
	deleted.appendChild(deletedH);
	
	for(const i of tasks){
		var innerDiv = document.createElement('DIV');
		var inner="";
		for(const j of i.task.tasks){
			inner+=j.name+"    ("+j.priority+")<br />";
		}
		innerDiv.innerHTML=inner;
		
		if(i.name==='Completed'){
			completed.appendChild(innerDiv);
		}
		if(i.name==='Incomplete'){
			pending.appendChild(innerDiv);
		}
		if(i.name==='Cancelled'){
			cancelled.appendChild(innerDiv);
		}
	}
	
	report.appendChild(pending);
	report.appendChild(completed);
	report.appendChild(cancelled);
	report.appendChild(deleted);
};


window.onload = function() {
	getCounts();
};