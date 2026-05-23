import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://jorjekhan-001-site1.site4future.com/api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_info', JSON.stringify(data.user));
        // If the logged-in user is an admin, set admin token too so admin panel is directly accessible
        if (data.user.role === 'admin') {
          localStorage.setItem('admin_token', data.token);
        }
        navigate('/detector');
      } else {
        setError(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '4rem', marginBottom: '4rem' }}>
      <div className="analysis-form" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'var(--primary-color)',
            color: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.8rem'
          }}>
            🔑
          </div>
          <h2 style={{ color: 'var(--primary-color)', fontWeight: 800 }}>تسجيل الدخول</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            سجل دخولك لتتمكن من استخدام المحلل الذكي للأخبار
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>اسم المستخدم أو البريد الإلكتروني</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="أدخل اسم المستخدم أو البريد"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingRight: '40px' }}
              />
              <User
                size={18}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '14px',
                  color: '#64748b',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '40px' }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '14px',
                  color: '#64748b',
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#fee2e2',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
            <LogIn size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
          <span>ليس لديك حساب؟ </span>
          <Link to="/register" style={{ color: 'var(--accent-color)', fontWeight: 700, textDecoration: 'none' }}>
            أنشئ حساباً جديداً الآن
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
