import { ExamGrades } from '../types/grades';

export class ExamCalculator {
  public static calculateExamGrades(examGrades: ExamGrades): string {
    // Check if all grades are filled
    const allGradesFilled = Object.values(examGrades).every(grade => grade !== '');
    if (!allGradesFilled) {
      return '';
    }

    // Count grades and convert to numbers
    const numericGrades = Object.entries(examGrades).map(([subject, grade]) => ({
      subject,
      value: parseInt(grade)
    }));

    // Check for grade 6
    const gradesSix = numericGrades.filter(g => g.value === 6);
    if (gradesSix.length > 0) {
      const subjects = gradesSix.map(g => this.getSubjectDisplayName(g.subject)).join(', ');
      return `eBBR nicht bestanden: Note 6 in ${subjects}`;
    }

    // Count grade 5s
    const gradesFive = numericGrades.filter(g => g.value === 5);
    if (gradesFive.length >= 2) {
      const subjects = gradesFive.map(g => this.getSubjectDisplayName(g.subject)).join(', ');
      return `eBBR nicht bestanden: Note 5 in ${subjects}`;
    }

    // Handle single grade 5
    if (gradesFive.length === 1) {
      // Check for compensating grades (3 or better)
      const hasCompensatingGrade = numericGrades.some(g => g.value <= 3 && g.subject !== gradesFive[0].subject);
      
      if (!hasCompensatingGrade) {
        const subject = this.getSubjectDisplayName(gradesFive[0].subject);
        return `eBBR nicht bestanden: Note 5 in ${subject} ohne ausgleichende Note (3 oder besser)`;
      }
    }

    return 'eBBR bestanden';
  }

  private static getSubjectDisplayName(subject: string): string {
    const displayNames: Record<string, string> = {
      deutsch: 'Deutsch',
      mathematik: 'Mathematik',
      fremdsprache: '1. Fremdsprache',
      praesentation: 'Präsentation'
    };
    return displayNames[subject] || subject;
  }
}