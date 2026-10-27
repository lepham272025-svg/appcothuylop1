import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, BookOpen, Users, Compass, BrainCircuit, BarChart3, Award, Sparkles, MonitorPlay } from 'lucide-react';

interface HeaderProps {
  onOpenOfflineCorner: () => void;
  isOfflineMode: boolean;
  onExitOfflineMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOfflineCorner,
  isOfflineMode,
  onExitOfflineMode,
}) => {
  const { currentView, setCurrentView, teacherProfile } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: Compass },
    { id: 'students', label: 'Quản lý học sinh', icon: Users },
    { id: 'skills_map', label: 'Bản đồ năng lực', icon: BookOpen },
    { id: 'diagnostics', label: 'Khảo sát đầu vào', icon: BarChart3 },
    { id: 'ai_workshop', label: 'Xưởng học liệu AI', icon: Sparkles },
    { id: 'item_bank', label: 'Ngân hàng bài tập', icon: BookOpen },
    { id: 'assign_task', label: 'Giao nhiệm vụ', icon: BrainCircuit },
    { id: 'analytics', label: 'Thống kê & Biểu đồ', icon: BarChart3 },
    { id: 'dossier_report', label: 'Báo cáo & Minh chứng', icon: Award },
  ];

  if (isOfflineMode) {
    return (
      <header className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sprout className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">GÓC HỌC TẬP LỚP 1 · NGOẠI TUYẾN</h1>
              <p className="text-xs text-emerald-100 font-medium">100% an toàn cho trẻ em · Không kết nối AI bên ngoài · Lớp {teacherProfile.experimentalClass}</p>
            </div>
          </div>

          <button
            onClick={onExitOfflineMode}
            className="px-4 py-2 text-sm font-semibold text-emerald-950 bg-white hover:bg-emerald-50 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            Quay lại Trung tâm Giáo viên
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Main 3-Zone Header Contract */}
        <div className="flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark with Sprout Icon */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  MỖI EM MỘT BƯỚC AI
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  Lớp 1
                </span>
              </div>
              <p className="text-xs text-slate-500 whitespace-nowrap hidden sm:block">
                Mỗi học sinh một lộ trình – Mỗi ngày một tiến bộ
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links (single-line, clean unboxed) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Launch Student Offline Learning Corner) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenOfflineCorner}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              title="Mở Góc học tập ngoại tuyến dành cho học sinh làm bài tập"
            >
              <MonitorPlay className="w-4 h-4" />
              <span>Góc Học Tập Học Sinh</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto gap-1 pt-2 pb-1 border-t border-slate-100 mt-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-2.5 py-1 text-xs rounded whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-100 text-sky-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
