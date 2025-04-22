import { AllGradeInputs, GradeWithLevel, GradeStats } from '../types/grades';

export class GradeCalculator {
  private static checkUebergangGymnasialeOberstufe(
    grades: AllGradeInputs,
    average: number
  ): boolean {
    if (average > 3.0) return false;

    // Check if all grades are 4 or better
    const allGrades = [
      ...Object.values(grades.kernfaecher),
      ...Object.values(grades.faecher)
    ];
    if (allGrades.some(g => g.grade !== '' && parseInt(g.grade) > 4)) return false;

    // Count E-Level grades that are 3 or better in Kernfaecher
    const kernfaecherELevel = Object.values(grades.kernfaecher)
      .filter(g => g.level === 'E' && g.grade !== '' && parseInt(g.grade) <= 3)
      .length;
    
    // Count E-Level grades that are 3 or better in Faecher
    const faecherELevel = Object.values(grades.faecher)
      .filter(g => g.level === 'E' && g.grade !== '' && parseInt(g.grade) <= 3)
      .length;

    // Need at least 2 E-Level grades in Kernfaecher with grade 3 or better
    if (kernfaecherELevel < 2) return false;

    // Need at least 3 E-Level grades in total with grade 3 or better
    const totalELevel = kernfaecherELevel + faecherELevel;
    return totalELevel >= 3;
  }

  public static calculateGrades(grades: AllGradeInputs): GradeStats {
    // Get all numeric grades
    const kernfaecherGrades = Object.values(grades.kernfaecher)
      .filter(g => g.grade !== '')
      .map(g => parseInt(g.grade));

    const faecherGrades = Object.values(grades.faecher)
      .filter(g => g.grade !== '')
      .map(g => parseInt(g.grade));

    // Count grades
    const allGrades = [...kernfaecherGrades, ...faecherGrades];
    const gradeCount = allGrades.length;

    if (gradeCount === 0) {
      return {
        status: '',
        average: 0,
        uebergangGymnasialeOberstufe: false
      };
    }

    // Calculate average
    const average = Number((allGrades.reduce((a, b) => a + b, 0) / gradeCount).toFixed(1));

    // Check for failing conditions
    const hasSixInKernfaecher = kernfaecherGrades.includes(6);
    const hasMultipleFiveInKernfaecher = kernfaecherGrades.filter(g => g === 5).length > 1;
    const hasMultipleSixInFaecher = faecherGrades.filter(g => g === 6).length > 1;

    if (hasSixInKernfaecher || hasMultipleFiveInKernfaecher) {
      return {
        status: 'Nicht bestanden: 6 oder 2x5 in einem Kernfach.',
        average,
        uebergangGymnasialeOberstufe: false
      };
    }

    if (hasMultipleSixInFaecher) {
      return {
        status: 'Nicht bestanden: 2x 6 in Fächer.',
        average,
        uebergangGymnasialeOberstufe: false
      };
    }

    // Count grades that are 2 or better and 3 or better
    const gradesThreeOrBetter = allGrades.filter(g => g <= 3).length;
    const gradesTwoOrBetter = allGrades.filter(g => g <= 2).length;

    // Handle single 6 in Fächer
    const singleSixInFaecher = faecherGrades.filter(g => g === 6).length === 1;
    if (singleSixInFaecher && gradesTwoOrBetter < 2) {
      return {
        status: 'Nicht bestanden: 1x 6 in Fächer und keine 2 zweien in Kernfächer und/oder Fächer.',
        average,
        uebergangGymnasialeOberstufe: false
      };
    }

    // Handle 5s
    const fivesInFaecher = faecherGrades.filter(g => g === 5).length;
    const fivesInKernfaecher = kernfaecherGrades.filter(g => g === 5).length;

    if (fivesInFaecher >= 2 && gradesThreeOrBetter < 2) {
      return {
        status: 'Nicht bestanden: 2x 5 in Fächer und nicht genug 3er.',
        average,
        uebergangGymnasialeOberstufe: false
      };
    }

    if (fivesInKernfaecher >= 1 && fivesInFaecher >= 1 && gradesThreeOrBetter < 2) {
      return {
        status: 'Nicht bestanden: 1x 5 in Kernfächer und 1x 5 in Fächer und nicht genug 3er.',
        average,
        uebergangGymnasialeOberstufe: false
      };
    }

    // Check Übergang Gymnasiale Oberstufe
    const uebergangGymnasialeOberstufe = this.checkUebergangGymnasialeOberstufe(grades, average);

    return {
      status: 'Bestanden',
      average,
      uebergangGymnasialeOberstufe
    };
  }
}