import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Calendar,
  Layers,
  History,
  FileCheck,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Subject } from '../types';

export const DiagnosticsView: React.FC = () => {
  const {
    students,
    skills,
    assessments,
    addAssessment,
    updateAssessmentScore,
    deleteAssessment,
  } = useApp();

  // Form state
  const [selectedStudentCode, setSelectedStudentCode] = useState<string>('');
  const [selectedSkillCode, setSelectedSkillCode] = useState<string>('TOAN_01');
  const [testType, setTestType] = useState<'PRE' | 'POST' | 'PERIODIC'>('PRE');
  const [testForm, setTestForm] = useState<'FORM_A' | 'FORM_B'>('FORM_A');
  const [score, setScore] = useState<number>(75);
  const [isIndependent, setIsIndependent] = useState<boolean>(true);
  const [assessmentDate, setAssessmentDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [rubricNotes, setRubricNotes] = useState<string>('');

  // Edit modal
  const [editingAssessment, setEditingAssessment] = useState<{ id: string; oldScore: number } | null>(null);
  const [newScoreInput, setNewScoreInput] = useState<number>(80);
  const [editReasonInput, setEditReasonInput] = useState<string>('');

  // Filter
  const [filterStudent, setFilterStudent] = useState<string>('');
  const [filterSkill, setFilterSkill] = useState<string>('ALL');

  // Filter only taught skills
  const taughtSkills = skills.filter((s) => s.taughtStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentCode) {
      alert('Vui lòng chọn mã học sinh!');
      return;
    }

    const currentSkill = skills.find((s) => s.code === selectedSkillCode);
    const student = students.find((s) => s.code === selectedStudentCode);

    if (!currentSkill || !student) return;

    addAssessment({
      studentId: student.id,
      studentCode: selectedStudentCode,
      skillCode: selectedSkillCode,
      subject: currentSkill.subject,
      testType,
      testForm,
      assessmentDate,
      score: Number(score),
      isIndependent,
      rubricNotes: rubricNotes.trim() || undefined,
    });

    setRubricNotes('');
    alert(`Đã ghi nhận kết quả khảo sát cho học sinh ${selectedStudentCode}!`);
  };

  const handleSaveEdit = () => {
    if (!editingAssessment) return;
    if (!editReasonInput.trim()) {
      alert('Vui lòng nhập lý do điều chỉnh điểm để lưu vào nhật ký minh chứng.');
      return;
    }

    updateAssessmentScore(editingAssessment.id, Number(newScoreInput), editReasonInput.trim());
    setEditingAssessment(null);
    setEditReasonInput('');
  };

  const filteredAssessments = assessments.filter((a) => {
    if (filterStudent && !a.studentCode.toLowerCase().includes(filterStudent.toLowerCase())) return false;
    if (filterSkill !== 'ALL' && a.skillCode !== filterSkill) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 pb-2">
          <BarChart3 className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Khảo sát Đầu vào & Đánh giá Năng lực Thích ứng
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Ghi nhận kết quả chẩn đoán trước can thiệp (Đề A) và sau can thiệp (Đề B tương đương) để chứng minh hiệu quả tiến bộ của từng học sinh theo chuẩn Thông tư 27/2020/TT-BGDĐT.
        </p>

        {taughtSkills.length === 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Tất cả các kỹ năng đang ở trạng thái "Chưa dạy". Cô cần vào Bản đồ năng lực và bật "Đã dạy" trước khi thực hiện khảo sát.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (1/3): Assessment Entry Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Nhập Phiếu Khảo sát Mới
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Student Code */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mã học sinh <span className="text-red-500">*</span>:
              </label>
              {students.length > 0 ? (
                <select
                  value={selectedStudentCode}
                  onChange={(e) => setSelectedStudentCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden bg-white text-xs"
                  required
                >
                  <option value="">-- Chọn mã học sinh --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.code}>
                      {s.code} {s.notes ? `(${s.notes})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-amber-700 text-xs italic">
                  Chưa có học sinh. Cô hãy vào mục "Quản lý học sinh" để nạp danh sách lớp 1A3.
                </p>
              )}
            </div>

            {/* Skill */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kỹ năng khảo sát (Chỉ hiện các bài đã dạy):
              </label>
              <select
                value={selectedSkillCode}
                onChange={(e) => setSelectedSkillCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden bg-white text-xs"
              >
                {taughtSkills.map((sk) => (
                  <option key={sk.id} value={sk.code}>
                    [{sk.code}] {sk.name} ({sk.subject === 'TOAN' ? 'Toán' : 'Tiếng Việt'})
                  </option>
                ))}
              </select>
            </div>

            {/* Test Type & Equivalent Form */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Giai đoạn:</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="PRE">Đầu vào (Pre-test)</option>
                  <option value="POST">Sau can thiệp (Post-test)</option>
                  <option value="PERIODIC">Định kỳ giữa kỳ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phiên bản đề:</label>
                <select
                  value={testForm}
                  onChange={(e) => setTestForm(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="FORM_A">Đề A (Chuẩn)</option>
                  <option value="FORM_B">Đề B (Tương đương)</option>
                </select>
              </div>
            </div>

            {/* Score & Independence */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">
                  Kết quả đánh giá: <strong className="text-sky-700 text-sm tabular-nums">{score}%</strong>
                </label>
                <span className="text-[11px] text-slate-400">
                  {score >= 80 ? 'Hoàn thành tốt' : score >= 50 ? 'Hoàn thành' : 'Chưa hoàn thành'}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-sky-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0% (Cần hỗ trợ nhiều)</span>
                <span>50% (Đạt chuẩn)</span>
                <span>100% (Thành thạo)</span>
              </div>
            </div>

            {/* Independence toggle */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-slate-700 font-semibold mb-1.5">
                Mức độ độc lập khi làm bài:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsIndependent(true)}
                  className={`p-2 rounded border text-center font-semibold cursor-pointer transition-colors ${
                    isIndependent
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tự làm độc lập
                </button>
                <button
                  type="button"
                  onClick={() => setIsIndependent(false)}
                  className={`p-2 rounded border text-center font-semibold cursor-pointer transition-colors ${
                    !isIndependent
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Có cô hỗ trợ / gợi ý
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                * Mức Hoa yêu cầu học sinh đạt từ 80% trở lên qua ít nhất hai lần kiểm tra độc lập.
              </p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Ngày thực hiện:</label>
              <input
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Rubric Notes */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Ghi chú quan sát cụ thể (lỗi sai hoặc ưu điểm):
              </label>
              <input
                type="text"
                placeholder="VD: Nhầm dấu > với <; đếm thừa 1 đơn vị..."
                value={rubricNotes}
                onChange={(e) => setRubricNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={students.length === 0 || taughtSkills.length === 0}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Lưu kết quả khảo sát
            </button>
          </form>
        </div>

        {/* Right (2/3): Assessment History & Audit Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-sky-600" />
                Nhật ký Khảo sát Thực tế ({filteredAssessments.length} bản ghi)
              </h3>
              <p className="text-xs text-slate-500">
                Cho phép sửa nếu nhập nhầm và tự động lưu lịch sử chỉnh sửa để minh bạch nghiên cứu.
              </p>
            </div>

            {/* Search / Filter */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Lọc theo mã HS..."
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs w-28 bg-slate-50 focus:bg-white"
              />
              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
              >
                <option value="ALL">Tất cả kỹ năng</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.code}>{s.code}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredAssessments.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <FileCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium text-slate-600">Chưa có bản ghi khảo sát nào phù hợp.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Cô hãy chọn học sinh bên trái và bấm lưu để bắt đầu xây dựng minh chứng.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Mã HS</th>
                    <th className="py-2.5 px-3">Kỹ năng</th>
                    <th className="py-2.5 px-3">Giai đoạn</th>
                    <th className="py-2.5 px-3">Điểm</th>
                    <th className="py-2.5 px-3">Hình thức</th>
                    <th className="py-2.5 px-3">Ngày</th>
                    <th className="py-2.5 px-3">Ghi chú & Lịch sử</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssessments.slice().reverse().map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{rec.studentCode}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px]">{rec.skillCode}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          rec.testType === 'PRE' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {rec.testType === 'PRE' ? 'Đầu vào (Đề A)' : 'Sau can thiệp (Đề B)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-bold text-slate-900">{rec.score}%</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {rec.isIndependent ? (
                          <span className="text-emerald-700 font-medium">Độc lập</span>
                        ) : (
                          <span className="text-amber-700 font-medium">Hỗ trợ</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-slate-400">{rec.assessmentDate}</td>
                      <td className="py-2.5 px-3 text-slate-500">
                        <div>{rec.rubricNotes || '—'}</div>
                        {rec.editHistory && rec.editHistory.length > 0 && (
                          <span className="text-[10px] text-indigo-600 block mt-0.5" title={`Đã sửa ${rec.editHistory.length} lần: ${rec.editHistory.map(h => `${h.oldScore}% -> ${h.newScore}% (${h.reason})`).join(', ')}`}>
                            (Lịch sử: đã sửa {rec.editHistory.length} lần)
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingAssessment({ id: rec.id, oldScore: rec.score });
                              setNewScoreInput(rec.score);
                            }}
                            className="p-1 text-slate-400 hover:text-sky-700 rounded cursor-pointer"
                            title="Sửa điểm số nếu nhập nhầm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Cô có chắc chắn muốn xóa lượt đánh giá này?')) {
                                deleteAssessment(rec.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                            title="Xóa lượt đánh giá"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Edit Score with Audit Trail */}
      {editingAssessment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Điều chỉnh điểm số đã nhập
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Điểm cũ: <strong className="text-slate-800">{editingAssessment.oldScore}%</strong>. Nhập điểm mới và lý do sửa đổi để đảm bảo tính minh bạch khoa học.
            </p>

            <div className="space-y-3 text-xs mb-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Điểm số mới (%):</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newScoreInput}
                  onChange={(e) => setNewScoreInput(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lý do điều chỉnh (Bắt buộc):</label>
                <input
                  type="text"
                  placeholder="VD: Nhập nhầm phím 65 thành 55; chấm lại phiếu..."
                  value={editReasonInput}
                  onChange={(e) => setEditReasonInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingAssessment(null)}
                className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
              >
                Lưu chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
