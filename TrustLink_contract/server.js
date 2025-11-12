const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
    storeIdentityVerification,
    storeAddressVerification,
    storeDeviceVerification,
    storeEmailVerification,
    storeCommunityVerification,
    storeTrustScore,
    getMyAllVerifications,
    getVerificationStatus,
    getCompletionPercentage,
    generateHash,
    VERIFICATION_TYPES,
    // Legacy functions
    storeHash,
    hashDocument,
    verifyDocument
} = require("./contract");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================================
// VERIFICATION ENDPOINTS
// ============================================================================

/**
 * Store Identity Verification (Face ID)
 * POST /api/verification/identity
 * Body: { faceData: {}, timestamp: number }
 */
app.post("/api/verification/identity", async (req, res) => {
    try {
        const { faceData, timestamp } = req.body;
        
        if (!faceData) {
            return res.status(400).json({ error: "Missing face data" });
        }

        // Generate hash of face data
        const dataHash = generateHash(faceData);
        const ts = timestamp || Math.floor(Date.now() / 1000);

        // Store on blockchain
        const receipt = await storeIdentityVerification(dataHash, ts);

        res.json({
            success: true,
            type: "identity",
            hash: dataHash,
            timestamp: ts,
            txHash: receipt.hash,
            message: "Identity verification stored on blockchain"
        });
    } catch (error) {
        console.error("Identity verification error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Store Address Verification (GPS)
 * POST /api/verification/address
 * Body: { gpsData: { lat, lng, accuracy }, timestamp: number }
 */
app.post("/api/verification/address", async (req, res) => {
    try {
        const { gpsData, timestamp } = req.body;
        
        if (!gpsData || !gpsData.lat || !gpsData.lng) {
            return res.status(400).json({ error: "Missing GPS coordinates" });
        }

        const dataHash = generateHash(gpsData);
        const ts = timestamp || Math.floor(Date.now() / 1000);

        const receipt = await storeAddressVerification(dataHash, ts);

        res.json({
            success: true,
            type: "address",
            hash: dataHash,
            timestamp: ts,
            txHash: receipt.hash,
            message: "Address verification stored on blockchain"
        });
    } catch (error) {
        console.error("Address verification error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Store Device Verification (Fingerprint)
 * POST /api/verification/device
 * Body: { deviceData: { fingerprint, platform, etc. }, timestamp: number }
 */
app.post("/api/verification/device", async (req, res) => {
    try {
        const { deviceData, timestamp } = req.body;
        
        if (!deviceData) {
            return res.status(400).json({ error: "Missing device data" });
        }

        const dataHash = generateHash(deviceData);
        const ts = timestamp || Math.floor(Date.now() / 1000);

        const receipt = await storeDeviceVerification(dataHash, ts);

        res.json({
            success: true,
            type: "device",
            hash: dataHash,
            timestamp: ts,
            txHash: receipt.hash,
            message: "Device verification stored on blockchain"
        });
    } catch (error) {
        console.error("Device verification error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Store Email Verification
 * POST /api/verification/email
 * Body: { emailData: { email, verified }, timestamp: number }
 */
app.post("/api/verification/email", async (req, res) => {
    try {
        const { emailData, timestamp } = req.body;
        
        if (!emailData || !emailData.email) {
            return res.status(400).json({ error: "Missing email data" });
        }

        const dataHash = generateHash(emailData);
        const ts = timestamp || Math.floor(Date.now() / 1000);

        const receipt = await storeEmailVerification(dataHash, ts);

        res.json({
            success: true,
            type: "email",
            hash: dataHash,
            timestamp: ts,
            txHash: receipt.hash,
            message: "Email verification stored on blockchain"
        });
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Store Community Verification (Vouches)
 * POST /api/verification/community
 * Body: { vouchData: { vouchers: [], count }, timestamp: number }
 */
app.post("/api/verification/community", async (req, res) => {
    try {
        const { vouchData, timestamp } = req.body;
        
        if (!vouchData) {
            return res.status(400).json({ error: "Missing vouch data" });
        }

        const dataHash = generateHash(vouchData);
        const ts = timestamp || Math.floor(Date.now() / 1000);

        const receipt = await storeCommunityVerification(dataHash, ts);

        res.json({
            success: true,
            type: "community",
            hash: dataHash,
            timestamp: ts,
            txHash: receipt.hash,
            message: "Community verification stored on blockchain"
        });
    } catch (error) {
        console.error("Community verification error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Store Trust Score
 * POST /api/verification/trust-score
 * Body: { scoreData: { score, factors }, timestamp: number }
 */
app.post("/api/verification/trust-score", async (req, res) => {
    try {
        const { scoreData, timestamp } = req.body;
        
        if (!scoreData || scoreData.score === undefined) {
            return res.status(400).json({ error: "Missing trust score data" });
        }

        const dataHash = generateHash(scoreData);
        const ts = timestamp || Math.floor(Date.now() / 1000);

        const receipt = await storeTrustScore(dataHash, ts);

        res.json({
            success: true,
            type: "trustScore",
            hash: dataHash,
            timestamp: ts,
            txHash: receipt.hash,
            message: "Trust score stored on blockchain"
        });
    } catch (error) {
        console.error("Trust score error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// RETRIEVE VERIFICATION ENDPOINTS
// ============================================================================

/**
 * Get all verifications for the current user
 * GET /api/verification/all
 */
app.get("/api/verification/all", async (req, res) => {
    try {
        const verifications = await getMyAllVerifications();
        
        res.json({
            success: true,
            count: verifications.length,
            verifications
        });
    } catch (error) {
        console.error("Get verifications error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get verification status for a user
 * GET /api/verification/status/:address
 */
app.get("/api/verification/status/:address", async (req, res) => {
    try {
        const { address } = req.params;
        
        if (!address) {
            return res.status(400).json({ error: "Missing address" });
        }

        const status = await getVerificationStatus(address);
        const completion = await getCompletionPercentage(address);

        res.json({
            success: true,
            address,
            status,
            completionPercentage: completion
        });
    } catch (error) {
        console.error("Get status error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get completion percentage for a user
 * GET /api/verification/completion/:address
 */
app.get("/api/verification/completion/:address", async (req, res) => {
    try {
        const { address } = req.params;
        
        if (!address) {
            return res.status(400).json({ error: "Missing address" });
        }

        const completion = await getCompletionPercentage(address);

        res.json({
            success: true,
            address,
            completionPercentage: completion
        });
    } catch (error) {
        console.error("Get completion error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// LEGACY ENDPOINTS (backward compatibility)
// ============================================================================

/**
 * Store document hash (legacy)
 * POST /api/hash-document
 */
app.post("/api/hash-document", async (req, res) => {
    try {
        const { hash, timestamp } = req.body;
        
        if (!hash) {
            return res.status(400).json({ error: "Missing document hash" });
        }

        const ts = timestamp || Math.floor(Date.now() / 1000);
        const receipt = await storeHash(hash, ts);

        res.json({
            success: true,
            hash,
            timestamp: ts,
            txHash: receipt.hash
        });
    } catch (error) {
        console.error("Store hash error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get document hash (legacy)
 * GET /api/hash-document
 */
app.get("/api/hash-document", async (req, res) => {
    try {
        const result = await hashDocument();
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error("Get hash error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Verify document (legacy)
 * POST /api/verify-document
 */
app.post("/api/verify-document", async (req, res) => {
    try {
        const { hash, timestamp } = req.body;
        
        if (!hash || !timestamp) {
            return res.status(400).json({ error: "Missing hash or timestamp" });
        }

        const isVerified = await verifyDocument(hash, timestamp);
        
        res.json({
            success: true,
            verified: isVerified
        });
    } catch (error) {
        console.error("Verify document error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// UTILITY ENDPOINTS
// ============================================================================

/**
 * Health check
 * GET /api/health
 */
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: Date.now(),
        service: "Verification API"
    });
});

/**
 * Get verification types
 * GET /api/verification/types
 */
app.get("/api/verification/types", (req, res) => {
    res.json({
        success: true,
        types: VERIFICATION_TYPES
    });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found",
        availableEndpoints: [
            "POST /api/verification/identity",
            "POST /api/verification/address",
            "POST /api/verification/device",
            "POST /api/verification/email",
            "POST /api/verification/community",
            "POST /api/verification/trust-score",
            "GET /api/verification/all",
            "GET /api/verification/status/:address",
            "GET /api/verification/completion/:address",
            "GET /api/health"
        ]
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        error: "Internal server error",
        message: err.message
    });
});

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🚀 VERIFICATION API SERVER RUNNING                    ║
║                                                               ║
║         Port: ${PORT}                                            ║
║         Environment: ${process.env.NODE_ENV || 'development'}                                    ║
║                                                               ║
║         📍 Endpoints:                                          ║
║         • POST /api/verification/identity                     ║
║         • POST /api/verification/address                      ║
║         • POST /api/verification/device                       ║
║         • POST /api/verification/email                        ║
║         • POST /api/verification/community                    ║
║         • POST /api/verification/trust-score                  ║
║         • GET  /api/verification/all                          ║
║         • GET  /api/verification/status/:address              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;