import { AllGradeInputs, GradeWithLevel, GradeStats } from '../types/grades';

export class GradeCalculator {
  private static countGradesByValue(grades: number[], value: number): number {
    return grades.filter(g => g === value).length;
  }

  private static countGradesBetterOrEqual(grades: number[], threshold: number): number {
    return grades.filter(g => g <= threshold).length;
  }

  private static getGradesFromInputs(grades: AllGradeInputs, useEGrades: boolean = false): {
    kernfaecherGrades: number[];
    faecherGrades: number[];
    allGrades: number[];
  } {
    const kernfaecherGrades = Object.values(grades.kernfaecher)
      .filter(g => g.points !== '')
      .map(g => {
        if (useEGrades) {
          return parseInt(g.gradeE);
        } else {
          return g.level === 'E' ? parseInt(g.gradeE) : parseInt(g.gradeG);
        }
      });

    const faecherGrades = Object.values(grades.faecher)
      .filter(g => g.points !== '')
      .map(g => {
        if (useEGrades) {
          return parseInt(g.gradeE);
        } else {
          return g.level === 'E' ? parseInt(g.gradeE) : parseInt(g.gradeG);
        }
      });

    const allGrades = [...kernfaecherGrades, ...faecherGrades];
    return { kernfaecherGrades, faecherGrades, allGrades };
  }

  private static calculateAverageG(grades: AllGradeInputs): number {
    const validGrades = [...Object.values(grades.kernfaecher), ...Object.values(grades.faecher)]
      .filter(g => g.points !== '')
      .map(g => {
        if (g.level === 'G' ) {
          return parseInt(g.gradeG);
        } else {  // E or M level
          return parseInt(g.gradeE);
        }
      });

    if (validGrades.length === 0) return 0;
    return Number((validGrades.reduce((a, b) => a + b, 0) / validGrades.length).toFixed(1));
  }

  private static calculateAverageE(grades: AllGradeInputs): number {
    const validGrades = [...Object.values(grades.kernfaecher), ...Object.values(grades.faecher)]
      .filter(g => g.points !== '')
      .map(g => parseInt(g.gradeE));

    if (validGrades.length === 0) return 0;
    return Number((validGrades.reduce((a, b) => a + b, 0) / validGrades.length).toFixed(1));
  }

  private static checkFailingConditions(
    kernfaecherGrades: number[],
    faecherGrades: number[],
    qualification: 'BBR' | 'MSA'
  ): { failed: boolean; reason: string } | null {
    const allGrades = [...kernfaecherGrades, ...faecherGrades];
    
    // Check for one 6 in Kernfaecher
    if (this.countGradesByValue(kernfaecherGrades, 6) > 0) {
      return {
        failed: true,
        reason: `${qualification}: Note 6 in Kernfächer`
      };
    }

    // Check for two 5s in Kernfaecher
    if (this.countGradesByValue(kernfaecherGrades, 5) > 1) {
      return {
        failed: true,
        reason: `${qualification}: 2x5 in Kernfächer`
      };
    }

    // Check for two 6s in Faecher
    if (this.countGradesByValue(faecherGrades, 6) > 1) {
      return {
        failed: true,
        reason: `${qualification}: 2x6 in Fächer`
      };
    }

    // Check for one 6 in Faecher, needs compensation
    const singleSixInFaecher = this.countGradesByValue(faecherGrades, 6) === 1;
    if (singleSixInFaecher) {
      const goodGrades = this.countGradesBetterOrEqual(allGrades, 2);
      if (goodGrades < 2) {
        return {
          failed: true,
          reason: `${qualification}: 1x6 in Fächer ohne ausgleichende Noten`
        };
      }
    }

    // Check 5s
    const fivesInKernfaecher = this.countGradesByValue(kernfaecherGrades, 5);
    const fivesInFaecher = this.countGradesByValue(faecherGrades, 5);
    const totalFives = fivesInKernfaecher + fivesInFaecher;

    // One 5 in Kernfaecher and five or more 5s in Faecher
    if (fivesInKernfaecher === 1 && fivesInFaecher >= 5) {
      return {
        failed: true,
        reason: `${qualification}: 1x5 in Kernfach und 5x5 in Fächer`
      };
    }

    // One 6 in Faecher and four or more 5s total
    if (singleSixInFaecher && totalFives >= 4) {
      return {
        failed: true,
        reason: `${qualification}: 1x6 in Fächer und 4 oder mehr 5er`
      };
    }

    // More than 5 total 5s
    if (totalFives > 5) {
      return {
        failed: true,
        reason: `${qualification}: Mehr als 5x5 insgesamt`
      };
    }

    // One 5 in Kernfaecher and one 5 in Faecher needs compensation
    if (fivesInKernfaecher >= 1 && fivesInFaecher >= 1) {
      const goodGrades = this.countGradesBetterOrEqual(allGrades, 3);
      if (goodGrades < 2) {
        return {
          failed: true,
          reason: `${qualification}: 5 in Kernfach und Fächer ohne ausgleichende Noten`
        };
      }
    }

    // Two 5s in Faecher needs compensation
    if (fivesInFaecher >= 2) {
      const goodGrades = this.countGradesBetterOrEqual(allGrades, 3);
      if (goodGrades < 2) {
        return {
          failed: true,
          reason: `${qualification}: 2x5 in Fächer ohne ausgleichende Noten`
        };
      }
    }

    return null;
  }

  private static countELevelGrades(grades: AllGradeInputs): {
    kernfaecherELevel: number;
    faecherELevel: number;
  } {
    const kernfaecherELevel = Object.values(grades.kernfaecher)
      .filter(g => g.level === 'E' && g.gradeE && parseInt(g.gradeE) <= 6)
      .length;
    
    const faecherELevel = Object.values(grades.faecher)
      .filter(g => g.level === 'E' && g.gradeE && parseInt(g.gradeE) <= 6)
      .length;

    return { kernfaecherELevel, faecherELevel };
  }

  private static countELevelGradesGo(grades: AllGradeInputs): {
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

  // private static checkUebergangGymnasialeOberstufe(
  //   grades: AllGradeInputs,
  //   averageE: number
  // ): { qualified: boolean; reason?: string } {
  //   if (averageE > 3.0) {
  //     return {
  //       qualified: false,
  //       reason: `Notendurchschnitt ${averageE} ist schlechter als 3,0`
  //     };
  //   }

  //   // Check if all grades are 4 or better
  //   const allGrades = [
  //     ...Object.values(grades.kernfaecher),
  //     ...Object.values(grades.faecher)
  //   ];
  //   // For Übergang, we only check E-level grades
  //   const eGrades = allGrades.filter(g => g.level === 'E');
  //   if (eGrades.some(g => g.gradeE && parseInt(g.gradeE) > 4)) {
  //     return {
  //       qualified: false,
  //       reason: 'Alle Noten müssen 4 oder besser sein'
  //     };
  //   }

  //   const { kernfaecherELevel, faecherELevel } = this.countELevelGrades(grades);

  //   // Need at least 2 E-Level grades in Kernfaecher with grade 3 or better
  //   if (kernfaecherELevel < 2) {
  //     return {
  //       qualified: false,
  //       reason: 'Mindestens 2 E-Kurse in Kernfächern mit Note 3 oder besser benötigt'
  //     };
  //   }

  //   // Need at least 2 E-Level grades in total with grade 3 or better
  //   const totalELevel = kernfaecherELevel + faecherELevel;
  //   if (totalELevel < 2) {
  //     return {
  //       qualified: false,
  //       reason: 'Insgesamt mindestens 2 E-Kurse mit Note 3 oder besser benötigt'
  //     };
  //   }

  //   return { qualified: true };
  // }
  private static calculateBBRGrades(grades: AllGradeInputs): {
    bbrPassed: boolean;
    bbrStatus: string;
    averageG: number;
  } {
      const averageG = this.calculateAverageG(grades);
      
    //check if deutsch and mathe are at least one 4  and one 5 or better
    const deutschGrade = parseInt(grades.kernfaecher.deutsch.gradeG);
    const matheGrade = parseInt(grades.kernfaecher.mathe.gradeG);
      // Determine BBR status and reason
    let bbrPassed = false;
    let bbrStatus = '';
  
    if ( isNaN(deutschGrade) || isNaN(matheGrade)) {
      bbrPassed = false;
      bbrStatus = 'BBR: Nicht bestanden, weil Deutsch oder Mathematik nicht belegt wurde.';
    }else if (averageG > 4.2) {
      bbrPassed = false;
      bbrStatus = `BBR: Nicht bestanden, weil der Notendurchschnitt ${averageG} über 4,2 ist.`;
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


    return{
      bbrPassed: bbrPassed,
      bbrStatus: bbrStatus,
      averageG: averageG
    }
  }

  private static calculateEBBRGrades(grades: AllGradeInputs): {
    ebbrPassed: boolean;
    ebbrStatus: string;
  } {
    // Always use gradeG for BBR/eBBR calculations regardless of level
    const kernfaecherGrades = Object.values(grades.kernfaecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.gradeG));

    const faecherGrades = Object.values(grades.faecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.gradeG));

    const allGrades = [...kernfaecherGrades, ...faecherGrades];

    if (allGrades.length === 0) {
      return {
        ebbrPassed: false,
        ebbrStatus: 'eBBR: Keine Noten eingegeben',
      };
    }

    // Check general failing conditions
    const failCheck = this.checkFailingConditions(kernfaecherGrades, faecherGrades, 'BBR');
    if (failCheck) {
      return {
        ebbrPassed: false,
        ebbrStatus: failCheck.reason.replace('BBR:', 'eBBR:'),
      };
    }

    // Count grades that are 2 or better and 3 or better for compensation
    let gradesTwoOrBetterKF = this.countGradesBetterOrEqual(kernfaecherGrades, 2);
    let gradesThreeOrBetterKF = this.countGradesBetterOrEqual(kernfaecherGrades, 3);
    let gradesTwoOrBetterF = this.countGradesBetterOrEqual(faecherGrades, 2);
    let gradesThreeOrBetterF = this.countGradesBetterOrEqual(faecherGrades, 3);
    let gradesThreeOrBetter = this.countGradesBetterOrEqual(allGrades, 3);
    let gradesTwoOrBetter = this.countGradesBetterOrEqual(allGrades, 2);
    
    // Handle compensation for single 6
    const singleSixInFaecher = this.countGradesByValue(faecherGrades, 6) === 1;
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
      } else {
        return {
          ebbrPassed: false,
          ebbrStatus: 'eBBR: Nicht bestanden wegen 1x 6 in Fächer ohne ausgleichende Noten',
        };
      }
    }

    // Handle compensation for 5s
    let fivesInFaecher = this.countGradesByValue(faecherGrades, 5);
    let fivesInKernfaecher = this.countGradesByValue(kernfaecherGrades, 5);

    if (fivesInKernfaecher >= 1 && fivesInFaecher >= 1) {
      if (gradesThreeOrBetterKF > 1 || (gradesThreeOrBetterKF === 1 && gradesThreeOrBetterF >= 1)) {
        gradesThreeOrBetterKF -= 1;
        gradesThreeOrBetter -= 1;
        fivesInKernfaecher -= 1;

        if (gradesThreeOrBetterF >= 1) {
          gradesThreeOrBetterF -= 1;
          gradesThreeOrBetter -= 1;
          fivesInFaecher -= 1;
        } else if (gradesThreeOrBetterKF > 1) {
          gradesThreeOrBetterKF -= 1;
          gradesThreeOrBetter -= 1;
          fivesInKernfaecher -= 1;
        }
      } else {
        return {
          ebbrPassed: false,
          ebbrStatus: 'eBBR: Nicht bestanden wegen 5 in Kernfach und Fächer ohne Ausgleich',
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
          ebbrStatus: 'eBBR: Nicht bestanden wegen 2x5 in Fächer ohne Ausgleich',
        };
      }
    }
    
    // If all compensations are successful
    return {
      ebbrPassed: true,
      ebbrStatus: 'eBBR: Bestanden',
    };
  }

  private static calculateMSAGrades(grades: AllGradeInputs): {
    msaPassed: boolean;
    msaStatus: string;
  } {
    // Always use gradeE for MSA calculations
    const kernfaecherGrades = Object.values(grades.kernfaecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.gradeE));

    const faecherGrades = Object.values(grades.faecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.gradeE));

    const allGrades = [...kernfaecherGrades, ...faecherGrades];

    if (allGrades.length === 0) {
      return {
        msaPassed: false,
        msaStatus: 'MSA: Keine Noten eingegeben',
      };
    }

    const averageE = this.calculateAverageE(grades);

    // Check general failing conditions
    const failCheck = this.checkFailingConditions(kernfaecherGrades, faecherGrades, 'MSA');
    if (failCheck) {
      return {
        msaPassed: false,
        msaStatus: failCheck.reason,
      };
    }

    // Count grades that are 2 or better and 3 or better for compensation
    let gradesTwoOrBetterKF = this.countGradesBetterOrEqual(kernfaecherGrades, 2);
    let gradesThreeOrBetterKF = this.countGradesBetterOrEqual(kernfaecherGrades, 3);
    let gradesTwoOrBetterF = this.countGradesBetterOrEqual(faecherGrades, 2);
    let gradesThreeOrBetterF = this.countGradesBetterOrEqual(faecherGrades, 3);
    let gradesThreeOrBetter = this.countGradesBetterOrEqual(allGrades, 3);
    let gradesTwoOrBetter = this.countGradesBetterOrEqual(allGrades, 2);

    // Handle compensation for single 6
    const singleSixInFaecher = this.countGradesByValue(faecherGrades, 6) === 1;
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
      } else {
        return {
          msaPassed: false,
          msaStatus: 'MSA: Nicht bestanden wegen 1x 6 in Fächer ohne ausgleichende Noten',
        };
      }
    }

    // Handle compensation for 5s
    let fivesInFaecher = this.countGradesByValue(faecherGrades, 5);
    let fivesInKernfaecher = this.countGradesByValue(kernfaecherGrades, 5);

    if (fivesInKernfaecher >= 1 && fivesInFaecher >= 1) {
      if (gradesThreeOrBetterKF > 1 || (gradesThreeOrBetterKF === 1 && gradesThreeOrBetterF >= 1)) {
        gradesThreeOrBetterKF -= 1;
        gradesThreeOrBetter -= 1;
        fivesInKernfaecher -= 1;

        if (gradesThreeOrBetterF >= 1) {
          gradesThreeOrBetterF -= 1;
          gradesThreeOrBetter -= 1;
          fivesInFaecher -= 1;
        } else if (gradesThreeOrBetterKF > 1) {
          gradesThreeOrBetterKF -= 1;
          gradesThreeOrBetter -= 1;
          fivesInKernfaecher -= 1;
        }
      } else {
        return {
          msaPassed: false,
          msaStatus: 'MSA: Nicht bestanden wegen 5 in Kernfach und Fächer ohne Ausgleich',
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
          msaPassed: false,
          msaStatus: 'MSA: Nicht bestanden wegen 2x5 in Fächer ohne Ausgleich',
        };
      }
    }

    // Check E-Level requirements
    const { kernfaecherELevel, faecherELevel } = this.countELevelGrades(grades);
    const totalELevel = kernfaecherELevel + faecherELevel;

    if (totalELevel >= 2) {
    // Check E-Level requirements for MSA Gymnasiale Oberstufe -> min 2 E-Kurse in Kernfächer und min 1 E-Kurs in Fächer
      if (kernfaecherELevel < 2 || faecherELevel < 1) {
      return {
        msaPassed: true,
        msaStatus: 'MSA: Bestanden',
      };
    }
    }else  {
      return {
        msaPassed: false,
        msaStatus: 'MSA: Nicht bestanden, weniger als 2 E-Kurse mit Note 3 oder besser',
      };
    }    

    // Check average requirement for MSA Gymnasiale Oberstufe
    // If the averageE is greater than 3.0, the student does not qualify for the Gymnasiale Oberstufe
    // and the MSA is passed
    if (averageE > 3.0) {
      return {
        msaPassed: true,
        msaStatus: 'MSA: Bestanden',
      };
    }
    // Check if there are more than two 5s in total than MSA GO is not passed MSA is still passed
    if (this.countGradesByValue(allGrades, 5) > 2) {
      return {
        msaPassed: true,
        msaStatus: 'MSA: Bestanden',
      };
    }

    // If all compensations are successful
    return {
      msaPassed: true,
      msaStatus: 'MSA: Bestanden',
    };

  }
  private static calculateMSAGo(grades: AllGradeInputs, msaResults: {msaPassed: boolean, msaStatus: String}): {
    averageE: number;
    uebergangGymnasialeOberstufe: boolean;
    uebergangReason: string;
  } {
    const averageE = this.calculateAverageE(grades);
    // Always use gradeE for MSA calculations
    const kernfaecherGrades = Object.values(grades.kernfaecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.gradeE));

    const faecherGrades = Object.values(grades.faecher)
      .filter(g => g.points !== '')
      .map(g => parseInt(g.gradeE));

    const allGrades = [...kernfaecherGrades, ...faecherGrades];



     // check if MSA is passed
    if (msaResults.msaPassed) {
      // Check if the averageE is greater than 3.0, the student does not qualify for the Gymnasiale Oberstufe
      if (averageE > 3.0) {
        return {
          averageE: averageE,
          uebergangGymnasialeOberstufe: false,
          uebergangReason: 'MSAgo: Notendurchschnitt schlechter als 3,0',
        };
      }
      //chek if there are at least 2 E-Kurse in Kernfächer and at least 1 E-Kurs in Fächer
    else if (this.countELevelGradesGo(grades).kernfaecherELevel < 2 || this.countELevelGradesGo(grades).faecherELevel < 1) {
      return {
        averageE: averageE,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'MSAgo: Nein, weniger als 2 E-Kurse in Kernfächer und 1 E-Kurs in Fächer',
      };
    }
      // Check if there are more than two 5s in total than MSA GO is not passed MSA is still passed

      else if (this.countGradesByValue(allGrades, 5) >= 2) {
        return {
          averageE: averageE,
          uebergangGymnasialeOberstufe: false,
          uebergangReason: 'MSAgo: Nein, mehr als eine 5 insgesamt',
        }
        //check if there are more than one 6 in total than MSA GO 
    } else if (this.countGradesByValue(allGrades, 6) > 0) {
      return {
        averageE: averageE,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'MSAgo: Nein, eine 6',
      };
    }


    else {
        return {
        averageE: averageE,
        uebergangGymnasialeOberstufe: true,
        uebergangReason: 'MSAgo: Bestanden',
      };
    }
  }

    else{
      return {
        averageE: averageE,
        uebergangGymnasialeOberstufe: false,
        uebergangReason: 'MSAgo: Nein, MSA nicht bestanden',
      };
    }
  }

  public static calculateGrades(grades: AllGradeInputs): GradeStats {
    const bbrResults = this.calculateBBRGrades(grades);
    const ebbrResults = this.calculateEBBRGrades(grades);
    const msaResults = this.calculateMSAGrades(grades);   
    const msaGymResults = this.calculateMSAGo(grades, msaResults);

    return {
      ...bbrResults,
      ...ebbrResults,
      ...msaResults,
      ...msaGymResults,
    };
  }
}