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
        ebbrStatus: 'Keine Noten eingegeben',
        msaPassed: false,
        msaStatus: 'Keine Noten eingegeben',
        bbrPassed: false,
        bbrStatus: 'Keine Noten eingegeben',
        average: 0,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: undefined
      };
    }

    // Calculate average
    const average = Number((allGrades.reduce((a, b) => a + b, 0) / gradeCount).toFixed(1));

    // Check BBR conditions
    const deutschGrade = parseInt(grades.kernfaecher.deutsch.grade);
    const matheGrade = parseInt(grades.kernfaecher.mathe.grade);
    
    // Determine BBR status and reason
    let bbrPassed = false;
    let bbrStatus = '';
  
    if ( isNaN(deutschGrade) || isNaN(matheGrade)) {
      bbrPassed = false;
      bbrStatus = 'BBR: Nicht bestanden, weil Deutsch oder Mathematik nicht belegt wurde.';
    }else if (average > 4.2) {
      bbrPassed = false;
      bbrStatus = `BBR: Nicht bestanden, weil der Notendurchschnitt ${average} über 4,2 ist.`;
    } else if (deutschGrade === 6) {
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

    if (hasSixInKernfaecher || hasMultipleFiveInKernfaecher) {
      return {
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 6 oder 2x5 in einem Kernfach',
        msaPassed: false,
        msaStatus: 'MSA: Nicht bestanden',
        bbrPassed: false,
        bbrStatus: bbrStatus,
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Note 6 oder 2x5 in Kernfächern'
      };
    }

    if (hasMultipleSixInFaecher) {
      return {
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 2x 6 in Fächer',
        msaPassed: false,
        msaStatus: 'MSA: Nicht bestanden',
        bbrPassed: false,
        bbrStatus: bbrStatus,
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: '2x Note 6 in Fächern'
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
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 1x 6 in Fächer ohne ausgleichende Noten',
        msaPassed: false,
        msaStatus: 'MSA: Nicht bestanden',
        bbrPassed: false,
        bbrStatus: bbrStatus,
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Note 6 in Fächern ohne ausgleichende Noten'
      };
    } 
    }

    // Handle 5s
    let fivesInFaecher = faecherGrades.filter(g => g === 5).length;
    let fivesInKernfaecher = kernfaecherGrades.filter(g => g === 5).length;
    const allFives = fivesInFaecher + fivesInKernfaecher;
    if (singleSixInFaecher && allFives > 3) {
      return {
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 1x 6 in Fächer und mehr als 4 x 5 - zu viele Durchfallkriterien überschritten',
        msaPassed: false,
        msaStatus: 'MSA: Nicht bestanden wegen 1x 6 in Fächer und mehr als 4 x 5 - zu viele Durchfallkriterien überschritten',
        bbrPassed: false,
        bbrStatus: bbrStatus,
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Nicht bestanden wegen 1x 6 in Fächer und mehr als 4 x 5 - zu viele Durchfallkriterien überschritten'
      }
    };
    if (allFives > 5) {
      return {
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden, mehr als 5 x 5 - zu viele Durchfallkriterien überschritten',
        msaPassed: false,
        msaStatus: 'MSA: Nicht bestanden, mehr als 5 x 5 - zu viele Durchfallkriterien überschritten',
        bbrPassed: false,
        bbrStatus: bbrStatus,
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Mehr als 5 x 5 - zu viele Durchfallkriterien überschritten'
      }
    };
    if (fivesInKernfaecher ==1 && fivesInFaecher >= 5) {
      return {
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden, mehr als 1x5 in Kernfach und als 4 x 5 in Fächer- zu viele Durchfallkriterien überschritten',
        msaPassed: false,
        msaStatus: 'MSA: Nicht bestanden, mehr als 1x5 in Kernfach und als 4 x 5 in Fächer- zu viele Durchfallkriterien überschritten',
        bbrPassed: false,
        bbrStatus: bbrStatus,
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Mehr als 1x5 in Kernfach und als 4 x 5 in Fächer- zu viele Durchfallkriterien überschritten'
      }
    };

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
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Nicht bestanden wegen 1x 5 in Kernfach und 1x 5 in Fächer ohne ausreichende Noten',
        msaPassed: false,
        msaStatus: 'MSA: Nicht bestanden wegen 1x 5 in Kernfach und 1x 5 in Fächer ohne ausreichende Noten',
        bbrPassed: false,
        bbrStatus: bbrStatus,
        average,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'Nicht bestanden wegen 1x 5 in Kernfach und 1x 5 in Fächer ohne ausreichende Noten'
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
          ebbrPassed: false,
          ebbrStatus: 'eBBR: Nicht bestanden wegen 2x 5 in Fächer ohne ausreichende Noten',
          msaPassed: false,
          msaStatus: 'MSA: Nicht bestanden wegen 2x 5 in Fächer ohne ausreichende Noten',
          bbrPassed: false,
          bbrStatus: bbrStatus,
          average,
          uebergangGymnasialeOberstufe: false,
          uebergangReason: '2x Note 5 in Fächern ohne ausreichend gute Noten'
      };
    }
  }
  

    

    // Count E-Level grades for MSA and Übergang checks
    const { kernfaecherELevel, faecherELevel } = this.countELevelGrades(grades);
    
    // Check MSA and Übergang Gymnasiale Oberstufe
    const uebergangResult = this.checkUebergangGymnasialeOberstufe(grades, average);

    // Check MSA with detailed reason
    let msaPassed = false;
    let msaStatus = '';
    if (average > 3.0) {
      msaPassed = false;
      msaStatus = `MSA: Nicht bestanden, Notendurchschnitt ${average} ist über 3,0`;
    } else if (kernfaecherELevel < 2) {
      msaPassed = false;
      msaStatus = 'MSA: Nicht bestanden, weniger als 2 E-Kurse in Kernfächern mit Note 3 oder besser';
    } else if ((kernfaecherELevel + faecherELevel) < 3) {
      msaPassed = false;
      msaStatus = 'MSA: Nicht bestanden, weniger als 3 E-Kurse insgesamt mit Note 3 oder besser';
    } else {
      msaPassed = true;
      msaStatus = 'MSA: Bestanden';
    }

    // Update Übergang status to include reason in success message
    const uebergangStatus = uebergangResult.qualified
      ? 'Übergang Gymnasiale Oberstufe: Ja'
      : `Übergang Gymnasiale Oberstufe: Nein, ${uebergangResult.reason}`;

    return {
      ebbrPassed: true,
      ebbrStatus: 'eBBR: Bestanden',
      msaPassed,
      msaStatus,
      bbrPassed,
      bbrStatus,
      average,
      uebergangGymnasialeOberstufe: uebergangResult.qualified,
      uebergangReason: uebergangStatus
    };
  }
}