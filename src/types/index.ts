export type Subject = 'TOAN' | 'TIENG_VIET';

export type AdaptiveTier = 'MAM' | 'CHOI' | 'HOA' | 'INSUFFICIENT_DATA';

export type QuestionFormat = 'multiple_choice' | 'matching' | 'fill_in' | 'visual_counting';

export interface Student {
  id: string;
  code: string; // e.g. H01, H02, H03...
  createdAt: string;
  notes?: string;
  assignedTier?: AdaptiveTier;
  overrideTier?: AdaptiveTier;
  overrideReason?: string;
}

export interface Skill {
  id: string;
  code: string; // e.g. TOAN_01, TV_01
  subject: Subject;
  name: string;
  objective: string;
  curriculumTopic: string;
  taughtStatus: boolean; // true = đã dạy, false = chưa dạy (Strict: un-taught can NEVER be assigned!)
  surveyDate?: string;
  preScoreAvg?: number;
  postScoreAvg?: number;
  teacherNotes?: string;
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  studentCode: string;
  skillCode: string;
  subject: Subject;
  testType: 'PRE' | 'POST' | 'PERIODIC';
  testForm: 'FORM_A' | 'FORM_B'; // Form A / Form B equivalence
  assessmentDate: string;
  score: number; // 0 to 100
  isIndependent: boolean; // Làm độc lập vs Có cô hỗ trợ
  rubricNotes?: string;
  updatedAt?: string;
  editHistory?: {
    date: string;
    oldScore: number;
    newScore: number;
    reason: string;
  }[];
}

export interface LearningItem {
  id: string;
  code: string;
  skillCode: string;
  subject: Subject;
  tier: 'MAM' | 'CHOI' | 'HOA';
  objective: string;
  questionText: string;
  questionType: QuestionFormat;
  options: string[];
  correctAnswer: string;
  explanation: string;
  visualHint?: string;
  visualType?: 'counting_apples' | 'counting_stars' | 'number_line' | 'letter_card' | 'shape_blocks' | 'simple_text';
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  source: 'AI_SUGGESTED' | 'TEACHER_CREATED' | 'OFFICIAL_BANK';
  verifiedMath?: boolean;
  mathVerificationNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AssignedTask {
  id: string;
  taskCode: string;
  title: string;
  subject: Subject;
  targetTier: 'MAM' | 'CHOI' | 'HOA';
  studentCodes: string[];
  itemIds: string[];
  durationMinutes: number; // 5-10 minutes
  assignedDate: string;
  status: 'ACTIVE' | 'COMPLETED';
  instructions: string;
}

export interface TeacherProfile {
  teacherName: string;
  schoolName: string;
  location: string;
  experimentalClass: string;
  schoolYear: string;
  avatarUrl: string;
  prepTimeSavedHours: number;
}

export interface AdaptiveRuleSettings {
  mamThreshold: number; // default 50
  choiThreshold: number; // default 80
  minAssessmentsRequired: number; // default 5
  minIndependentRequiredForHoa: number; // default 2
}

export interface StudentProgressResult {
  studentCode: string;
  skillCode: string;
  preScore?: number;
  postScore?: number;
  delta?: number;
  tier: AdaptiveTier;
  assessmentsCount: number;
  independentCount: number;
}
