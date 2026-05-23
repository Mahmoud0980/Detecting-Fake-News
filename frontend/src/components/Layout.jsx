import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('user_token');
  const userInfoStr = localStorage.getItem('user_info');
  const user = userInfoStr ? JSON.parse(userInfoStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  return (
    <div className="layout-wrapper">
      <header>
        <div className="container">
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem', margin: 0, padding: 0 }}>
              <li>
                <NavLink to="/">الرئيسية</NavLink>
              </li>
              <li>
                <NavLink to="/detector">المحلل الذكي</NavLink>
              </li>
              <li>
                <NavLink to="/about">عن المشروع</NavLink>
              </li>
              <li>
                <NavLink to="/contact">اتصل بنا</NavLink>
              </li>
            </ul>

            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', alignItems: 'center', margin: 0, padding: 0 }}>
              {token && user ? (
                <>
                  <li style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
                    مرحباً، <span style={{ color: 'white', fontWeight: 700 }}>{user.username}</span>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <NavLink to="/admin" style={{ color: '#3b82f6', fontWeight: 700 }}>لوحة الإدارة</NavLink>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={handleLogout}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#ef4444';
                        e.target.style.borderColor = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                      }}
                    >
                      تسجيل خروج
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" style={{ color: 'white' }}>تسجيل الدخول</NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/register" 
                      style={{ 
                        background: 'var(--accent-color)', 
                        padding: '6px 15px', 
                        borderRadius: '6px', 
                        color: 'white',
                        fontWeight: 700
                      }}
                    >
                      إنشاء حساب
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer>
        <div className="container">
          <p>© 2026 كاشف الأخبار الكاذبة - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
