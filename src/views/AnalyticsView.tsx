import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Filter,
} from 'lucide-react';
import { Subject } from '../types';

export const AnalyticsView: React.FC = () => {
  const { assessments, students, skills, teacherProfile } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<'ALL' | Subject>('ALL');

  // Filter assessments by subject if selected
  const filteredAssessments = assessments.filter((a) => {
    if (selectedSubject === 'ALL') return true;
    return a.subject === selectedSubject;
  });

  // Calculate pre vs post paired differences for each student
  const studentGrowth: {
    studentCode: string;
    preScore: number | null;
    postScore: number | null;
    delta: number | null;
    status: 'IMPROVED' | 'SAME' | 'DECREASED' | 'INCOMPLETE';
  }[] = [];

  const uniqueStudentCodes = Array.from(new Set(students.map((s) => s.code)));

  uniqueStudentCodes.forEach((code) => {
    const stdRecords = filteredAssessments.filter((a) => a.studentCode === code);
    const preRec = stdRecords.find((a) => a.testType === 'PRE');
    const postRec = stdRecords.find((a) => a.testType === 'POST');

    const pre = preRec ? preRec.score : null;
    const post = postRec ? postRec.score : null;
    let delta = null;
    let status: 'IMPROVED' | 'SAME' | 'DECREASED' | 'INCOMPLETE' = 'INCOMPLETE';

    if (pre !== null && post !== null) {
      delta = post - pre;
      if (delta > 0) status = 'IMPROVED';
      else if (delta === 0) status = 'SAME';
      else status = 'DECREASED';
    }

    studentGrowth.push({
      studentCode: code,
      preScore: pre,
      postScore: post,
      delta,
      status,
    });
  });

  const validPairs = studentGrowth.filter((s) => s.delta !== null);
  const sampleSizeN = validPairs.length;

  const improvedCount = validPairs.filter((s) => s.status === 'IMPROVED').length;
  const sameCount = validPairs.filter((s) => s.status === 'SAME').length;
  const decreasedCount = validPairs.filter((s) => s.status === 'DECREASED').length;

  // Average growth
  const avgDelta = sampleSizeN > 0
    ? Math.round((validPairs.reduce((acc, s) => acc + (s.delta || 0), 0) / sampleSizeN) * 10) / 10
    : 0;

  // Skills needing more support: skills with pre/post average < 65%
  const skillsNeedingSupport = skills.filter((sk) => {
    const skRecs = assessments.filter((a) => a.skillCode === sk.code);
    if (skRecs.length === 0) return false;
    const avg = skRecs.reduce((sum, r) => sum + r.score, 0) / skRecs.length;
    return avg < 65;
  });

  return (
    <div className="space-y-6">
      {/* Header with Scientific Disclaimer */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Thống kê Đo lường & Minh chứng Sư phạm Thực tế
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dữ liệu khảo sát Lớp 1A3 ({teacherProfile.schoolName}). Cỡ mẫu thực nghiệm: <strong>n = {sampleSizeN}</strong> học sinh có đủ bài kiểm tra trước–sau.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 shrink-0">
            <button
              onClick={() => setSelectedSubject('ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Cả hai môn
            </button>
            <button
              onClick={() => setSelectedSubject('TOAN')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'TOAN' ? 'bg-sky-100 text-sky-900 font-semibold' : 'hover:text-sky-900'
              }`}
            >
              Toán
            </button>
            <button
              onClick={() => setSelectedSubject('TIENG_VIET')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'TIENG_VIET' ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'hover:text-emerald-900'
              }`}
            >
              Tiếng Việt
            </button>
          </div>
        </div>

        {/* Scientific Rigor Disclaimer */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-600">
          <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <span>
            <strong>Ghi nhận phương pháp luận nghiên cứu:</strong> Kết quả đo lường phản ánh sự biến thiên năng lực của học sinh Lớp 1A3 trong bối cảnh học tập thích ứng; không khẳng định mối quan hệ nhân quả tuyệt đối mà là minh chứng cho quá trình hỗ trợ cá nhân hóa của cô giáo.
          </span>
        </div>
      </div>

      {sampleSizeN === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-2xs">
          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Chưa có đủ cặp dữ liệu Trước – Sau (n = 0)
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
            Hệ thống không tự sinh phần trăm ảo khi dữ liệu trống. Để xem biểu đồ so sánh, cô hãy vào mục "Khảo sát đầu vào" để nhập kết quả Đề A (Đầu vào) và Đề B (Sau can thiệp) cho các em học sinh.
          </p>
        </div>
      ) : (
        <>
          {/* Top KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Cỡ mẫu thực tế</span>
              <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">n = {sampleSizeN}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">học sinh có đủ 2 bài</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
              <span className="text-xs text-emerald-800 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" /> Số em tiến bộ
              </span>
              <p className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
                {improvedCount} <span className="text-sm font-normal text-emerald-600">({Math.round((improvedCount / sampleSizeN) * 100)}%)</span>
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">điểm Post &gt; Pre</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                <Minus className="w-4 h-4 text-slate-400" /> Không thay đổi
              </span>
              <p className="text-2xl font-bold text-slate-700 mt-1 tabular-nums">
                {sameCount} <span className="text-sm font-normal text-slate-500">({Math.round((sameCount / sampleSizeN) * 100)}%)</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">duy trì ổn định</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                <Clock className="w-4 h-4 text-sky-600" /> Tiết kiệm thời gian
              </span>
              <p className="text-2xl font-bold text-sky-700 mt-1 tabular-nums">
                ~{teacherProfile.prepTimeSavedHours}h
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">chuẩn bị học liệu / tuần</p>
            </div>
          </div>

          {/* Visual Pre vs Post Growth Bars */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              So sánh Trực quan Kết quả Trước (Đề A) và Sau (Đề B) từng học sinh
            </h3>

            <div className="space-y-3">
              {validPairs.map((s) => {
                const pre = s.preScore || 0;
                const post = s.postScore || 0;
                const delta = s.delta || 0;

                return (
                  <div key={s.studentCode} className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800">{s.studentCode}</span>
                      <div className="flex items-center gap-2 font-bold tabular-nums">
                        <span className="text-slate-600">Trước: {pre}%</span>
                        <span>→</span>
                        <span className="text-emerald-700">Sau: {post}%</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                          delta > 0 ? 'bg-emerald-100 text-emerald-800' : delta === 0 ? 'bg-slate-200 text-slate-700' : 'bg-red-100 text-red-800'
                        }`}>
                          {delta > 0 ? `+${delta}%` : `${delta}%`}
                        </span>
                      </div>
                    </div>

                    {/* Comparative Dual Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] text-slate-400">Đầu vào:</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${pre}%` }}></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] text-slate-400">Sau CT:</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${post}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Insights: Skills Needing Continued Support */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Kỹ năng Cốt lõi Cần Tiếp tục Hỗ trợ (Theo số liệu thực tế)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Các kỹ năng có tỷ lệ hoàn thành thấp hơn được hệ thống đề xuất cô Thủy tăng cường các bài tập mức Mầm trong tuần tới.
            </p>

            {skillsNeedingSupport.length === 0 ? (
              <p className="text-xs text-emerald-700 font-semibold">
                ✓ Tất cả các kỹ năng đã dạy đều đạt trên ngưỡng 65%. Học sinh lớp 1A3 có tiến độ rất tích cực!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skillsNeedingSupport.map((sk) => (
                  <div key={sk.id} className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-amber-900">{sk.code}</span>
                      <span className="text-[10px] text-amber-700">{sk.subject === 'TOAN' ? 'Toán' : 'Tiếng Việt'}</span>
                    </div>
                    <p className="font-semibold text-slate-800">{sk.name}</p>
                    <p className="text-[11px] text-slate-600 mt-1">{sk.objective}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
