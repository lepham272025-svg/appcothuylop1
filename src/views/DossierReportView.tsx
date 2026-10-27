import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileText,
  UserCheck,
  Sparkles,
  BookOpen,
  Calendar,
} from 'lucide-react';

export const DossierReportView: React.FC = () => {
  const {
    teacherProfile,
    students,
    skills,
    assessments,
    learningItems,
    tasks,
    exportBackupJSON,
    exportStudentsCSV,
  } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const taughtSkillsCount = skills.filter((s) => s.taughtStatus).length;
  const surveyedCount = new Set(assessments.map((a) => a.studentCode)).size;

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Hồ sơ Minh chứng Dự thi Vòng Top 50 Toàn quốc
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Giải pháp AI Giáo dục Việt Nam 2026 · Tác giả: Cô Trịnh Thị Chung Thủy (Trường TH Hiển Khánh)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportBackupJSON}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Xuất dữ liệu JSON
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> In / Lưu PDF Báo cáo
          </button>
        </div>
      </div>

      {/* Formal Dossier Document Sheet (Optimized for Screen & Print) */}
      <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 space-y-8 text-slate-800 font-serif">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6">
          <p className="text-xs font-sans uppercase font-bold tracking-widest text-slate-600 mb-1">
            BỘ GIÁO DỤC VÀ ĐÀO TẠO · GIẢI THƯỞNG SẢN PHẨM AI GIÁO DỤC VIỆT NAM 2026
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900 mt-2">
            BÁO CÁO KẾT QUẢ THỰC NGHIỆM SƯ PHẠM
          </h1>
          <h2 className="text-base sm:text-lg font-bold text-sky-900 mt-1 font-sans">
            "MỖI EM MỘT BƯỚC AI": HỆ SINH THÁI HỌC TẬP THÍCH ỨNG, CÁ NHÂN HÓA TIẾN TRÌNH HỌC TOÁN VÀ TIẾNG VIỆT CHO HỌC SINH LỚP 1
          </h2>
          <p className="text-xs text-slate-600 font-sans mt-3">
            Thời gian báo cáo: Ngày {new Date().toLocaleDateString('vi-VN')} · Địa điểm: Xã Hiển Khánh, tỉnh Ninh Bình
          </p>
        </div>

        {/* Section 1: Thông tin Tác giả và Đơn vị thực nghiệm */}
        <div className="space-y-3 font-sans text-xs">
          <h3 className="font-bold text-sm text-slate-900 uppercase border-l-3 border-emerald-600 pl-2">
            I. THÔNG TIN TÁC GIẢ & ĐỊA BÀN THỰC NGHIỆM
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p><strong>Giáo viên chủ trì:</strong> Cô {teacherProfile.teacherName}</p>
              <p className="mt-1"><strong>Chức vụ:</strong> Giáo viên Tiểu học (Chuyên môn Lớp 1)</p>
              <p className="mt-1"><strong>Đơn vị:</strong> {teacherProfile.schoolName}</p>
            </div>
            <div>
              <p><strong>Địa phương:</strong> {teacherProfile.location}</p>
              <p className="mt-1"><strong>Lớp thực nghiệm:</strong> {teacherProfile.experimentalClass} (Năm học {teacherProfile.schoolYear})</p>
              <p className="mt-1"><strong>Sĩ số thực tế tham gia:</strong> {students.length} học sinh (Mã H01 – H{students.length < 10 ? '0' + students.length : students.length})</p>
            </div>
          </div>
        </div>

        {/* Section 2: Vấn đề thực tiễn & Mục tiêu giải pháp */}
        <div className="space-y-2.5 font-sans text-xs text-slate-700 leading-relaxed">
          <h3 className="font-bold text-sm text-slate-900 uppercase border-l-3 border-emerald-600 pl-2">
            II. BỐI CẢNH THỰC TIỄN & TÍNH CẦN THIẾT
          </h3>
          <p>
            Học sinh lớp 1 bước vào môi trường học tập có sự phân hóa tự nhiên rất lớn về tâm lý, khả năng tập trung và tốc độ tiếp thu âm chữ, con số. Việc áp dụng đồng loạt một đề bài cho cả lớp 30–35 em thường dẫn đến tình trạng: học sinh tiếp thu chậm bị quá tải, nản lòng; trong khi học sinh nắm bài nhanh thiếu thử thách phát triển.
          </p>
          <p>
            Giải pháp <strong>"Mỗi Em Một Bước AI"</strong> của cô Trịnh Thị Chung Thủy được thiết kế nhằm hiện thực hóa mục tiêu cá nhân hóa việc học mà không làm tăng gánh nặng soạn giáo án cho giáo viên, đồng thời bảo vệ 100% quyền riêng tư và sức khỏe tinh thần của trẻ 6 tuổi.
          </p>
        </div>

        {/* Section 3: AI được ứng dụng ở bước nào? (Mandatory) */}
        <div className="space-y-3 font-sans text-xs">
          <h3 className="font-bold text-sm text-slate-900 uppercase border-l-3 border-emerald-600 pl-2">
            III. PHẠM VI ỨNG DỤNG AI & KIẾN TRÚC AN TOÀN DÀNH CHO TRẺ
          </h3>
          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-lg space-y-2 text-slate-800 leading-relaxed">
            <p>
              <strong>1. AI hỗ trợ giáo viên (Thành phần A):</strong> Mô hình <em>Gemini 3.8 Flash</em> chạy hoàn toàn phía máy chủ (Server-side) để hỗ trợ cô giáo tạo câu hỏi theo chuẩn GDPT 2018 dựa trên <em>mục tiêu bài học chung</em>. Tuyệt đối không gửi họ tên, mã học sinh, hình ảnh hoặc giọng nói của trẻ lên mô hình AI.
            </p>
            <p>
              <strong>2. Kiểm chứng mã nguồn toán học 100%:</strong> Mọi phép tính số học do AI đề xuất đều được kiểm tra độc lập bằng mã nguồn thuật toán để loại bỏ hoàn toàn hiện tượng ảo giác (hallucination) trước khi hiển thị cho giáo viên.
            </p>
            <p>
              <strong>3. Quyền kiểm duyệt tối cao của giáo viên:</strong> 100% câu hỏi do AI tạo ra đều có nhãn "Chờ giáo viên duyệt". Chỉ câu hỏi đã được cô giáo duyệt mới được đưa vào ngân hàng.
            </p>
            <p>
              <strong>4. Góc học tập ngoại tuyến của học sinh (Thành phần B):</strong> Chạy độc lập, không có chatbot tự do, không có kết nối ra ngoài, không thu thập dữ liệu cá nhân, đảm bảo an toàn tuyệt đối cho trẻ lớp 1.
            </p>
          </div>
        </div>

        {/* Section 4: Bảng số liệu thực nghiệm đo lường được */}
        <div className="space-y-3 font-sans text-xs">
          <h3 className="font-bold text-sm text-slate-900 uppercase border-l-3 border-emerald-600 pl-2">
            IV. SỐ LIỆU MINH CHỨNG THỰC NGHIỆM ĐO LƯỜNG ĐƯỢC
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center">
              <span className="text-[11px] text-slate-500 block">Sĩ số Lớp 1A3</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">{students.length} em</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center">
              <span className="text-[11px] text-slate-500 block">Kỹ năng đang dạy</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">{taughtSkillsCount}/{skills.length}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center">
              <span className="text-[11px] text-slate-500 block">Học sinh đã khảo sát</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">{surveyedCount} em</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center">
              <span className="text-[11px] text-slate-500 block">Thời gian tiết kiệm</span>
              <span className="text-xl font-bold text-emerald-700 tabular-nums">~{teacherProfile.prepTimeSavedHours} giờ/tuần</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-600">
            <p className="font-semibold text-slate-800 mb-1">Quy tắc phân tầng học tập thích ứng đã chứng minh hiệu quả:</p>
            <p>· <strong>Mức Mầm (&lt;50%):</strong> Tăng cường que tính, đồ vật trực quan, giao bài ngắn 3–4 câu có sự trợ giúp của cô.</p>
            <p>· <strong>Mức Chồi (50%–80%):</strong> Luyện tập củng cố vừa sức, rèn thói quen tự lập làm bài.</p>
            <p>· <strong>Mức Hoa (≥80% qua 2 lần độc lập):</strong> Bài tập mở rộng liên hệ thực tế, kích thích tư duy sáng tạo.</p>
          </div>
        </div>

        {/* Section 5: Hạn chế của nghiên cứu thực nghiệm (Mandatory) */}
        <div className="space-y-2.5 font-sans text-xs text-slate-700 leading-relaxed">
          <h3 className="font-bold text-sm text-slate-900 uppercase border-l-3 border-emerald-600 pl-2">
            V. GHI NHẬN HẠN CHẾ CỦA THỰC NGHIỆM
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Nghiên cứu thực hiện trong phạm vi một lớp học (Lớp 1A3, Trường TH Hiển Khánh) tại địa bàn nông thôn tỉnh Ninh Bình, điều kiện thiết bị công nghệ của phụ huynh còn phân tán.</li>
            <li>Khoảng thời gian khảo sát thực nghiệm bước đầu tập trung vào học kỳ 1 (chủ đề số đến 10 và các âm vần cơ bản).</li>
            <li>Tác giả chủ động giữ thái độ thận trọng khoa học: coi kết quả là bằng chứng quá trình phát triển của từng cá nhân học sinh, không suy diễn thành quy luật khái quát hóa tuyệt đối.</li>
          </ul>
        </div>

        {/* Section 6: Cam kết và Chữ ký Giáo viên */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 font-sans text-xs text-center">
          <div>
            <p className="font-bold uppercase text-slate-700">XÁC NHẬN CỦA BAN GIÁM HIỆU</p>
            <p className="text-[11px] text-slate-500 italic mt-0.5">Trường Tiểu học Hiển Khánh</p>
            <div className="h-20 flex items-center justify-center text-slate-300 italic text-[11px]">
              (Ký tên và đóng dấu)
            </div>
          </div>

          <div>
            <p className="font-bold uppercase text-slate-700">GIÁO VIÊN NGHIÊN CỨU & BÁO CÁO</p>
            <p className="text-[11px] text-slate-500 italic mt-0.5">Cam kết tính trung thực của dữ liệu</p>
            <div className="h-20 flex flex-col items-center justify-center">
              <span className="text-emerald-800 font-serif font-bold text-base italic">Trịnh Thị Chung Thủy</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Cô giáo Trịnh Thị Chung Thủy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
