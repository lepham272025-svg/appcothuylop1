import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Home,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Download,
  ShieldCheck,
  Star,
  Award,
  Smile,
  Heart,
} from 'lucide-react';
import { LearningItem, Subject } from '../types';

interface StudentSessionResult {
  studentCode: string;
  subject: Subject;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
}

export const OfflineStudentCornerView: React.FC = () => {
  const { learningItems, teacherProfile, students } = useApp();

  // Student station state
  const [activeStep, setActiveStep] = useState<'LOGIN' | 'CHOOSE_SUBJECT' | 'PRACTICE' | 'RESULT'>('LOGIN');
  const [studentCode, setStudentCode] = useState<string>('H01');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('TOAN');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Local storage results for this offline station
  const [stationHistory, setStationHistory] = useState<StudentSessionResult[]>([]);

  // Filter ONLY APPROVED items for kids!
  const practiceItems = learningItems.filter(
    (it) => it.status === 'APPROVED' && it.subject === selectedSubject
  );

  const currentItem = practiceItems[currentIndex] || practiceItems[0];

  /**
   * Speak friendly Vietnamese encouragement or question.
   * Strictly uses vi-VN speech synthesis or subtle web audio chime. Never speaks English!
   */
  const speakVietnamese = (text: string) => {
    if (!soundEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9; // clear and gentle for 6-year-olds

      // Find Vietnamese voice if available
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VN'));
      if (viVoice) {
        utterance.voice = viVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartPractice = (subj: Subject) => {
    setSelectedSubject(subj);
    setCurrentIndex(0);
    setScoreCount(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setActiveStep('PRACTICE');

    const firstItem = learningItems.find((it) => it.status === 'APPROVED' && it.subject === subj);
    if (firstItem) {
      speakVietnamese(`Chào bạn ${studentCode}! Chúng mình cùng làm bài môn ${subj === 'TOAN' ? 'Toán' : 'Tiếng Việt'} nhé!`);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !currentItem) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedAnswer === currentItem.correctAnswer;
    if (isCorrect) {
      setScoreCount((prev) => prev + 1);
      const praises = ['Tuyệt vời lắm! Cô khen em!', 'Chính xác rồi! Em giỏi quá!', 'Rất tốt! Em đã làm đúng!'];
      const chosenPraise = praises[Math.floor(Math.random() * praises.length)];
      setFeedbackMessage(chosenPraise);
      speakVietnamese(chosenPraise);
    } else {
      const encourages = ['Em hãy quan sát kỹ lại nhé!', 'Không sao cả, chúng mình thử lại một lần nữa nào!'];
      const chosenEncourage = encourages[Math.floor(Math.random() * encourages.length)];
      setFeedbackMessage(chosenEncourage);
      speakVietnamese(chosenEncourage);
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = currentIndex + 1;
    // Cap session at 4 questions to prevent tiring Grade 1 students
    const maxQuestions = Math.min(practiceItems.length, 4);

    if (nextIdx < maxQuestions) {
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setFeedbackMessage('');
      const nextItem = practiceItems[nextIdx];
      if (nextItem) {
        speakVietnamese(nextItem.questionText);
      }
    } else {
      // Completed session
      const result: StudentSessionResult = {
        studentCode,
        subject: selectedSubject,
        totalQuestions: maxQuestions,
        correctAnswers: scoreCount + (selectedAnswer === currentItem.correctAnswer ? 1 : 0),
        completedAt: new Date().toISOString(),
      };
      setStationHistory((prev) => [result, ...prev]);
      setActiveStep('RESULT');
      speakVietnamese(`Hoan hô bạn ${studentCode}! Em đã hoàn thành bài học hôm nay!`);
    }
  };

  const handleRedo = () => {
    setCurrentIndex(0);
    setScoreCount(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setFeedbackMessage('');
    setActiveStep('PRACTICE');
  };

  /**
   * Export the Standalone Single-File Offline Learning Corner HTML
   * This is a 100% self-contained HTML file that the teacher can copy to a USB
   * and run in rural schools with NO internet and NO server!
   */
  const exportStandaloneHtmlPackage = () => {
    const approvedData = learningItems.filter((it) => it.status === 'APPROVED');
    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Góc Học Tập Lớp 1 - Ngoại Tuyến (Trường TH Hiển Khánh)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { background: #f0fdf4; color: #1e293b; padding: 20px; display: flex; justify-content: center; }
    .container { max-width: 650px; width: 100%; background: #ffffff; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); padding: 24px; border: 3px solid #bbf7d0; }
    .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-size: 22px; font-weight: 800; color: #065f46; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .card { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 20px; }
    .question { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    .options { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px; }
    .btn-opt { font-size: 16px; font-weight: 600; padding: 14px 20px; border-radius: 12px; border: 2px solid #cbd5e1; background: #ffffff; cursor: pointer; text-align: left; transition: all 0.2s; }
    .btn-opt:hover { background: #f1f5f9; border-color: #94a3b8; }
    .btn-opt.selected { background: #e0f2fe; border-color: #0284c7; color: #0369a1; }
    .btn-opt.correct { background: #dcfce7; border-color: #22c55e; color: #15803d; }
    .btn-primary { width: 100%; font-size: 16px; font-weight: 700; padding: 14px; border-radius: 12px; border: none; background: #059669; color: #ffffff; cursor: pointer; }
    .btn-primary:hover { background: #047857; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">GÓI NGOẠI TUYẾN 100% · LỚP 1A3</div>
      <h1 class="title">GÓC HỌC TẬP LỚP 1</h1>
      <p class="subtitle">Trường Tiểu học Hiển Khánh · Cô Trịnh Thị Chung Thủy</p>
    </div>
    <div id="app">
      <div class="card">
        <p class="question">Chào em! Chúc em có một buổi học thật vui và bổ ích nhé.</p>
        <button class="btn-primary" onclick="startApp()">Bắt đầu học ngay</button>
      </div>
    </div>
  </div>
  <script>
    const items = ${JSON.stringify(approvedData, null, 2)};
    let currentIdx = 0;
    let selected = null;
    let score = 0;

    function startApp() {
      if (items.length === 0) {
        document.getElementById('app').innerHTML = '<p>Chưa có câu hỏi nào được duyệt.</p>';
        return;
      }
      renderQuestion();
    }

    function renderQuestion() {
      const q = items[currentIdx];
      selected = null;
      let optsHtml = q.options.map(opt => \`<button class="btn-opt" onclick="selectOpt(this, '\${opt}')">\${opt}</button>\`).join('');
      document.getElementById('app').innerHTML = \`
        <div class="card">
          <div style="font-size:12px;color:#64748b;margin-bottom:8px;">Câu \${currentIdx + 1}/\${items.length} · \${q.subject === 'TOAN' ? 'Toán' : 'Tiếng Việt'}</div>
          <div class="question">\${q.questionText}</div>
          <div class="options">\${optsHtml}</div>
          <button id="btn-submit" class="btn-primary" onclick="checkAnswer()">Kiểm tra kết quả</button>
        </div>
      \`;
    }

    function selectOpt(btn, opt) {
      document.querySelectorAll('.btn-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selected = opt;
    }

    function checkAnswer() {
      if (!selected) return alert('Em hãy chọn một đáp án nhé!');
      const q = items[currentIdx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score++;
      alert(isCorrect ? 'Tuyệt vời! Em làm đúng rồi!' : 'Em hãy cố gắng ở câu tiếp theo nhé!');
      currentIdx++;
      if (currentIdx < items.length) {
        renderQuestion();
      } else {
        document.getElementById('app').innerHTML = \`
          <div class="card" style="text-align:center;">
            <h2 style="color:#059669;margin-bottom:10px;">Hoan hô em đã hoàn thành bài!</h2>
            <p style="font-size:18px;margin-bottom:20px;">Em trả lời đúng \${score}/\${items.length} câu hỏi.</p>
            <button class="btn-primary" onclick="currentIdx=0;score=0;renderQuestion()">Học lại từ đầu</button>
          </div>
        \`;
      }
    }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'goc_hoc_tap_lop1_offline.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportStationResults = () => {
    const blob = new Blob([JSON.stringify(stationHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ket_qua_goc_hoc_tap_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Offline Security Guarantee Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Môi trường Học tập Ngoại tuyến 100% An toàn cho Trẻ 6 tuổi</span>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Không gọi API AI · Không thu thập dữ liệu · Không quảng cáo · Chỉ dùng bài tập cô {teacherProfile.teacherName} đã duyệt.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-white hover:bg-emerald-100 rounded-lg border border-emerald-200 cursor-pointer text-emerald-800"
            title={soundEnabled ? 'Tắt âm thanh hướng dẫn' : 'Bật âm thanh tiếng Việt'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={exportStandaloneHtmlPackage}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Tải gói HTML độc lập chạy ngoại tuyến không cần internet"
          >
            <Download className="w-3.5 h-3.5" /> Tải gói Offline (HTML)
          </button>
        </div>
      </div>

      {/* Screen 1: Student Code Selection */}
      {activeStep === 'LOGIN' && (
        <div className="bg-white rounded-3xl p-8 border-3 border-emerald-100 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl font-bold">
            🌱
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Chào em đến với Góc Học Tập Lớp 1!
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Lớp {teacherProfile.experimentalClass} · {teacherProfile.schoolName}
            </p>
          </div>

          <div className="max-w-xs mx-auto text-left">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Chọn mã số của em:
            </label>
            <select
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="w-full p-3 border-2 border-emerald-300 rounded-xl font-mono font-bold text-base bg-emerald-50/50 text-slate-800 focus:outline-hidden"
            >
              {students.map((s) => (
                <option key={s.id} value={s.code}>
                  Học sinh {s.code}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveStep('CHOOSE_SUBJECT')}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-base shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              Vào học ngay nhé!
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Choose Subject */}
      {activeStep === 'CHOOSE_SUBJECT' && (
        <div className="bg-white rounded-3xl p-8 border-3 border-emerald-100 shadow-md text-center space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Học sinh: {studentCode}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              Hôm nay em muốn luyện tập môn gì?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {/* Math Button */}
            <button
              onClick={() => handleStartPractice('TOAN')}
              className="p-6 rounded-2xl border-3 border-sky-300 bg-sky-50 hover:bg-sky-100 hover:border-sky-400 transition-all text-center cursor-pointer group active:scale-95 shadow-sm"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🔢</div>
              <h3 className="text-lg font-extrabold text-sky-950">Môn Toán Lớp 1</h3>
              <p className="text-xs text-sky-700 mt-1">Đếm số, so sánh và phép tính que tính vui nhộn</p>
            </button>

            {/* Vietnamese Button */}
            <button
              onClick={() => handleStartPractice('TIENG_VIET')}
              className="p-6 rounded-2xl border-3 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400 transition-all text-center cursor-pointer group active:scale-95 shadow-sm"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📖</div>
              <h3 className="text-lg font-extrabold text-emerald-950">Môn Tiếng Việt Lớp 1</h3>
              <p className="text-xs text-emerald-700 mt-1">Ghép âm, đọc tiếng và nhận biết chữ cái</p>
            </button>
          </div>

          <button
            onClick={() => setActiveStep('LOGIN')}
            className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ← Chọn lại mã học sinh
          </button>
        </div>
      )}

      {/* Screen 3: Interactive Practice Station */}
      {activeStep === 'PRACTICE' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-100 shadow-md space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep('CHOOSE_SUBJECT')}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
                title="Về trang chọn môn"
              >
                <Home className="w-5 h-5" />
              </button>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {selectedSubject === 'TOAN' ? 'Toán Lớp 1' : 'Tiếng Việt Lớp 1'} · Câu {currentIndex + 1}/4
                </span>
                <p className="text-xs text-emerald-700 font-semibold">Em: {studentCode}</p>
              </div>
            </div>

            <button
              onClick={() => speakVietnamese(currentItem?.questionText || '')}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              Nghe cô đọc
            </button>
          </div>

          {!currentItem ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p>Chưa có bài tập nào được duyệt cho môn này.</p>
              <button
                onClick={() => setActiveStep('CHOOSE_SUBJECT')}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs"
              >
                Chọn môn khác
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Text */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {currentItem.questionText}
                </h3>
              </div>

              {/* Visual Stage (Tactile counters for 6yo) */}
              {currentItem.visualType === 'counting_apples' && (
                <div className="p-5 bg-amber-50/60 rounded-2xl border-2 border-amber-200 text-center">
                  <span className="text-xs font-bold text-amber-800 block mb-2">Đồ dùng trực quan:</span>
                  <div className="flex justify-center items-center gap-3 text-4xl">
                    🍎 🍎 🍎
                  </div>
                </div>
              )}

              {currentItem.visualType === 'counting_stars' && (
                <div className="p-5 bg-sky-50 rounded-2xl border-2 border-sky-200 text-center">
                  <span className="text-xs font-bold text-sky-800 block mb-2">Đồ dùng trực quan:</span>
                  <div className="flex justify-center items-center gap-2 text-3xl">
                    ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐
                  </div>
                </div>
              )}

              {currentItem.visualType === 'letter_card' && (
                <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center">
                  <span className="text-xs font-bold text-emerald-800 block mb-2">Thẻ chữ mẫu:</span>
                  <div className="inline-block px-6 py-3 bg-white rounded-xl shadow-xs border-2 border-emerald-300 font-bold text-3xl text-emerald-950 font-serif">
                    {currentItem.correctAnswer}
                  </div>
                </div>
              )}

              {/* Big Touch-Friendly Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentItem.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = isAnswerChecked && opt === currentItem.correctAnswer;
                  const isWrong = isAnswerChecked && isSelected && !isCorrect;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isAnswerChecked}
                      className={`p-5 rounded-2xl border-3 text-left font-extrabold text-lg sm:text-xl transition-all cursor-pointer active:scale-95 flex items-center justify-between ${
                        isCorrect
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-md'
                          : isWrong
                          ? 'bg-rose-50 border-rose-400 text-rose-950'
                          : isSelected
                          ? 'bg-sky-100 border-sky-500 text-sky-950 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Banner in Vietnamese */}
              {feedbackMessage && (
                <div className={`p-4 rounded-2xl border-2 text-center text-sm font-bold flex items-center justify-center gap-2 ${
                  selectedAnswer === currentItem.correctAnswer
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                    : 'bg-amber-100 border-amber-300 text-amber-950'
                }`}>
                  <Smile className="w-5 h-5" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              {/* Bottom Nav: Check Answer vs Next Question */}
              <div className="pt-2 flex justify-end gap-3">
                {!isAnswerChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selectedAnswer}
                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold rounded-2xl text-base shadow-sm transition-transform cursor-pointer"
                  >
                    Kiểm tra kết quả
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto px-8 py-3.5 bg-sky-700 hover:bg-sky-800 text-white font-extrabold rounded-2xl text-base shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-transform"
                  >
                    <span>Câu tiếp theo</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Screen 4: Results and Encouragement */}
      {activeStep === 'RESULT' && (
        <div className="bg-white rounded-3xl p-8 border-3 border-emerald-100 shadow-md text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🎉
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Hoan hô bạn {studentCode}!
            </h2>
            <p className="text-sm text-emerald-800 font-semibold mt-1">
              Em đã hoàn thành rất tốt bài học hôm nay cùng cô {teacherProfile.teacherName}!
            </p>
          </div>

          <div className="p-6 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl max-w-sm mx-auto">
            <span className="text-xs text-emerald-800 uppercase font-bold tracking-wider block mb-1">
              Kết quả của em:
            </span>
            <div className="text-3xl font-extrabold text-emerald-900 tabular-nums">
              {scoreCount}/4 câu đúng
            </div>
            <p className="text-xs text-emerald-700 mt-2 font-medium">
              "Mỗi ngày một tiến bộ – Từng bước vững vàng!"
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRedo}
              className="px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" /> Làm lại bài này
            </button>

            <button
              onClick={() => setActiveStep('CHOOSE_SUBJECT')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Home className="w-4 h-4" /> Về chọn môn học
            </button>
          </div>

          {stationHistory.length > 0 && (
            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                onClick={exportStationResults}
                className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Xuất kết quả lưu trên máy ({stationHistory.length} phiên đã làm)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
