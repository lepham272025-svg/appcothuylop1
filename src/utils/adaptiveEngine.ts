import { AdaptiveRuleSettings, AdaptiveTier, AssessmentRecord } from '../types';

export const DEFAULT_ADAPTIVE_SETTINGS: AdaptiveRuleSettings = {
  mamThreshold: 50,
  choiThreshold: 80,
  minAssessmentsRequired: 5,
  minIndependentRequiredForHoa: 2,
};

export interface AdaptiveEvaluationResult {
  recommendedTier: AdaptiveTier;
  averageScore: number;
  totalAssessments: number;
  independentAssessments: number;
  reason: string;
  isSufficientData: boolean;
  pedagogicalSuggestion: string;
}

/**
 * Pure and deterministic adaptive rules engine.
 * Never labels students with stigmatizing terms; assigns developmental tier (Mầm, Chồi, Hoa).
 */
export function evaluateStudentTier(
  records: AssessmentRecord[],
  settings: AdaptiveRuleSettings = DEFAULT_ADAPTIVE_SETTINGS
): AdaptiveEvaluationResult {
  const validRecords = records.filter((r) => typeof r.score === 'number' && !isNaN(r.score));
  const total = validRecords.length;

  if (total < settings.minAssessmentsRequired) {
    return {
      recommendedTier: 'INSUFFICIENT_DATA',
      averageScore: total > 0 ? Math.round(validRecords.reduce((acc, r) => acc + r.score, 0) / total) : 0,
      totalAssessments: total,
      independentAssessments: validRecords.filter((r) => r.isIndependent).length,
      reason: `Đã có ${total}/${settings.minAssessmentsRequired} lượt đánh giá hợp lệ. Cần thêm ít nhất ${
        settings.minAssessmentsRequired - total
      } lượt đánh giá thực tế để đảm bảo độ tin cậy khoa học.`,
      isSufficientData: false,
      pedagogicalSuggestion: 'Tiếp tục quan sát trong giờ học và thực hiện thêm các phiếu khảo sát chẩn đoán ngắn.',
    };
  }

  const sum = validRecords.reduce((acc, r) => acc + r.score, 0);
  const avg = Math.round(sum / total);
  const independentCount = validRecords.filter((r) => r.isIndependent).length;

  // Evaluation logic
  if (avg < settings.mamThreshold) {
    return {
      recommendedTier: 'MAM',
      averageScore: avg,
      totalAssessments: total,
      independentAssessments: independentCount,
      reason: `Điểm trung bình ${avg}% (<${settings.mamThreshold}%). Học sinh cần được củng cố trọng tâm kỹ năng nền.`,
      isSufficientData: true,
      pedagogicalSuggestion:
        'Đề xuất nhiệm vụ mức MẦM: 3-4 câu ngắn, tăng tối đa hình ảnh trực quan (que tính, quả táo), chia nhỏ thao tác và có cô hướng dẫn gợi ý.',
    };
  }

  if (avg >= settings.choiThreshold) {
    // Condition for HOA: must have at least 2 independent assessments
    if (independentCount >= settings.minIndependentRequiredForHoa) {
      return {
        recommendedTier: 'HOA',
        averageScore: avg,
        totalAssessments: total,
        independentAssessments: independentCount,
        reason: `Điểm trung bình ${avg}% (>=${settings.choiThreshold}%) và đã hoàn thành ${independentCount} lần làm bài độc lập.`,
        isSufficientData: true,
        pedagogicalSuggestion:
          'Đề xuất nhiệm vụ mức HOA: Bài tập vận dụng thực tế nhẹ nhàng trong phạm vi chương trình lớp 1, phát huy tính chủ động và sáng tạo.',
      };
    } else {
      return {
        recommendedTier: 'CHOI',
        averageScore: avg,
        totalAssessments: total,
        independentAssessments: independentCount,
        reason: `Điểm trung bình ${avg}% rất tốt, nhưng mới có ${independentCount}/${settings.minIndependentRequiredForHoa} lần kiểm tra độc lập. Đề xuất giữ mức Chồi để củng cố độ bền vững trước khi nở Hoa.`,
        isSufficientData: true,
        pedagogicalSuggestion:
          'Tạo cơ hội để học sinh tự hoàn thành bài tập độc lập mà không cần trợ giúp, nhằm đủ điều kiện chuyển lên mức Hoa.',
      };
    }
  }

  // 50% <= avg < 80%
  return {
    recommendedTier: 'CHOI',
    averageScore: avg,
    totalAssessments: total,
    independentAssessments: independentCount,
    reason: `Điểm trung bình ${avg}% (${settings.mamThreshold}% đến dưới ${settings.choiThreshold}%). Đã nắm vững kiến thức cơ bản.`,
    isSufficientData: true,
    pedagogicalSuggestion:
      'Đề xuất nhiệm vụ mức CHỒI: Luyện tập vừa sức, kết hợp trắc nghiệm và nối ghép, khuyến khích học sinh tự hoàn thành độc lập.',
  };
}

export const TIER_CONFIG = {
  MAM: {
    label: 'Mầm',
    badgeText: 'Mức Mầm',
    colorText: 'text-amber-800',
    colorBg: 'bg-amber-50',
    colorBorder: 'border-amber-300',
    indicatorColor: '#F59E0B',
    description: 'Cần hỗ trợ, bài tập ngắn gọn, tăng que tính trực quan',
  },
  CHOI: {
    label: 'Chồi',
    badgeText: 'Mức Chồi',
    colorText: 'text-emerald-800',
    colorBg: 'bg-emerald-50',
    colorBorder: 'border-emerald-300',
    indicatorColor: '#10B981',
    description: 'Vừa sức, phát triển kỹ năng tự lập, bài tập đa dạng',
  },
  HOA: {
    label: 'Hoa',
    badgeText: 'Mức Hoa',
    colorText: 'text-sky-800',
    colorBg: 'bg-sky-50',
    colorBorder: 'border-sky-300',
    indicatorColor: '#0284C7',
    description: 'Thành thạo độc lập, bài tập vận dụng nhẹ trong chuẩn lớp 1',
  },
  INSUFFICIENT_DATA: {
    label: 'Chưa đủ dữ liệu',
    badgeText: 'Chưa đủ dữ liệu (Cần ≥5 lần)',
    colorText: 'text-slate-600',
    colorBg: 'bg-slate-100',
    colorBorder: 'border-slate-200',
    indicatorColor: '#94A3B8',
    description: 'Chưa đủ tối thiểu 5 lượt đánh giá hợp lệ',
  },
};
