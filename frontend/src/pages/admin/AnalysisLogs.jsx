import React, { useState, useEffect } from 'react';
import { Calendar, Search, ExternalLink, Activity } from 'lucide-react';

const AnalysisLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jorjekhan-001-site1.site4future.com/api/admin.php?action=get_logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      'trusted': 'bg-green-50 text-green-700 border-green-100',
      'fake': 'bg-red-50 text-red-700 border-red-100',
      'uncertain': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'invalid': 'bg-gray-50 text-gray-700 border-gray-100'
    };
    const labels = {
      'trusted': 'موثوق',
      'fake': 'كاذب',
      'uncertain': 'غير مؤكد',
      'invalid': 'غير صالح'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Activity size={20} className="text-blue-600" />
          سجلات عمليات التحليل
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">التاريخ</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">النص (أول 50 حرف)</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">المصدر</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">النتيجة</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">الثقة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">جاري التحميل...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">لا توجد عمليات تحليل مسجلة</td></tr>
            ) : logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(log.created_at).toLocaleDateString('ar-EG')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1 max-w-[300px]">
                    {log.input_text}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {log.source_url ? (
                    <a href={log.source_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                      <ExternalLink size={14} />
                      رابط
                    </a>
                  ) : <span className="text-gray-300">-</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(log.result_status)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`font-bold ${log.confidence_score > 70 ? 'text-green-600' : log.confidence_score > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {log.confidence_score}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisLogs;
