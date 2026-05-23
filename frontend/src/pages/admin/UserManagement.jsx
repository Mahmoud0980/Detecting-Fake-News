import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, UserX, UserCheck, Trash2, Edit3, Plus, X, Lock, Key } from 'lucide-react';
import '../../Admin.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add User Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [status, setStatus] = useState('active');

  // Edit User States
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('user');
  const [editStatus, setEditStatus] = useState('active');

  const token = localStorage.getItem('admin_token');

  const fetchUsers = () => {
    setLoading(true);
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=get_users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          setError('انتهت جلسة العمل. يرجى تسجيل الدخول مجدداً.');
          return [];
        }
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('حدث خطأ أثناء تحميل المستخدمين.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    setError('');
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=add_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username, email, password, role, status })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsername('');
          setEmail('');
          setPassword('');
          setRole('user');
          setStatus('active');
          setShowAddForm(false);
          fetchUsers();
        } else {
          setError('فشل إضافة المستخدم. قد يكون اسم المستخدم أو البريد مسجلاً مسبقاً.');
        }
      })
      .catch(() => setError('خطأ في الاتصال بالخادم.'));
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setError('');
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=update_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: editingUser.id,
        username: editUsername,
        email: editEmail,
        role: editRole,
        status: editStatus,
        password: editPassword || null
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEditingUser(null);
          setEditPassword('');
          fetchUsers();
        } else {
          setError('فشل تعديل بيانات المستخدم.');
        }
      })
      .catch(() => setError('خطأ في الاتصال بالخادم.'));
  };

  const handleToggleStatus = (userItem) => {
    setError('');
    const newStatus = userItem.status === 'active' ? 'disabled' : 'active';
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=update_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: userItem.id,
        username: userItem.username,
        email: userItem.email,
        role: userItem.role,
        status: newStatus
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchUsers();
        } else {
          setError('فشل تغيير حالة الحساب.');
        }
      })
      .catch(() => setError('خطأ في الاتصال بالخادم.'));
  };

  const handleDeleteUser = (id, uName) => {
    if (uName === 'admin') {
      alert('لا يمكن حذف حساب المسؤول الرئيسي الرئيسي!');
      return;
    }
    if (window.confirm(`هل أنت متأكد من حذف حساب المستخدم "${uName}" بشكل نهائي؟`)) {
      fetch(`https://jorjekhan-001-site1.site4future.com/api/admin.php?action=delete_user&id=${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            fetchUsers();
          } else {
            setError('فشل حذف حساب المستخدم.');
          }
        })
        .catch(() => setError('خطأ في الاتصال بالخادم.'));
    }
  };

  const startEdit = (userItem) => {
    setEditingUser(userItem);
    setEditUsername(userItem.username);
    setEditEmail(userItem.email);
    setEditRole(userItem.role);
    setEditStatus(userItem.status);
    setEditPassword('');
  };

  return (
    <div>
      {/* Intro Header */}
      <div className="page-header">
        <div className="page-title-box">
           <p className="page-subtitle indigo">لوحة التحكم الفنية</p>
           <h2 className="page-title">إدارة حسابات الأعضاء</h2>
        </div>
        <button className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          <span>{showAddForm ? 'إلغاء الإضافة' : 'إضافة مستخدم جديد'}</span>
        </button>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#fee2e2',
          color: '#ef4444',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.1)'
        }}>
          <UserX size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <div className="glass-card animate-fade" style={{ padding: '40px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div className="info-icon indigo" style={{ background: '#3b82f6', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}>
                  <Plus size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>إنشاء حساب مستخدم جديد</h3>
          </div>

          <form onSubmit={handleAddUser} className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'end' }}>
            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label>اسم المستخدم</label>
              <div className="input-wrapper">
                  <span className="input-icon" style={{ right: 'auto', left: '16px' }}><User size={18} /></span>
                  <input 
                      type="text" 
                      placeholder="اسم المستخدم بالإنجليزية..."
                      value={username} 
                      onChange={e => setUsername(e.target.value)}
                      required 
                  />
              </div>
            </div>
            
            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label>البريد الإلكتروني</label>
              <div className="input-wrapper">
                  <span className="input-icon" style={{ right: 'auto', left: '16px' }}><Mail size={18} /></span>
                  <input 
                      type="email" 
                      placeholder="example@mail.com"
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      required 
                  />
              </div>
            </div>

            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label>كلمة المرور</label>
              <div className="input-wrapper">
                  <span className="input-icon" style={{ right: 'auto', left: '16px' }}><Lock size={18} /></span>
                  <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      required 
                  />
              </div>
            </div>

            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label>الصلاحية</label>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', fontWeight: 600, outline: 'none' }}
              >
                <option value="user">مستخدم عادي</option>
                <option value="admin">مسؤول نظام (أدمن)</option>
              </select>
            </div>

            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label>حالة الحساب</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', fontWeight: 600, outline: 'none' }}
              >
                <option value="active">نشط</option>
                <option value="disabled">معطل</option>
              </select>
            </div>

            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <button type="submit" className="btn-premium" style={{ width: '100%' }}>
                تأكيد الإضافة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal Overlay */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card animate-fade" style={{ width: '90%', maxWidth: '550px', padding: '40px', background: 'white', border: '1px solid rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="info-icon indigo" style={{ background: '#f59e0b', boxShadow: '0 4px 15px rgba(245,158,11,0.3)' }}>
                    <Edit3 size={20} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>تعديل حساب: {editingUser.username}</h3>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>اسم المستخدم</label>
                <div className="input-wrapper">
                    <span className="input-icon" style={{ right: 'auto', left: '16px' }}><User size={18} /></span>
                    <input 
                        type="text" 
                        value={editUsername} 
                        onChange={e => setEditUsername(e.target.value)}
                        required 
                    />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>البريد الإلكتروني</label>
                <div className="input-wrapper">
                    <span className="input-icon" style={{ right: 'auto', left: '16px' }}><Mail size={18} /></span>
                    <input 
                        type="email" 
                        value={editEmail} 
                        onChange={e => setEditEmail(e.target.value)}
                        required 
                    />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>كلمة مرور جديدة (اتركها فارغة لعدم التغيير)</label>
                <div className="input-wrapper">
                    <span className="input-icon" style={{ right: 'auto', left: '16px' }}><Key size={18} /></span>
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        value={editPassword} 
                        onChange={e => setEditPassword(e.target.value)}
                    />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>الصلاحية</label>
                  <select 
                    value={editRole} 
                    onChange={e => setEditRole(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', fontWeight: 600, outline: 'none' }}
                  >
                    <option value="user">مستخدم عادي</option>
                    <option value="admin">مسؤول نظام (أدمن)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>الحالة</label>
                  <select 
                    value={editStatus} 
                    onChange={e => setEditStatus(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', fontWeight: 600, outline: 'none' }}
                  >
                    <option value="active">نشط</option>
                    <option value="disabled">معطل</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="submit" className="btn-premium" style={{ flex: 1 }}>
                  حفظ التعديلات
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)} 
                  className="btn-delete" 
                  style={{ background: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '8px', padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-card table-container" style={{ padding: 0 }}>
        <div className="table-header">
          <h3 className="table-title">قائمة الحسابات المسجلة</h3>
          <span className="table-count">{users.length} مستخدم فعال</span>
        </div>
        
        <div className="table-wrapper">
          <table className="premium-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم المستخدم</th>
                <th>البريد الإلكتروني</th>
                <th style={{ textAlign: 'center' }}>نوع الحساب</th>
                <th style={{ textAlign: 'center' }}>الحالة</th>
                <th style={{ textAlign: 'center' }}>تاريخ التسجيل</th>
                <th style={{ textAlign: 'left' }}>التحكم</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>جاري تحميل الحسابات...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>لا يوجد أي حسابات مسجلة بعد.</td></tr>
              ) : users.map((userItem, idx) => (
                <tr key={userItem.id}>
                  <td>{(idx + 1).toString().padStart(2, '0')}</td>
                  <td>
                    <div className="td-flex">
                        <div className="td-icon" style={{ background: userItem.role === 'admin' ? '#dbeafe' : '#f1f5f9', color: userItem.role === 'admin' ? '#1e3a8a' : '#64748b' }}>
                            <User size={18} />
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: 800 }}>{userItem.username}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500, color: '#475569' }}>{userItem.email}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={userItem.role === 'admin' ? 'td-badge-indigo' : 'td-badge-gray'} style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: userItem.role === 'admin' ? '#e0f2fe' : '#f1f5f9',
                      color: userItem.role === 'admin' ? '#0369a1' : '#475569'
                    }}>
                      {userItem.role === 'admin' ? 'مسؤول (أدمن)' : 'عضو'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: userItem.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: userItem.status === 'active' ? '#065f46' : '#991b1b'
                    }}>
                      {userItem.status === 'active' ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    {new Date(userItem.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleToggleStatus(userItem)}
                        className="btn-status"
                        style={{
                          background: 'transparent',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          color: userItem.status === 'active' ? '#ef4444' : '#10b981'
                        }}
                        title={userItem.status === 'active' ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                      >
                        {userItem.status === 'active' ? (
                          <>
                            <UserX size={16} />
                            <span>تعطيل</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={16} />
                            <span>تفعيل</span>
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => startEdit(userItem)}
                        className="btn-edit"
                        style={{
                          background: 'transparent',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#f59e0b',
                          cursor: 'pointer'
                        }}
                        title="تعديل"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button 
                        onClick={() => handleDeleteUser(userItem.id, userItem.username)}
                        className="btn-delete"
                        disabled={userItem.username === 'admin'}
                        style={{ opacity: userItem.username === 'admin' ? 0.3 : 1 }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
