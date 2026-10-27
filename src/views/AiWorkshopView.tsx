import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  FileDown,
  Printer,
  ShieldAlert,
  Loader2,
  BookmarkCheck,
  AlertTriangle,
  Lightbulb,
  Check,
} from 'lucide-react';
import { LearningItem, QuestionFormat, Subject } from '../types';
import { TIER_CONFIG } from '../utils/adaptiveEngine';

export const AiWorkshopView: React.FC = () => {
  const {
    skills,
    learningItems,
    addLearningItem,
    approveItem,
    rejectItem,
    deleteItem,
    updateItem,
    teacherProfile,
  } = useApp();

  // Generator form state
  const [subject, setSubject] = useState<Subject>('TOAN');
  const [skillCode, setSkillCode] = useState<string>('TOAN_04');
  const [lessonObjective, setLessonObjective] = useState<string>('Phép cộng trong phạm vi 10 dựa trên tách gộp số và que tính trực quan');
  const [taughtContent, setTaughtContent] = useState<string>('Các số từ 0 đến 10, phép cộng không nhớ, dùng que tính hoặc hình ảnh đồ vật');
  const [tier, setTier] = useState<'MAM' | 'CHOI' | 'HOA'>('MAM');
  const [count, setCount] = useState<number>(3);
  const [format, setFormat] = useState<QuestionFormat>('multiple_choice');
  const [visualSupport, setVisualSupport] = useState<'high' | 'medium' | 'low'>('high');

  // Loading & status
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Preview & Edit modal
  const [previewItem, setPreviewItem] = useState<LearningItem | null>(null);
  const [editingItem, setEditingItem] = useState<LearningItem | null>(null);

  // Filter skills by selected subject and taughtStatus
  const availableSkills = skills.filter((s) => s.subject === subject);

  // Switch presets when changing subject
  const handleSubjectChange = (newSubject: Subject) => {
    setSubject(newSubject);
    if (newSubject === 'TOAN') {
      setSkillCode('TOAN_04');
      setLessonObjective('Phép cộng và trừ trong phạm vi 10 có hình ảnh minh họa');
      setTaughtContent('Số 0 đến 10, que tính, phép cộng trừ không nhớ');
    } else {
      setSkillCode('TV_01');
      setLessonObjective('Nhận biết và phát âm đúng các chữ cái đã học: a, b, c, d, đ, e, ê, o, ô, ơ');
      setTaughtContent('Chỉ dùng các chữ cái và âm đã học trong Bài 1 đến Bài 15');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerMessage(null);
    setServerError(null);

    try {
      const response = await fetch('/api/gemini/generate-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          lessonObjective,
          taughtContent,
          skillCode,
          tier,
          count: Number(count),
          format,
          visualSupport,
        }),
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.items)) {
        // Add items to AppContext with PENDING_APPROVAL status
        data.items.forEach((item: LearningItem) => {
          addLearningItem(item);
        });
        setServerMessage(`Máy chủ đã tạo thành công ${data.items.length} câu hỏi mới. Mọi câu hỏi đang ở trạng thái "Chờ giáo viên duyệt".`);
      } else {
        // Handle fallback cleanly as required
        setServerError(data.error || data.message || 'Không thể kết nối đến mô hình Gemini. Cô có thể chọn dùng ngân hàng câu hỏi có sẵn đã được thẩm định.');
      }
    } catch (err: any) {
      setServerError('Lỗi đường truyền hoặc máy chủ AI chưa sẵn sàng. Vui lòng thử lại hoặc sử dụng Ngân hàng bài tập chuẩn.');
    } finally {
      setIsLoading(false);
    }
  };

  // Only display items that are either AI_SUGGESTED or recently created
  const pendingItems = learningItems.filter((it) => it.status === 'PENDING_APPROVAL');

  return (
    <div className="space-y-6">
      {/* Workshop Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 pb-2">
          <Sparkles className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Xưởng Học liệu AI dành cho Giáo viên (Teacher AI Workshop)
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Sử dụng trí tuệ nhân tạo Gemini 3.8 Flash phía máy chủ để hỗ trợ cô Trịnh Thị Chung Thủy soạn nhanh câu hỏi theo mục tiêu bài học cụ thể.
          <strong> Tuyệt đối bảo mật:</strong> Không gửi dữ liệu học sinh lên mô hình AI. Mọi câu hỏi đều phải qua bước kiểm duyệt của cô trước khi đưa vào ngân hàng hoặc giao cho học sinh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3): Generation Request Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Thiết lập Yêu cầu Soạn bài
          </h3>

          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            {/* Subject */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Môn học:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSubjectChange('TOAN')}
                  className={`py-2 px-3 rounded-lg border text-center font-semibold cursor-pointer transition-colors ${
                    subject === 'TOAN'
                      ? 'bg-sky-50 text-sky-900 border-sky-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Toán lớp 1
                </button>
                <button
                  type="button"
                  onClick={() => handleSubjectChange('TIENG_VIET')}
                  className={`py-2 px-3 rounded-lg border text-center font-semibold cursor-pointer transition-colors ${
                    subject === 'TIENG_VIET'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Tiếng Việt lớp 1
                </button>
              </div>
            </div>

            {/* Target Skill */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Kỹ năng mục tiêu:</label>
              <select
                value={skillCode}
                onChange={(e) => setSkillCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                {availableSkills.map((sk) => (
                  <option key={sk.id} value={sk.code}>
                    [{sk.code}] {sk.name} {!sk.taughtStatus ? '(Chưa dạy)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Pedagogical Lesson Objective */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mục tiêu sư phạm cụ thể:
              </label>
              <textarea
                rows={2}
                value={lessonObjective}
                onChange={(e) => setLessonObjective(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                placeholder="VD: Nhận biết dấu >, <, = hoặc đọc đúng vần an, at..."
                required
              />
            </div>

            {/* Verified Taught Scope */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Giới hạn kiến thức đã dạy trên lớp:
              </label>
              <input
                type="text"
                value={taughtContent}
                onChange={(e) => setTaughtContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                placeholder="VD: Chỉ trong phạm vi 10; chỉ các chữ a, b, c, d..."
                required
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                * AI sẽ chỉ tạo các câu hỏi nằm hoàn toàn trong phạm vi giới hạn này.
              </p>
            </div>

            {/* Adaptive Tier */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tầng thích ứng cần soạn:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['MAM', 'CHOI', 'HOA'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`py-1.5 rounded border text-center font-semibold cursor-pointer transition-colors ${
                      tier === t
                        ? 'bg-sky-700 text-white border-sky-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {TIER_CONFIG[t].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Format & Count */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hình thức:</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="multiple_choice">Trắc nghiệm</option>
                  <option value="matching">Ghép nối</option>
                  <option value="fill_in">Điền khuyết</option>
                  <option value="visual_counting">Đếm hình ảnh</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số lượng câu:</label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value={2}>2 câu ngắn</option>
                  <option value={3}>3 câu chuẩn</option>
                  <option value={4}>4 câu</option>
                  <option value={5}>5 câu</option>
                </select>
              </div>
            </div>

            {/* Visual Support Level */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Hỗ trợ trực quan:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['high', 'medium', 'low'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisualSupport(v)}
                    className={`py-1 rounded border text-center font-medium cursor-pointer ${
                      visualSupport === v
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {v === 'high' ? 'Nhiều hình' : v === 'medium' ? 'Vừa phải' : 'Ít hình'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini 3.8 Flash đang xử lý...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>AI đề xuất học liệu (Máy chủ)</span>
                </>
              )}
            </button>
          </form>

          {/* Feedback & Fallback notices */}
          {serverMessage && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{serverMessage}</span>
            </div>
          )}

          {serverError && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Thông báo máy chủ AI:</span>
              </div>
              <p className="leading-relaxed">{serverError}</p>
              <p className="text-[11px] text-amber-700 pt-1 border-t border-amber-200/60">
                Cô có thể truy cập <strong>"Ngân hàng bài tập"</strong> ở thanh menu để chọn sử dụng hàng chục câu hỏi đã được thẩm định sẵn cho môn Toán và Tiếng Việt.
              </p>
            </div>
          )}
        </div>

        {/* Right Column (2/3): Pending Review Queue & Question Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-sky-600" />
                  Hàng đợi Chờ Giáo viên Duyệt ({pendingItems.length} câu)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mọi câu hỏi do AI đề xuất bắt buộc phải được cô Thủy xem trước, sửa đổi hoặc bấm "Duyệt" trước khi xuất bản.
                </p>
              </div>

              {pendingItems.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Cô có chắc chắn muốn duyệt nhanh toàn bộ các câu hỏi trong hàng đợi?')) {
                      pendingItems.forEach((it) => approveItem(it.id));
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Duyệt tất cả
                </button>
              )}
            </div>

            {pendingItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-40 text-sky-500" />
                <p className="text-xs font-semibold text-slate-700">Không có câu hỏi nào đang chờ duyệt</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
                  Cô hãy chọn mục tiêu bài học ở cột bên trái và bấm <strong>"AI đề xuất học liệu"</strong> để hệ thống tạo danh sách câu hỏi mới.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 mt-4">
                {pendingItems.map((item) => {
                  const cfg = TIER_CONFIG[item.tier];

                  return (
                    <div
                      key={item.id}
                      className="border border-amber-200 bg-amber-50/20 rounded-xl p-4 shadow-2xs hover:border-amber-300 transition-colors"
                    >
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                            Chờ giáo viên duyệt
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${cfg.colorBg} ${cfg.colorText} border ${cfg.colorBorder}`}>
                            {cfg.label}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {item.code}
                          </span>
                        </div>

                        {item.verifiedMath && (
                          <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                            ✓ Mã nguồn đã kiểm chứng phép tính
                          </span>
                        )}
                      </div>

                      {/* Question Text */}
                      <h4 className="font-bold text-slate-900 text-sm mb-2">
                        {item.questionText}
                      </h4>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                        {item.options.map((opt, oIdx) => {
                          const isCorrect = opt === item.correctAnswer;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Visual hint & pedagogical explanation */}
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 mb-3 space-y-1">
                        {item.visualHint && (
                          <p>
                            <strong className="text-slate-700">Gợi ý hình ảnh:</strong> {item.visualHint}
                          </p>
                        )}
                        <p>
                          <strong className="text-slate-700">Lời giải thích sư phạm:</strong> {item.explanation}
                        </p>
                        {item.mathVerificationNote && (
                          <p className="text-emerald-700 font-medium">
                            {item.mathVerificationNote}
                          </p>
                        )}
                      </div>

                      {/* Actions: Approve, Edit, Reject, Delete */}
                      <div className="flex items-center justify-between pt-2 border-t border-amber-100/80">
                        <span className="text-[11px] text-slate-400">
                          Nguồn: AI Gemini 3.8 Flash
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="px-2.5 py-1 text-xs text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-slate-500" /> Sửa nội dung
                          </button>

                          <button
                            onClick={() => rejectItem(item.id)}
                            className="px-2.5 py-1 text-xs text-amber-800 bg-amber-100 hover:bg-amber-200 rounded cursor-pointer"
                          >
                            Từ chối
                          </button>

                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                            title="Xóa câu hỏi này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => approveItem(item.id)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt & Lưu ngân hàng
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Edit Question Content */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Chỉnh sửa nội dung câu hỏi ({editingItem.code})
            </h3>

            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nội dung câu hỏi:</label>
                <textarea
                  rows={2}
                  value={editingItem.questionText}
                  onChange={(e) => setEditingItem({ ...editingItem, questionText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Đáp án đúng:</label>
                <input
                  type="text"
                  value={editingItem.correctAnswer}
                  onChange={(e) => setEditingItem({ ...editingItem, correctAnswer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lời giải thích:</label>
                <textarea
                  rows={2}
                  value={editingItem.explanation}
                  onChange={(e) => setEditingItem({ ...editingItem, explanation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gợi ý hình ảnh:</label>
                <input
                  type="text"
                  value={editingItem.visualHint || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, visualHint: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  updateItem(editingItem.id, editingItem);
                  setEditingItem(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
