# ChildGuard AI — Missing Child Detection & Alert Platform

> ⚠️ **DEMO ENVIRONMENT** — All cases, persons, and data are entirely fictional. Not for operational use.

A React-based missing child detection and rapid-alert platform built on AWS services.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- [npm 9+](https://npmjs.com)

### Run Locally (Demo Mode)

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. Runs in **demo mode** — no AWS backend required.

---

## 📋 Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Mission statement, animated stats, recent cases |
| Missing Children Gallery | `/gallery` | Searchable/filterable case grid |
| Case Detail | `/gallery/:id` | Full case info, LE-restricted contact data |
| Submit Sighting | `/submit-sighting` | Community tip form with photo upload |
| About | `/about` | Platform info, NCMEC partnership, tech stack |
| Login | `/login` | Cognito-powered, role-based access |

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Public | `public.demo@childguard-demo.test` | `Demo@Public2024` |
| Law Enforcement | `officer.demo@childguard-demo.test` | `Demo@Officer2024` |
| Admin | `admin.demo@childguard-demo.test` | `Demo@Admin2024` |

---

## 🏗️ AWS Architecture

```
React (Amplify Hosting)
    ↕
Amazon Cognito (Auth + Role Groups)
    ↕
AWS AppSync (GraphQL API)  ←→  API Gateway
    ↕
Amazon DynamoDB (Cases, Sightings, Users)
Amazon S3 (Photo storage, pre-signed URLs)
    ↕
AWS Lambda (Triggers: alerts, Rekognition)  [Phase 2]
Amazon Rekognition (Face matching)          [Phase 2]
Amazon SNS (LE alert notifications)
Amazon SES (Email confirmations)
```

---

## 🔧 AWS Amplify Setup (Production)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure AWS credentials
amplify configure

# Initialize Amplify in this project
amplify init

# Add authentication (Cognito)
amplify add auth
# Choose: Default configuration with Social Provider
# After setup, add User Pool Groups: public, law_enforcement, admin

# Add file storage (S3)
amplify add storage
# Choose: Content (Images, audio, video, etc.)

# Add GraphQL API (DynamoDB)
amplify add api
# Choose: GraphQL > Amazon Cognito User Pool > Schema: single object with fields

# Deploy all resources
amplify push

# Amplify auto-generates src/aws-exports.js with real values
```

### Cognito User Pool Groups

Create these groups in the Cognito User Pool (Amplify Console → Auth → User Pool → Groups):
- `public` — Standard authenticated users
- `law_enforcement` — Verified LE officers (manually promoted by admin)
- `admin` — Platform administrators

---

## 📁 Project Structure

```
src/
├── aws-exports.js          # Amplify config (placeholder — replaced after amplify push)
├── App.js                  # Router + providers
├── context/
│   └── AuthContext.js      # Cognito auth state + demo mode fallback
├── data/
│   └── mockData.js         # 10 fictional cases + demo accounts
├── components/
│   ├── DemoBanner.js       # Fixed "DEMO ENVIRONMENT" strip
│   ├── Navbar.js           # Responsive nav + auth state
│   └── Footer.js           # Links + emergency contacts
└── pages/
    ├── HomePage.js         # Hero, stats, how-it-works, recent cases
    ├── GalleryPage.js      # Searchable missing children grid
    ├── CaseDetailPage.js   # Full case detail + LE-gated info
    ├── SubmitSightingPage.js # Sighting report form + S3 photo upload
    ├── AboutPage.js        # Platform info + architecture + roadmap
    ├── LoginPage.js        # Cognito login + demo account quick-fill
    └── NotFoundPage.js     # 404
```

---

## 🤖 AWS Rekognition Integration (Phase 2)

Look for `// TODO: AWS Rekognition integration` comments throughout the codebase.
Planned implementation:
1. On photo upload to S3, Lambda trigger calls `rekognition.indexFaces()` for case photos
2. On sighting photo submission, Lambda calls `rekognition.searchFacesByImage()`
3. Matches above 90% confidence create SNS alerts to the relevant LE agency
4. Match results stored in DynamoDB Sightings table with confidence scores

---

## 🛡️ Security Notes

- All contact information encrypted in DynamoDB
- S3 photos accessed via pre-signed URLs (24hr expiry)
- LE-only data gated by Cognito group membership checked server-side
- Public bucket listing disabled
- HSTS, X-Frame-Options, X-Content-Type-Options headers via amplify.yml

---

## ⚠️ Disclaimer

All missing child cases shown are entirely fictional and created for demonstration purposes only.
No real child data is used. This platform is not connected to any law enforcement database.
NCMEC and partner logos/names are referenced for illustrative purposes only.
