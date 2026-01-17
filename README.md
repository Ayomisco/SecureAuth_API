# SecureAuth API

Enterprise-grade authentication and authorization API with JWT-based security, HMAC email verification, and role-based access control.

## 🌟 Features

### Security
- **JWT Authentication**: Secure token-based authentication with Bearer tokens
- **HMAC Verification**: Email verification codes hashed using HMAC for enhanced security
- **Password Security**: bcrypt hashing with configurable salt rounds
- **HTTP-Only Cookies**: Protection against XSS attacks
- **Helmet.js**: Security headers configured out of the box
- **Input Validation**: Joi schemas for robust request validation

### Authentication Features
- User registration with email verification
- Secure login/logout
- Email verification with time-limited OTP (15 minutes)
- Password change functionality
- Dual authentication support (Bearer token + Cookies)

### API Features
- **RESTful Design**: Clean, intuitive API endpoints
- **Swagger Documentation**: Full OpenAPI 3.0 specification
- **Pagination**: Built-in pagination for list endpoints
- **Error Handling**: Comprehensive error responses
- **CORS Support**: Configurable cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js >= 22.x
- MongoDB
- SMTP server (for email verification)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ayomisco/auth_system.git
cd auth_system

# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env

# Run in development mode
npm run dev

# Run in production mode
npm start
```

### Environment Variables

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret_key
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
HMAC_VERIFICATION_KEY=your_hmac_secret_key
```

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:

```
http://localhost:8000/api-docs
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)
- `PATCH /api/auth/verify-email` - Send verification code to email
- `PATCH /api/auth/accept-verification-code` - Verify email with code
- `PATCH /api/auth/change-password` - Change user password (requires auth)

### Posts
- `POST /api/posts/create` - Create a new post (requires auth)
- `GET /api/posts/all?page=1` - Get all posts with pagination

## 🏗️ Architecture

```
.
├── config/
│   └── swagger.js          # Swagger/OpenAPI configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── postsController.js  # Post management logic
├── middlewares/
│   ├── identification.js   # JWT verification middleware
│   ├── sendMail.js         # Email service configuration
│   └── validator.js        # Joi validation schemas
├── models/
│   ├── usersModel.js       # User database schema
│   └── postsModel.js       # Post database schema
├── routers/
│   ├── authRouter.js       # Authentication routes
│   └── postRouter.js       # Post routes
├── utils/
│   └── hashing.js          # bcrypt & HMAC utilities
└── index.js                # Application entry point
```

## 🔒 Security Features Explained

### HMAC Email Verification
Instead of storing plain verification codes, SecureAuth uses HMAC (Hash-based Message Authentication Code) to hash the codes before storage. This means:
- Even with database access, codes cannot be used
- Codes are time-limited (15 minutes)
- No plaintext sensitive data in the database

### Password Security
- Passwords are hashed using bcrypt with 10 salt rounds
- Passwords are never stored in plaintext
- Password validation requires uppercase, lowercase, numbers, and special characters

### JWT Token Management
- Tokens are signed with a secret key
- Tokens include user ID, email, and username
- Dual storage: localStorage (for client) + httpOnly cookies (for web)

## 🧪 Testing the API

### Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe123",
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Create a Post (Authenticated)
```bash
curl -X POST http://localhost:8000/api/posts/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "description": "This is the content of my first post"
  }'
```

## 🛠️ Built With

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Joi** - Input validation
- **Nodemailer** - Email service
- **Swagger** - API documentation
- **Helmet** - Security headers

## 📝 License

ISC

## 👨‍💻 Author

**Ayomisco**
- GitHub: [@Ayomisco](https://github.com/Ayomisco)
- Email: francisayomide878@gmail.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
