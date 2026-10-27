import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AdaptiveRuleSettings,
  AdaptiveTier,
  AssessmentRecord,
  AssignedTask,
  LearningItem,
  Skill,
  Student,
  TeacherProfile,
} from '../types';
import {
  DEFAULT_ADAPTIVE_SETTINGS,
  evaluateStudentTier,
} from '../utils/adaptiveEngine';
import {
  generateSampleClass1A3,
  INITIAL_BANK_ITEMS,
  INITIAL_SKILLS,
  INITIAL_TEACHER_PROFILE,
} from '../data/initialData';

interface AppContextType {
  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;

  // Teacher Profile
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => void;

  // Students
  students: Student[];
  addStudent: (code: string, notes?: string) => { success: boolean; message: string };
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  overrideStudentTier: (studentId: string, tier: AdaptiveTier, reason: string) => void;
  importStudentsCSV: (csvContent: string) => { success: boolean; count: number; message: string };
  exportStudentsCSV: () => void;
  loadSample1A3: () => void;

  // Skills
  skills: Skill[];
  toggleSkillTaught: (skillCode: string) => void;
  updateSkillNotes: (skillCode: string, notes: string) => void;

  // Assessments
  assessments: AssessmentRecord[];
  addAssessment: (record: Omit<AssessmentRecord, 'id'>) => void;
  updateAssessmentScore: (id: string, newScore: number, reason: string) => void;
  deleteAssessment: (id: string) => void;

  // Learning Items (Bank & Workshop)
  learningItems: LearningItem[];
  addLearningItem: (item: LearningItem) => void;
  approveItem: (id: string) => void;
  rejectItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<LearningItem>) => void;
  deleteItem: (id: string) => void;

  // Tasks
  tasks: AssignedTask[];
  createTask: (task: Omit<AssignedTask, 'id' | 'taskCode' | 'assignedDate'>) => string;
  deleteTask: (id: string) => void;

  // Adaptive Settings
  adaptiveSettings: AdaptiveRuleSettings;
  updateAdaptiveSettings: (newSettings: Partial<AdaptiveRuleSettings>) => void;

  // Helper calculations
  getStudentTierInfo: (studentCode: string, skillCode?: string) => ReturnType<typeof evaluateStudentTier>;
  hasRealSurveyData: boolean;

  // Data management
  resetAllData: () => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TEACHER: 'MOI_EM_MOT_BUOC_TEACHER_V1',
  STUDENTS: 'MOI_EM_MOT_BUOC_STUDENTS_V1',
  SKILLS: 'MOI_EM_MOT_BUOC_SKILLS_V1',
  ASSESSMENTS: 'MOI_EM_MOT_BUOC_ASSESSMENTS_V1',
  ITEMS: 'MOI_EM_MOT_BUOC_ITEMS_V1',
  TASKS: 'MOI_EM_MOT_BUOC_TASKS_V1',
  SETTINGS: 'MOI_EM_MOT_BUOC_SETTINGS_V1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Teacher Profile State
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHER);
      return saved ? JSON.parse(saved) : INITIAL_TEACHER_PROFILE;
    } catch {
      return INITIAL_TEACHER_PROFILE;
    }
  });

  // Students State (Starts empty or from storage, no hardcoded count as required by rule #9!)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Skills State
  const [skills, setSkills] = useState<Skill[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
      return saved ? JSON.parse(saved) : INITIAL_SKILLS;
    } catch {
      return INITIAL_SKILLS;
    }
  });

  // Assessments State
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Learning Items
  const [learningItems, setLearningItems] = useState<LearningItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return saved ? JSON.parse(saved) : INITIAL_BANK_ITEMS;
    } catch {
      return INITIAL_BANK_ITEMS;
    }
  });

  // Tasks
  const [tasks, setTasks] = useState<AssignedTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Settings
  const [adaptiveSettings, setAdaptiveSettings] = useState<AdaptiveRuleSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_ADAPTIVE_SETTINGS;
    } catch {
      return DEFAULT_ADAPTIVE_SETTINGS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(teacherProfile));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [teacherProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [skills]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [assessments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(learningItems));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [learningItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(adaptiveSettings));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [adaptiveSettings]);

  // Actions
  const updateTeacherProfile = (updates: Partial<TeacherProfile>) => {
    setTeacherProfile((prev) => ({ ...prev, ...updates }));
  };

  const addStudent = (code: string, notes?: string) => {
    const formattedCode = code.trim().toUpperCase();
    if (!formattedCode) {
      return { success: false, message: 'Vui lòng nhập mã học sinh (ví dụ: H01).' };
    }
    if (students.some((s) => s.code.toUpperCase() === formattedCode)) {
      return { success: false, message: `Mã học sinh ${formattedCode} đã tồn tại trong danh sách.` };
    }
    const newStudent: Student = {
      id: `STD_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      code: formattedCode,
      notes: notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => [...prev, newStudent]);
    return { success: true, message: `Đã thêm học sinh mã ${formattedCode} thành công.` };
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    if (!target) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Also remove assessments for this student
    setAssessments((prev) => prev.filter((a) => a.studentId !== id && a.studentCode !== target.code));
  };

  const overrideStudentTier = (studentId: string, tier: AdaptiveTier, reason: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, overrideTier: tier, overrideReason: reason } : s))
    );
  };

  const loadSample1A3 = () => {
    const sample = generateSampleClass1A3();
    setStudents(sample);
  };

  const importStudentsCSV = (csvContent: string) => {
    try {
      const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
      let count = 0;
      const newItems: Student[] = [];

      for (let i = 0; i < lines.length; i++) {
        // Skip header if present
        if (i === 0 && (lines[i].toLowerCase().includes('ma_hoc_sinh') || lines[i].toLowerCase().includes('code'))) {
          continue;
        }
        const parts = lines[i].split(',').map((p) => p.trim());
        const code = parts[0]?.toUpperCase();
        const notes = parts[1] || undefined;

        if (code && !students.some((s) => s.code.toUpperCase() === code) && !newItems.some((s) => s.code === code)) {
          newItems.push({
            id: `STD_${Date.now()}_${count}_${Math.random().toString(36).substring(2, 5)}`,
            code,
            notes,
            createdAt: new Date().toISOString(),
          });
          count++;
        }
      }

      if (count > 0) {
        setStudents((prev) => [...prev, ...newItems]);
        return { success: true, count, message: `Đã nhập thành công ${count} mã học sinh từ tệp CSV.` };
      }
      return { success: false, count: 0, message: 'Không tìm thấy mã học sinh hợp lệ hoặc tất cả mã đã tồn tại.' };
    } catch {
      return { success: false, count: 0, message: 'Định dạng tệp CSV không hợp lệ.' };
    }
  };

  const exportStudentsCSV = () => {
    const header = 'ma_hoc_sinh,ghi_chu_su_pham,ngay_tao\n';
    const rows = students
      .map((s) => `"${s.code}","${(s.notes || '').replace(/"/g, '""')}","${s.createdAt}"`)
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `danh_sach_hoc_sinh_lop1A3_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSkillTaught = (skillCode: string) => {
    setSkills((prev) =>
      prev.map((sk) => (sk.code === skillCode ? { ...sk, taughtStatus: !sk.taughtStatus } : sk))
    );
  };

  const updateSkillNotes = (skillCode: string, notes: string) => {
    setSkills((prev) =>
      prev.map((sk) => (sk.code === skillCode ? { ...sk, teacherNotes: notes } : sk))
    );
  };

  const addAssessment = (record: Omit<AssessmentRecord, 'id'>) => {
    const newRecord: AssessmentRecord = {
      ...record,
      id: `ASM_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      assessmentDate: record.assessmentDate || new Date().toISOString().slice(0, 10),
    };
    setAssessments((prev) => [...prev, newRecord]);
  };

  const updateAssessmentScore = (id: string, newScore: number, reason: string) => {
    setAssessments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const history = a.editHistory || [];
          return {
            ...a,
            score: newScore,
            updatedAt: new Date().toISOString(),
            editHistory: [
              ...history,
              {
                date: new Date().toISOString(),
                oldScore: a.score,
                newScore,
                reason,
              },
            ],
          };
        }
        return a;
      })
    );
  };

  const deleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  };

  const addLearningItem = (item: LearningItem) => {
    setLearningItems((prev) => [item, ...prev]);
  };

  const approveItem = (id: string) => {
    setLearningItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'APPROVED', updatedAt: new Date().toISOString() } : it))
    );
  };

  const rejectItem = (id: string) => {
    setLearningItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'REJECTED', updatedAt: new Date().toISOString() } : it))
    );
  };

  const updateItem = (id: string, updates: Partial<LearningItem>) => {
    setLearningItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updates, updatedAt: new Date().toISOString() } : it))
    );
  };

  const deleteItem = (id: string) => {
    setLearningItems((prev) => prev.filter((it) => it.id !== id));
  };

  const createTask = (task: Omit<AssignedTask, 'id' | 'taskCode' | 'assignedDate'>) => {
    const code = `NV_${Date.now().toString().slice(-6)}`;
    const newTask: AssignedTask = {
      ...task,
      id: `TASK_${Date.now()}`,
      taskCode: code,
      assignedDate: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return code;
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateAdaptiveSettings = (newSettings: Partial<AdaptiveRuleSettings>) => {
    setAdaptiveSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const getStudentTierInfo = (studentCode: string, skillCode?: string) => {
    const student = students.find((s) => s.code === studentCode);
    let studentAssessments = assessments.filter((a) => a.studentCode === studentCode);
    if (skillCode) {
      studentAssessments = studentAssessments.filter((a) => a.skillCode === skillCode);
    }
    const evalResult = evaluateStudentTier(studentAssessments, adaptiveSettings);

    // If teacher overrode tier
    if (student?.overrideTier) {
      return {
        ...evalResult,
        recommendedTier: student.overrideTier,
        reason: `[Giáo viên điều chỉnh trực tiếp]: ${student.overrideReason || 'Giáo viên đánh giá chuyên môn toàn diện.'}`,
      };
    }
    return evalResult;
  };

  const hasRealSurveyData = assessments.length > 0;

  const resetAllData = () => {
    setStudents([]);
    setAssessments([]);
    setTasks([]);
    setSkills(INITIAL_SKILLS);
    setLearningItems(INITIAL_BANK_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
  };

  const exportBackupJSON = () => {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      teacherProfile,
      students,
      skills,
      assessments,
      learningItems,
      tasks,
      adaptiveSettings,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sao_luu_MoiEmMotBuocAI_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importBackupJSON = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.skills)) {
        return { success: false, message: 'Tệp sao lưu không đúng định dạng của Mỗi Em Một Bước AI.' };
      }
      if (data.teacherProfile) setTeacherProfile(data.teacherProfile);
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.skills)) setSkills(data.skills);
      if (Array.isArray(data.assessments)) setAssessments(data.assessments);
      if (Array.isArray(data.learningItems)) setLearningItems(data.learningItems);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (data.adaptiveSettings) setAdaptiveSettings(data.adaptiveSettings);

      return { success: true, message: 'Khôi phục dữ liệu sao lưu thành công!' };
    } catch {
      return { success: false, message: 'Đọc tệp JSON thất bại.' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        teacherProfile,
        updateTeacherProfile,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        overrideStudentTier,
        importStudentsCSV,
        exportStudentsCSV,
        loadSample1A3,
        skills,
        toggleSkillTaught,
        updateSkillNotes,
        assessments,
        addAssessment,
        updateAssessmentScore,
        deleteAssessment,
        learningItems,
        addLearningItem,
        approveItem,
        rejectItem,
        updateItem,
        deleteItem,
        tasks,
        createTask,
        deleteTask,
        adaptiveSettings,
        updateAdaptiveSettings,
        getStudentTierInfo,
        hasRealSurveyData,
        resetAllData,
        exportBackupJSON,
        importBackupJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
