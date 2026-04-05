import React, { useState, useEffect } from 'react';
import { Trash2, Plus, ShieldCheck, Globe } from 'lucide-react';

const SourceManagement = () => {
  const [sources, setSources] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSources = () => {
    setLoading(true);
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=get_sources')
      .then(res => res.json())
      .then(data => {
        setSources(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=add_source', {
      method: 'POST',
      body: JSON.stringify({ name: newName, domain: newDomain }),
      headers: { 'Content-Type': 'application/json' }
    }).then(() => {
      setNewName('');
      setNewDomain('');
      fetchSources();
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المصدر؟')) {
      fetch(`https://jorjekhan-001-site1.site4future.com/api/admin.php?action=delete_source&id=${id}`)
        .then(() => fetchSources());
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-green-600" />
          إضافة مصدر موثوق جديد
        </h3>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-500 mb-1">اسم المصدر (مثلاً: الجزيرة)</label>
            <input 
              type="text" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-500 mb-1">النطاق / الرابط (مثلاً: aljazeera.net)</label>
            <input 
              type="text" 
              value={newDomain} 
              onChange={e => setNewDomain(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
              required 
              placeholder="example.com"
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all font-bold">
            إضافة
          </button>
        </form>
      </div>

      {/* Sources list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold">مصادر الأخبار الموثوقة</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">#</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">اسم المصدر</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">النطاق</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400">جاري التحميل...</td></tr>
              ) : sources.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400">لا توجد مصادر موثوقة</td></tr>
              ) : sources.map((src, idx) => (
                <tr key={src.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-gray-700">{src.source_name}</td>
                  <td className="px-6 py-4 flex items-center gap-2 text-blue-600">
                    <Globe size={14} />
                    <span className="font-mono text-sm">{src.domain}</span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleDelete(src.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
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

export default SourceManagement;
