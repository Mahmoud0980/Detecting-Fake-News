import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://jorjekhan-001-site1.site4future.com/api/auth.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('تم إنشاء الحساب بنجاح! جاري تحويلك لصفحة تسجيل الدخول...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'حدث خطأ أثناء إنشاء الحساب');
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
            background: 'var(--success-color)',
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
            📝
          </div>
          <h2 style={{ color: 'var(--primary-color)', fontWeight: 800 }}>إنشاء حساب جديد</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            سجل حسابك الآن لتتمكن من فحص الأخبار والتحقق من مصداقيتها
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>اسم المستخدم</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="أدخل اسم المستخدم بالإنجليزية"
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
            <label>البريد الإلكتروني</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingRight: '40px' }}
              />
              <Mail
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

          <div className="form-group">
            <label>تأكيد كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#d1fae5',
              color: '#10b981',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: 'var(--success-color)' }}>
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
            <UserPlus size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
          <span>لديك حساب بالفعل؟ </span>
          <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 700, textDecoration: 'none' }}>
            سجل دخولك الآن
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
