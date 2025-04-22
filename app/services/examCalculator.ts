import { ExamGrades } from '../types/grades';

export class ExamCalculator {
  public static calculateExamGrades(examGrades: ExamGrades): string {
    // Check if all grades are filled
    const allGradesFilled = Object.values(examGrades).every(grade => grade !== '');
    if (!allGradesFilled) {
      return '';
    }

    // Check if all grades are 4 or less
    const allGradesPassing = Object.values(examGrades).every(grade => {
      const numGrade = parseInt(grade);
      return numGrade <= 4;
    });

    return allGradesPassing ? 'eBBR bestanden' : 'eBBR nicht bestanden';
  }
}