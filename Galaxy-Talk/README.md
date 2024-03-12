Features

 user can login if he has an acccount
 and singup if he not has an account

InInstall dependencies:

npm i cookie-parser
npm i mongoose  bcryptjs validator dotenv cors jsonwebtoken

Start the server:
node index.js

API Endpoints

POST /user/signup: Register a new user. {email,password,name}
POST /user/login: Login and receive an authentication token.{email,password}

