# 🧰 User Management Backend

This is a Node.js + Express backend for a simple user management system.  
It includes **authentication**, **email verification via Gmail API**, **user blocking/unblocking**, and **JWT-based session handling** with cookies.

---

## 📌 Features

- ✅ User registration with email verification  
- 🔐 Login using JWT stored in HTTP-only cookies  
- 📨 Email confirmation via unique token  
- 🚫 Block / Unblock / Delete users (admin routes)  
- 🔒 Protected routes using middleware  
- 🌐 CORS configured for frontend communication

---

## 🏗️ Tech Stack

- **Node.js** — JavaScript runtime  
- **Express.js** — Web framework  
- **MySQL** — Database  
- **JWT (jsonwebtoken)** — Authentication  
- **bcrypt** — Password hashing  
- **googleapis** — Sending confirmation emails via Gmail API  
- **dotenv** — Environment variables  
- **cookie-parser** — Cookie handling  
- **cors** — Cross-origin resource sharing

---

## 📁 Project Structure

project/
├── config/ # Database configuration
├── controllers/ # Route controllers (auth, email, user)
├── middlewares/ # Authentication middleware
├── models/ # Database models (User)
├── routes/ # API routes
├── utils/ # Helper functions (e.g. sendEmail)
├── app.js # Main entry point
├── package.json
└── .env


---

## ⚙️ Installation

#### 1. Clone the repository
```
   git clone https://github.com/AzaS31/user-management-backend.git
   cd user-management-backend
```
#### 2. Install dependencies
```
    npm install
```
#### 3. Set up .env file
Create a .env file in the project root:
```
PORT=5000                          # Server port (e.g. 5000)
DB_HOST=localhost                  # Database host
DB_USER=root                       # Database username
DB_PASSWORD=your_db_password       # Database password
DB_NAME=your_database_name         # Database name

JWT_SECRET=your_very_long_secret_key   # Secret key for signing JWT tokens

FRONTEND_URL=http://localhost:5173     # Frontend URL allowed for CORS and email confirmation links
NODE_ENV=development                   # Environment mode: 'development' or 'production'

```
#### 4. Start the server
```
npm start
```

## 🧪 API Endpoints
#### 🔑 Auth Routes (/api/auth)
| Method | Endpoint          | Description                          |
| ------ | ----------------- | ------------------------------------ |
| POST   | `/register`       | Register a new user and send email   |
| POST   | `/login`          | Login and set auth cookie            |
| GET    | `/confirm/:token` | Verify email via confirmation link   |
| GET    | `/check`          | Check if user is still authenticated |
| POST   | `/logout`         | Clear auth cookie                    |

#### 👤 User Routes (/api/users)
| Method | Endpoint   | Description            |
| ------ | ---------- | ---------------------- |
| GET    | `/`        | Get all users          |
| POST   | `/block`   | Block selected users   |
| POST   | `/unblock` | Unblock selected users |
| DELETE | `/`        | Delete selected users  |

## 🧑‍💻 Author

Azamat S.

## 🪪 License

This project is licensed under the MIT License
