Features

user can login if he has an acccount

and singup if he not has an account

display all users

create chat one user

getchat 

make a chat group

add user to chatgroup


Install dependencies:

npm i cookie-parser
npm i mongoose bcryptjs validator dotenv cors jsonwebtoken express-async-handler

Start the server:

node index.js


API Endpoints

POST  http://localhost:8000/user/signup: Register a new user. {email,password,name}

POST  http://localhost:8000/user/login: Login and receive an authentication token.{email,password}

Get http://localhost:8000/user :show all users

Get http://localhost:8000/use/:id :show one user

POST  http://localhost:8000/chat: create a chat with user .{userId}

Get http://localhost:8000/chat :show chat

POST  http://localhost:8000/chat/group: create a createGroupChat .{name,users:[]}

POST  http://localhost:8000/chat/groupadd: add another user to the groupchat{userId}





