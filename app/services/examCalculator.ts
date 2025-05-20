import { ExamGrades } from '../types/grades';

export class ExamCalculator {
  public static calculateExamGrades(examGrades: ExamGrades): string {
    const grades = Object.entries(examGrades).map(([subject, value]) => ({
      subject,
      grade: value.level === 'E'
        ? (value.gradeE ? parseInt(value.gradeE) : NaN)
        : (value.gradeG ? parseInt(value.gradeG) : NaN),
      level: value.level
    }));

    // Check if all grades are filled
    if (grades.some(g => isNaN(g.grade))) {
      return '';
    }

    // Check for grade 6
    const gradesSix = grades.filter(g => g.grade === 6);
    if (gradesSix.length > 0) {
      const subjects = gradesSix.map(g => this.getSubjectDisplayName(g.subject)).join(', ');
      return `eBBR nicht bestanden: Note 6 in ${subjects}`;
    }

    // Check for multiple grade 5s
    const gradesFive = grades.filter(g => g.grade === 5);
    if (gradesFive.length >= 2) {
      const subjects = gradesFive.map(g => this.getSubjectDisplayName(g.subject)).join(', ');
      return `eBBR nicht bestanden: Note 5 in ${subjects}`;
    }

    // Check for single grade 5 with compensation
    if (gradesFive.length === 1) {
      const hasCompensation = grades.some(g => 
        g.grade <= 3 && g.subject !== gradesFive[0].subject
      );

      if (!hasCompensation) {
        const subject = this.getSubjectDisplayName(gradesFive[0].subject);
        return `eBBR nicht bestanden: Note 5 in ${subject} ohne ausgleichende Note (3 oder besser)`;
      }
    }

    return 'eBBR und MSA Prüfungen bestanden';
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