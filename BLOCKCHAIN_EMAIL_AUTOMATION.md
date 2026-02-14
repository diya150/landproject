# Blockchain-Based Email Records System

## Overview
This system implements a blockchain-based complaint recording mechanism with automated email notifications. All violations and complaints are cryptographically secured on an immutable blockchain ledger.

## Architecture

### Backend Components

#### 1. **Blockchain Service** (`backend/src/services/blockchainService.js`)
- Implements SHA-256 hashing for record immutability
- Maintains chain integrity through linked blocks
- Features:
  - **Record Complaint**: Adds complaint to blockchain with cryptographic hash
  - **Verify Chain**: Validates blockchain integrity
  - **Generate Proof**: Creates cryptographic proof for complaints
  - **Get Records**: Retrieves all blockchain records

**Key Methods:**
```javascript
blockchainService.recordComplaint(complaint)    // Record on blockchain
blockchainService.verifyRecord(hash)            // Verify complaint
blockchainService.getBlockchainStats()          // Get chain stats
blockchainService.getComplaintsByCompany(name)  // Filter by company
```

#### 2. **Email Service** (`backend/src/services/emailService.js`)
- Automated email notifications when complaints are recorded
- Features:
  - Complaint notification to company
  - Verification email with blockchain proof
  - Admin alerts
  - HTML formatted emails with blockchain verification details

**Key Methods:**
```javascript
emailService.sendComplaintNotification(complaint, proof)  // Send to company
emailService.sendVerificationEmail(complaint, hash)       // Send verification link
emailService.sendAdminAlert(complaint, proof)             // Alert admin
```

#### 3. **Blockchain Controller** (`backend/src/controllers/blockchainController.js`)
- REST API endpoints for blockchain operations
- Request validation and response formatting

### Frontend Integration

#### 1. **Blockchain Service** (`src/services/blockchainService.ts`)
- TypeScript service for calling blockchain APIs
- Handles complaint recording and record verification

#### 2. **ChangeDetection Component** (`src/pages/ChangeDetection.tsx`)
- Integrated complaint form with blockchain submission
- Real-time blockchain status tracking
- Displays blockchain hash and block number for each complaint

## API Endpoints

### Record Complaint (POST /api/blockchain/complaint)
```json
Request:
{
  "companyName": "Bhilai Steel Manufacturing Ltd.",
  "reason": "Unauthorized waste dumping detected",
  "email": "contact@bhilaisteel.com",
  "phone": "+91-7712-234567",
  "severity": "High",
  "location": "Sector 3, Raipur",
  "details": "Hazardous waste detected near east boundary"
}

Response:
{
  "status": "success",
  "blockchain": {
    "blockNumber": "0x5",
    "hash": "a3b2c1d4e5f6...",
    "timestamp": "2026-02-14T09:30:45Z",
    "proof": {...}
  },
  "notifications": {
    "adminAlert": "sent",
    "verificationEmail": "sent"
  }
}
```

### Verify Record (GET /api/blockchain/complaint/:hash)
```json
Response:
{
  "status": "verified",
  "verification": {
    "isValid": true,
    "record": {...},
    "chainPosition": 5,
    "timestamp": "2026-02-14T09:30:45Z"
  },
  "blockchainStats": {
    "totalBlocks": 10,
    "chainIntegrity": true
  }
}
```

### Get All Records (GET /api/blockchain/records)
```json
Response:
{
  "status": "success",
  "totalRecords": 5,
  "records": [
    {
      "blockNumber": "0x5",
      "hash": "a3b2c1d4e5f6...",
      "companyName": "Bhilai Steel Manufacturing Ltd.",
      "reason": "Unauthorized waste dumping",
      "severity": "High",
      "timestamp": "2026-02-14T09:30:45Z"
    }
  ],
  "blockchain": {
    "totalBlocks": 10,
    "chainIntegrity": true
  }
}
```

### Get Company Complaints (GET /api/blockchain/company/:companyName)
```json
Response:
{
  "status": "success",
  "company": "Bhilai Steel Manufacturing Ltd.",
  "complaints": [...],
  "totalComplaints": 2
}
```

### Get Blockchain History (GET /api/blockchain/history?limit=10)
```json
Response:
{
  "status": "success",
  "transactions": [
    {
      "transactionHash": "a3b2c1d4e5f6...",
      "blockNumber": "0x5",
      "timestamp": "2026-02-14T09:30:45Z",
      "from": "System",
      "to": "company@email.com",
      "value": "Complaint: Unauthorized waste...",
      "status": "confirmed"
    }
  ]
}
```

### Get Blockchain Stats (GET /api/blockchain/stats)
```json
Response:
{
  "status": "success",
  "blockchain": {
    "totalBlocks": 10,
    "totalRecords": 9,
    "chainIntegrity": true,
    "latestBlockHash": "a3b2c1d4e5f6...",
    "genesisHash": "0x..."
  },
  "integrityStatus": "Valid ✓"
}
```

## How It Works

### Step-by-Step Process

1. **Complaint Raised** (User)
   - User selects company and enters complaint reason on ChangeDetection page
   - Clicks "Raise Complaint" button

2. **Blockchain Recording** (Backend)
   - Complaint data is hashed using SHA-256
   - New block created with reference to previous block hash
   - Chain integrity verified
   - Block added to immutable ledger

3. **Email Notifications** (Automated)
   - **Company Email**: Receives complaint notification with blockchain proof
   - **Verification Email**: Contains blockchain hash for verification
   - **Admin Alert**: Sent to system administrator

4. **Proof Generation**
   - Cryptographic proof including:
     - Transaction hash (SHA-256)
     - Block number (hex format)
     - Merkle proof
     - Chain validation status
     - Proof timestamp

5. **Verification**
   - Company can verify complaint using blockchain hash
   - System checks if hash is valid and part of chain
   - Displays verification status and chain position

## Features

### Security
- **SHA-256 Hashing**: All records cryptographically hashed
- **Chain Linking**: Each block references previous block
- **Integrity Checks**: Automatic verification of chain integrity
- **Immutability**: Records cannot be altered once recorded

### Automation
- **Automated Emails**: Sent immediately when complaint recorded
- **Email Templates**: Professional HTML formatted emails
- **Attachments**: Blockchain proof attached to emails
- **Admin Alerts**: Real-time alerts to administrators

### Verification
- **Proof Generation**: Creates cryptographic proof for complaints
- **Record Lookup**: Search records by hash
- **Chain Validation**: Verify entire blockchain integrity
- **Company Lookup**: Filter complaints by company

### Transparency
- **Blockchain Explorer**: View transaction history
- **Chain Statistics**: See total blocks, records, integrity status
- **Block Details**: Access each block's timestamp and hash
- **Merkle Proofs**: Cryptographic proof of inclusion

## Usage

### For Administrators
1. Go to **Change Detection** → **Visual Compare** tab
2. Click **"Raise Complaint"** button
3. Select company from dropdown
4. Enter violation reason
5. Click "Submit to Blockchain"
6. Confirmation shows blockchain hash and block number

### For Verification
1. Receive blockchain hash in email
2. Copy hash
3. Navigate to **Blockchain Verification** section
4. Paste hash to verify authenticity
5. System displays:
   - Block number
   - Timestamp
   - Chain position
   - Verification status

## Database Schema

### Blockchain Block Structure
```typescript
{
  index: number;                    // Block position in chain
  timestamp: string;                // ISO 8601 timestamp
  complaint: {
    companyName: string;
    reason: string;
    email: string;
    phone: string;
    severity: string;
    location: string;
    details: string;
  };
  previousHash: string;             // SHA-256 hash of previous block
  hash: string;                     // SHA-256 hash of this block
  blockNumber: string;              // Hex format (0x1, 0x2, etc.)
}
```

## Environment Variables

```env
# Backend
EMAIL_SERVICE=gmail
EMAIL_USER=industrial.monitoring@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@industrialmonitoring.local
FRONTEND_URL=http://localhost:3000

# Frontend
VITE_API_BASE_URL=http://localhost:3001
```

## Technology Stack

- **Blockchain**: Custom SHA-256 implementation
- **Backend**: Node.js, Express.js
- **Frontend**: React, TypeScript
- **Email**: Nodemailer
- **Hashing**: crypto (Node.js built-in)

## Future Enhancements

1. **Ethereum/Polygon Integration**: Store proofs on actual blockchain
2. **Smart Contracts**: Automated enforcement rules
3. **Multi-signature**: Approval workflow before recording
4. **IPFS Storage**: Distributed file storage for attachments
5. **QR Codes**: Generate QR codes for quick verification
6. **Webhooks**: External system notifications
7. **Dashboard**: Real-time blockchain monitoring dashboard

## Testing

### Test Recording a Complaint
```curl
curl -X POST http://localhost:3001/api/blockchain/complaint \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "reason": "Test violation",
    "email": "test@company.com",
    "phone": "+91-9999-9999",
    "severity": "High",
    "location": "Test Location",
    "details": "Test details"
  }'
```

### Test Verification
```curl
curl http://localhost:3001/api/blockchain/complaint/<hash>
```

### Test Get All Records
```curl
curl http://localhost:3001/api/blockchain/records
```

### Test Blockchain Stats
```curl
curl http://localhost:3001/api/blockchain/stats
```

## Compliance & Regulations

This blockchain system helps ensure:
- ✓ Immutable audit trail
- ✓ Tamper-proof records
- ✓ Legal compliance (non-repudiation)
- ✓ Transparency
- ✓ Accountability
- ✓ Data integrity verification

