import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Lock, Mail, ArrowRight, CheckCircle, KeyRound, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type ViewState = 'loading' | 'request_link' | 'reset_password' | 'success_link_sent' | 'success_password_reset';

export default function ResetPassword() {
  const [view, setView] = useState<ViewState>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setView('reset_password');
      } else {
        setView('request_link');
      }
    } catch (e) {
      setView('request_link');
    }
  };

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) throw error;
      setView('success_link_sent');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setView('success_password_reset');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'loading') {
    return (
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-primary" size={32} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
      
      {/* Background ambient glows */}
      <div className="glow-bg" style={{ top: '-10%', left: '-10%', width: '800px', height: '800px' }}></div>
      <div className="glow-bg" style={{ bottom: '-10%', right: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(109, 40, 217, 0.1) 0%, rgba(5, 5, 8, 0) 60%)' }}></div>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'rgba(15, 15, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border-light)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        zIndex: 10,
        transition: 'all 0.5s ease',
      }}>
        {/* Back Button */}
        <Link to="/" style={{ position: 'absolute', top: '24px', left: '24px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
          <ChevronLeft size={24} />
        </Link>

        {/* VIEW: Request Link */}
        {view === 'request_link' && (
          <div style={{ animation: 'fade-in 0.5s ease' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(124, 77, 255, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(124, 77, 255, 0.2)' }}>
              <KeyRound size={24} color="var(--primary)" />
            </div>
            
            <h1 style={{ textAlign: 'center', color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Forgot Password?</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Enter your email and we'll send you a link to reset your password.</p>

            {error && (
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: '#F87171', fontSize: '14px' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestLink} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px 14px 44px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', borderRadius: '12px', color: '#FFF', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, rgba(178, 139, 255, 0.8) 0%, rgba(109, 40, 217, 0.8) 100%)', border: '1px solid rgba(178, 139, 255, 0.3)', borderRadius: '12px', color: '#FFF', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '8px' }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send Reset Link <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        )}

        {/* VIEW: Success Link Sent */}
        {view === 'success_link_sent' && (
          <div style={{ textAlign: 'center', animation: 'fade-in 0.5s ease' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <Mail size={32} color="#4ADE80" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>Check your inbox</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', lineHeight: '1.6' }}>
              We've sent a password reset link to <br/> <strong style={{ color: '#FFF' }}>{email}</strong>
            </p>
            <button 
              onClick={() => setView('request_link')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              Try different email
            </button>
          </div>
        )}

        {/* VIEW: Reset Password (Enter New) */}
        {view === 'reset_password' && (
          <div style={{ animation: 'fade-in 0.5s ease' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(124, 77, 255, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(124, 77, 255, 0.2)' }}>
              <Lock size={24} color="var(--primary)" />
            </div>

            <h1 style={{ textAlign: 'center', color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Set New Password</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Please create a secure password.</p>

            {error && (
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: '#F87171', fontSize: '14px' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>New Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '14px 16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', borderRadius: '12px', color: '#FFF', fontSize: '15px', outline: 'none' }}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '14px 16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', borderRadius: '12px', color: '#FFF', fontSize: '15px', outline: 'none' }}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, rgba(178, 139, 255, 0.8) 0%, rgba(109, 40, 217, 0.8) 100%)', border: '1px solid rgba(178, 139, 255, 0.3)', borderRadius: '12px', color: '#FFF', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '8px' }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* VIEW: Success Password Reset */}
        {view === 'success_password_reset' && (
          <div style={{ textAlign: 'center', animation: 'fade-in 0.5s ease' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <CheckCircle size={32} color="#4ADE80" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>Password Updated</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', lineHeight: '1.6' }}>
              Your password has been successfully changed.<br/>
              You can now log in to the application.
            </p>
            <Link 
              to="/"
              style={{ display: 'block', width: '100%', padding: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#FFF', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
