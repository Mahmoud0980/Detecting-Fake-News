import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  ShieldAlert, 
  Database,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=get_stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-20">جاري التحميل...</div>;

  const cards = [
    { 
      title: 'إجمالي التحليلات', 
      value: stats?.total_analyses || 0, 
      icon: BarChart3, 
      color: 'blue' 
    },
    { 
      title: 'الكلمات المرصودة', 
      value: stats?.total_keywords || 0, 
      icon: ShieldAlert, 
      color: 'red' 
    },
    { 
      title: 'المصادر الموثوقة', 
      value: stats?.total_sources || 0, 
      icon: Database, 
      color: 'green' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const colors = {
            blue: 'bg-blue-50 text-blue-600',
            red: 'bg-red-50 text-red-600',
            green: 'bg-green-50 text-green-600'
          };
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${colors[card.color]}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">توزيع النتائج</h3>
          <div className="space-y-4">
            {stats?.status_distribution?.map((item, idx) => (
                <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-600">{item.result_status}</span>
                        <span className="font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(item.count / stats.total_analyses) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6">نصيحة للإدارة</h3>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="text-blue-800 leading-relaxed">
                    تأكد من تحديث الكلمات المفتاحية بشكل دوري لمواكبة الإشاعات الجديدة. 
                    إضافة مصادر موثوقة يساعد في تحسين دقة النظام بشكل كبير.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
