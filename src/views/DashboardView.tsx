import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  BookOpen,
  CheckCircle2,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react';
import { TIER_CONFIG } from '../utils/adaptiveEngine';

export const DashboardView: React.FC = () => {
  const {
    teacherProfile,
    students,
    skills,
    tasks,
    assessments,
    setCurrentView,
    loadSample1A3,
  } = useApp();

  const totalStudents = students.length;
  const activeSkillsCount = skills.filter((s) => s.taughtStatus).length;
  const totalTasks = tasks.length;

  // Real students with assessment data
  const surveyedStudentCodes = new Set(assessments.map((a) => a.studentCode));
  const surveyedCount = surveyedStudentCodes.size;

  // Calculate tier distribution for surveyed students
  const tierCounts = { MAM: 0, CHOI: 0, HOA: 0, INSUFFICIENT_DATA: 0 };
  students.forEach((std) => {
    const stdRecords = assessments.filter((a) => a.studentCode === std.code);
    if (stdRecords.length < 5) {
      tierCounts.INSUFFICIENT_DATA++;
    } else {
      const avg = stdRecords.reduce((sum, r) => sum + r.score, 0) / stdRecords.length;
      const indep = stdRecords.filter((r) => r.isIndependent).length;
      if (avg < 50) tierCounts.MAM++;
      else if (avg >= 80 && indep >= 2) tierCounts.HOA++;
      else tierCounts.CHOI++;
    }
  });

  // Calculate pre/post comparison if any
  const preAssessments = assessments.filter((a) => a.testType === 'PRE');
  const postAssessments = assessments.filter((a) => a.testType === 'POST');
  const avgPre = preAssessments.length > 0
    ? Math.round(preAssessments.reduce((acc, r) => acc + r.score, 0) / preAssessments.length)
    : null;
  const avgPost = postAssessments.length > 0
    ? Math.round(postAssessments.reduce((acc, r) => acc + r.score, 0) / postAssessments.length)
    : null;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-2">
            <span className="uppercase tracking-wider">Trung tâm Giáo viên AI</span>
            <span>·</span>
            <span>Chương trình GDPT 2018 Lớp 1</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
            Mỗi Em Một Bước AI
          </h2>

          <p className="text-sm text-sky-100/90 leading-relaxed mb-6">
            Hệ sinh thái học tập thích ứng hỗ trợ cô <strong className="text-white">{teacherProfile.teacherName}</strong> cá nhân hóa lộ trình học Toán & Tiếng Việt cho học sinh lớp <strong className="text-white">{teacherProfile.experimentalClass}</strong> ({teacherProfile.schoolName}, {teacherProfile.location}).
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentView('diagnostics')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              Bắt đầu khảo sát
            </button>

            <button
              onClick={() => setCurrentView('ai_workshop')}
              className="px-4 py-2 bg-white hover:bg-sky-50 text-sky-900 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              Xưởng học liệu AI
            </button>

            <button
              onClick={() => setCurrentView('skills_map')}
              className="px-4 py-2 bg-sky-800/80 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg border border-sky-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Bản đồ tiến bộ
            </button>
          </div>
        </div>

        {/* Subtle decorative background graphic */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Real Student Count */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Sĩ số thực tế</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {totalStudents}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Lớp {teacherProfile.experimentalClass}
          </p>
        </div>

        {/* KPI 2: Active Tracked Skills */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Kỹ năng đang dạy</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {activeSkillsCount}/{skills.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Toán & Tiếng Việt
          </p>
        </div>

        {/* KPI 3: Surveyed Count */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Học sinh đã KS</span>
            <BarChart3 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {surveyedCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {totalStudents > 0 ? `${Math.round((surveyedCount / totalStudents) * 100)}% tổng số` : 'Chưa có HS'}
          </p>
        </div>

        {/* KPI 4: Tasks Count */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Nhiệm vụ đã giao</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {totalTasks}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Phiên 5-10 phút
          </p>
        </div>

        {/* KPI 5: Valid Assessments Recorded */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Lượt đánh giá</span>
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {assessments.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Khảo sát thực tế
          </p>
        </div>

        {/* KPI 6: Time Saved for Teacher */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Tiết kiệm soạn bài</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 tabular-nums">
            ~{teacherProfile.prepTimeSavedHours}h
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            mỗi tuần với AI
          </p>
        </div>
      </div>

      {/* If No Students Yet: Action Helper */}
      {totalStudents === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Chưa có danh sách học sinh Lớp {teacherProfile.experimentalClass}
              </h4>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                Để tôn trọng tính thực tế và minh chứng khoa học, hệ thống không tự áp đặt một sĩ số cố định. Cô có thể thêm mã học sinh thực tế (H01, H02...) hoặc tải nhanh danh sách 32 em mẫu để thử nghiệm giao diện.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={loadSample1A3}
              className="px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg cursor-pointer transition-colors"
            >
              Nạp mẫu 32 em (H01-H32)
            </button>
            <button
              onClick={() => setCurrentView('students')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg cursor-pointer transition-colors"
            >
              Nhập mã thực tế
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Real Progress Evidence vs "Chưa có dữ liệu" */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Real Progress Chart or Empty Notice */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-600" />
                Tiến độ Thích ứng và Tăng trưởng Năng lực
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Đánh giá theo chuẩn GDPT 2018 qua các mốc khảo sát thực tế (Đề A & Đề B)
              </p>
            </div>

            <button
              onClick={() => setCurrentView('diagnostics')}
              className="text-xs text-sky-700 font-semibold hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              Nhập khảo sát <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {assessments.length === 0 ? (
            /* Explicit requirement: Display "Chưa có dữ liệu thực tế" if no surveys */
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                Chưa có dữ liệu thực tế
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
                Hệ thống tuân thủ đạo đức nghiên cứu: không tự vẽ biểu đồ hay tạo điểm số giả lập. Cô vui lòng bấm vào nút dưới đây để nhập kết quả khảo sát đầu vào cho học sinh.
              </p>
              <button
                onClick={() => setCurrentView('diagnostics')}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Bắt đầu khảo sát chẩn đoán đầu vào
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Pre vs Post Comparison Strip */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500">Khảo sát Đầu vào (Đề A)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-slate-800 tabular-nums">
                      {avgPre !== null ? `${avgPre}%` : 'Chưa có'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ({preAssessments.length} bài)
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Khảo sát Sau can thiệp (Đề B)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-emerald-700 tabular-nums">
                      {avgPost !== null ? `${avgPost}%` : 'Chưa có'}
                    </span>
                    {avgPre !== null && avgPost !== null && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        +{avgPost - avgPre}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tier Distribution Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Phân bố Tầng Thích ứng Lớp 1A3 (Quy tắc tự động)
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    <span className="text-xs font-medium text-amber-900 block">MẦM</span>
                    <span className="text-xl font-bold text-amber-700 tabular-nums">{tierCounts.MAM}</span>
                    <span className="text-[10px] text-amber-600 block">&lt;50% điểm</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    <span className="text-xs font-medium text-emerald-900 block">CHỒI</span>
                    <span className="text-xl font-bold text-emerald-700 tabular-nums">{tierCounts.CHOI}</span>
                    <span className="text-[10px] text-emerald-600 block">50% - 80%</span>
                  </div>
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-center">
                    <span className="text-xs font-medium text-sky-900 block">HOA</span>
                    <span className="text-xl font-bold text-sky-700 tabular-nums">{tierCounts.HOA}</span>
                    <span className="text-[10px] text-sky-600 block">≥80% độc lập</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <span className="text-xs font-medium text-slate-700 block">CHƯA ĐỦ</span>
                    <span className="text-xl font-bold text-slate-600 tabular-nums">{tierCounts.INSUFFICIENT_DATA}</span>
                    <span className="text-[10px] text-slate-500 block">&lt;5 lần KS</span>
                  </div>
                </div>
              </div>

              {/* Recent assessment records table */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700">Các lượt đánh giá gần nhất</span>
                  <span className="tabular-nums">Tổng {assessments.length} bản ghi</span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="py-2 px-3">Mã HS</th>
                        <th className="py-2 px-3">Kỹ năng</th>
                        <th className="py-2 px-3">Đề</th>
                        <th className="py-2 px-3">Điểm</th>
                        <th className="py-2 px-3">Hình thức</th>
                        <th className="py-2 px-3">Ngày</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {assessments.slice(-4).reverse().map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-900">{rec.studentCode}</td>
                          <td className="py-2 px-3 text-slate-600">{rec.skillCode}</td>
                          <td className="py-2 px-3 text-slate-500">{rec.testForm === 'FORM_A' ? 'Đề A' : 'Đề B'}</td>
                          <td className="py-2 px-3 font-bold tabular-nums text-slate-900">{rec.score}%</td>
                          <td className="py-2 px-3 text-slate-600">
                            {rec.isIndependent ? 'Tự làm độc lập' : 'Có cô hướng dẫn'}
                          </td>
                          <td className="py-2 px-3 text-slate-400 tabular-nums">{rec.assessmentDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1/3): Pedagogical Guardrails & Author Card */}
        <div className="space-y-4">
          {/* Author Badge Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Thông tin Giáo viên nghiên cứu
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold text-base flex items-center justify-center border border-emerald-300">
                {teacherProfile.avatarUrl ? (
                  <img
                    src={teacherProfile.avatarUrl}
                    alt={teacherProfile.teacherName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  'T'
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Cô {teacherProfile.teacherName}</p>
                <p className="text-xs text-slate-600">{teacherProfile.schoolName}</p>
                <p className="text-[11px] text-slate-500">{teacherProfile.location}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Lớp thực nghiệm: <strong>{teacherProfile.experimentalClass}</strong></span>
              <span>Năm học: <strong>{teacherProfile.schoolYear}</strong></span>
            </div>
          </div>

          {/* Sư phạm & An toàn AI Notice */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-2.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Quy chuẩn Bảo mật & Đạo đức AI
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Mô hình AI chỉ tiếp nhận mục tiêu sư phạm chung của chương trình lớp 1; tuyệt đối không tiếp cận mã, tên, giọng nói hay dữ liệu cá nhân của các em học sinh.
            </p>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Mô hình AI máy chủ:</span>
              <span className="font-semibold text-slate-700">Gemini 3.8 Flash (Server-side)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Xác thực toán học:</span>
              <span className="font-semibold text-emerald-700">Kiểm chứng mã nguồn 100%</span>
            </div>
          </div>

          {/* Quick Step Guide */}
          <div className="bg-sky-50/60 p-5 rounded-xl border border-sky-100 text-xs">
            <h4 className="font-bold text-sky-900 mb-2">Quy trình 4 bước của Cô Thủy:</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-sky-800">
              <li>Nhập mã học sinh Lớp 1A3 (H01, H02...).</li>
              <li>Khảo sát chẩn đoán đầu vào (Đề A).</li>
              <li>Hệ thống xếp tầng Mầm - Chồi - Hoa & Giao bài.</li>
              <li>Khảo sát đầu ra (Đề B) và xuất báo cáo minh chứng.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
