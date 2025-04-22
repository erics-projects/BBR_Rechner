import { AllGradeInputs, KernfaecherInputs, FaecherInputs } from '../types/grades';

interface GradeCounts {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  '6': number;
}

interface CalculationResult {
  status: string;
  kernfaecher: string;
  faecher: string;
}

export class GradeCalculator {
  private static countGradesForCategory(grades: KernfaecherInputs | FaecherInputs): GradeCounts {
    const counts: GradeCounts = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 };
    (Object.values(grades) as string[]).forEach(grade => {
      if (grade !== '') {
        counts[grade as keyof GradeCounts]++;
      }
    });
    return counts;
  }

  private static countGradesUpTo(grades: KernfaecherInputs | FaecherInputs, maxGrade: number): number {
    return (Object.values(grades) as string[]).filter(grade => {
      const numGrade = parseInt(grade);
      return grade !== '' && numGrade <= maxGrade;
    }).length;
  }

  public static calculateGrades(grades: AllGradeInputs): CalculationResult {
    const kernfaecherCounts = this.countGradesForCategory(grades.kernfaecher);
    const faecherCounts = this.countGradesForCategory(grades.faecher);

    let kernfaecher3orBetter = this.countGradesUpTo(grades.kernfaecher, 3);
    let faecher3orBetter = this.countGradesUpTo(grades.faecher, 3);
    let kernfaecherFaecher3orBetter = kernfaecher3orBetter + faecher3orBetter;

    let kernfaecher2orBetter = this.countGradesUpTo(grades.kernfaecher, 2);
    let faecher2orBetter = this.countGradesUpTo(grades.faecher, 2);
    let kernfaecherFaecher2orBetter = kernfaecher2orBetter + faecher2orBetter;

    // Check for failing conditions
    if (kernfaecherCounts['6'] > 0 || kernfaecherCounts['5'] > 1) {
      return {
        status: 'Nicht bestanden: 6 oder 2x5 in einem Kernfach.',
        kernfaecher: '',
        faecher: ''
      };
    }

    if (faecherCounts['6'] > 1) {
      return {
        status: 'Nicht bestanden: 2x 6 in Fächer.',
        kernfaecher: '',
        faecher: ''
      };
    }

    // Handle single 6 in Fächer
    if (faecherCounts['6'] === 1) {
      if (kernfaecherFaecher2orBetter >= 2) {
        kernfaecherFaecher2orBetter -= 2;
        kernfaecherFaecher3orBetter -= 2;
        faecherCounts['6'] -= 1;

        if (faecher2orBetter >= 2) {
          faecher3orBetter -= 2;
          faecher2orBetter -= 2;
        } else if (faecher2orBetter === 1 && kernfaecher2orBetter >= 1) {
          faecher3orBetter -= 1;
          kernfaecher3orBetter -= 1;
          faecher2orBetter -= 1;
          kernfaecher2orBetter -= 1;
        } else if (kernfaecher2orBetter >= 2) {
          kernfaecher3orBetter -= 2;
          kernfaecher2orBetter -= 2;
        }
      } else {
        return {
          status: 'Nicht bestanden: 1x 6 in Fächer und keine 2 zweien in Kernfächer und/oder Fächer.',
          kernfaecher: '',
          faecher: ''
        };
      }
    }

    // Handle 5s in both categories
    if (kernfaecherCounts['5'] >= 1 && faecherCounts['5'] >= 1) {
      if (kernfaecher3orBetter > 1 || (kernfaecher3orBetter === 1 && faecher3orBetter >= 1)) {
        kernfaecherFaecher3orBetter -= 2;
        kernfaecherCounts['5'] -= 1;

        if (faecher3orBetter >= 1) {
          faecher3orBetter -= 1;
          faecherCounts['5'] -= 1;
        } else if (kernfaecher3orBetter > 1) {
          kernfaecher3orBetter -= 1;
          kernfaecherCounts['5'] -= 1;
        }
      } else {
        return {
          status: 'Nicht bestanden: 1x 5 in Kernfächer und 1x 5 in Fächer und nicht genug 3er.',
          kernfaecher: '',
          faecher: ''
        };
      }
    }

    // Handle two 5s in Fächer
    if (faecherCounts['5'] >= 2) {
      if (kernfaecherFaecher3orBetter >= 2) {
        faecherCounts['5'] -= 2;
        kernfaecherFaecher3orBetter -= 2;
      } else {
        return {
          status: 'Nicht bestanden: 2x 5 in Fächer und nicht genug 3er.',
          kernfaecher: '',
          faecher: ''
        };
      }
    }

    // Create summary strings
    const kernfaecherSummary = `Kernfächer: ${Object.entries(kernfaecherCounts)
      .filter(([_, count]) => count > 0)
      .map(([grade, count]) => `Note ${grade}: ${count}x`)
      .join(', ')}`;

    const faecherSummary = `Fächer: ${Object.entries(faecherCounts)
      .filter(([_, count]) => count > 0)
      .map(([grade, count]) => `Note ${grade}: ${count}x`)
      .join(', ')}`;

    return {
      status: 'Bestanden: ',
      kernfaecher: kernfaecherSummary,
      faecher: faecherSummary
    };
  }
}