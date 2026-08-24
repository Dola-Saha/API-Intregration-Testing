# DMoney API Integration Tests

## Project Summary

This project contains automated API integration tests for the DMoney digital financial service. The test suite validates authentication, user management, and money movement workflows across administrators, system users, agents, customers, and merchants.

The tests create unique customer, agent, and merchant accounts on every run, activate the accounts, authenticate users with OTP, and verify transaction fees and commissions.

## Technologies

- JavaScript (ES modules)
- Node.js and npm
- Mocha for test execution
- Chai for assertions
- Axios for HTTP requests
- dotenv for environment configuration

## Prerequisites

- Node.js 18 or later
- npm
- Access to a running DMoney API environment
- Valid administrator, system-user, OTP, and API authentication credentials

## Clone the Project

Replace `<repository-url>` with the repository URL:

```bash
git clone <repository-url>
cd Dmoney-Integration
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file in the project root:

```env
BASE_URL=https://your-dmoney-api.example.com
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
SYSTEM_EMAIL=your-system-email
SYSTEM_PASSWORD=your-system-password
OTP=your-otp
AUTH_SECRET=your-auth-secret
```

Keep `.env` private and do not commit real credentials to source control.

## Run the Tests

Run the complete integration suite with:

```bash
npm test
```

The configured command executes `dmoney.spec.js` with Mocha.

## Test Coverage

The suite verifies:

1. Admin and system user login
2. Creation and activation of customers, an agent, and a merchant
3. System deposit to an agent
4. Agent OTP authentication and deposit to a customer
5. Customer OTP authentication
6. Customer-to-customer send money
7. Customer cash-out through an agent
8. Customer payment to a merchant
9. Expected transaction commissions and service fees

## Notes

- Tests must run against an API environment whose data can be modified.
- Test cases are intentionally ordered because later transactions use users, IDs, and tokens created by earlier cases.
- Customer, agent, and merchant contact details are generated from the current timestamp to reduce duplicate-data conflicts.
- The configured OTP must be valid for the target API environment.

