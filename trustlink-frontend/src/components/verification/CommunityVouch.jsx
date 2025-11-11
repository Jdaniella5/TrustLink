// src/components/verification/CommunityVouch.jsx
// This component allows users to add referees/vouchers who can verify their identity
// Builds community trust through peer verification

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  Loader, 
  Trash2, 
  Mail,
  AlertCircle,
  Info
} from 'lucide-react';
import { submitCommunityVouch } from '../../services/api';

const CommunityVouch = ({ sessionId, onComplete }) => {
  // Component state
  const [vouchers, setVouchers] = useState([]); // List of added vouchers
  const [isAddingVoucher, setIsAddingVoucher] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state for new voucher
  const [newVoucher, setNewVoucher] = useState({
    name: '',
    email: '',
    relationship: '',
    yearsKnown: '',
    notes: ''
  });

  // Minimum vouchers required
  const MIN_VOUCHERS = 2;
  const MAX_VOUCHERS = 5;

  // Relationship options
  const RELATIONSHIP_OPTIONS = [
    { value: 'family', label: 'Family Member' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague/Coworker' },
    { value: 'classmate', label: 'Classmate' },
    { value: 'neighbor', label: 'Neighbor' },
    { value: 'mentor', label: 'Mentor/Teacher' },
    { value: 'business', label: 'Business Partner' },
    { value: 'other', label: 'Other' }
  ];

  // =============================================================================
  // ADD VOUCHER
  // =============================================================================

  /**
   * Show add voucher form
   */
  const handleStartAddVoucher = () => {
    setIsAddingVoucher(true);
    setError(null);
  };

  /**
   * Cancel adding voucher
   */
  const handleCancelAddVoucher = () => {
    setIsAddingVoucher(false);
    setNewVoucher({
      name: '',
      email: '',
      relationship: '',
      yearsKnown: '',
      notes: ''
    });
    setError(null);
  };

  /**
   * Validate voucher form
   * @returns {boolean} - Whether form is valid
   */
  const validateVoucherForm = () => {
    if (!newVoucher.name.trim()) {
      setError('Please enter the voucher\'s name');
      return false;
    }
    if (!newVoucher.email.trim()) {
      setError('Please enter the voucher\'s email');
      return false;
    }
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newVoucher.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!newVoucher.relationship) {
      setError('Please select your relationship');
      return false;
    }
    if (!newVoucher.yearsKnown || parseInt(newVoucher.yearsKnown) < 0) {
      setError('Please enter how long you\'ve known them');
      return false;
    }
    
    // Check for duplicate email
    if (vouchers.some(v => v.email.toLowerCase() === newVoucher.email.toLowerCase())) {
      setError('This person has already been added');
      return false;
    }

    return true;
  };

  /**
   * Add voucher to list
   */
  const handleAddVoucher = () => {
    if (!validateVoucherForm()) return;

    // Add voucher to list
    const voucherToAdd = {
      id: Date.now(), // Temporary ID
      ...newVoucher,
      addedAt: new Date().toISOString()
    };

    setVouchers(prev => [...prev, voucherToAdd]);
    
    // Reset form
    handleCancelAddVoucher();
  };

  /**
   * Remove voucher from list
   * @param {number} voucherId - ID of voucher to remove
   */
  const handleRemoveVoucher = (voucherId) => {
    setVouchers(prev => prev.filter(v => v.id !== voucherId));
  };

  // =============================================================================
  // SUBMIT VOUCHERS
  // =============================================================================

  /**
   * Submit all vouchers to backend
   */
  const handleSubmit = async () => {
    if (vouchers.length < MIN_VOUCHERS) {
      setError(`Please add at least ${MIN_VOUCHERS} vouchers to continue`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Submit each voucher to backend
      const submissions = vouchers.map(voucher => 
        submitCommunityVouch(sessionId, {
          name: voucher.name,
          email: voucher.email,
          relationship: voucher.relationship,
          yearsKnown: parseInt(voucher.yearsKnown),
          notes: voucher.notes || ''
        })
      );

      // Wait for all submissions to complete
      await Promise.all(submissions);

      // Notify parent component
      if (onComplete) {
        onComplete({
          success: true,
          voucherCount: vouchers.length,
          vouchers: vouchers.map(v => ({
            name: v.name,
            email: v.email,
            relationship: v.relationship
          }))
        });
      }
    } catch (err) {
      console.error('Failed to submit vouchers:', err);
      setError('Failed to submit vouchers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Skip this step (optional verification)
   */
  const handleSkip = () => {
    if (onComplete) {
      onComplete({
        success: true,
        voucherCount: 0,
        skipped: true
      });
    }
  };

  // =============================================================================
  // RENDER UI
  // =============================================================================

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Community Trust
        </h2>
        <p className="text-gray-600">
          Add people who can vouch for your identity
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">What is community vouching?</p>
          <p>
            Adding vouchers strengthens your trust score. We'll send them an email 
            asking them to confirm they know you. The more trusted vouchers you have, 
            the higher your trust score.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Vouchers Added
          </span>
          <span className="text-lg font-bold text-pink-600">
            {vouchers.length} / {MIN_VOUCHERS} minimum
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min((vouchers.length / MIN_VOUCHERS) * 100, 100)}%` 
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {vouchers.length < MIN_VOUCHERS 
            ? `Add ${MIN_VOUCHERS - vouchers.length} more to continue`
            : `Great! You can add up to ${MAX_VOUCHERS} vouchers total`
          }
        </p>
      </div>

      {/* Vouchers List */}
      {vouchers.length > 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Your Vouchers</h3>
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users size={24} className="text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{voucher.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Mail size={14} />
                      {voucher.email}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-block px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full">
                        {RELATIONSHIP_OPTIONS.find(r => r.value === voucher.relationship)?.label}
                      </span>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        Known for {voucher.yearsKnown} {parseInt(voucher.yearsKnown) === 1 ? 'year' : 'years'}
                      </span>
                    </div>
                    {voucher.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        "{voucher.notes}"
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveVoucher(voucher.id)}
                  disabled={isSubmitting}
                  className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                  title="Remove voucher"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Voucher Form */}
      {isAddingVoucher ? (
        <div className="bg-white border-2 border-pink-500 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Add New Voucher
          </h3>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={newVoucher.name}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={newVoucher.email}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship *
              </label>
              <select
                value={newVoucher.relationship}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, relationship: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              >
                <option value="">Select relationship...</option>
                {RELATIONSHIP_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Years Known */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How long have you known them? (years) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newVoucher.yearsKnown}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, yearsKnown: e.target.value }))}
                placeholder="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
            </div>

            {/* Notes (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                value={newVoucher.notes}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional context about how you know this person..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCancelAddVoucher}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddVoucher}
              className="flex-1 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Add Voucher
            </button>
          </div>
        </div>
      ) : (
        /* Add Voucher Button */
        vouchers.length < MAX_VOUCHERS && (
          <button
            onClick={handleStartAddVoucher}
            disabled={isSubmitting}
            className="w-full py-4 border-2 border-dashed border-pink-300 text-pink-600 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus size={24} />
            <span className="font-medium">Add Voucher</span>
          </button>
        )
      )}

      {/* Submit/Skip Buttons */}
      {!isAddingVoucher && (
        <div className="mt-6 flex gap-4">
          {vouchers.length === 0 && (
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            >
              Skip for Now
            </button>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || vouchers.length < MIN_VOUCHERS}
            className="flex-1 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Submit Vouchers ({vouchers.length})
              </>
            )}
          </button>
        </div>
      )}

      {/* Guidelines */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Guidelines</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Add people who know you well and can verify your identity</li>
          <li>• Choose vouchers who are likely to respond to verification emails</li>
          <li>• More vouchers = higher trust score</li>
          <li>• Vouchers will receive an email asking them to confirm they know you</li>
          <li>• This step is optional but highly recommended</li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityVouch;