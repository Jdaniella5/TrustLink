require('dotenv').config({ path: './contract.env' });
const { ethers } = require("ethers");

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = "0xe9d02f9C55Bf9f9F92F9443d0e572339516AaE5F";

// ============================================================================
// ENHANCED ABI - Includes all verification functions
// ============================================================================
const abi = [
    // ========================================================================
    // STORE VERIFICATION FUNCTIONS
    // ========================================================================
    "function storeVerification(uint8 verificationType, bytes32 dataHash, uint64 timestamp) external",
    "function storeIdentityVerification(bytes32 dataHash, uint64 timestamp) external",
    "function storeAddressVerification(bytes32 dataHash, uint64 timestamp) external",
    "function storeDeviceVerification(bytes32 dataHash, uint64 timestamp) external",
    "function storeEmailVerification(bytes32 dataHash, uint64 timestamp) external",
    "function storeCommunityVerification(bytes32 dataHash, uint64 timestamp) external",
    "function storeTrustScore(bytes32 dataHash, uint64 timestamp) external",

    // ========================================================================
    // RETRIEVE VERIFICATION FUNCTIONS
    // ========================================================================
    "function getMyVerification(uint8 verificationType) external view returns (bytes32, uint64, bool)",
    "function getUserVerification(address user, uint8 verificationType) external view returns (bytes32, uint64, bool)",
    "function getMyAllVerifications() external view returns (uint8[], bytes32[], uint64[], bool[])",
    "function getUserAllVerifications(address user) external view returns (uint8[], bytes32[], uint64[], bool[])",
    
    // ========================================================================
    // STATUS & UTILITY FUNCTIONS
    // ========================================================================
    "function hasVerification(address user, uint8 verificationType) external view returns (bool)",
    "function getVerificationStatus(address user) external view returns (bool, bool, bool, bool, bool, bool)",
    "function getCompletionPercentage(address user) external view returns (uint8)",
    "function getTotalUsers() external view returns (uint64)",
    "function getCurrentTimestamp() external view returns (uint64)",
    "function deactivateVerification(uint8 verificationType) external",

    // ========================================================================
    // LEGACY FUNCTIONS (backward compatibility)
    // ========================================================================
    "function storeHash(bytes32, uint64) external",
    "function hashDocument() external view returns (bytes32, uint64)",
    "function verifyDocument(bytes32, uint64) external view returns (bool)",
    "function getAllStoredHashesAndTimestamps() external view returns (address[], bytes32[], uint64[])"
];

// ============================================================================
// VERIFICATION TYPE CONSTANTS
// ============================================================================
const VERIFICATION_TYPES = {
    IDENTITY: 0,      // Face ID
    ADDRESS: 1,       // GPS Location
    DEVICE: 2,        // Device Fingerprint
    EMAIL: 3,         // Email Verification
    COMMUNITY: 4,     // Community Vouches
    TRUST_SCORE: 5,   // Trust Score
    DOCUMENT: 6       // Legacy Document Hash
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get contract instance
 */
function getContract(signerOrProvider) {
    return new ethers.Contract(CONTRACT_ADDRESS, abi, signerOrProvider);
}

/**
 * Get provider and wallet
 */
function getProviderAndWallet() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    return { provider, wallet };
}

// ============================================================================
// STORE VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Store any verification type
 */
async function storeVerification(verificationType, dataHash, timestamp) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    console.log(`📝 Storing verification type ${verificationType}...`);
    const tx = await contract.storeVerification(verificationType, dataHash, timestamp);
    const receipt = await tx.wait();
    
    console.log(`✅ Verification stored! Tx: ${receipt.hash}`);
    return receipt;
}

/**
 * Store identity verification (Face ID)
 */
async function storeIdentityVerification(dataHash, timestamp) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    console.log(`👤 Storing identity verification...`);
    const tx = await contract.storeIdentityVerification(dataHash, timestamp);
    const receipt = await tx.wait();
    
    console.log(`✅ Identity stored! Tx: ${receipt.hash}`);
    return receipt;
}

/**
 * Store address verification (GPS)
 */
async function storeAddressVerification(dataHash, timestamp) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    console.log(`📍 Storing address verification...`);
    const tx = await contract.storeAddressVerification(dataHash, timestamp);
    const receipt = await tx.wait();
    
    console.log(`✅ Address stored! Tx: ${receipt.hash}`);
    return receipt;
}

/**
 * Store device fingerprint
 */
async function storeDeviceVerification(dataHash, timestamp) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    console.log(`📱 Storing device verification...`);
    const tx = await contract.storeDeviceVerification(dataHash, timestamp);
    const receipt = await tx.wait();
    
    console.log(`✅ Device stored! Tx: ${receipt.hash}`);
    return receipt;
}

/**
 * Store email verification
 */
async function storeEmailVerification(dataHash, timestamp) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    console.log(`📧 Storing email verification...`);
    const tx = await contract.storeEmailVerification(dataHash, timestamp);
    const receipt = await tx.wait();
    
    console.log(`✅ Email stored! Tx: ${receipt.hash}`);
    return receipt;
}

/**
 * Store community vouch
 */
async function storeCommunityVerification(dataHash, timestamp) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    console.log(`👥 Storing community verification...`);
    const tx = await contract.storeCommunityVerification(dataHash, timestamp);
    const receipt = await tx.wait();
    
    console.log(`✅ Community vouch stored! Tx: ${receipt.hash}`);
    return receipt;
}

/**
 * Store trust score
 */
async function storeTrustScore(dataHash, timestamp) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    console.log(`⭐ Storing trust score...`);
    const tx = await contract.storeTrustScore(dataHash, timestamp);
    const receipt = await tx.wait();
    
    console.log(`✅ Trust score stored! Tx: ${receipt.hash}`);
    return receipt;
}

// ============================================================================
// RETRIEVE VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Get a specific verification for the caller
 */
async function getMyVerification(verificationType) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    const [hash, timestamp, isActive] = await contract.getMyVerification(verificationType);
    
    return {
        hash,
        timestamp: timestamp.toString(),
        isActive,
        date: new Date(Number(timestamp) * 1000)
    };
}

/**
 * Get all verifications for the caller
 */
async function getMyAllVerifications() {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    const [types, hashes, timestamps, statuses] = await contract.getMyAllVerifications();
    
    const verifications = [];
    for (let i = 0; i < types.length; i++) {
        verifications.push({
            type: types[i],
            typeName: getVerificationTypeName(types[i]),
            hash: hashes[i],
            timestamp: timestamps[i].toString(),
            isActive: statuses[i],
            date: new Date(Number(timestamps[i]) * 1000)
        });
    }
    
    return verifications;
}

/**
 * Get verification status (which verifications are complete)
 */
async function getVerificationStatus(userAddress) {
    const { provider } = getProviderAndWallet();
    const contract = getContract(provider);
    
    const [identity, address, device, email, community, trustScore] = 
        await contract.getVerificationStatus(userAddress);
    
    return {
        identity,
        address,
        device,
        email,
        community,
        trustScore
    };
}

/**
 * Get completion percentage
 */
async function getCompletionPercentage(userAddress) {
    const { provider } = getProviderAndWallet();
    const contract = getContract(provider);
    
    const percentage = await contract.getCompletionPercentage(userAddress);
    return Number(percentage);
}

// ============================================================================
// LEGACY FUNCTIONS (backward compatibility)
// ============================================================================

/**
 * Store document hash (legacy)
 */
async function storeHash(hash, timestamp) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    console.log(`📄 Storing document hash...`);
    const tx = await contract.storeHash(hash, timestamp);
    const receipt = await tx.wait();
    
    console.log(`✅ Hash stored! Tx: ${receipt.hash}`);
    return receipt;
}

/**
 * Get document hash (legacy)
 */
async function hashDocument() {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    const [hash, timestamp] = await contract.hashDocument();
    
    return {
        hash,
        timestamp: timestamp.toString(),
        date: new Date(Number(timestamp) * 1000)
    };
}

/**
 * Verify document (legacy)
 */
async function verifyDocument(hash, timestamp) {
    const { wallet } = getProviderAndWallet();
    const contract = getContract(wallet);
    
    const isValid = await contract.verifyDocument(hash, timestamp);
    return isValid;
}

/**
 * Get all stored hashes (legacy)
 */
async function getAllStoredHashesAndTimestamps() {
    const { provider } = getProviderAndWallet();
    const contract = getContract(provider);
    
    const [owners, hashes, timestamps] = await contract.getAllStoredHashesAndTimestamps();
    
    const results = [];
    for (let i = 0; i < owners.length; i++) {
        results.push({
            owner: owners[i],
            hash: hashes[i],
            timestamp: timestamps[i].toString(),
            date: new Date(Number(timestamps[i]) * 1000)
        });
    }
    
    return results;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get verification type name from number
 */
function getVerificationTypeName(typeNumber) {
    const names = {
        0: 'Identity',
        1: 'Address',
        2: 'Device',
        3: 'Email',
        4: 'Community',
        5: 'Trust Score',
        6: 'Document'
    };
    return names[typeNumber] || 'Unknown';
}

/**
 * Generate SHA-256 hash from data
 */
function generateHash(data) {
    const jsonString = JSON.stringify(data);
    return ethers.keccak256(ethers.toUtf8Bytes(jsonString));
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    // Constants
    CONTRACT_ADDRESS,
    VERIFICATION_TYPES,
    abi,
    
    // Store functions
    storeVerification,
    storeIdentityVerification,
    storeAddressVerification,
    storeDeviceVerification,
    storeEmailVerification,
    storeCommunityVerification,
    storeTrustScore,
    
    // Retrieve functions
    getMyVerification,
    getMyAllVerifications,
    getVerificationStatus,
    getCompletionPercentage,
    
    // Legacy functions
    storeHash,
    hashDocument,
    verifyDocument,
    getAllStoredHashesAndTimestamps,
    
    // Utilities
    getContract,
    getProviderAndWallet,
    getVerificationTypeName,
    generateHash
};

// ============================================================================
// EXAMPLE USAGE (if running directly)
// ============================================================================

async function main() {
    console.log("🚀 Testing Enhanced Verification Contract\n");
    
    // Example: Store identity verification
    const identityData = {
        faceId: "face_scan_12345",
        timestamp: Date.now(),
        verified: true
    };
    const identityHash = generateHash(identityData);
    const timestamp = Math.floor(Date.now() / 1000);
    
    await storeIdentityVerification(identityHash, timestamp);
    
    // Get verification status
    const { wallet } = getProviderAndWallet();
    const status = await getVerificationStatus(wallet.address);
    console.log("\n📊 Verification Status:", status);
    
    // Get all verifications
    const allVerifications = await getMyAllVerifications();
    console.log("\n📜 All Verifications:", allVerifications);
    
    // Get completion percentage
    const completion = await getCompletionPercentage(wallet.address);
    console.log(`\n✅ Completion: ${completion}%`);
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}