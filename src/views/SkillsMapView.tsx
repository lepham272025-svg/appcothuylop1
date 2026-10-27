import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Edit3,
  Calendar,
  Layers,
  AlertTriangle,
  Save,
  Filter,
} from 'lucide-react';
import { Subject } from '../types';

export const SkillsMapView: React.FC = () => {
  const { skills, toggleSkillTaught, updateSkillNotes, assessments } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'ALL'>('ALL');
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredSkills = skills.filter((sk) => {
    if (selectedSubject === 'ALL') return true;
    return sk.subject === selectedSubject;
  });

  const handleEditNote = (code: string, currentNote: string = '') => {
    setEditingCode(code);
    setNoteText(currentNote);
  };

  const handleSaveNote = (code: string) => {
    updateSkillNotes(code, noteText);
    setEditingCode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and explanation */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Bản đồ Năng lực Cốt lõi Lớp 1 (Chương trình GDPT 2018)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi trạng thái tiến độ giảng dạy môn Toán và Tiếng Việt. Kỹ năng được đánh dấu "Chưa dạy" sẽ được hệ thống khóa an toàn, tuyệt đối không xuất hiện trong các bài giao cho học sinh.
            </p>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 shrink-0">
            <button
              onClick={() => setSelectedSubject('ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Tất cả môn ({skills.length})
            </button>
            <button
              onClick={() => setSelectedSubject('TOAN')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'TOAN' ? 'bg-sky-100 text-sky-900 font-semibold' : 'hover:text-sky-900'
              }`}
            >
              Toán lớp 1
            </button>
            <button
              onClick={() => setSelectedSubject('TIENG_VIET')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'TIENG_VIET' ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'hover:text-emerald-900'
              }`}
            >
              Tiếng Việt lớp 1
            </button>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Nguyên tắc sư phạm bất di bất dịch:</strong> Giáo viên là người trực tiếp xác nhận tiến độ bài học trên lớp. Học sinh lớp 1 chỉ được làm bài tập đối với các kiến thức cô đã dạy để không gây quá tải và áp lực tâm lý.
          </span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((sk) => {
          const isEditing = editingCode === sk.code;
          const isTaught = sk.taughtStatus;

          // Compute pre/post scores for this specific skill
          const skillRecords = assessments.filter((a) => a.skillCode === sk.code);
          const preRecs = skillRecords.filter((a) => a.testType === 'PRE');
          const postRecs = skillRecords.filter((a) => a.testType === 'POST');

          const avgPre = preRecs.length > 0
            ? Math.round(preRecs.reduce((sum, r) => sum + r.score, 0) / preRecs.length)
            : null;
          const avgPost = postRecs.length > 0
            ? Math.round(postRecs.reduce((sum, r) => sum + r.score, 0) / postRecs.length)
            : null;

          return (
            <div
              key={sk.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs transition-all ${
                isTaught ? 'border-slate-200 hover:border-slate-300' : 'border-dashed border-slate-300 bg-slate-50/60 opacity-80'
              }`}
            >
              {/* Top Row: Code, Subject, Taught Toggle */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {sk.code}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    sk.subject === 'TOAN' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {sk.subject === 'TOAN' ? 'Toán' : 'Tiếng Việt'}
                  </span>
                </div>

                {/* Taught Switch */}
                <button
                  type="button"
                  onClick={() => toggleSkillTaught(sk.code)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isTaught
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Bấm để chuyển trạng thái Đã dạy / Chưa dạy"
                >
                  {isTaught ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã dạy trên lớp</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Chưa dạy (Khóa)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Skill Name */}
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                {sk.name}
              </h3>

              {/* Specific Objective */}
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                <strong className="text-slate-700">Mục tiêu:</strong> {sk.objective}
              </p>

              {/* Curriculum Lesson Reference */}
              <p className="text-[11px] text-slate-500 mb-3 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Nội dung bài học: {sk.curriculumTopic}</span>
              </p>

              {/* Metrics: Pre vs Post Survey */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Khảo sát Đầu vào:</span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {avgPre !== null ? `${avgPre}% (${preRecs.length} em)` : 'Chưa có dữ liệu'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Khảo sát Sau can thiệp:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {avgPost !== null ? `${avgPost}% (${postRecs.length} em)` : 'Chưa có dữ liệu'}
                  </span>
                </div>
              </div>

              {/* Teacher Clinical Observation Note */}
              <div className="pt-2 border-t border-slate-100 text-xs">
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <textarea
                      rows={2}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Ghi chú quan sát lâm sàng của cô..."
                      className="w-full p-2 border border-sky-400 rounded-md text-xs focus:outline-hidden"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditingCode(null)}
                        className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleSaveNote(sk.code)}
                        className="px-3 py-1 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3 h-3" /> Lưu ghi chú
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-500 italic">
                      <strong className="text-slate-600 not-italic">Ghi chú của cô:</strong>{' '}
                      {sk.teacherNotes || 'Chưa có ghi chú.'}
                    </p>
                    <button
                      onClick={() => handleEditNote(sk.code, sk.teacherNotes)}
                      className="text-slate-400 hover:text-slate-700 p-1 shrink-0 cursor-pointer"
                      title="Sửa ghi chú của giáo viên"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
