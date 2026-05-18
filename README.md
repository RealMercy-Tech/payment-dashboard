

# Demo Payment Dashboard

A secure, full-stack peer-to-peer (P2P) demo payment dashboard application. This platform allows users to create accounts, log in securely, check their transaction history, and seamlessly send money to other users using just their phone numbers.

---

## 🚀 Features

* **User Authentication:** Secure sign-up and login routes.
* **Instant Demo Balance:** Every newly registered user automatically starts with a default balance of **20,000** for instant testing.
* **P2P Money Transfer:** Send money instantly to other registered users via their phone numbers.
* **Transaction History:** A dedicated route and view to track all incoming and outgoing transfers.
* **Security & Protection:** 
    * **Rate Limiting:** Protects the server from brute-force attacks and API spamming.
    * **Password Security:** Passwords are securely hashed and salted using `bcrypt` before saving them to the database.
    * **Session Management:** JSON Web Tokens (JWT) are utilized to authorize logged-in users, protecting the dashboard access and transfer routes.

---

## 🛠️ Tech Stack

### Frontend
* **HTML5** - Structure of the dashboard and forms.
* **CSS3** - Custom styling and responsive layout.
* **JavaScript (Vanilla)** - Frontend logic, DOM manipulation, and asynchronous API calls (`fetch`).

### Backend
* **Node.js** - JavaScript runtime environment.
* **Express.js** - Backend framework for routing, middleware, and handling HTTP requests.

### Database & Security
* **PostgreSQL** - Relational database to store user credentials, balances, and ledger logs.
* **Neon** - Serverless PostgreSQL cloud hosting platform.
* **JWT (jsonwebtoken)** - Secure token-based authentication.
* **bcrypt** - Industry-standard password hashing.
* **express-rate-limit** - Rate limiting middleware to prevent brute-force attacks.

---

## ⚙️ Environment Variables

To run this project locally, you will need to create a `.env` file in the root of your backend directory and configure the following variables:

```env
PORT=3000
DATABASE_URL=postgres://username:password@your-neon-host.neon.tech/dbname?sslmode=verify-full
JWT_SECRET=your_super_secret_jwt_key

> ⚠️ **Note on SSL Mode:** The `?sslmode=verify-full` flag is appended to the Neon database URL to ensure maximum encryption security and prevent deprecation warnings in the `pg` library.

---

## 🕹️ How to Test the Demo

1. **Create Account A:** Sign up with a phone number (e.g., `1234567890`). You will log in and see your starting balance of **20,000**.
2. **Create Account B:** Open a private browsing tab, or log out, and sign up with a different phone number (e.g., `0987654321`). This account will also start with **20,000**.
3. **Make a Transfer:** From Account B, use the transfer feature to send money to Account A's phone number (`1234567890`).
4. **Check History:** Check the dashboard of both accounts to see the balances update in real-time and view the transaction records in the history feed.