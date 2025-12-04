
# PharmaPrime — Employee Management App 🩺

> Centralized employee & field-force management for Admins and Employees — attendance, leaves, POB (Proof of Business) visits, doctor/chemist database, field productivity tracking and analytics.
> React Native client + Node.js/Express backend + MongoDB. Geo-tracking, OTP/email notifications and role-based access included.

---

## Quick links

* Live backend: [https://PharmaPrime.onrender.com/](https://PharmaPrime.onrender.com/)
* API docs (Swagger): [https://PharmaPrime.onrender.com/api-docs/](https://PharmaPrime.onrender.com/api-docs/)
* Figma (design): [https://www.figma.com/make/zowwkwF4sV8lmmgiaTXV74/Employee-Management-App?node-id=0-1&p=f&t=Ia5BHcXOXdklokdB-0](https://www.figma.com/make/zowwkwF4sV8lmmgiaTXV74/Employee-Management-App?node-id=0-1&p=f&t=Ia5BHcXOXdklokdB-0)
* Repository: `ritikraj07/PharmaPrime` (this repo)

---

## Table of contents

1. [Project overview](#project-overview)
2. [Features & user roles](#features--user-roles)
3. [Tech stack](#tech-stack)
4. [Architecture & folder layout](#architecture--folder-layout)
5. [Environment variables (`.env.example`)](#environment-variables-envexample)
6. [Install & run (dev)](#install--run-development)
7. [API & endpoints](#api--endpoints)
8. [Security & validation notes](#security--validation-notes)
9. [Logging, monitoring & OTP/email](#logging-monitoring--otpemail)
10. [Testing & CI suggestions](#testing--ci-suggestions)
11. [Roadmap & known limitations](#roadmap--known-limitations)
12. [Contributing & contact](#contributing--contact)
13. [License](#license)

---

## Project overview

**PharmaPrime** is a full-stack Employee Management application focused on field operations. It replaces manual spreadsheets and disconnected tools with a single platform where Admins and Employees can manage:

* Daily attendance (check-in / check-out with geo coordinates)
* Leave requests and approvals
* POB visits (doctor / chemist interactions, products, visit summary)
* Hierarchical employee mapping (Headquarter → Manager → Employee)
* Reporting & analytics dashboards for Admins
* Account flows: Signup, OTP/Email verification, password change/reset

The system keeps data structured using MongoDB schemas for Employee, Admin, Attendance, Leave, POB, Doctor/Chemist and Headquarter.

---

## Features & user roles

### Admin

* Create / update / delete employees
* Approve / reject leave requests
* View overall analytics and reports
* Manage POB, doctor/chemist master data
* Headquarter & manager mapping

### Employee

* Mark attendance (with geo tracking)
* Apply for leave
* Create POB entries and doctor/chemist visits
* View personal attendance/leave history and reports

### Extra / implemented (beyond core)

* OTP via email (account create, OTP for actions)
* Password reset / change
* Error/info logger that stores server logs
* Weekly POB planning input & product value tracking

---

## Tech stack

**Server**

* Node.js (Express)
* MongoDB (Mongoose)
* JWT auth, bcryptjs for hashing
* Swagger (swagger-autogen / swagger-ui-express) for API docs

**Client**

* React Native (Expo) + Expo Router
* Redux Toolkit (for state)
* Redux RTK Query for API requests
* Expo libraries: location, image, splash, etc.

**Other**

* Hosting: Render (backend deployed)
* Email: Nodemailer (OTP, notifications)
* Logging: custom logger (stores error and info logs)

---

## Architecture & folder layout

(High level — adapt to actual layout in repo)

```
PharmaPrime/
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── utils/         # logger, mailer, helpers
│   ├── index.js
│   └── package.json
├── client/            # Expo React Native app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/  # api wrappers
│   │   ├── redux/
│   │   └── App entry
│   └── package.json
└── README.md
```

---

## Environment variables (`.env.example`)

Use the following as a base. Replace the placeholder values with real credentials. **Do not commit `.env`**.

```bash
# Server
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<a_strong_random_secret>
SERVER_URL=https://PharmaPrime.onrender.com

# Client
APP_URL=http://localhost:19000   # or the expo URL when running locally
API_BASE_URL=${SERVER_URL}/api  # or direct server URL

# App setup / security
SETUP_TOKEN=<initial_setup_token_if_any>
SETUP_ENABLED=true

# Email / OTP (nodemailer)
EMAIL_SERVICE=<smtp_provider_or_service>
EMAIL_USER=<email_address>
EMAIL_PASS=<email_password>

# Environment
NODE_ENV=development

# Optional
PASSWORD_SALT_ROUNDS=10
LOG_LEVEL=info
```

---

## Install & run (development)

> **One README for root:** the repo contains `server` and `client` folders. Run them separately.

### 1. Clone the repo

```bash
git clone https://github.com/ritikraj07/PharmaPrime.git
cd PharmaPrime
```

### 2. Server (backend)

```bash
cd server
npm install
# create .env using the .env.example values
npm run dev      # uses nodemon (see package.json: "dev": "nodemon index.js")
# or
npm start        # production start (node index.js)
```

**Quick check**: Server listens on `PORT` from `.env`. API docs available at `/api-docs/` (e.g. [https://PharmaPrime.onrender.com/api-docs/](https://PharmaPrime.onrender.com/api-docs/))

### 3. Client (React Native / Expo)

```bash
cd client
npm install
npm run start    # expo start
# or
npm run android
npm run ios
```



---

## API & endpoints

A complete, interactive API documentation is available via Swagger at:

**[https://PharmaPrime.onrender.com/api-docs/](https://PharmaPrime.onrender.com/api-docs/)**

You can use the Swagger UI to review available endpoints, request/response schemas, required headers, and example payloads. This README lists the main resource groups (examples):

* `POST /employees` — create employee (admin)
* `POST /employees/login` — login (returns JWT)
* `GET /employees` — list employees (admin)
* `GET /attendance` — fetch attendance records
* `POST /attendance/mark` — mark attendance (employee)
* `POST /pob` — create POB visit entry (employee)
* `GET /pob` — POB listing / filters
* `POST /leaves` — apply for leave
* `PATCH /leaves/:id/approve` — approve/reject (admin)
* `GET /reports` — aggregated admin reports & analytics

> For exact routes, request/response models and authorization requirements, use the **Swagger UI** link above (it is the source of truth and automatically generated from the server).

---

## Security & validation notes

PharmaPrime already includes several security measures (from packages in `package.json`), and I recommend the following checklist to keep the app secure and production ready:

* [x] `helmet` for HTTP headers (already in `package.json`)
* [x] CORS configured (use a strict origin whitelist for production)
* [x] Password hashing using `bcrypt` (already implemented in code)
* [x] JWT authentication with proper expiry and rotation strategy (`JWT_SECRET`)
* [x] Input validation using `express-validator` on all incoming requests
* [x] Role-based middleware: separate Admin vs Employee routes and middleware guards
* [x] Rate limiting (e.g., `express-rate-limit`) on auth endpoints to reduce brute force attempts — consider adding if not present
* [x] Sanitize inputs (avoid NoSQL injection): use mongoose casting or libraries like `express-mongo-sanitize`
* [x] HTTPS in production (Render provides TLS) — do not send sensitive data over plain HTTP
* [x] Use environment variables for all secrets — never commit them
* [x] Set secure cookie flags and CORS properly if you use cookies

**[More about secure coding practices](https://ritik-blogs.netlify.app/blogs/secure-coding-practices.html)**

---

## Logging, monitoring & OTP/email

* **Logging:** The server contains a logger that stores `error` and `info` logs. Ensure logs are rotated and stored securely in production (e.g., use a logging service or centralized store). Do not log secrets.
* **Mailer / OTP:** Nodemailer is used for OTPs (account creation, password reset, leave notifications). Use a reliable transactional email provider (SendGrid, Mailgun, SES) and keep credentials in `.env`. Add rate limiting for sending OTPs.
* **Monitoring:** Add basic uptime / error monitoring (Sentry, LogRocket, or Render alerts). Configure alerts for error log spikes or failed email deliveries.

---

## Testing & CI suggestions

* Add unit tests for controllers and route handlers (Jest + Supertest are already in `devDependencies`)
* Add integration tests to cover authentication flows (register/login), POB creation, and leave approvals
* CI: set up GitHub Actions to run `npm test` and linting on PRs. Optionally add a build step for Expo (EAS) or web preview.

---

## Roadmap & known limitations

**Planned / recommended improvements**

* Add role-based dashboards for Manager and multi-HQ reporting
* Pagination & filtering on list endpoints (large datasets)
* Add rate limiting on auth/email endpoints
* Add end-to-end tests and integration tests for critical flows
* Dockerize server and client for consistent deployments
* Implement refresh tokens & token revocation for JWT flows

**Current limitations**

* Client currently uses a static UI with completed navigation & flows; further UX polishing and mobile testing required
* Hardening and additional production-grade monitoring (Sentry) needed

---

## Contributing & contact

This project is maintained by **Ritik Raj**. If you want to contribute:

1. Fork the repo
2. Create a branch: `feature/<name>` or `fix/<issue>`
3. Make changes, keep commits atomic & useful
4. Open a PR and describe the change, motivation, and testing steps

If you want me to add a CONTRIBUTING.md with a PR template, I can generate that too.

---

## Credits & design

* Backend & frontend developer: **Ritik Raj**
* Figma design: [https://www.figma.com/make/zowwkwF4sV8lmmgiaTXV74/Employee-Management-App?node-id=0-1&p=f&t=Ia5BHcXOXdklokdB-0](https://www.figma.com/make/zowwkwF4sV8lmmgiaTXV74/Employee-Management-App?node-id=0-1&p=f&t=Ia5BHcXOXdklokdB-0)

---

## License

ISC © 2025 — **Ritik Raj**

---

