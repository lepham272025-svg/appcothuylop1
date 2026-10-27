import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Upload, RotateCcw, Camera, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    teacherProfile,
    updateTeacherProfile,
    exportBackupJSON,
    importBackupJSON,
    resetAllData,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [tempTeacher, setTempTeacher] = useState({ ...teacherProfile });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateTeacherProfile({ avatarUrl: reader.result });
          setTempTeacher((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const res = importBackupJSON(content);
          alert(res.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-8 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
          {/* Author and Institutional Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-white text-sm">MỖI EM MỘT BƯỚC AI</span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-1.5 py-0.5 rounded">
                Dự thi 2026
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-2">
              Hệ sinh thái học tập thích ứng, cá nhân hóa tiến trình học Toán và Tiếng Việt cho học sinh lớp 1.
            </p>
            <div className="text-slate-300 font-medium space-y-0.5">
              <p>Sản phẩm giáo dục do cô <button onClick={() => setShowTeacherModal(true)} className="text-emerald-400 underline font-semibold hover:text-emerald-300 cursor-pointer">{teacherProfile.teacherName}</button> phát triển.</p>
              <p>{teacherProfile.schoolName} – Năm học {teacherProfile.schoolYear}.</p>
              <p className="text-slate-400">{teacherProfile.location} · Lớp thực nghiệm {teacherProfile.experimentalClass}.</p>
            </div>
          </div>

          {/* Privacy and Pedagogical Principles */}
          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Cam kết an toàn dữ liệu & Sư phạm
            </h4>
            <ul className="text-slate-400 space-y-1.5 leading-relaxed">
              <li>· Không gửi thông tin định danh hoặc hình ảnh học sinh đến AI.</li>
              <li>· Mã nguồn xác thực độ chính xác các phép toán lớp 1.</li>
              <li>· Bài tập cho học sinh hoạt động 100% ngoại tuyến an toàn.</li>
              <li>· Tuân thủ Chương trình GDPT 2018 và Thông tư đánh giá tiểu học.</li>
            </ul>
          </div>

          {/* Data Backup & Management */}
          <div>
            <h4 className="font-semibold text-white mb-2">Quản trị & Dữ liệu nghiên cứu</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={exportBackupJSON}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 cursor-pointer"
                title="Xuất tệp sao lưu toàn bộ dữ liệu JSON"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                Sao lưu dữ liệu (JSON)
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 cursor-pointer"
                title="Khôi phục dữ liệu từ tệp JSON đã lưu"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                Khôi phục dữ liệu
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJSON}
              />

              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 rounded text-xs flex items-center gap-1.5 cursor-pointer"
                title="Xóa dữ liệu để làm thực tế"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                Xóa dữ liệu để làm thật
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              * Trước khi tiến hành khảo sát thực nghiệm chính thức, giáo viên có thể xóa toàn bộ dữ liệu minh họa để nhập dữ liệu thực tế của lớp 1A3.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <div>
            © 2026 Cô Trịnh Thị Chung Thủy · Trường Tiểu học Hiển Khánh. Mọi quyền sư phạm được bảo lưu.
          </div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0 text-slate-400">
            <span>Dành trọn tâm huyết cho học sinh lớp 1</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>

      {/* Modal: Confirm Reset Data */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-red-600 mb-2 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Xác nhận xóa dữ liệu để làm thực tế
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Hành động này sẽ xóa danh sách học sinh và kết quả khảo sát đang lưu trên trình duyệt để cô bắt đầu nhập dữ liệu nghiên cứu thực nghiệm mới cho lớp 1A3.
              Ngân hàng bài tập chuẩn GDPT 2018 sẽ được giữ nguyên.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                  alert('Đã xóa dữ liệu thành công. Bây giờ cô có thể thêm danh sách học sinh thực tế của lớp 1A3.');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Teacher Profile & Portrait Upload */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Thông tin Giáo viên nghiên cứu & Triển khai
            </h3>

            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="relative">
                {tempTeacher.avatarUrl ? (
                  <img
                    src={tempTeacher.avatarUrl}
                    alt={tempTeacher.teacherName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 font-bold text-lg flex items-center justify-center border-2 border-emerald-300">
                    {tempTeacher.teacherName.split(' ').slice(-1)[0]?.charAt(0) || 'T'}
                  </div>
                )}
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-xs cursor-pointer"
                  title="Tải ảnh chân dung của cô giáo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div>
                <p className="font-semibold text-slate-900">{tempTeacher.teacherName}</p>
                <p className="text-xs text-slate-500">{tempTeacher.schoolName}</p>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Cô có thể bấm vào biểu tượng máy ảnh để tải ảnh chân dung thực tế của mình lên báo cáo dự thi.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Họ và tên giáo viên:</label>
                <input
                  type="text"
                  value={tempTeacher.teacherName}
                  onChange={(e) => setTempTeacher({ ...tempTeacher, teacherName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Trường:</label>
                  <input
                    type="text"
                    value={tempTeacher.schoolName}
                    onChange={(e) => setTempTeacher({ ...tempTeacher, schoolName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Lớp thực nghiệm:</label>
                  <input
                    type="text"
                    value={tempTeacher.experimentalClass}
                    onChange={(e) => setTempTeacher({ ...tempTeacher, experimentalClass: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Địa phương:</label>
                  <input
                    type="text"
                    value={tempTeacher.location}
                    onChange={(e) => setTempTeacher({ ...tempTeacher, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Năm học:</label>
                  <input
                    type="text"
                    value={tempTeacher.schoolYear}
                    onChange={(e) => setTempTeacher({ ...tempTeacher, schoolYear: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowTeacherModal(false)}
                className="px-4 py-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  updateTeacherProfile(tempTeacher);
                  setShowTeacherModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
              >
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
