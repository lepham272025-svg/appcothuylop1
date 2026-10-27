import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Trash2,
  Download,
  Upload,
  Shield,
  FileSpreadsheet,
  Search,
  Filter,
  Sliders,
  Edit2,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { TIER_CONFIG } from '../utils/adaptiveEngine';
import { AdaptiveTier } from '../types';

export const StudentsView: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    overrideStudentTier,
    importStudentsCSV,
    exportStudentsCSV,
    loadSample1A3,
    getStudentTierInfo,
    teacherProfile,
  } = useApp();

  const [newCode, setNewCode] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  // Override Tier Dialog state
  const [overrideModalStudent, setOverrideModalStudent] = useState<{ id: string; code: string; currentTier: AdaptiveTier } | null>(null);
  const [selectedOverrideTier, setSelectedOverrideTier] = useState<AdaptiveTier>('CHOI');
  const [overrideReason, setOverrideReason] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addStudent(newCode, newNotes);
    if (res.success) {
      setNewCode('');
      setNewNotes('');
    } else {
      alert(res.message);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const res = importStudentsCSV(text);
          alert(res.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadSampleCSV = () => {
    const content = `ma_hoc_sinh,ghi_chu_su_pham\nH01,Học sinh nắm chắc phép cộng\nH02,Cần thêm que tính khi đếm\nH03,Đọc trơn tốt\nH04,Hay nhầm lẫn âm d và đ`;
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mau_danh_sach_hoc_sinh_lop1A3.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTier === 'ALL') return true;
    const tierInfo = getStudentTierInfo(s.code);
    return tierInfo.recommendedTier === filterTier;
  });

  return (
    <div className="space-y-6">
      {/* Title & Privacy Policy Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Quản lý Danh sách Mã Học sinh · Lớp {teacherProfile.experimentalClass}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Thực hiện đúng quy tắc ẩn danh: Sử dụng mã định danh (H01, H02...) để bảo vệ bí mật đời tư học sinh theo quy định của Bộ GD&ĐT.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={exportStudentsCSV}
              disabled={students.length === 0}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              title="Xuất danh sách học sinh thành tệp CSV"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất CSV
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Nhập danh sách mã từ tệp CSV"
            >
              <Upload className="w-3.5 h-3.5" />
              Nhập CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVUpload}
            />

            <button
              onClick={downloadSampleCSV}
              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-lg border border-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Tải CSV mẫu
            </button>
          </div>
        </div>

        {/* Form: Add Student */}
        <form onSubmit={handleAdd} className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Mã học sinh mới <span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              placeholder="VD: H01, H02, H15..."
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ghi chú sư phạm của giáo viên (tùy chọn):
            </label>
            <input
              type="text"
              placeholder="VD: Cần hỗ trợ que tính, phát âm tốt..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Thêm học sinh
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo mã học sinh (H01, H02...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        {/* Tier filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 overflow-x-auto">
          <button
            onClick={() => setFilterTier('ALL')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterTier === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Tất cả ({students.length})
          </button>
          <button
            onClick={() => setFilterTier('MAM')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterTier === 'MAM' ? 'bg-amber-100 text-amber-900 font-semibold' : 'hover:text-amber-900'
            }`}
          >
            Mầm
          </button>
          <button
            onClick={() => setFilterTier('CHOI')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterTier === 'CHOI' ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'hover:text-emerald-900'
            }`}
          >
            Chồi
          </button>
          <button
            onClick={() => setFilterTier('HOA')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterTier === 'HOA' ? 'bg-sky-100 text-sky-900 font-semibold' : 'hover:text-sky-900'
            }`}
          >
            Hoa
          </button>
          <button
            onClick={() => setFilterTier('INSUFFICIENT_DATA')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterTier === 'INSUFFICIENT_DATA' ? 'bg-slate-200 text-slate-900 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Chưa đủ dữ liệu
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {students.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Chưa có mã học sinh nào</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Cô có thể thêm thủ công từng mã học sinh hoặc nhấn nút bên dưới để tạo danh sách 32 em mẫu của lớp 1A3.
            </p>
            <button
              onClick={loadSample1A3}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Nạp mẫu 32 học sinh Lớp 1A3 (H01 - H32)
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Mã học sinh</th>
                  <th className="py-3 px-4">Tầng thích ứng hiện tại</th>
                  <th className="py-3 px-4">Số lần KS</th>
                  <th className="py-3 px-4">Điểm TB</th>
                  <th className="py-3 px-4">Ghi chú sư phạm</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => {
                  const tierInfo = getStudentTierInfo(std.code);
                  const isEditing = editingId === std.id;
                  const cfg = TIER_CONFIG[tierInfo.recommendedTier];

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Code */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800">
                          {std.code}
                        </span>
                        {std.overrideTier && (
                          <span className="ml-1.5 text-[10px] text-indigo-700 font-semibold bg-indigo-50 border border-indigo-200 px-1 py-0.5 rounded">
                            Cô điều chỉnh
                          </span>
                        )}
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${cfg.colorBg} ${cfg.colorText} border ${cfg.colorBorder}`}>
                          <span>{cfg.label}</span>
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate" title={tierInfo.reason}>
                          {tierInfo.reason}
                        </p>
                      </td>

                      {/* Assessment Count */}
                      <td className="py-3 px-4 tabular-nums text-slate-700">
                        {tierInfo.totalAssessments} lần ({tierInfo.independentAssessments} độc lập)
                      </td>

                      {/* Average Score */}
                      <td className="py-3 px-4 tabular-nums font-bold text-slate-900">
                        {tierInfo.totalAssessments > 0 ? `${tierInfo.averageScore}%` : '—'}
                      </td>

                      {/* Notes / Edit Notes */}
                      <td className="py-3 px-4 text-slate-600">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingNotes}
                              onChange={(e) => setEditingNotes(e.target.value)}
                              className="px-2 py-1 border border-sky-400 rounded text-xs w-full focus:outline-hidden"
                            />
                            <button
                              onClick={() => {
                                updateStudent(std.id, { notes: editingNotes });
                                setEditingId(null);
                              }}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <span>{std.notes || <span className="text-slate-300 italic">Chưa có ghi chú</span>}</span>
                            <button
                              onClick={() => {
                                setEditingId(std.id);
                                setEditingNotes(std.notes || '');
                              }}
                              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                              title="Sửa ghi chú"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setOverrideModalStudent({
                                id: std.id,
                                code: std.code,
                                currentTier: tierInfo.recommendedTier,
                              });
                              setSelectedOverrideTier(
                                tierInfo.recommendedTier !== 'INSUFFICIENT_DATA'
                                  ? tierInfo.recommendedTier
                                  : 'CHOI'
                              );
                              setOverrideReason(std.overrideReason || '');
                            }}
                            className="px-2 py-1 text-[11px] text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 transition-colors cursor-pointer"
                            title="Điều chỉnh tầng thích ứng cho học sinh này"
                          >
                            <Sliders className="w-3 h-3 text-slate-500" />
                            Điều chỉnh tầng
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Cô có chắc chắn muốn xóa mã học sinh ${std.code}? Toàn bộ lịch sử khảo sát của mã này cũng sẽ bị xóa.`)) {
                                deleteStudent(std.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Xóa học sinh này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Override Tier */}
      {overrideModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Điều chỉnh tầng thích ứng cho học sinh {overrideModalStudent.code}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Theo quy định sư phạm, giáo viên có toàn quyền chuyên môn ghi đè gợi ý của thuật toán nếu nhận thấy học sinh có sự tiến bộ hoặc cần hỗ trợ đặc biệt trong lớp.
            </p>

            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Chọn tầng thích ứng mong muốn:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MAM', 'CHOI', 'HOA'] as AdaptiveTier[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedOverrideTier(t)}
                      className={`p-2.5 rounded-lg border text-center font-semibold cursor-pointer transition-colors ${
                        selectedOverrideTier === t
                          ? 'border-sky-600 bg-sky-50 text-sky-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {TIER_CONFIG[t].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Lý do sư phạm của cô giáo:
                </label>
                <textarea
                  rows={2}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="VD: Em tiến bộ rõ rệt trong giờ thực hành que tính trên lớp..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOverrideModalStudent(null)}
                className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  overrideStudentTier(overrideModalStudent.id, selectedOverrideTier, overrideReason);
                  setOverrideModalStudent(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
              >
                Lưu điều chỉnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
