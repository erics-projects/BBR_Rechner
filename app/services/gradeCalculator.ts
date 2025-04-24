import { AllGradeInputs, GradeWithLevel, GradeStats } from '../types/grades';

export class GradeCalculator {
  private static countELevelGrades(grades: AllGradeInputs): {
    kernfaecherELevel: number;
    faecherELevel: number;
  } {
    const kernfaecherELevel = Object.values(grades.kernfaecher)
      .filter(g => g.level === 'E' && g.grade !== '' && parseInt(g.grade) <= 3)
      .length;
    
    const faecherELevel = Object.values(grades.faecher)
      .filter(g => g.level === 'E' && g.grade !== '' && parseInt(g.grade) <= 3)
      .length;

    return { kernfaecherELevel, faecherELevel };
  }

  private static checkUebergangGymnasialeOberstufe(
    grades: AllGradeInputs,
    average: number
  ): { qualified: boolean; reason?: string } {
    if (average > 3.0) {
      return {
        qualified: false,
        reason: `Notendurchschnitt ${average} ist schlechter als 3,0`
      };
    }

    // Check if all grades are 4 or better
    const allGrades = [
      ...Object.values(grades.kernfaecher),
      ...Object.values(grades.faecher)
    ];
    if (allGrades.some(g => g.grade !== '' && parseInt(g.grade) > 4)) {
      return {
        qualified: false,
        reason: 'Alle Noten müssen 4 oder besser sein'
      };
    }

    const { kernfaecherELevel, faecherELevel } = this.countELevelGrades(grades);

    // Need at least 2 E-Level grades in Kernfaecher with grade 3 or better
    if (kernfaecherELevel < 2) {
      return {
        qualified: false,
        reason: 'Mindestens 2 E-Kurse in Kernfächern mit Note 3 oder besser benötigt'
      };
    }

    // Need at least 3 E-Level grades in total with grade 3 or better
    const totalELevel = kernfaecherELevel + faecherELevel;
    if (totalELevel < 3) {
      return {
        qualified: false,
        reason: 'Insgesamt mindestens 3 E-Kurse mit Note 3 oder besser benötigt'
      };
    }

    return { qualified: true };
  }

  public static calculateGrades(grades: AllGradeInputs): GradeStats {
    // Get all numeric grades
    const kernfaecherGrades = Object.values(grades.kernfaecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.grade));

    const faecherGrades = Object.values(grades.faecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.grade));

    // Count grades
    const allGrades = [...kernfaecherGrades, ...faecherGrades];
    const gradeCount = allGrades.length;

    if (gradeCount === 0) {
      return {
        ebbrPassed: false,
        msaPassed: false,
        status: '',
        average: 0,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: undefined
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
        ebbrPassed: false,
        msaPassed: false,
        status: 'Nicht bestanden: 6 oder 2x5 in einem Kernfach.',
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Note 6 oder 2x5 in Kernfächern'
      };
    }

    if (hasMultipleSixInFaecher) {
      return {
        ebbrPassed: false,
        msaPassed: false,
        status: 'Nicht bestanden: 2x 6 in Fächer.',
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: '2x Note 6 in Fächern'
      };
    }

    // Count grades that are 2 or better and 3 or better
    const gradesThreeOrBetter = allGrades.filter(g => g <= 3).length;
    const gradesTwoOrBetter = allGrades.filter(g => g <= 2).length;

    // Handle single 6 in Fächer
    const singleSixInFaecher = faecherGrades.filter(g => g === 6).length === 1;
    if (singleSixInFaecher && gradesTwoOrBetter < 2) {
      return {
        ebbrPassed: false,
        msaPassed: false,
        status: 'Nicht bestanden: 1x 6 in Fächer und keine 2 zweien in Kernfächer und/oder Fächer.',
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Note 6 in Fächern ohne ausgleichende Noten'
      };
    }

    // Handle 5s
    const fivesInFaecher = faecherGrades.filter(g => g === 5).length;
    const fivesInKernfaecher = kernfaecherGrades.filter(g => g === 5).length;

    if (fivesInFaecher >= 2 && gradesThreeOrBetter < 2) {
      return {
        ebbrPassed: false,
        msaPassed: false,
        status: 'Nicht bestanden: 2x 5 in Fächer und nicht genug 3er.',
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: '2x Note 5 in Fächern ohne ausreichend gute Noten'
      };
    }

    if (fivesInKernfaecher >= 1 && fivesInFaecher >= 1 && gradesThreeOrBetter < 2) {
      return {
        ebbrPassed: false,
        msaPassed: false,
        status: 'Nicht bestanden: 1x 5 in Kernfächer und 1x 5 in Fächer und nicht genug 3er.',
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Note 5 in Kernfach und Fach ohne ausreichend gute Noten'
      };
    }

    // Count E-Level grades for MSA and Übergang checks
    const { kernfaecherELevel, faecherELevel } = this.countELevelGrades(grades);
    
    // Check MSA and Übergang Gymnasiale Oberstufe
    const uebergangResult = this.checkUebergangGymnasialeOberstufe(grades, average);

    // Check MSA (similar to Übergang requirements but with different thresholds)
    const msaPassed = average <= 3.0 &&
      kernfaecherELevel >= 2 &&
      (kernfaecherELevel + faecherELevel) >= 3;

    return {
      ebbrPassed: true,
      msaPassed,
      status: 'eBBR Bestanden',
      average,
      uebergangGymnasialeOberstufe: uebergangResult.qualified,
      uebergangReason: !uebergangResult.qualified ? uebergangResult.reason : undefined
    };
  }
}