# Todo app
This is a simple todo app using Express and MongoDB.
[Home page](https://todoapp-jarosh.up.railway.app)


## Features

### Todo

- A user can view the task she/he planned to do in the order of the priority from highest to lowest.
- A user can add any number of tasks and assign a priority for it.
- A task can be marked as completed or incomplete and also can be cancelled.
- A task can also be deleted from the listing which also removes it from the database.
The web page showing tasks can be viewed [here](https://todoapp-jarosh.up.railway.app/todo) , but token has to be supplied as a query parameter 'token'.


### Report

- A user can generate a short report where pending,completed and cancelled tasks are displayed in the order of priority.
- Count of pending, completed, cancelled and deleted tasks are also displayed.
The web page showing report can be viewed [here](https://todoapp-jarosh.up.railway.app/report) , but token has to be supplied as a query parameter 'token'.


## Technologies Used

- Backend: NodeJS
- Framework: ExpressJS
- Database: MongoDB
- Frontend: JS, HTML (PUG), CSS


## Getting Started

1. Clone this repository.
	```bash
	git clone https://github.com/Jarosh-Antony/todoapp
	```

2. Navigate to `todoapp`.
	```bash
	cd todoapp
	```

3. Initialise the nodeJS project repository and install necessary packages.
	```bash
	npm init
	npm install
	```

4. Create a .env file to store hostname, MongoDB URL and Secret key for token generation in the current directory.
	```env
	HOSTNAME=[HOSTNAME]
	DB=[MONGODB URL]
	SECRET_KEY=[SECRET KEY FOR TOKENS]
	```

5. Run the app.
	```bash
	npm start
	```

The app automatically create a database with name `todo`. It also automatically creates collections `Tasks` and `Users`. 'Users' store the details of users for authentication. 'Tasks' store the details of each tasks of every users along with its priority and current status.
Status can be `Completed`, `Incomplete` and `Cancelled`.


## API Endpoints

1. ### Authentication
	
	- #### Login
	
		An endpoint to **autherize** a user.
		
		##### Request
		```
		POST /auth/api/login
		'Content-Type': 'application/json'
		
		{
			"email" : "john@j.com",
			"password" : "abcdefgh"
		}
		```
		
		##### Response
		```json
		HTTP 200 OK
		
		{
			"token" : "sdfefefsd.sdfsdsdfsd.dfsdfsdf"
		}
		```
	
	
	- #### Signup
	
		An endpoint to **create** a new user with given details.
		
		##### Request
		```
		POST /auth/api/signup
		'Content-Type': 'application/json'
		
		{
			"name" : "John",
			"email" : "john@j.com",
			"password" : "abcdefgh"
		}
		```
		
		##### Response
		```json
		HTTP 201 OK
		
		{
			"token" : "regrtg.bcdfdg.xcvvdfgd"
		}
		```
	
	
	
2. ### Tasks
	
	- #### List of tasks
		
		An endpoint to **get** the tasks.
		
		##### Request
		```
		GET /todo/tasks
		'Authorization': 'Bearer [TOKEN]'
		```
		
		##### Response
		```json
		HTTP 200 OK
		
		{
			"tasks":
			[
				{
					"_id" : "63dac56e3eed5f9669391a27", 
					"name" : "Take out garbage", 
					"priority" : 2, 
					"id" : "63d7f4d1d7be2090d9e94de5", 
					"status" : "Cancelled"
				}
				{
					"_id" : "63df5f868284d5e1b494e532",
					"name" : "Pay electricity bill",
					"priority" : 1,
					"id" : "63df5f498284d5e1b494e52f",
					"status" : "Incomplete"
				}
				{
					"_id" : "63df8d4b314f4dfa02057858",
					"name" : "Buy gifts",
					"priority" : 5,
					"id" : "63d7f4d1d7be2090d9e94de5", 
					"status" : "Cancelled"
				}
			]
		}
		```
		- `_id` is the task id.
		- `id` is the user id of the user to whom the task belongs to.
		- Since request query doesn't have `name`, `priority`, and `status`, complete data belonging to the user is returned.
		- Since request query doesn't have `sort`, the data is sorted in the order of `_id`.
		- Since request query doesn't have `order`, the data is ordered in ascending order.
		- If `order` is present without `sort`, then `order` will be tried to be matched with fields in data. This will result in response being empty since there is no field named `order`.
		
		##### Request
		```
		GET /todo/tasks?status=Cancelled&sort=priority&order=DESC
		'Authorization': 'Bearer [TOKEN]'
		```
		
		##### Response
		```json
		HTTP 200 OK
		
		{
			"tasks":
			[
				{
					"_id" : "63df8d4b314f4dfa02057858",
					"name" : "Buy gifts",
					"priority" : 5,
					"id" : "63d7f4d1d7be2090d9e94de5", 
					"status" : "Cancelled"
				}
				{
					"_id" : "63dac56e3eed5f9669391a27", 
					"name" : "Take out garbage", 
					"priority" : 2, 
					"id" : "63d7f4d1d7be2090d9e94de5", 
					"status" : "Cancelled"
				}
			]
		}
		```
		- Request query accepts `name`, `priority`, `status` and any combination of them.
		- Request query also accepts `sort` which sorts data based on the values in field represented by value of `sort`.
		- Sort order can be `DESC` for descending order and `ASC` for ascending order.
		- If `order` is invalid, the data will be sorted in ascending order.
		- If `sort` is invalid, then the data will be sorted based on `_id`.
		
		
	- #### Create a task
		
		An endpoint to **create** a task with given information.
		
		##### Request
		```
		POST /todo/tasks/create
		'Content-Type': 'application/json',
		'Authorization': 'Bearer [TOKEN]'
		
		{
			"name" : "Recharge mobile",
			"priority" : 8
		}
		```
		
		##### Response
		```json
		HTTP 201 OK
		
		```
		
		
	- #### Update status of tasks
	
		An endpoint to **update** the `status` of a task.
		
		##### Request
		```
		PUT /todo/tasks/update
		'Content-Type': 'application/json',
		'Authorization': 'Bearer [TOKEN]'
		
		{
			"_id" : "1231238374872389379",
			"status" : "Completed",
		}
		```
		- `_id` is the task id.
		- `status` can be `Completed`, `Incomplete` and `Cancelled`.
		
		##### Response
		```json
		HTTP 204 OK
		
		```
		
		
	- #### Delete a task
		
		An endpoint to **delete** a task from database.
		
		##### Request
		```
		DELETE /todo/tasks/delete
		'Content-Type': 'application/json',
		'Authorization': 'Bearer [TOKEN]'
		
		{
			"_id" : "593t86045094305943509409"
		}
		```
		- `_id` is the task id.
		
		##### Response
		```json
		HTTP 204 OK
		
		```
		
		
		
3. ### Report
	
	- #### Count
		
		An endpoint to **get** the counts of tasks grouped by their `status`.
		
		##### Request
		```
		GET /report/count
		'Authorization': 'Bearer [TOKEN]'
		```
		
		##### Response
		```json
		HTTP 200 OK
		
		{
			"count" : 
			{
				"Cancelled" : 6,
				"Completed" : 1,
				"Deleted" : 27,
				"Incomplete": 0
			}
		}
		```
		
		##### Request
		```
		GET /report/count?Status=Deleted
		'Authorization': 'Bearer [TOKEN]'
		```
		
		##### Response
		```json
		HTTP 200 OK
		
		{
			"count" : 27
		}
		```
		- Instead of `Deleted` one can use `Completed`, `Incomplete` and `Cancelled`.
		- Only accepted request query is `Status`.
		- Trying out different query produces same response as request without any query.
		- Trying out different values for query produces `0` for `count`.
		
4. ### Other return status
	
	- No token or invalid token when required.
	##### Response
	```json
	HTTP 401 Unauthorized
	
	```
	
	
	- Internal Server Error.
	##### Response
	```json
	HTTP 500 Internal Server Error
	
	```
	
	
	- Invalid/empty values when updating.
	##### Response
	```json
	HTTP 400 Bad Request
	
	```