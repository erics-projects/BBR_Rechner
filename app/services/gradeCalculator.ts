import { AllGradeInputs, GradeWithLevel, GradeStats } from '../types/grades';

export class GradeCalculator {
  private static countELevelGrades(grades: AllGradeInputs): {
    kernfaecherELevel: number;
    faecherELevel: number;
  } {
    const kernfaecherELevel = Object.values(grades.kernfaecher)
      .filter(g => g.level === 'E' && g.gradeE && parseInt(g.gradeE) <= 3)
      .length;
    
    const faecherELevel = Object.values(grades.faecher)
      .filter(g => g.level === 'E' && g.gradeE && parseInt(g.gradeE) <= 3)
      .length;

    return { kernfaecherELevel, faecherELevel };
  }

  private static checkUebergangGymnasialeOberstufe(
    grades: AllGradeInputs,
    averageE: number
  ): { qualified: boolean; reason?: string } {
    if (averageE > 3.0) {
      return {
        qualified: false,
        reason: `Notendurchschnitt ${averageE} ist schlechter als 3,0`
      };
    }

    // Check if all grades are 4 or better
    const allGrades = [
      ...Object.values(grades.kernfaecher),
      ...Object.values(grades.faecher)
    ];
    // For Übergang, we only check E-level grades
    const eGrades = allGrades.filter(g => g.level === 'E');
    if (eGrades.some(g => g.gradeE && parseInt(g.gradeE) > 4)) {
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

    // Need at least 2 E-Level grades in total with grade 3 or better
    const totalELevel = kernfaecherELevel + faecherELevel;
    if (totalELevel < 2) {
      return {
        qualified: false,
        reason: 'Insgesamt mindestens 2 E-Kurse mit Note 3 oder besser benötigt'
      };
    }

    return { qualified: true };
  }

  private static calculateBBRGrades(grades: AllGradeInputs): {
    bbrPassed: boolean;
    bbrStatus: string;
    ebbrPassed: boolean;
    ebbrStatus: string;
    averageG: number;
  } {
    // Always use gradeG for BBR/eBBR calculations
    const kernfaecherGrades = Object.values(grades.kernfaecher)
      .filter(g => g.points !== '')
      .map(g => g.level === 'E' ? parseInt(g.gradeE) : parseInt(g.gradeG));

    const faecherGrades = Object.values(grades.faecher)
      .filter(g => g.points !== '')
      .map(g => g.level === 'E' ? parseInt(g.gradeE) : parseInt(g.gradeG));

    // Count grades
    const allGrades = [...kernfaecherGrades, ...faecherGrades];
    const gradeCount = allGrades.length;

    if (gradeCount === 0) {
      return {
        bbrPassed: false,
        bbrStatus: 'Keine Noten eingegeben',
        ebbrPassed: false,
        ebbrStatus: 'Keine Noten eingegeben',
        averageG: 0
      };
    }

    // Calculate G average
    const averageG = Number((allGrades.reduce((a, b) => a + b, 0) / gradeCount).toFixed(1));

    // Check BBR conditions using gradeG
    const deutschGrade = parseInt(grades.kernfaecher.deutsch.gradeG);
    const matheGrade = parseInt(grades.kernfaecher.mathe.gradeG);
    
    // Determine BBR status and reason
    let bbrPassed = false;
    let bbrStatus = '';
  
    if (isNaN(deutschGrade) || isNaN(matheGrade)) {
      return {
        bbrPassed: false,
        bbrStatus: 'BBR: Nicht bestanden, weil Deutsch oder Mathematik nicht belegt wurde.',
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden, weil Deutsch oder Mathematik nicht belegt wurde.',
        averageG: 0
      };
    }

    if (averageG > 4.2) {
      return {
        bbrPassed: false,
        bbrStatus: `BBR: Nicht bestanden, weil der Notendurchschnitt ${averageG} über 4,2 ist.`,
        ebbrPassed: false,
        ebbrStatus: `eBBR: Nicht bestanden, weil der Notendurchschnitt ${averageG} über 4,2 ist.`,
        averageG
      };
    }

    if (deutschGrade === 6) {
      bbrPassed = false;
      bbrStatus = 'BBR: Nicht bestanden, weil Deutsch mit Note 6 bewertet wurde.';
    } else if (matheGrade === 6) {
      bbrPassed = false;
      bbrStatus = 'BBR: Nicht bestanden, weil Mathematik mit Note 6 bewertet wurde.';
    } else if ((deutschGrade + matheGrade) > 9) {
      bbrPassed = false;
      bbrStatus = `BBR: Nicht bestanden, weil die Noten in Deutsch und Mathematik beide schlechter als 4 sind.`;
    } else {
      bbrPassed = true;
      bbrStatus = 'BBR: Bestanden';
    }

    // Check for failing conditions
    const hasSixInKernfaecher = kernfaecherGrades.includes(6);
    const hasMultipleFiveInKernfaecher = kernfaecherGrades.filter(g => g === 5).length > 1;
    const hasMultipleSixInFaecher = faecherGrades.filter(g => g === 6).length > 1;

    // Early exit conditions for BBR/eBBR
    if (hasSixInKernfaecher || hasMultipleFiveInKernfaecher) {
      return {
        bbrPassed: false,
        bbrStatus: 'BBR: Nicht bestanden wegen 6 oder 2x5 in einem Kernfach',
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 6 oder 2x5 in einem Kernfach',
        averageG
      };
    }

    if (hasMultipleSixInFaecher) {
      return {
        bbrPassed: false,
        bbrStatus: 'BBR: Nicht bestanden wegen 2x 6 in Fächer',
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 2x 6 in Fächer',
        averageG
      };
    }

    // Count grades that are 2 or better and 3 or better 
    // only kernfaecher
    let gradesTwoOrBetterKF = kernfaecherGrades.filter(g => g <= 2).length;
    let gradesThreeOrBetterKF = kernfaecherGrades.filter(g => g <= 3).length;
    // only faecher
    let gradesTwoOrBetterF = faecherGrades.filter(g => g <= 2).length;
    let gradesThreeOrBetterF = faecherGrades.filter(g => g <= 3).length;
    // both
    let gradesThreeOrBetter = allGrades.filter(g => g <= 3).length;
    let gradesTwoOrBetter = allGrades.filter(g => g <= 2).length;

    // Handle single 6 in Fächer
    const singleSixInFaecher = faecherGrades.filter(g => g === 6).length === 1;
    if (singleSixInFaecher) {

      if (gradesTwoOrBetter >= 2) {
        gradesTwoOrBetter -= 2;
        gradesThreeOrBetter -= 2;

        if (gradesTwoOrBetterF >= 2) {
          gradesThreeOrBetterF -= 2;
          gradesTwoOrBetterF -= 2;
          
        } else if (gradesTwoOrBetterF === 1 && gradesTwoOrBetterKF >= 1) {
          gradesThreeOrBetterF -= 1;
          gradesThreeOrBetterKF -= 1;
          gradesTwoOrBetterF -= 1;
          gradesTwoOrBetterKF -= 1;
        } else if (gradesTwoOrBetterKF >= 2) {
          gradesThreeOrBetterKF -= 2;
          gradesTwoOrBetterKF -= 2;
        }
    
      } 
      else {

      return {
        bbrPassed: false,
        bbrStatus: 'BBR: Nicht bestanden wegen 1x 6 in Fächer ohne ausgleichende Noten',
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 1x 6 in Fächer ohne ausgleichende Noten',
        averageG
      };
    } 
    }

    // Handle 5s
    let fivesInFaecher = faecherGrades.filter(g => g === 5).length;
    let fivesInKernfaecher = kernfaecherGrades.filter(g => g === 5).length;
    const allFives = fivesInFaecher + fivesInKernfaecher;
    if (singleSixInFaecher && allFives > 3) {
      return {
        bbrPassed: false,
        bbrStatus: 'BBR: Nicht bestanden wegen zu vielen Durchfallkriterien',
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 1x 6 und mehr als 4 x 5',
        averageG
      }
    }
    if (allFives > 5) {
      return {
        bbrPassed: false,
        bbrStatus: 'BBR: Nicht bestanden, mehr als 5 x 5',
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden, mehr als 5 x 5',
        averageG
      }
    }
    if (fivesInKernfaecher == 1 && fivesInFaecher >= 5) {
      return {
        bbrPassed: false,
        bbrStatus: 'BBR: Nicht bestanden, 1x5 in Kernfach und 5x5 in Fächer',
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden, 1x5 in Kernfach und 5x5 in Fächer',
        averageG
      }
    }

    if (fivesInKernfaecher >= 1 && fivesInFaecher >= 1 ) {
      console.log('Fives in Kernfächer and Fächer:');
      
        if (gradesThreeOrBetterKF > 1 || (gradesThreeOrBetterKF === 1 && gradesThreeOrBetterF >= 1)) {
          console.log('Fives in Kernfächer and Fächer: 1x 5 in Kernfächer and 1x 5 in Fächer');
          gradesThreeOrBetterKF -= 1;
          gradesThreeOrBetter -= 1;
          fivesInKernfaecher -= 1;
  
          if (gradesThreeOrBetterF >= 1) {
            console.log('Fives in Fächer: 1x 5 in Fächer');
            gradesThreeOrBetterF -= 1;
            gradesThreeOrBetter -= 1;
            fivesInFaecher -= 1;
          } else if (gradesThreeOrBetterKF > 1) {
            console.log('Fives in Kernfächer: 1x 5 in Kernfächer');
            gradesThreeOrBetterKF -= 1;
            gradesThreeOrBetter -= 1;
            fivesInKernfaecher -= 1;
          }
        } else {
      return {
        bbrPassed: false,
        bbrStatus: 'BBR: Nicht bestanden wegen 5 in Kernfach und Fächer ohne Ausgleich',
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 5 in Kernfach und Fächer ohne Ausgleich',
        averageG
      };
    }
  }

    if (fivesInFaecher >= 2) {
        if (gradesThreeOrBetter >= 2) {
          fivesInFaecher -= 2;
          gradesThreeOrBetter -= 2;
          gradesThreeOrBetterF -= 2;
    
        } else {
          return {
            bbrPassed: false,
            bbrStatus: 'BBR: Nicht bestanden wegen 2x5 in Fächer ohne Ausgleich',
            ebbrPassed: false,
            ebbrStatus: 'eBBR: Nicht bestanden wegen 2x5 in Fächer ohne Ausgleich',
            averageG
          };
    }
  }
  

    

    return {
      bbrPassed: true,
      bbrStatus: 'BBR: Bestanden',
      ebbrPassed: true,
      ebbrStatus: 'eBBR: Bestanden',
      averageG
    };
  }

  private static calculateMSAGrades(grades: AllGradeInputs): {
    msaPassed: boolean;
    msaStatus: string;
    averageE: number;
    uebergangGymnasialeOberstufe: boolean;
    uebergangReason: string;
  } {
    // Get all grades - always use gradeE for MSA calculations
    const kernfaecherGrades = Object.values(grades.kernfaecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.gradeE));

    const faecherGrades = Object.values(grades.faecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.gradeE));

    // Count grades
    const allGrades = [...kernfaecherGrades, ...faecherGrades];
    const gradeCount = allGrades.length;

    if (gradeCount === 0) {
      return {
        msaPassed: false,
        msaStatus: 'MSA: Keine Noten eingegeben',
        averageE: 0,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Übergang Gymnasiale Oberstufe: Nein, keine Noten eingegeben'
      };
    }

    // Calculate E average
    const averageE = Number((allGrades.reduce((a, b) => a + b, 0) / gradeCount).toFixed(1));

    // Count E-Level grades for MSA and Übergang checks
    const { kernfaecherELevel, faecherELevel } = this.countELevelGrades(grades);
    
    // Check MSA and Übergang Gymnasiale Oberstufe
    const uebergangResult = this.checkUebergangGymnasialeOberstufe(grades, averageE);

    // Check MSA with detailed reason
    let msaPassed = false;
    let msaStatus = '';
    const totalELevel = kernfaecherELevel + faecherELevel;
    if (averageE > 3.0) {
      msaPassed = false;
      msaStatus = `MSA: Nicht bestanden, Notendurchschnitt ${averageE} ist über 3,0`;
    } else if (totalELevel < 2) {
      msaPassed = false;
      msaStatus = 'MSA: Nicht bestanden, weniger als 2 E-Kurse mit Note 3 oder besser';
    } else {
      msaPassed = true;
      msaStatus = 'MSA: Bestanden';
    }

    // Update Übergang status to include reason in success message
    const uebergangStatus = uebergangResult.qualified
      ? 'Übergang Gymnasiale Oberstufe: Ja'
      : `Übergang Gymnasiale Oberstufe: Nein, ${uebergangResult.reason}`;

    return {
      msaPassed,
      msaStatus,
      averageE,
      uebergangGymnasialeOberstufe: uebergangResult.qualified,
      uebergangReason: uebergangStatus
    };
  }

  public static calculateGrades(grades: AllGradeInputs): GradeStats {
    const bbrResults = this.calculateBBRGrades(grades);
    const msaResults = this.calculateMSAGrades(grades);

    return {
      ...bbrResults,
      ...msaResults
    };
  }
}