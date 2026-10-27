import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Printer,
  CheckCircle2,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  Users,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { AdaptiveTier, AssignedTask, LearningItem, Subject } from '../types';
import { TIER_CONFIG } from '../utils/adaptiveEngine';

export const TaskAssignmentView: React.FC = () => {
  const {
    students,
    learningItems,
    tasks,
    createTask,
    deleteTask,
    teacherProfile,
    getStudentTierInfo,
  } = useApp();

  const [taskTitle, setTaskTitle] = useState('Phiên luyện tập thích ứng 7 phút');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('TOAN');
  const [selectedTier, setSelectedTier] = useState<AdaptiveTier>('CHOI');
  const [targetStudentCodes, setTargetStudentCodes] = useState<string[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(7);
  const [instructions, setInstructions] = useState('Em hãy đọc kỹ câu hỏi và chọn câu trả lời đúng nhất nhé!');

  // Selected items to assign (max 3-5 questions)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Printable Modal State
  const [printTask, setPrintTask] = useState<AssignedTask | null>(null);

  // Available approved items matching subject and tier
  const approvedItems = learningItems.filter(
    (it) => it.status === 'APPROVED' && it.subject === selectedSubject && it.tier === selectedTier
  );

  // Quick select students matching the chosen tier
  const handleSelectStudentsByTier = () => {
    const matched = students
      .filter((s) => {
        const info = getStudentTierInfo(s.code);
        return info.recommendedTier === selectedTier;
      })
      .map((s) => s.code);

    if (matched.length > 0) {
      setTargetStudentCodes(matched);
    } else {
      // If no students assigned yet, just take first 5
      setTargetStudentCodes(students.slice(0, 5).map((s) => s.code));
    }
  };

  const handleToggleItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 bài tập đã duyệt từ danh sách!');
      return;
    }
    if (targetStudentCodes.length === 0) {
      alert('Vui lòng chọn ít nhất 1 mã học sinh để giao bài!');
      return;
    }

    const code = createTask({
      title: taskTitle,
      subject: selectedSubject,
      targetTier: selectedTier as any,
      studentCodes: targetStudentCodes,
      itemIds: selectedItemIds,
      durationMinutes,
      status: 'ACTIVE',
      instructions,
    });

    alert(`Đã tạo thành công nhiệm vụ mã ${code} cho ${targetStudentCodes.length} học sinh!`);
    setSelectedItemIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 pb-2">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Giao Nhiệm vụ Thích ứng & In Phiếu Học tập A4
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Tạo các phiên học vi mô (Micro-learning) kéo dài 5–10 phút, vừa sức cho học sinh lớp 1.
          Chỉ sử dụng bài tập đã được cô duyệt. Hệ thống hỗ trợ xuất phiếu giấy A4 có đáp án riêng cho cô giáo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 cols): Task Builder */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Thiết lập Phiên Nhiệm vụ Mới
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Môn học:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value as any);
                    setSelectedItemIds([]);
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="TOAN">Toán lớp 1</option>
                  <option value="TIENG_VIET">Tiếng Việt lớp 1</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tầng học sinh hướng tới:</label>
                <select
                  value={selectedTier}
                  onChange={(e) => {
                    setSelectedTier(e.target.value as any);
                    setSelectedItemIds([]);
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="MAM">Mức Mầm (Cần trợ giúp que tính)</option>
                  <option value="CHOI">Mức Chồi (Vừa sức, tự lập)</option>
                  <option value="HOA">Mức Hoa (Vận dụng nhẹ)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tên nhiệm vụ:</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            {/* Target students selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">
                  Mã học sinh nhận bài ({targetStudentCodes.length} em):
                </label>
                <button
                  type="button"
                  onClick={handleSelectStudentsByTier}
                  className="text-sky-700 hover:text-sky-800 text-[11px] font-semibold cursor-pointer"
                >
                  Chọn nhanh các em thuộc tầng {TIER_CONFIG[selectedTier].label}
                </button>
              </div>

              <div className="p-2 border border-slate-200 rounded-lg max-h-24 overflow-y-auto flex flex-wrap gap-1 bg-slate-50">
                {students.map((s) => {
                  const isChecked = targetStudentCodes.includes(s.code);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() =>
                        setTargetStudentCodes((prev) =>
                          isChecked ? prev.filter((c) => c !== s.code) : [...prev, s.code]
                        )
                      }
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-sky-700 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s.code}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item Selection from Bank */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">
                  Chọn câu hỏi ({selectedItemIds.length}/5 câu tối đa cho trẻ 6 tuổi):
                </label>
                <span className="text-[11px] text-slate-400">
                  {approvedItems.length} câu đã duyệt khả dụng
                </span>
              </div>

              {approvedItems.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
                  Chưa có câu hỏi nào được duyệt cho môn {selectedSubject === 'TOAN' ? 'Toán' : 'Tiếng Việt'} ở mức{' '}
                  {TIER_CONFIG[selectedTier].label}. Cô vui lòng vào "Xưởng học liệu AI" hoặc "Ngân hàng bài tập" để duyệt thêm bài.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {approvedItems.map((it) => {
                    const isSelected = selectedItemIds.includes(it.id);
                    return (
                      <div
                        key={it.id}
                        onClick={() => handleToggleItem(it.id)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono text-[11px] text-slate-500">{it.code}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                        <p className="line-clamp-2">{it.questionText}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Duration and instructions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Thời lượng khuyến nghị:</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value={5}>5 phút (Phiên nhanh)</option>
                  <option value={7}>7 phút (Chuẩn)</option>
                  <option value={10}>10 phút (Mở rộng)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lời dặn của cô:</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={selectedItemIds.length === 0 || targetStudentCodes.length === 0}
              className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Tạo nhiệm vụ & Xuất phiếu học tập
            </button>
          </form>
        </div>

        {/* Right List (5 cols): Active Tasks & Print Options */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Danh sách Nhiệm vụ Đã Giao ({tasks.length})</span>
              <FileText className="w-4 h-4 text-sky-600" />
            </h3>

            {tasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <BrainCircuit className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Chưa có nhiệm vụ nào được giao.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Cô hãy chọn bài tập bên trái và bấm tạo nhiệm vụ.</p>
              </div>
            ) : (
              <div className="space-y-3 mt-3">
                {tasks.map((task) => (
                  <div key={task.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {task.taskCode}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.durationMinutes} phút
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800">{task.title}</h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{task.studentCodes.length} học sinh</span>
                      <span>{task.itemIds.length} bài tập</span>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setPrintTask(task)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Printer className="w-3 h-3 text-slate-600" /> In phiếu A4
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Cô có muốn xóa nhiệm vụ ${task.taskCode}?`)) {
                            deleteTask(task.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        title="Xóa nhiệm vụ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable A4 Worksheet Modal with Student View & Teacher Answer Key */}
      {printTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl space-y-6">
            {/* Action Bar for Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-700">Mẫu Phiếu A4 Chuẩn In</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> In ra máy in
                </button>
                <button
                  onClick={() => setPrintTask(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-lg cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* A4 Paper Header */}
            <div className="border-b-2 border-slate-800 pb-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {teacherProfile.schoolName} – {teacherProfile.location}
              </p>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1 uppercase">
                PHIẾU HỌC TẬP THÍCH ỨNG LỚP 1
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                Môn: {printTask.subject === 'TOAN' ? 'Toán' : 'Tiếng Việt'} · {printTask.title}
              </p>
              <div className="mt-3 flex justify-between text-xs font-medium text-slate-800 px-4">
                <span>Mã học sinh: <strong>[ . . . . . . . . . . ]</strong></span>
                <span>Lớp: <strong>{teacherProfile.experimentalClass}</strong></span>
                <span>Thời gian: <strong>{printTask.durationMinutes} phút</strong></span>
              </div>
            </div>

            {/* Questions with checkboxes */}
            <div className="space-y-4 text-xs">
              {printTask.itemIds.map((itemId, idx) => {
                const item = learningItems.find((it) => it.id === itemId);
                if (!item) return null;

                return (
                  <div key={itemId} className="p-3 border border-slate-300 rounded-lg space-y-2">
                    <p className="font-bold text-slate-900">
                      Câu {idx + 1}: {item.questionText}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {item.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="flex items-center gap-2 p-1.5 border border-slate-200 rounded"
                        >
                          <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs"></div>
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Student Self-Reflection */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
              <span className="font-medium text-slate-700">Em tự đánh giá bài làm hôm nay:</span>
              <div className="flex gap-4">
                <span>⚪ Em làm rất tốt 😊</span>
                <span>⚪ Em cần cô giúp đỡ 🤔</span>
              </div>
            </div>

            {/* Teacher Answer Key Block (Separate for Teacher) */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 text-xs">
              <h4 className="font-bold text-slate-900 mb-2">
                [HƯỚNG DẪN CHẤM DÀNH RIÊNG CHO CÔ GIÁO {teacherProfile.teacherName.toUpperCase()}]
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                {printTask.itemIds.map((itemId, idx) => {
                  const item = learningItems.find((it) => it.id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} className="p-1.5 bg-slate-100 rounded">
                      <strong>Câu {idx + 1}:</strong> Đáp án đúng là <strong>"{item.correctAnswer}"</strong>. ({item.explanation})
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
