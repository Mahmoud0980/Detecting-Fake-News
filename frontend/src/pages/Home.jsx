import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert("يرجى إدخال نص الخبر أولاً");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://jorjekhan-001-site1.site4future.com/api/analyze.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, url }),
        },
      );
      const data = await response.json();
      navigate("/result", { state: { result: data } });
    } catch (error) {
      console.error("Error analyzing news:", error);
      alert("حدث خطأ أثناء تحليل الخبر. تأكد من تشغيل الخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>كاشف الأخبار الكاذبة</h1>
        <p>
          نظام ذكي للتحقق من مصداقية الأخبار العربية باستخدام تحليل الكلمات
          والمصادر
        </p>
      </div>

      <div className="analysis-form">
        <form onSubmit={handleAnalyze}>
          <div className="form-group">
            <label>نص الخبر:</label>
            <textarea
              placeholder="انسخ نص الخبر هنا..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>رابط الخبر (اختياري):</label>
            <input
              type="text"
              placeholder="https://example.com/news..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "جاري التحليل..." : "تحليل الخبر"}
          </button>
        </form>
      </div>

      <div className="info-cards">
        <div className="card">
          <h3>تحليل النص</h3>
          <p>
            نقوم بفحص الكلمات المفتاحية المستخدمة في النص للكشف عن الأساليب
            المضللة.
          </p>
        </div>
        <div className="card">
          <h3>فحص المصدر</h3>
          <p>
            نتحقق من نطاق الموقع (Domain) ومقارنته بقائمة المصادر الموثوقة
            لدينا.
          </p>
        </div>
        <div className="card">
          <h3>نسبة الثقة</h3>
          <p>
            نعطيك نتيجة رقمية توضح مدى مصداقية الخبر بناءً على المعايير المحددة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
