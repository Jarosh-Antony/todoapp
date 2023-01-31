var getCounts=function(){
	
	fetch('http://127.0.0.1:3000/report/count/'+userID)
	.then(response => response.json())
	.then(data => {
		var count = document.getElementById('count');
		count.innerHTML="";
		
		var ul = document.createElement("UL");
		for(i of data.count){
			var t=document.createElement("LI");
			t.innerHTML='&nbsp;&nbsp;'+i._id+' : '+i.count;
			
			ul.appendChild(t);
		}
		count.appendChild(ul);
	})
	.catch(error => console.error(error));
	
};


var getTaskSummary=function(){
	fetch('http://127.0.0.1:3000/todo/tasks/'+userID+'?sort=status&order=ASC')
	.then(response => response.json())
	.then(data => {
		var count = document.getElementById('count');
		count.innerHTML="";
		
		var ul = document.createElement("UL");
		for(i of data.count){
			var t=document.createElement("LI");
			t.innerHTML='&nbsp;&nbsp;'+i._id+' : '+i.count;
			
			ul.appendChild(t);
		}
		count.appendChild(ul);
	})
	.catch(error => console.error(error));
};


window.onload = function() {
	getCounts();
	getTaskSummary();
};