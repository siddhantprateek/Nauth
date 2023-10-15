#  Nauth

Authentication service in Typescript

## Running application using `docker-compose`

```shell
docker-compose up -d
```


## Checklist

Task: Building a Secure User Authentication and Authorization System with Express.js
Task Description: The objective is to create a secure user authentication and
authorization system using Express.js.
Requirements:
- [x] Create an Express.js Application
- [x]User Registration and Authentication:
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
- [ ] Password Reset:
    - [ ]Implement a "Forgot Password" feature that allows users to reset their passwords through a secure email-based process.
- [x] Security Measures:
    - [x] Implement security headers to prevent common web security vulnerabilities (e.g., XSS, CSRF).
    - [x] Use appropriate libraries to secure against other common attacks.
- [x] Logging:
    - [x] Implement a basic logging system to record user activities and security-related events.
- [x] Testing:
    - [x] Write test cases to ensure that the authentication, authorization, and security features are working as expected.

## Test Coverage

![](./assets/test.png)


## Author

- [Siddhant Prateek Mahanayak](https://github.com/siddhantprateek)