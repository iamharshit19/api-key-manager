A backend-only Node.js-based API Key Management System for generating, validating, revoking, and tracking API keys with audit logging, role-based access, and rate limiting.

---

## Features

- Generate secure API keys for users (via CLI)
- Store keys in MongoDB with expiry & status
- Verify and revoke keys
- Rate limit API key usage
- Role-based access (admin/user)
- CLI interface (no frontend)
- Email notifications on creation & revocation
- Audit logging to `logs/audit.log`

---

##  Local Development Setup

### 1. Clone the repository

    git clone https://github.com/iamharshit19/api-key-manager.git
    cd api-key-manager

##2. Install dependencies
        
    npm install
##3. Set up environment variables
Create a .env file:
            
    cp .env.example .env

Edit .env with your details:
  
    MONGO_URI=mongodb://localhost:27017/apikeys
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password_here

##5. Run the server
      
      node main.js

You’ll see a menu:
 API Key Management CLI
1. Generate API key
2. Verify API key
3. Revoke API key
4. List API keys for user
0. Exit

##Project Structure:

    .
    ├── main.js
    ├── models/
    │   └── APIkey.js
    ├── mailer.js
    │   
    ├── logs/
    │   └── audit.log
    ├ ── .env
    ├── .gitignore
    └── README.md


