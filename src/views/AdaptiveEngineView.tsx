import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Sliders,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Info,
  HelpCircle,
  Save,
  RotateCcw,
} from 'lucide-react';
import { DEFAULT_ADAPTIVE_SETTINGS, TIER_CONFIG } from '../utils/adaptiveEngine';

export const AdaptiveEngineView: React.FC = () => {
  const { adaptiveSettings, updateAdaptiveSettings, students, assessments, getStudentTierInfo } = useApp();

  const [mamThreshold, setMamThreshold] = useState(adaptiveSettings.mamThreshold);
  const [choiThreshold, setChoiThreshold] = useState(adaptiveSettings.choiThreshold);
  const [minAssessments, setMinAssessments] = useState(adaptiveSettings.minAssessmentsRequired);
  const [minIndependentForHoa, setMinIndependentForHoa] = useState(adaptiveSettings.minIndependentRequiredForHoa);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (mamThreshold >= choiThreshold) {
      alert('Ngưỡng Mầm phải nhỏ hơn ngưỡng Chồi!');
      return;
    }
    updateAdaptiveSettings({
      mamThreshold: Number(mamThreshold),
      choiThreshold: Number(choiThreshold),
      minAssessmentsRequired: Number(minAssessments),
      minIndependentRequiredForHoa: Number(minIndependentForHoa),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setMamThreshold(DEFAULT_ADAPTIVE_SETTINGS.mamThreshold);
    setChoiThreshold(DEFAULT_ADAPTIVE_SETTINGS.choiThreshold);
    setMinAssessments(DEFAULT_ADAPTIVE_SETTINGS.minAssessmentsRequired);
    setMinIndependentForHoa(DEFAULT_ADAPTIVE_SETTINGS.minIndependentRequiredForHoa);
    updateAdaptiveSettings(DEFAULT_ADAPTIVE_SETTINGS);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 pb-2">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Cơ chế Thích ứng Minh bạch (Adaptive Learning Rules Engine)
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Động cơ thích ứng dựa trên hệ luật suy diễn sư phạm tường minh, có thể giải thích và kiểm chứng khoa học.
          Tuyệt đối không sử dụng "hộp đen" hay tự động dán nhãn cố định cho học sinh.
        </p>
      </div>

      {/* 3 Developmental Tiers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier MẦM */}
        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md">
              TẦNG 1: MỨC MẦM
            </span>
            <span className="text-xs font-mono font-bold text-amber-700">
              &lt; {adaptiveSettings.mamThreshold}%
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1.5">
            Củng cố nền tảng & Hỗ trợ tối đa
          </h3>
          <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <li>· Khi kỹ năng còn nhiều lỗi hoặc chưa vững.</li>
            <li>· Nhiệm vụ ngắn (3-4 câu/phiên), tránh quá tải.</li>
            <li>· Tăng tối đa hình ảnh trực quan (que tính, quả táo, thẻ chữ).</li>
            <li>· Có gợi ý từng bước và cho phép cô giáo hướng dẫn.</li>
          </ul>
        </div>

        {/* Tier CHỒI */}
        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md">
              TẦNG 2: MỨC CHỒI
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              {adaptiveSettings.mamThreshold}% – {adaptiveSettings.choiThreshold}%
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1.5">
            Thực hành vừa sức & Tự lập
          </h3>
          <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <li>· Đã nắm được kiến thức nền tảng của bài học.</li>
            <li>· Bài tập vừa sức kết hợp nhiều dạng câu (nối ghép, trắc nghiệm).</li>
            <li>· Khuyến khích học sinh suy nghĩ và tự làm độc lập.</li>
            <li>· Tỷ lệ gợi ý giảm dần để rèn tính kiên trì.</li>
          </ul>
        </div>

        {/* Tier HOA */}
        <div className="bg-white p-5 rounded-xl border border-sky-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-sky-900 bg-sky-100 border border-sky-300 px-2.5 py-1 rounded-md">
              TẦNG 3: MỨC HOA
            </span>
            <span className="text-xs font-mono font-bold text-sky-700">
              ≥ {adaptiveSettings.choiThreshold}% (≥2 lần độc lập)
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1.5">
            Vận dụng mở rộng trong chuẩn Lớp 1
          </h3>
          <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <li>· Đạt điểm cao qua ít nhất 2 lần kiểm tra độc lập.</li>
            <li>· Bài tập tình huống thực tế phong phú, kích thích sáng tạo.</li>
            <li>· TUYỆT ĐỐI KHÔNG đưa kiến thức vượt chương trình lớp 1.</li>
            <li>· Phát huy tính hứng thú và tự tin trong học tập.</li>
          </ul>
        </div>
      </div>

      {/* Threshold Configuration Panel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-600" />
              Tùy chỉnh Thông số Ngưỡng Sư phạm
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cô có thể linh hoạt điều chỉnh ngưỡng phân loại cho phù hợp với đặc thù học sinh lớp 1A3.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Khôi phục mặc định
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Mam Threshold */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-slate-700 font-semibold mb-1">
                Ngưỡng Mầm (dưới mức này):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={20}
                  max={70}
                  value={mamThreshold}
                  onChange={(e) => setMamThreshold(Number(e.target.value))}
                  className="w-20 px-2.5 py-1.5 border border-slate-300 rounded font-bold text-sm bg-white"
                />
                <span className="text-slate-600 font-semibold">% điểm</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Mặc định: 50%</p>
            </div>

            {/* Choi Threshold */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-slate-700 font-semibold mb-1">
                Ngưỡng Chồi lên Hoa:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={60}
                  max={95}
                  value={choiThreshold}
                  onChange={(e) => setChoiThreshold(Number(e.target.value))}
                  className="w-20 px-2.5 py-1.5 border border-slate-300 rounded font-bold text-sm bg-white"
                />
                <span className="text-slate-600 font-semibold">% điểm</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Mặc định: 80%</p>
            </div>

            {/* Min Assessments */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-slate-700 font-semibold mb-1">
                Số lần KS tối thiểu:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={minAssessments}
                  onChange={(e) => setMinAssessments(Number(e.target.value))}
                  className="w-20 px-2.5 py-1.5 border border-slate-300 rounded font-bold text-sm bg-white"
                />
                <span className="text-slate-600 font-semibold">lần đánh giá</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Chưa đủ sẽ báo "Chưa đủ dữ liệu"</p>
            </div>

            {/* Min Independent for Hoa */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-slate-700 font-semibold mb-1">
                Số lần độc lập để lên Hoa:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={minIndependentForHoa}
                  onChange={(e) => setMinIndependentForHoa(Number(e.target.value))}
                  className="w-20 px-2.5 py-1.5 border border-slate-300 rounded font-bold text-sm bg-white"
                />
                <span className="text-slate-600 font-semibold">lần tự làm</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Tránh trường hợp được nhắc bài</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Đã cập nhật thông số thích ứng thành công!
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                * Mọi thay đổi sẽ lập tức cập nhật lại phân loại tầng thích ứng cho toàn bộ danh sách lớp 1A3.
              </span>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu cấu hình quy tắc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
