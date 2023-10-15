# Nauth

Authentication service in Typescript

## Running application using `docker-compose`

```shell
docker-compose up -d
```
or

```
npm install
npm run prisma:generate
npx prisma migrate dev
npm run deploy

<!-- to start the server -->
npm run dev     # Serve on http://localhost:8090
```
## API Documentation

[Link](https://documenter.getpostman.com/view/16181974/2s9YR6ZYtw)

## Checklist

Task: Build a Secure User Authentication and Authorization System with Express.js

The objective is to create a secure user authentication and authorization system using Express.js.

### Requirements

- [x] Create an Express.js Application
- [x] User Registration and Authentication:
  - [x] Implement user registration with email and password.
  - [x] Store user information securely, including password hashing (using libraries like `bcrypt`).
  - [x] Implement user login with token-based authentication (JWT).
  - [x] Return a JWT token upon successful login.
- [x] Secure Routes
  - [x] Create a set of routes that are protected and require a valid JWT token for access.
  - [x] Implement middleware for JWT validation to secure these routes.
- [x] User Roles and Authorization:
  - [x] Implement a basic role-based access control system with roles like "user" and "admin."
  - [x] Restrict access to certain routes based on the user's role.
  - [x] Admins should have additional permissions.
- [x] Password Reset:
  - [x] Implement a "Forgot Password" feature that allows users to reset their passwords through a secure email-based process.
- [x] Security Measures:
  - [x] Implement security headers to prevent common web security vulnerabilities (e.g., XSS, CSRF).
  - [x] Use appropriate libraries to secure against other common attacks.
- [x] Logging:
  - [x] Implement a basic logging system to record user activities and security-related events.
- [x] Testing:
  - [x] Write test cases to ensure that the authentication, authorization, and security features are working as expected.

## Test Coverage

![](./assets/test.png)

![](./assets/test-2.png)


## Email

For sending email it uses `nodemailer` library.

```js
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  requireTLS: true,
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});
```

- `requireTLS: true` : Ensures that the email server is encrypted during transmission.
- Port `587` is used for sending emails securely via SMTP.

![](./assets/reset-email.png)

## Author

- [Siddhant Prateek Mahanayak](https://github.com/siddhantprateek)
