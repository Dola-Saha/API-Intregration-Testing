import { expect } from "chai";
import { describe, it } from "mocha";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const SYSTEM_EMAIL = process.env.SYSTEM_EMAIL;
const SYSTEM_PASSWORD = process.env.SYSTEM_PASSWORD;

const OTP = process.env.OTP;
const AUTH_SECRET = process.env.AUTH_SECRET;


// ============================================================
// AXIOS CONFIGURATION
// ============================================================

const api = axios.create({
    baseURL: BASE_URL,

    // Axios will NOT throw automatically for 4xx/5xx.
    // This allows us to see the actual API response.
    validateStatus: () => true,

    timeout: 30000
});


// ============================================================
// COMMON HEADERS
// ============================================================

const commonHeaders = {
    "Content-Type": "application/json",
    "X-AUTH-SECRET-KEY": AUTH_SECRET
};


// ============================================================
// HELPER FUNCTION
// ============================================================

function getToken(response) {
    return (
        response?.data?.token ||
        response?.data?.access_token ||
        response?.data?.accessToken ||
        null
    );
}


// ============================================================
// UNIQUE TEST DATA
// ============================================================

// Every time the test runs, new users will be created.
//
// Phone format:
// 017 + 8 digits = 11 digits
//
// NID format:
// 987 + 7 digits = 10 digits

const timestamp = Date.now().toString();

const suffix8 = timestamp.slice(-8);
const suffix7 = timestamp.slice(-7);

const CUSTOMER1 = {
    name: "Customer One",
    email: `customer1_${suffix8}@gmail.com`,
    password: "1234",
    phone_number: `017${suffix8}`,
    nid: `987${suffix7}`,
    role: "Customer"
};

const CUSTOMER2 = {
    name: "Customer Two",
    email: `customer2_${suffix8}@gmail.com`,
    password: "1234",
    phone_number: `018${suffix8}`,
    nid: `988${suffix7}`,
    role: "Customer"
};

const AGENT = {
    name: "Agent One",
    email: `agent_${suffix8}@gmail.com`,
    password: "1234",
    phone_number: `013${suffix8}`,
    nid: `989${suffix7}`,
    role: "Agent"
};

const MERCHANT = {
    name: "Merchant One",
    email: `merchant_${suffix8}@gmail.com`,
    password: "1234",
    phone_number: `019${suffix8}`,
    nid: `990${suffix7}`,
    role: "Merchant"
};


// ============================================================
// VARIABLES
// ============================================================

let adminToken;
let systemToken;

let agentToken;
let customer1Token;
let customer2Token;

let customer1Id;
let customer2Id;
let agentId;
let merchantId;


// ============================================================
// TEST SUITE
// ============================================================

describe("DMoney API Integration Testing", function () {

    // Timeout is inside dmoney.spec.js.
    // No timeout is required in package.json.
    this.timeout(30000);


    // ========================================================
    // 1. ADMIN LOGIN
    // ========================================================

    it("1. Admin should login successfully", async function () {

        const res = await api.post(
            "/user/login",
            {
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        expect(res.status).to.equal(200);

        const token = getToken(res);

        expect(token)
            .to.be.a("string")
            .and.not.empty;

        adminToken = token;
    });


    // ========================================================
    // 2. CREATE CUSTOMER-1
    // ========================================================

    it("2. Should create Customer-1 successfully", async function () {

        const res = await api.post(
            "/user/create",
            CUSTOMER1,
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${adminToken}`
                }
            }
        );

        console.log("Customer-1 Create Response:", res.status, res.data);

        expect(res.status).to.equal(201);

        expect(res.data)
            .to.have.property("user");

        expect(res.data.user)
            .to.have.property("id");

        customer1Id = res.data.user.id;

        expect(customer1Id)
            .to.be.a("number");

        expect(res.data.user.email)
            .to.equal(CUSTOMER1.email);

        expect(res.data.user.phone_number)
            .to.equal(CUSTOMER1.phone_number);
    });


    // ========================================================
    // 3. CREATE CUSTOMER-2
    // ========================================================

    it("3. Should create Customer-2 successfully", async function () {

        const res = await api.post(
            "/user/create",
            CUSTOMER2,
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${adminToken}`
                }
            }
        );

        console.log("Customer-2 Create Response:", res.status, res.data);

        expect(res.status).to.equal(201);

        expect(res.data)
            .to.have.property("user");

        expect(res.data.user)
            .to.have.property("id");

        customer2Id = res.data.user.id;

        expect(customer2Id)
            .to.be.a("number");

        expect(res.data.user.email)
            .to.equal(CUSTOMER2.email);

        expect(res.data.user.phone_number)
            .to.equal(CUSTOMER2.phone_number);
    });


    // ========================================================
    // 4. CREATE AGENT
    // ========================================================

    it("4. Should create Agent successfully", async function () {

        const res = await api.post(
            "/user/create",
            AGENT,
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${adminToken}`
                }
            }
        );

        console.log("Agent Create Response:", res.status, res.data);

        expect(res.status).to.equal(201);

        expect(res.data)
            .to.have.property("user");

        expect(res.data.user)
            .to.have.property("id");

        agentId = res.data.user.id;

        expect(agentId)
            .to.be.a("number");

        expect(res.data.user.email)
            .to.equal(AGENT.email);

        expect(res.data.user.phone_number)
            .to.equal(AGENT.phone_number);
    });


    // ========================================================
    // 5. CREATE MERCHANT
    // ========================================================

    it("5. Should create Merchant successfully", async function () {

        const res = await api.post(
            "/user/create",
            MERCHANT,
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${adminToken}`
                }
            }
        );

        console.log("Merchant Create Response:", res.status, res.data);

        expect(res.status).to.equal(201);

        expect(res.data)
            .to.have.property("user");

        expect(res.data.user)
            .to.have.property("id");

        merchantId = res.data.user.id;

        expect(merchantId)
            .to.be.a("number");

        expect(res.data.user.email)
            .to.equal(MERCHANT.email);

        expect(res.data.user.phone_number)
            .to.equal(MERCHANT.phone_number);
    });


    // ========================================================
    // 6. ACTIVATE CUSTOMER-1
    // ========================================================

    it("6. Should activate Customer-1 successfully", async function () {

        expect(customer1Id)
            .to.exist;

        const res = await api.patch(
            `/user/update/${customer1Id}`,
            {
                status: "active"
            },
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${adminToken}`
                }
            }
        );

        console.log("Customer-1 Activation:", res.status, res.data);

        expect(res.status)
            .to.be.oneOf([200, 201, 204]);

        if (res.data && res.data.user) {
            expect(res.data.user.status)
                .to.equal("active");
        }
    });


    // ========================================================
    // 7. ACTIVATE CUSTOMER-2
    // ========================================================

    it("7. Should activate Customer-2 successfully", async function () {

        expect(customer2Id)
            .to.exist;

        const res = await api.patch(
            `/user/update/${customer2Id}`,
            {
                status: "active"
            },
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${adminToken}`
                }
            }
        );

        console.log("Customer-2 Activation:", res.status, res.data);

        expect(res.status)
            .to.be.oneOf([200, 201, 204]);

        if (res.data && res.data.user) {
            expect(res.data.user.status)
                .to.equal("active");
        }
    });


    // ========================================================
    // 8. ACTIVATE AGENT
    // ========================================================

    it("8. Should activate Agent successfully", async function () {

        expect(agentId)
            .to.exist;

        const res = await api.patch(
            `/user/update/${agentId}`,
            {
                status: "active"
            },
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${adminToken}`
                }
            }
        );

        console.log("Agent Activation:", res.status, res.data);

        expect(res.status)
            .to.be.oneOf([200, 201, 204]);

        if (res.data && res.data.user) {
            expect(res.data.user.status)
                .to.equal("active");
        }
    });


    // ========================================================
    // 9. ACTIVATE MERCHANT
    // ========================================================

    it("9. Should activate Merchant successfully", async function () {

        expect(merchantId)
            .to.exist;

        const res = await api.patch(
            `/user/update/${merchantId}`,
            {
                status: "active"
            },
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${adminToken}`
                }
            }
        );

        console.log("Merchant Activation:", res.status, res.data);

        expect(res.status)
            .to.be.oneOf([200, 201, 204]);

        if (res.data && res.data.user) {
            expect(res.data.user.status)
                .to.equal("active");
        }
    });


    // ========================================================
    // 10. SYSTEM LOGIN
    // ========================================================

    it("10. System should login successfully", async function () {

        const res = await api.post(
            "/user/login",
            {
                email: SYSTEM_EMAIL,
                password: SYSTEM_PASSWORD
            }
        );

        console.log("System Login:", res.status, res.data);

        expect(res.status)
            .to.equal(200);

        const token = getToken(res);

        expect(token)
            .to.be.a("string")
            .and.not.empty;

        systemToken = token;
    });


    // ========================================================
    // 11. SYSTEM DEPOSIT 5000 TO AGENT
    // ========================================================

    it("11. System should deposit 5000 TK to Agent", async function () {

        const res = await api.post(
            "/transaction/deposit",
            {
                from_account: "SYSTEM",
                to_account: AGENT.phone_number,
                amount: 5000
            },
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${systemToken}`
                }
            }
        );

        console.log("System Deposit Response:", res.status, res.data);

        expect(res.status)
            .to.be.oneOf([200, 201, 208]);

        expect(res.data)
            .to.be.an("object");

        expect(JSON.stringify(res.data).toLowerCase())
            .to.include("deposit");
    });


    // ========================================================
    // 12. AGENT LOGIN
    // ========================================================

    it("12. Agent login should be successful", async function () {

        const res = await api.post(
            "/user/login?env=dev",
            {
                email: AGENT.phone_number,
                password: AGENT.password
            }
        );

        console.log("Agent Login:", res.status, res.data);

        expect(res.status)
            .to.equal(200);

        // IMPORTANT:
        // Agent login only initiates OTP.
        // We DO NOT expect token here.
    });


    // ========================================================
    // 13. AGENT OTP
    // ========================================================

    it("13. Agent OTP verification should be successful", async function () {

        const res = await api.post(
            "/user/verify-otp?env=dev",
            {
                identifier: AGENT.phone_number,
                otp: OTP
            }
        );

        console.log("Agent OTP:", res.status, res.data);

        expect(res.status)
            .to.equal(200);

        const token = getToken(res);

        expect(token)
            .to.be.a("string")
            .and.not.empty;

        agentToken = token;
    });


    // ========================================================
    // 14. AGENT DEPOSIT 2000 TO CUSTOMER-1
    // ========================================================

    it("14. Agent should deposit 2000 TK to Customer-1 and assert commission", async function () {

        const res = await api.post(
            "/transaction/deposit",
            {
                from_account: AGENT.phone_number,
                to_account: CUSTOMER1.phone_number,
                amount: 2000
            },
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${agentToken}`
                }
            }
        );

        console.log("Agent Deposit Response:", res.status, res.data);

        expect(res.status)
            .to.be.oneOf([200, 201, 208]);

        expect(res.data)
            .to.have.property("commission");

        console.log(
            "Agent Deposit Commission:",
            res.data.commission
        );

        // Based on your actual API response:
        // 2000 TK deposit -> commission 50 TK

        expect(Number(res.data.commission))
            .to.equal(50);
    });


    // ========================================================
    // 15. CUSTOMER-1 LOGIN
    // ========================================================

    it("15. Customer-1 login should be successful", async function () {

        const res = await api.post(
            "/user/login?env=dev",
            {
                email: CUSTOMER1.email,
                password: CUSTOMER1.password
            }
        );

        console.log("Customer-1 Login:", res.status, res.data);

        expect(res.status)
            .to.equal(200);

        // Login initiates OTP.
        // Token will be captured after OTP verification.
    });


    // ========================================================
    // 16. CUSTOMER-1 OTP
    // ========================================================

    it("16. Customer-1 OTP verification should be successful", async function () {

        const res = await api.post(
            "/user/verify-otp?env=dev",
            {
                identifier: CUSTOMER1.email,
                otp: OTP
            }
        );

        console.log("Customer-1 OTP:", res.status, res.data);

        expect(res.status)
            .to.equal(200);

        const token = getToken(res);

        expect(token)
            .to.be.a("string")
            .and.not.empty;

        customer1Token = token;
    });


    // ========================================================
    // 17. CUSTOMER-1 SEND 1000 TO CUSTOMER-2
    // ========================================================

    it("17. Customer-1 should send 1000 TK to Customer-2 and assert service fee", async function () {

        const res = await api.post(
            "/transaction/sendmoney",
            {
                from_account: CUSTOMER1.phone_number,
                to_account: CUSTOMER2.phone_number,
                amount: 1000
            },
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${customer1Token}`
                }
            }
        );

        console.log("Send Money Response:", res.status, res.data);

        expect(res.status)
            .to.be.oneOf([200, 201, 208]);

        expect(res.data)
            .to.be.an("object");

        /*
         * Your actual API returned service fee = 5.
         *
         * We look for serviceFee / service_fee / fee
         * so the test does not depend on only one field name.
         */

        const serviceFee =
            res.data.serviceFee ??
            res.data.service_fee ??
            res.data.fee ??
            res.data.serviceCharge ??
            res.data.service_charge;

        expect(serviceFee)
            .to.exist;

        console.log(
            "Send Money Service Fee:",
            serviceFee
        );

        expect(Number(serviceFee))
            .to.equal(5);
    });


    // ========================================================
    // 18. CUSTOMER-2 LOGIN
    // ========================================================

    it("18. Customer-2 login should be successful", async function () {

        const res = await api.post(
            "/user/login?env=dev",
            {
                email: CUSTOMER2.email,
                password: CUSTOMER2.password
            }
        );

        console.log("Customer-2 Login:", res.status, res.data);

        expect(res.status)
            .to.equal(200);
    });


    // ========================================================
    // 19. CUSTOMER-2 OTP
    // ========================================================

    it("19. Customer-2 OTP verification should be successful", async function () {

        const res = await api.post(
            "/user/verify-otp?env=dev",
            {
                identifier: CUSTOMER2.email,
                otp: OTP
            }
        );

        console.log("Customer-2 OTP:", res.status, res.data);

        expect(res.status)
            .to.equal(200);

        const token = getToken(res);

        expect(token)
            .to.be.a("string")
            .and.not.empty;

        customer2Token = token;
    });


    // ========================================================
    // 20. CUSTOMER-2 CASHOUT 500 FROM AGENT
    // ========================================================

    it("20. Customer-2 should cashout 500 TK from Agent and assert service fee", async function () {

        const res = await api.post(
            "/transaction/withdraw",
            {
                from_account: CUSTOMER2.phone_number,
                to_account: AGENT.phone_number,
                amount: 500
            },
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${customer2Token}`
                }
            }
        );

        console.log("Cashout Response:", res.status, res.data);

        expect(res.status)
            .to.be.oneOf([200, 201, 208]);

        const serviceFee =
            res.data.serviceFee ??
            res.data.service_fee ??
            res.data.fee ??
            res.data.serviceCharge ??
            res.data.service_charge;

        expect(serviceFee)
            .to.exist;

        console.log(
            "Cashout Service Fee:",
            serviceFee
        );

        // Based on your API:
        // Cashout 500 -> service fee 5

        expect(Number(serviceFee))
            .to.equal(5);
    });


    // ========================================================
    // 21. CUSTOMER-2 PAY MERCHANT 400
    // ========================================================

    it("21. Customer-2 should pay 400 TK to Merchant and assert service fee", async function () {

        const res = await api.post(
            "/transaction/payment",
            {
                from_account: CUSTOMER2.phone_number,
                to_account: MERCHANT.phone_number,
                amount: 400
            },
            {
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${customer2Token}`
                }
            }
        );

        console.log(
            "Merchant Payment Response:",
            res.status,
            res.data
        );

        expect(res.status)
            .to.be.oneOf([200, 201, 208]);

        const serviceFee =
            res.data.serviceFee ??
            res.data.service_fee ??
            res.data.fee ??
            res.data.serviceCharge ??
            res.data.service_charge;

        expect(serviceFee)
            .to.exist;

        console.log(
            "Merchant Payment Service Fee:",
            serviceFee
        );

        // Based on your API:
        // Payment 400 -> minimum service fee 5

        expect(Number(serviceFee))
            .to.equal(5);
    });

});