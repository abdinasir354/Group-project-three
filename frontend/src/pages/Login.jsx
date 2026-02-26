import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/student/login', { email, password });
      login(response.data.student, response.data.token);
      navigate('/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '120px 24px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b1220',
      }}
    >
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div
          style={{
            background: '#1c1c28',
            border: '1px solid #2a2a3a',
            borderRadius: '14px',
            padding: '30px',
          }}
        >

          <div style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <ShieldCheck style={{ width: 18, height: 18, color: '#818cf8' }} />
              <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 700 }}>Secure access</span>
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: 'white', margin: 0 }}>Login</h2>
            <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 6 }}>Enter your credentials to continue.</p>
          </div>

          {error && (
            <div
              style={{
                background: '#2a1a1a',
                border: '1px solid #7f1d1d',
                borderRadius: '8px',
                marginBottom: 18,
                padding: '10px 12px',
                color: '#f87171',
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                >
                  <Mail style={{ width: 16, height: 16 }} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="handmade-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                >
                  <Lock style={{ width: 16, height: 16 }} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="handmade-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#6366f1',
                borderRadius: '8px',
                width: '100%',
                border: 'none',
                padding: '12px',
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: 'white',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: loading ? '#4f46e5' : '#6366f1',
              }}
            >
              {loading ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : 'Login'}
            </button>
          </form>

          <p style={{ marginTop: 18, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 700 }}>
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
