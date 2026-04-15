import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gsvccxhdgcshiwgjvgfi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdmNjeGhkZ2NzaGl3Z2p2Z2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczOTY2NTIsImV4cCI6MjA4Mjk3MjY1Mn0.Sbb6YJjlQ_ig2LCcs9zz_Be1kU-iIHBx4Vu4nzCPyTM';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type PageState = 'loading' | 'invalid' | 'form' | 'success';

export default function SecretResetPassword() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', !!session);
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        setPageState('form');
      } else if (event === 'SIGNED_IN' && session) {
        setPageState('form');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setPageState('form');
      }
    });

    const checkSession = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (!mounted) return;

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setPageState('form');
        return;
      }

      const hash = window.location.hash;
      if (hash.includes('access_token') || hash.includes('type=recovery')) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (!mounted) return;

        const { data: { session: retrySession } } = await supabase.auth.getSession();
        if (retrySession) {
          setPageState('form');
        } else {
          setPageState('invalid');
        }
      } else {
        setPageState('invalid');
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const showMessage = (text: string, type: 'error' | 'success') => {
    setMessage({ text, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      setPageState('success');
    } catch (error: any) {
      console.error('Error:', error);
      showMessage(error.message || 'Failed to update password. The link may have expired.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
      
      {/* Background ambient glows */}
      <div className="glow-bg" style={{ top: '-10%', left: '-10%', width: '800px', height: '800px' }}></div>
      <div className="glow-bg" style={{ bottom: '-10%', right: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(109, 40, 217, 0.1) 0%, rgba(5, 5, 8, 0) 60%)' }}></div>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'rgba(15, 15, 20, 0.8)',
        border: '1px solid var(--border-light)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1,
      }}>
        
        {/* Loading State */}
        {pageState === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(124, 77, 255, 0.2)', borderTopColor: '#7C4DFF', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Verifying your reset link...</p>
          </div>
        )}

        {/* Invalid State */}
        {pageState === 'invalid' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Invalid or Expired Link</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              This password reset link is invalid or has expired. Please request a new one from the app.
            </p>
            <button
              onClick={handleClose}
              style={{ width: '100%', padding: '14px 24px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', borderRadius: '10px', color: '#FFFFFF', fontSize: '15px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Close This Page
            </button>
          </div>
        )}

        {/* Form State */}
        {pageState === 'form' && (
          <div style={{ animation: 'fade-in 0.5s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
              <h1 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Create New Password</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Enter your new password below</p>
            </div>

            {message && (
              <div style={{
                backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <span style={{ fontSize: '16px' }}>{message.type === 'error' ? '⚠️' : '✓'}</span>
                <span style={{ color: message.type === 'error' ? '#F87171' : '#4ADE80', fontSize: '14px' }}>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  style={{ width: '100%', padding: '14px 16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', borderRadius: '10px', color: '#FFFFFF', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  style={{ width: '100%', padding: '14px 16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', borderRadius: '10px', color: '#FFFFFF', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: loading ? 'rgba(124, 77, 255, 0.5)' : 'linear-gradient(135deg, rgba(178, 139, 255, 0.8) 0%, rgba(109, 40, 217, 0.8) 100%)',
                  border: '1px solid rgba(178, 139, 255, 0.3)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {loading ? (
                  <>
                    <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255, 255, 255, 0.3)', borderTopColor: '#FFFFFF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Updating...
                  </>
                ) : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Success State */}
        {pageState === 'success' && (
          <div style={{ textAlign: 'center', animation: 'fade-in 0.5s ease' }}>
            <div style={{ width: '72px', height: '72px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <span style={{ fontSize: '36px' }}>✓</span>
            </div>
            <h2 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>Password Updated!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '28px' }}>
              Your password has been successfully changed.<br />
              You can now close this tab and sign in with your new password in the app.
            </p>
            <button
              onClick={handleClose}
              style={{ width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg, rgba(178, 139, 255, 0.8) 0%, rgba(109, 40, 217, 0.8) 100%)', border: '1px solid rgba(178, 139, 255, 0.3)', borderRadius: '10px', color: '#FFFFFF', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
            >
              Close & Open the App
            </button>
          </div>
        )}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
