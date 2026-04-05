import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('admin_token', data.token);
                navigate('/admin');
            } else {
                setError('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        } catch (err) {
            setError('خطأ في الاتصال بالخادم');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" dir="rtl">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">تسجيل الدخول للإدارة</h2>
                    <p className="text-gray-500 mt-2">يرجى إدخال بيانات الاعتماد الخاصة بك</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                                <User size={20} />
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="admin"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                                <Lock size={20} />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-[1.02]"
                    >
                        تسجيل الدخول
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
