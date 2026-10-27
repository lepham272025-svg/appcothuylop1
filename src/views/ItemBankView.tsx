import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Search,
  Filter,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { LearningItem, QuestionFormat, Subject } from '../types';
import { TIER_CONFIG } from '../utils/adaptiveEngine';

export const ItemBankView: React.FC = () => {
  const { learningItems, addLearningItem, deleteItem, approveItem } = useApp();

  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<'ALL' | Subject>('ALL');
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Manual Question Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState<Subject>('TOAN');
  const [newSkillCode, setNewSkillCode] = useState('TOAN_01');
  const [newTier, setNewTier] = useState<'MAM' | 'CHOI' | 'HOA'>('CHOI');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionsText, setNewOptionsText] = useState('A, B, C');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('');
  const [newExplanation, setNewExplanation] = useState('');

  const filteredItems = learningItems.filter((item) => {
    if (search && !item.questionText.toLowerCase().includes(search.toLowerCase()) && !item.code.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (filterSubject !== 'ALL' && item.subject !== filterSubject) return false;
    if (filterTier !== 'ALL' && item.tier !== filterTier) return false;
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    return true;
  });

  const handleDuplicate = (item: LearningItem) => {
    const duplicated: LearningItem = {
      ...item,
      id: `BANK_COPY_${Date.now()}`,
      code: `${item.code}_BAN_SAO`,
      createdAt: new Date().toISOString(),
      source: 'TEACHER_CREATED',
    };
    addLearningItem(duplicated);
    alert(`Đã nhân bản câu hỏi ${item.code} thành công.`);
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newCorrectAnswer.trim()) {
      alert('Vui lòng điền nội dung câu hỏi và đáp án đúng!');
      return;
    }

    const options = newOptionsText.split(',').map((o) => o.trim()).filter((o) => o.length > 0);
    if (!options.includes(newCorrectAnswer.trim())) {
      options.push(newCorrectAnswer.trim());
    }

    const newItem: LearningItem = {
      id: `MANUAL_${Date.now()}`,
      code: `CH_GV_${Date.now().toString().slice(-4)}`,
      skillCode: newSkillCode,
      subject: newSubject,
      tier: newTier,
      objective: 'Do giáo viên trực tiếp biên soạn theo tiến độ lớp 1A3',
      questionText: newQuestionText.trim(),
      questionType: 'multiple_choice',
      options,
      correctAnswer: newCorrectAnswer.trim(),
      explanation: newExplanation.trim() || 'Giáo viên hướng dẫn chi tiết trên lớp.',
      status: 'APPROVED',
      source: 'TEACHER_CREATED',
      verifiedMath: newSubject === 'TOAN',
      createdAt: new Date().toISOString(),
    };

    addLearningItem(newItem);
    setShowAddModal(false);
    setNewQuestionText('');
    setNewCorrectAnswer('');
    setNewExplanation('');
    alert('Đã thêm câu hỏi vào ngân hàng thành công!');
  };

  const exportBankJSON = () => {
    const blob = new Blob([JSON.stringify(learningItems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ngan_hang_bai_tap_lop1_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner Required by Section IV.7 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-amber-900 tracking-wider uppercase">
              DỮ LIỆU MINH HỌA – KHÔNG PHẢI KẾT QUẢ THỰC NGHIỆM
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Toàn bộ bài tập mẫu được biên soạn chuẩn theo chương trình GDPT 2018 (Toán & Tiếng Việt lớp 1) để minh chứng kỹ thuật phân tầng thích ứng Mầm – Chồi – Hoa.
            </p>
          </div>
        </div>

        <button
          onClick={exportBankJSON}
          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Xuất ngân hàng (JSON)
        </button>
      </div>

      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              Ngân hàng Bài tập Phân tầng Lớp 1 ({learningItems.length} câu)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân loại bài tập theo 3 mức độ thích ứng: Mầm (trực quan), Chồi (vừa sức), Hoa (vận dụng nhẹ).
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm bài tập thủ công
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo từ khóa, mã câu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
          >
            <option value="ALL">Tất cả môn học</option>
            <option value="TOAN">Môn Toán</option>
            <option value="TIENG_VIET">Môn Tiếng Việt</option>
          </select>

          {/* Tier Filter */}
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
          >
            <option value="ALL">Tất cả mức độ</option>
            <option value="MAM">Mức Mầm (Cần hỗ trợ)</option>
            <option value="CHOI">Mức Chồi (Vừa sức)</option>
            <option value="HOA">Mức Hoa (Vận dụng nhẹ)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="APPROVED">Đã duyệt (Sẵn sàng giao)</option>
            <option value="PENDING_APPROVAL">Chờ giáo viên duyệt</option>
          </select>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const cfg = TIER_CONFIG[item.tier];
          const isApproved = item.status === 'APPROVED';

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Meta Top */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${cfg.colorBg} ${cfg.colorText} border ${cfg.colorBorder}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {item.subject === 'TOAN' ? 'Toán' : 'Tiếng Việt'} · {item.skillCode}
                    </span>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    isApproved ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                </div>

                {/* Question */}
                <h3 className="font-bold text-slate-900 text-sm mb-2.5">
                  {item.questionText}
                </h3>

                {/* Options */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {item.options.map((opt, idx) => {
                    const isCorrect = opt === item.correctAnswer;
                    return (
                      <div
                        key={idx}
                        className={`p-1.5 rounded text-xs text-center border ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {/* Visual Hint / Explanation */}
                <div className="text-[11px] text-slate-500 space-y-1 mb-3">
                  {item.visualHint && (
                    <p><strong className="text-slate-600">Trực quan:</strong> {item.visualHint}</p>
                  )}
                  <p><strong className="text-slate-600">Giải thích:</strong> {item.explanation}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400">
                  {item.source === 'OFFICIAL_BANK'
                    ? 'Ngân hàng chuẩn Bộ GD&ĐT'
                    : item.source === 'AI_SUGGESTED'
                    ? 'AI Gemini 3.8'
                    : 'Cô Thủy biên soạn'}
                </span>

                <div className="flex items-center gap-1.5">
                  {!isApproved && (
                    <button
                      onClick={() => approveItem(item.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                    </button>
                  )}

                  <button
                    onClick={() => handleDuplicate(item)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                    title="Nhân bản câu hỏi này"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Cô có chắc chắn muốn xóa câu hỏi ${item.code}?`)) {
                        deleteItem(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Manual Question */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Thêm bài tập tự biên soạn vào Ngân hàng
            </h3>

            <form onSubmit={handleCreateManual} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Môn học:</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="TOAN">Toán lớp 1</option>
                    <option value="TIENG_VIET">Tiếng Việt lớp 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tầng thích ứng:</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="MAM">Mầm (Hỗ trợ nhiều)</option>
                    <option value="CHOI">Chồi (Vừa sức)</option>
                    <option value="HOA">Hoa (Vận dụng nhẹ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nội dung câu hỏi:</label>
                <textarea
                  rows={2}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="VD: Phép tính nào có kết quả bằng 7?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Các đáp án (ngăn cách bằng dấu phẩy):</label>
                  <input
                    type="text"
                    value={newOptionsText}
                    onChange={(e) => setNewOptionsText(e.target.value)}
                    placeholder="VD: 3 + 4, 2 + 3, 5 + 1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Đáp án đúng:</label>
                  <input
                    type="text"
                    value={newCorrectAnswer}
                    onChange={(e) => setNewCorrectAnswer(e.target.value)}
                    placeholder="VD: 3 + 4"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lời giải thích sư phạm:</label>
                <input
                  type="text"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="VD: Vì 3 + 4 = 7 nên đây là đáp án đúng..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                >
                  Lưu vào ngân hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
