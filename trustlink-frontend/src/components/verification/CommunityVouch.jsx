import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  Loader, 
  Trash2, 
  Mail,
  AlertCircle,
  Info,
  X,
  Award
} from 'lucide-react';

const CommunityVouch = ({ sessionId, onComplete }) => {
  const [vouchers, setVouchers] = useState([]);
  const [isAddingVoucher, setIsAddingVoucher] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [newVoucher, setNewVoucher] = useState({
    name: '',
    email: '',
    relationship: '',
    yearsKnown: '',
    notes: ''
  });

  const MAX_VOUCHERS = 10;

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

  const handleStartAddVoucher = () => {
    setIsAddingVoucher(true);
    setError(null);
  };

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

  const validateVoucherForm = () => {
    if (!newVoucher.name.trim()) {
      setError('Please enter the voucher\'s name');
      return false;
    }
    if (!newVoucher.email.trim()) {
      setError('Please enter the voucher\'s email');
      return false;
    }
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
    
    if (vouchers.some(v => v.email.toLowerCase() === newVoucher.email.toLowerCase())) {
      setError('This person has already been added');
      return false;
    }

    return true;
  };

  const handleAddVoucher = () => {
    if (!validateVoucherForm()) return;

    const voucherToAdd = {
      id: Date.now(),
      ...newVoucher,
      addedAt: new Date().toISOString()
    };

    setVouchers(prev => [...prev, voucherToAdd]);
    handleCancelAddVoucher();
  };

  const handleRemoveVoucher = (voucherId) => {
    setVouchers(prev => prev.filter(v => v.id !== voucherId));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

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

  const handleSkip = () => {
    if (onComplete) {
      onComplete({
        success: true,
        voucherCount: 0,
        skipped: true
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)'
          }}>
            <Users size={40} color="#0a0a0a" />
          </div>

          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}>
            Community Trust
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 3vw, 16px)',
            color: '#a0a0a0',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Add vouchers who can verify your identity and boost your trust score
          </p>
        </div>

        {/* Info Banner */}
        <div style={{
          marginBottom: '24px',
          background: 'linear-gradient(145deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          gap: '16px'
        }}>
          <Info size={24} color="#ffd700" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 15px)',
              fontWeight: '600',
              color: '#ffd700',
              marginBottom: '8px'
            }}>
              How it works
            </p>
            <p style={{
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              color: '#a0a0a0',
              lineHeight: '1.6'
            }}>
              We'll send your vouchers an email asking them to confirm they know you. 
              Each verified voucher increases your trust score. This step is completely 
              optional - you can skip it or add vouchers later.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: '20px',
            background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
            <p style={{
              fontSize: 'clamp(13px, 2.5vw, 14px)',
              color: '#ef4444'
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Vouchers Count */}
        {vouchers.length > 0 && (
          <div style={{
            marginBottom: '24px',
            background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#a0a0a0',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                VOUCHERS ADDED
              </p>
              <p style={{
                fontSize: 'clamp(28px, 6vw, 36px)',
                fontWeight: '700',
                color: '#ffd700'
              }}>
                {vouchers.length}
              </p>
            </div>
            <Award size={48} color="#ffd700" style={{ opacity: 0.3 }} />
          </div>
        )}

        {/* Vouchers List */}
        {vouchers.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                style={{
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
                  border: '2px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '12px',
                  position: 'relative'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'start'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'rgba(255, 215, 0, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Users size={28} color="#ffd700" />
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontSize: 'clamp(16px, 3.5vw, 18px)',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '8px'
                    }}>
                      {voucher.name}
                    </h4>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <Mail size={16} color="#a0a0a0" />
                      <span style={{
                        fontSize: 'clamp(13px, 2.5vw, 14px)',
                        color: '#a0a0a0'
                      }}>
                        {voucher.email}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <span style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 215, 0, 0.1)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: '8px',
                        fontSize: 'clamp(11px, 2vw, 12px)',
                        color: '#ffd700',
                        fontWeight: '600'
                      }}>
                        {RELATIONSHIP_OPTIONS.find(r => r.value === voucher.relationship)?.label}
                      </span>
                      <span style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: 'clamp(11px, 2vw, 12px)',
                        color: '#a0a0a0',
                        fontWeight: '600'
                      }}>
                        {voucher.yearsKnown} {parseInt(voucher.yearsKnown) === 1 ? 'year' : 'years'}
                      </span>
                    </div>

                    {voucher.notes && (
                      <p style={{
                        fontSize: 'clamp(12px, 2.5vw, 13px)',
                        color: '#888',
                        fontStyle: 'italic',
                        marginTop: '12px',
                        lineHeight: '1.5'
                      }}>
                        "{voucher.notes}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveVoucher(voucher.id)}
                    disabled={isSubmitting}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '2px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.5 : 1,
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }
                    }}
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Voucher Form */}
        {isAddingVoucher ? (
          <div style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
            border: '2px solid #ffd700',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: 'clamp(18px, 4vw, 20px)',
                fontWeight: '700',
                color: '#ffffff'
              }}>
                Add New Voucher
              </h3>
              <button
                onClick={handleCancelAddVoucher}
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <X size={20} color="#ffffff" />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(13px, 2.5vw, 14px)',
                  fontWeight: '600',
                  color: '#ffd700',
                  marginBottom: '8px'
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newVoucher.name}
                  onChange={(e) => setNewVoucher(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0a0a0a',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 3vw, 15px)',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ffd700';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(13px, 2.5vw, 14px)',
                  fontWeight: '600',
                  color: '#ffd700',
                  marginBottom: '8px'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newVoucher.email}
                  onChange={(e) => setNewVoucher(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0a0a0a',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 3vw, 15px)',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ffd700';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                  }}
                />
              </div>

              {/* Relationship */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(13px, 2.5vw, 14px)',
                  fontWeight: '600',
                  color: '#ffd700',
                  marginBottom: '8px'
                }}>
                  Relationship *
                </label>
                <select
                  value={newVoucher.relationship}
                  onChange={(e) => setNewVoucher(prev => ({ ...prev, relationship: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0a0a0a',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 3vw, 15px)',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ffd700';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                  }}
                >
                  <option value="" style={{ background: '#0a0a0a' }}>Select relationship...</option>
                  {RELATIONSHIP_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} style={{ background: '#0a0a0a' }}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Years Known */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(13px, 2.5vw, 14px)',
                  fontWeight: '600',
                  color: '#ffd700',
                  marginBottom: '8px'
                }}>
                  How long have you known them? (years) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newVoucher.yearsKnown}
                  onChange={(e) => setNewVoucher(prev => ({ ...prev, yearsKnown: e.target.value }))}
                  placeholder="5"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0a0a0a',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 3vw, 15px)',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ffd700';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                  }}
                />
              </div>

              {/* Notes */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(13px, 2.5vw, 14px)',
                  fontWeight: '600',
                  color: '#ffd700',
                  marginBottom: '8px'
                }}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={newVoucher.notes}
                  onChange={(e) => setNewVoucher(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional context about how you know this person..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0a0a0a',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 3vw, 15px)',
                    color: '#ffffff',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ffd700';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                  }}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '24px'
            }}>
              <button
                onClick={handleCancelAddVoucher}
                style={{
                  padding: '14px',
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: 'clamp(14px, 3vw, 15px)',
                  fontWeight: '600',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddVoucher}
                style={{
                  padding: '14px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: 'clamp(14px, 3vw, 15px)',
                  fontWeight: '700',
                  color: '#0a0a0a',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
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
              style={{
                width: '100%',
                padding: '20px',
                background: 'transparent',
                border: '3px dashed rgba(255, 215, 0, 0.3)',
                borderRadius: '16px',
                fontSize: 'clamp(15px, 3vw, 16px)',
                fontWeight: '600',
                color: '#ffd700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '24px',
                opacity: isSubmitting ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'rgba(255, 215, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#ffd700';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                }
              }}
            >
              <UserPlus size={28} />
              Add Voucher
            </button>
          )
        )}

        {/* Action Buttons */}
        {!isAddingVoucher && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: vouchers.length > 0 ? '1fr 1fr' : '1fr',
            gap: '12px',
            marginBottom: '32px'
          }}>
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              style={{
                padding: '16px',
                background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                fontSize: 'clamp(15px, 3vw, 16px)',
                fontWeight: '700',
                color: '#ffffff',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isSubmitting ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {vouchers.length > 0 ? 'Skip & Continue' : 'Skip This Step'}
            </button>
            
            {vouchers.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '16px',
                  background: isSubmitting 
                    ? 'linear-gradient(135deg, #999 0%, #888 100%)'
                    : 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: 'clamp(15px, 3vw, 16px)',
                  fontWeight: '700',
                  color: '#0a0a0a',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 215, 0, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Submit {vouchers.length} Voucher{vouchers.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Guidelines */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
          border: '2px solid #2a2a2a',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h4 style={{
            fontSize: 'clamp(15px, 3vw, 16px)',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={20} color="#ffd700" />
            Guidelines
          </h4>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '12px'
          }}>
            {[
              'Add people who know you well and can verify your identity',
              'Choose vouchers who are likely to respond to verification emails',
              'More vouchers = higher trust score',
              'Vouchers will receive an email asking them to confirm they know you',
              'This step is completely optional - you can skip it or add vouchers later'
            ].map((item, index) => (
              <li
                key={index}
                style={{
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  color: '#a0a0a0',
                  lineHeight: '1.6',
                  paddingLeft: '24px',
                  position: 'relative'
                }}
              >
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: '#ffd700',
                  fontWeight: '700'
                }}>
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        input::placeholder,
        textarea::placeholder,
        select option:first-child {
          color: #666;
        }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffd700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 20px;
          padding-right: 40px;
        }
      `}</style>
    </div>
  );
};
export default CommunityVouch;