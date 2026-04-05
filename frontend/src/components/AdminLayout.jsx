import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Search, 
  Link2, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'الإحصائيات', path: '/admin', icon: LayoutDashboard },
    { name: 'سجلات التحليل', path: '/admin/logs', icon: Search },
    { name: 'الكلمات المفتاحية', path: '/admin/keywords', icon: MessageSquare },
    { name: 'المصادر الموثوقة', path: '/admin/sources', icon: Link2 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-l border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            لوحة الإدارة
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
                {isActive && <ChevronRight size={16} className="mr-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-100 p-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              {navItems.find(i => i.path === location.pathname)?.name || 'الرئيسية'}
            </h1>
            <div className="text-sm text-gray-500">
                مرحباً، مدير النظام
            </div>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
