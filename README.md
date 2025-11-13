# 🛡️ TrustLink

> **“Verify identity, not documents.”**  
> TrustLink is a decentralized identity verification system designed to confirm if users are who they truly claim to be — without relying on traditional government-issued IDs like NIN or international passports.

We’re reimagining digital onboarding for banks, fintechs, and institutions by replacing complex document-based verification with **biometric** and **location-based authentication** — all secured through the **Arbitrum Stylus blockchain**.

---

## 🧾 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [How It Works](#-how-it-works)
- [Why TrustLink](#-why-trustlink)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Security & Privacy](#-security--privacy)
- [Use Cases](#-use-cases)
- [Team & Tech Stack](#-team--tech-stack)
- [License](#-license)
- [Inspiration](#-inspiration)

---

## 🚀 Overview

Traditional identity verification is slow, centralized, and prone to fraud. **TrustLink** provides a seamless alternative by combining **biometric verification**, **geo-location**, and **blockchain hashing** to ensure user authenticity.

Our system eliminates dependency on manual document verification by:
- Using **Face ID**, **fingerprint**, and **geo-location** for trust-based user onboarding.
- Hashing and storing verification data securely on the **Arbitrum Stylus blockchain**.
- Providing APIs for **banks**, **fintech apps**, and **KYC providers** to plug into.

---

## 🧩 Architecture

TrustLink consists of three core modules:

### 🖥️ Frontend — `TrustLink_Frontend`
- **Tech Stack:** React + Vite + Tailwind CSS  
- **Purpose:** User interface for registration, biometric capture, and verification.  
- **Features:**
  - User onboarding and login
  - Face and fingerprint scanning interfaces
  - Geo-location access and display
  - Connection to backend and smart contract for verification

---

### ⚙️ Backend — `TrustLink_Backend`
- **Tech Stack:** Express.js  
- **Purpose:** Manages biometric data flow, verification logic, and blockchain interaction.  
- **Features:**
  - API endpoints for biometric verification
  - Hash generation and validation
  - Secure communication with blockchain smart contract
  - Integration endpoints for third-party banks and fintechs

---

### 🔗 Smart Contract — `TrustLink_Contract`
- **Tech Stack:** Arbitrum Stylus (Rust-compatible Layer 2)  
- **Purpose:** Handles decentralized identity proofing by storing hashed verification data securely.  
- **Features:**
  - Immutable verification hashes stored on-chain
  - Proof-of-identity validation via contract calls
  - Transparent and tamper-proof verification history

---

## 🧠 How It Works

1. **User Registration:**  
   User provides biometric data such as Face ID or fingerprint through the frontend.

2. **Data Processing:**  
   The backend converts biometric signatures into a unique hash and sends it to the smart contract.

3. **Blockchain Verification:**  
   The hash is stored on the Arbitrum Stylus blockchain — ensuring tamper-proof, decentralized verification.

4. **Future Authentication:**  
   When a user attempts to verify their identity, the system rehashes the biometric input and compares it with the stored hash on-chain.

---

## ⚡ Why TrustLink?

| Problem | Traditional KYC | TrustLink |
|----------|------------------|------------|
| Verification Time | Days | Seconds |
| Privacy | Centralized storage | Decentralized |
| Fraud Risk | High | Minimal |
| Integration | Manual | API-based |
| Cost | High | Low |

---

## 🏗️ Project Structure

TrustLink/
│
├── TrustLink_Frontend/ # React + Vite + Tailwind Frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── assets/
│ │ └── main.jsx
│ ├── public/
│ ├── package.json
│ ├── vite.config.js
│ └── tailwind.config.js
│
├── TrustLink_Backend/ # Express.js Backend APIs
│ ├── controllers/
│ │ ├── userController.js
│ │ └── verificationController.js
│ ├── routes/
│ │ ├── userRoutes.js
│ │ └── verifyRoutes.js
│ ├── models/
│ │ └── User.js
│ ├── utils/
│ │ ├── generateHash.js
│ │ └── connectDB.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorHandler.js
│ ├── .env
│ ├── server.js
│ └── package.json
│
└── TrustLink_Contract/ # Arbitrum Stylus Smart Contract
├── src/
│ └── lib.rs
├── Cargo.toml
└── README.md


---

## 🛠️ Installation & Setup

### 🧩 Clone the repositories

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jdaniella5/TrustLink
   cd TrustLink
   ```

2. **Frontend Setup**:
   ```bash
   cd trustlink-fromtend
   npm install
   npm run dev
   ```
   

3. **Backend Setup**:
   ```bash
   cd trustlink-backend
   npm install
   node server.js
   ```

4. **Smart Contract Deployment**
  '''bash
  cd TrustLink_Contract
  cargo build --release
  #Deploy using your preferred Arbitrum deployment tool or CLI
  '''


## 🔒Security & Privacy

Biometric data is never stored directly — only hashed representations are recorded.

Communication between frontend and backend is secured via HTTPS, CORS, and JWT tokens.

The blockchain ensures immutability and transparency for every verification proof.

All sensitive environment variables are managed through .env files and excluded via .gitignore.



## Use Cases

🏦 Banking & Fintech Onboarding
Verify new customers instantly with biometric and blockchain-based proof of identity.

💳 Digital KYC and AML Compliance
Reduce friction during customer onboarding while maintaining regulatory standards.

🪪 Web3 Wallet & DAO Membership Verification
Link real identities to blockchain wallets securely.

💼 Decentralized Employment Background Checks
Enable organizations to validate real-world credentials without third-party dependency.

📱 Mobile App Authentication
Integrate frictionless biometric verification directly into mobile or web apps.



## 👩‍💻Team & Tech Stack

Component	Technology
Frontend	    React + Vite + Tailwind CSS
Backend   	    Express.js
Blockchain	    Arbitrum Stylus
Database	    MongoDB
Authentication	JWT + Biometrics
Deployment	     Vercel (Frontend), Render/Node (Backend), Arbitrum (Smart Contract)


## ⚙️ API Overview


Method	Endpoint	Description
POST	/api/register	Register user and capture biometric data

POST	/api/verify	Validate user biometric hash

GET	/api/status/:id	Fetch verification status

GET	/api/contract/:hash	Retrieve on-chain verification record



## Run backend and frontend locally

Access frontend via http://localhost:5173

Create a test user and complete FaceID verification

Observe blockchain hash creation on Arbitrum testnet

Use Postman to test backend endpoints manually



## 🔐 Future Improvements

Implement multi-biometric fusion (Face + Voice + Fingerprint)

Add AI-powered fraud detection

Provide SDKs for third-party integration

Introduce Zero-Knowledge Proofs for privacy-preserving verification



## 📄 License

MIT License © 2025 TrustLink Team


## 🧠 Inspiration

Traditional identity verification relies too heavily on government databases and paper-based proof. TrustLink aims to make trust borderless, enabling banks, fintechs, and startups to onboard real users instantly — without bureaucracy, without waiting.

💜 Made with passion by the TrustLink Team

“Decentralizing trust, one identity at a time.”
