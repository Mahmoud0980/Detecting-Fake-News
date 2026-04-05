import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Search, AlertTriangle } from 'lucide-react';

const KeywordManagement = () => {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newWeight, setNewWeight] = useState(10);
  const [loading, setLoading] = useState(true);

  const fetchKeywords = () => {
    setLoading(true);
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=get_keywords')
      .then(res => res.json())
      .then(data => {
        setKeywords(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=add_keyword', {
      method: 'POST',
      body: JSON.stringify({ keyword: newKeyword, weight: newWeight }),
      headers: { 'Content-Type': 'application/json' }
    }).then(() => {
      setNewKeyword('');
      fetchKeywords();
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الكلمة؟')) {
      fetch(`https://jorjekhan-001-site1.site4future.com/api/admin.php?action=delete_keyword&id=${id}`)
        .then(() => fetchKeywords());
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Plus size={20} className="text-blue-600" />
          إضافة كلمة مفتاحية جديدة
        </h3>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-500 mb-1">الكلمة أو العبارة</label>
            <input 
              type="text" 
              value={newKeyword} 
              onChange={e => setNewKeyword(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div className="w-32">
            <label className="block text-sm text-gray-500 mb-1">الوزن (تأثيرها)</label>
            <input 
              type="number" 
              value={newWeight} 
              onChange={e => setNewWeight(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold">
            إضافة
          </button>
        </form>
      </div>

      {/* Keywords Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">قائمة الكلمات المشبوهة</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertTriangle size={16} />
            <span>الوزن الأعلى يعني تأثيراً أقوى على تقييم "كاذب"</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">#</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">الكلمة</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">الوزن</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400">جاري التحميل...</td></tr>
              ) : keywords.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400">لا توجد كلمات مسجلة</td></tr>
              ) : keywords.map((kw, idx) => (
                <tr key={kw.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{kw.keyword}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        {kw.weight}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleDelete(kw.id)}
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

export default KeywordManagement;
