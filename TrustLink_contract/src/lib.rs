#![cfg_attr(not(any(feature = "export-abi", test)), no_main)]
extern crate alloc;

use stylus_sdk::{
    abi::Bytes, 
    alloy_primitives::{FixedBytes, U256, Address}, 
    block, 
    msg, 
    prelude::*,
    storage::{StorageMap, StorageVec, StorageU64, StorageFixedBytes, StorageAddress}
};
use alloc::string::String;
use alloc::vec::Vec;

// ============================================================================
// STORAGE STRUCTURES
// ============================================================================

/// Represents a single verification entry
#[storage]
pub struct VerificationEntry {
    /// Hash of the verification data
    data_hash: StorageFixedBytes<32>,
    /// Timestamp when verification was stored
    timestamp: StorageU64,
    /// Whether this verification is active
    is_active: StorageBool,
}

/// Main contract storage
#[storage]
#[entrypoint]
pub struct VerificationContract {
    /// Maps: user_address => verification_type => VerificationEntry
    /// verification_type: 0=identity, 1=address, 2=device, 3=email, 4=community, 5=trustScore
    verifications: StorageMap<Address, StorageMap<u8, VerificationEntry>>,
    
    /// Total number of users who have stored verifications
    total_users: StorageU64,
    
    /// List of all users who have stored verifications
    user_addresses: StorageVec<StorageAddress>,
}

// ============================================================================
// PUBLIC FUNCTIONS
// ============================================================================

#[public]
impl VerificationContract {
    
    // ========================================================================
    // STORE VERIFICATION DATA
    // ========================================================================
    
    /// Store a verification hash with verification type
    /// @param verification_type: 0=identity, 1=address, 2=device, 3=email, 4=community, 5=trustScore
    /// @param data_hash: SHA-256 hash of the verification data
    /// @param timestamp: Unix timestamp of verification
    pub fn store_verification(
        &mut self,
        verification_type: u8,
        data_hash: FixedBytes<32>,
        timestamp: u64
    ) -> Result<(), Vec<u8>> {
        // Validate verification type (0-5)
        if verification_type > 5 {
            return Err(b"Invalid verification type".to_vec());
        }

        let user = msg::sender();
        
        // Get or create user's verification map
        let mut user_verifications = self.verifications.setter(user);
        let mut verification = user_verifications.setter(verification_type);
        
        // Store the verification data
        verification.data_hash.set(data_hash);
        verification.timestamp.set(timestamp);
        verification.is_active.set(true);
        
        // If this is the user's first verification, add to user list
        if !self.has_any_verification(user) {
            let mut user_addr = self.user_addresses.grow();
            user_addr.set(user);
            self.total_users.set(self.total_users.get() + 1);
        }

        Ok(())
    }

    /// Store identity verification (Face ID)
    pub fn store_identity_verification(
        &mut self,
        data_hash: FixedBytes<32>,
        timestamp: u64
    ) -> Result<(), Vec<u8>> {
        self.store_verification(0, data_hash, timestamp)
    }

    /// Store address verification (GPS)
    pub fn store_address_verification(
        &mut self,
        data_hash: FixedBytes<32>,
        timestamp: u64
    ) -> Result<(), Vec<u8>> {
        self.store_verification(1, data_hash, timestamp)
    }

    /// Store device fingerprint verification
    pub fn store_device_verification(
        &mut self,
        data_hash: FixedBytes<32>,
        timestamp: u64
    ) -> Result<(), Vec<u8>> {
        self.store_verification(2, data_hash, timestamp)
    }

    /// Store email verification
    pub fn store_email_verification(
        &mut self,
        data_hash: FixedBytes<32>,
        timestamp: u64
    ) -> Result<(), Vec<u8>> {
        self.store_verification(3, data_hash, timestamp)
    }

    /// Store community vouch verification
    pub fn store_community_verification(
        &mut self,
        data_hash: FixedBytes<32>,
        timestamp: u64
    ) -> Result<(), Vec<u8>> {
        self.store_verification(4, data_hash, timestamp)
    }

    /// Store trust score
    pub fn store_trust_score(
        &mut self,
        data_hash: FixedBytes<32>,
        timestamp: u64
    ) -> Result<(), Vec<u8>> {
        self.store_verification(5, data_hash, timestamp)
    }

    // ========================================================================
    // LEGACY FUNCTIONS (for backward compatibility with document storage)
    // ========================================================================

    /// Store document hash (legacy function)
    pub fn store_hash(
        &mut self,
        hash: FixedBytes<32>,
        timestamp: u64
    ) -> Result<(), Vec<u8>> {
        // Store as a generic document (type 6)
        self.store_verification(6, hash, timestamp)
    }

    /// Get latest document hash for caller (legacy function)
    pub fn hash_document(&self) -> (FixedBytes<32>, u64) {
        let user = msg::sender();
        let user_verifications = self.verifications.get(user);
        
        // Try to get type 6 (legacy document) first
        let verification = user_verifications.get(6);
        
        if verification.is_active.get() {
            (verification.data_hash.get(), verification.timestamp.get())
        } else {
            // Return empty hash if not found
            (FixedBytes::<32>::ZERO, 0)
        }
    }

    /// Verify document hash (legacy function)
    pub fn verify_document(
        &self,
        expected_hash: FixedBytes<32>,
        expected_timestamp: u64
    ) -> bool {
        let user = msg::sender();
        let user_verifications = self.verifications.get(user);
        let verification = user_verifications.get(6);
        
        if !verification.is_active.get() {
            return false;
        }

        let stored_hash = verification.data_hash.get();
        let stored_timestamp = verification.timestamp.get();

        stored_hash == expected_hash && stored_timestamp == expected_timestamp
    }

    // ========================================================================
    // RETRIEVE VERIFICATION DATA
    // ========================================================================

    /// Get a specific verification for the caller
    pub fn get_my_verification(
        &self,
        verification_type: u8
    ) -> (FixedBytes<32>, u64, bool) {
        let user = msg::sender();
        self.get_user_verification(user, verification_type)
    }

    /// Get a specific verification for any user (public view)
    pub fn get_user_verification(
        &self,
        user: Address,
        verification_type: u8
    ) -> (FixedBytes<32>, u64, bool) {
        if verification_type > 6 {
            return (FixedBytes::<32>::ZERO, 0, false);
        }

        let user_verifications = self.verifications.get(user);
        let verification = user_verifications.get(verification_type);

        (
            verification.data_hash.get(),
            verification.timestamp.get(),
            verification.is_active.get()
        )
    }

    /// Get all verifications for the caller
    pub fn get_my_all_verifications(&self) -> (
        Vec<u8>,           // verification types
        Vec<FixedBytes<32>>, // hashes
        Vec<u64>,          // timestamps
        Vec<bool>          // active status
    ) {
        let user = msg::sender();
        self.get_user_all_verifications(user)
    }

    /// Get all verifications for a specific user
    pub fn get_user_all_verifications(
        &self,
        user: Address
    ) -> (
        Vec<u8>,           // verification types
        Vec<FixedBytes<32>>, // hashes
        Vec<u64>,          // timestamps
        Vec<bool>          // active status
    ) {
        let user_verifications = self.verifications.get(user);
        
        let mut types = Vec::new();
        let mut hashes = Vec::new();
        let mut timestamps = Vec::new();
        let mut statuses = Vec::new();

        // Check all verification types (0-6)
        for verification_type in 0..=6 {
            let verification = user_verifications.get(verification_type);
            
            if verification.is_active.get() {
                types.push(verification_type);
                hashes.push(verification.data_hash.get());
                timestamps.push(verification.timestamp.get());
                statuses.push(true);
            }
        }

        (types, hashes, timestamps, statuses)
    }

    /// Check if user has completed a specific verification type
    pub fn has_verification(
        &self,
        user: Address,
        verification_type: u8
    ) -> bool {
        if verification_type > 6 {
            return false;
        }

        let user_verifications = self.verifications.get(user);
        let verification = user_verifications.get(verification_type);
        verification.is_active.get()
    }

    /// Get verification completion status for all types
    pub fn get_verification_status(
        &self,
        user: Address
    ) -> (bool, bool, bool, bool, bool, bool) {
        (
            self.has_verification(user, 0), // identity
            self.has_verification(user, 1), // address
            self.has_verification(user, 2), // device
            self.has_verification(user, 3), // email
            self.has_verification(user, 4), // community
            self.has_verification(user, 5), // trustScore
        )
    }

    /// Calculate completion percentage (0-100)
    pub fn get_completion_percentage(&self, user: Address) -> u8 {
        let mut completed = 0u8;
        
        for verification_type in 0..6 {
            if self.has_verification(user, verification_type) {
                completed += 1;
            }
        }

        (completed * 100) / 6
    }

    // ========================================================================
    // LEGACY FUNCTION - Get all stored hashes (for backward compatibility)
    // ========================================================================

    pub fn get_all_stored_hashes_and_timestamps(&self) -> (
        Vec<Address>,
        Vec<FixedBytes<32>>,
        Vec<u64>
    ) {
        let total = self.total_users.get();
        let mut addresses = Vec::new();
        let mut hashes = Vec::new();
        let mut timestamps = Vec::new();

        for i in 0..total {
            if let Some(user_addr_storage) = self.user_addresses.get(i as usize) {
                let user = user_addr_storage.get();
                let user_verifications = self.verifications.get(user);
                
                // Get legacy document (type 6) if exists
                let verification = user_verifications.get(6);
                if verification.is_active.get() {
                    addresses.push(user);
                    hashes.push(verification.data_hash.get());
                    timestamps.push(verification.timestamp.get());
                }
            }
        }

        (addresses, hashes, timestamps)
    }

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================

    /// Get total number of users with verifications
    pub fn get_total_users(&self) -> u64 {
        self.total_users.get()
    }

    /// Get current block timestamp
    pub fn get_current_timestamp(&self) -> u64 {
        block::timestamp()
    }

    /// Deactivate a verification (soft delete)
    pub fn deactivate_verification(
        &mut self,
        verification_type: u8
    ) -> Result<(), Vec<u8>> {
        if verification_type > 6 {
            return Err(b"Invalid verification type".to_vec());
        }

        let user = msg::sender();
        let mut user_verifications = self.verifications.setter(user);
        let mut verification = user_verifications.setter(verification_type);
        
        verification.is_active.set(false);

        Ok(())
    }

    // ========================================================================
    // HELPER FUNCTIONS (internal use)
    // ========================================================================

    /// Check if user has any active verification
    fn has_any_verification(&self, user: Address) -> bool {
        let user_verifications = self.verifications.get(user);
        
        for verification_type in 0..=6 {
            let verification = user_verifications.get(verification_type);
            if verification.is_active.get() {
                return true;
            }
        }
        
        false
    }
}

// ============================================================================
// VERIFICATION TYPE CONSTANTS (for reference)
// ============================================================================
// 0 = Identity (Face ID)
// 1 = Address (GPS)
// 2 = Device (Fingerprint)
// 3 = Email
// 4 = Community (Vouches)
// 5 = Trust Score
// 6 = Legacy Document Hash
// ============================================================================