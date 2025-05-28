import { ExamGrades } from '../types/grades';
import {
  MSA_deutschGradeMapping,  EBBR_deutschGradeMapping,
  MSA_matheGradeMapping,  EBBR_matheGradeMapping,
  MSA_praesentationGradeMapping, EBBR_praesentationGradeMapping,
  MSA_fremdspracheGradeMappingSchritlich, MSA_fremdspracheGradeMappingMuendlich,
  EBBR_fremdspracheGradeMappingSchriftlich, EBBR_fremdspracheGradeMappingMuendlich,
  notenMatrix
} from '../types/examCalculationVariables';
export const convertExamPointsToGrade = (points: String, gradeMapping: { [key: number]: String }): string => {
  if( points === '' ) {
    return '';
  }
  let pointsTmp = Number(points);
  for (const [threshold, grade] of Object.entries(gradeMapping).sort((a, b) => Number(b[0]) - Number(a[0]))) {
    if (pointsTmp >= Number(threshold)) {
      return grade.toString();
    }
  }
  return '6'; // Default grade if no thresholds are met
};



function getPunktwert(note: string): number {
  const noteZuPunktwert: Record<string, number> = {
    "1+": 0, "1": 1, "1-": 2,
    "2+": 3, "2": 4, "2-": 5,
    "3+": 6, "3": 7, "3-": 8,
    "4+": 9, "4": 10, "4-": 11,
    "5+": 12, "5": 13, "5-": 14,
    "6": 15
  };
  return noteZuPunktwert[note] ?? -1; // Return -1 if the key is not found
}


// const as function to calculate the grade of fremdsprache
export function calculateFremdsprache(schriftlich: string, muendlich: string): string {
  if (schriftlich === '' || muendlich === '') {
    return '';
  }else if(schriftlich=== undefined || muendlich === undefined) {
    return '';

  }else {
    const pS = getPunktwert(schriftlich);
    const pM = getPunktwert(muendlich);
    return notenMatrix[pS][pM];
  }
  return 'error';
}




export class ExamCalculator {
  // Calculate grades for all subjects
  public static calculateExamGrades(examGrades: ExamGrades): ExamGrades {
    const gradeDeutsch = examGrades.deutsch.points;
    const gradeMathe = examGrades.mathematik.points;
    const gradeFremdspracheSchriftlich = examGrades.fremdsprache.pointsSchriftlich;
    const gradeFremdspracheMuendlich = examGrades.fremdsprache.pointsMuendlich;
    const gradePraesentation = examGrades.praesentation.points;

    const gradeFremdspracheSchriftlich_MSA = convertExamPointsToGrade(gradeFremdspracheSchriftlich, MSA_fremdspracheGradeMappingSchritlich);
    const gradeFremdspracheMuendlich_MSA = convertExamPointsToGrade(gradeFremdspracheMuendlich, MSA_fremdspracheGradeMappingMuendlich);
    const gradeFremdspracheMSA = calculateFremdsprache(gradeFremdspracheSchriftlich_MSA, gradeFremdspracheMuendlich_MSA);

    const gradeFremdspracheSchriftlich_EBBR = convertExamPointsToGrade(gradeFremdspracheSchriftlich, EBBR_fremdspracheGradeMappingSchriftlich);
    const gradeFremdspracheMuendlich_EBBR = convertExamPointsToGrade(gradeFremdspracheMuendlich, EBBR_fremdspracheGradeMappingMuendlich);
    const gradeFremdspracheEBBR = calculateFremdsprache(gradeFremdspracheSchriftlich_EBBR, gradeFremdspracheMuendlich_EBBR);

    // change the points to grades
    // 1 point = 6; 2 points =5; 3 points = 4; 4 points = 3; 5 points = 2; 6 points = 1
     const calculatedGrades: ExamGrades = {
      deutsch: {
        points: gradeDeutsch,
        gradeMSA: gradeDeutsch ? convertExamPointsToGrade(gradeDeutsch, MSA_deutschGradeMapping).toString() : '',
        gradeEBBR: gradeDeutsch ? convertExamPointsToGrade(gradeDeutsch, EBBR_deutschGradeMapping).toString() : '',
        maxPoints: examGrades.deutsch.maxPoints
      },
      mathematik: {
        points: gradeMathe,
        gradeMSA: gradeMathe ? convertExamPointsToGrade(gradeMathe, MSA_matheGradeMapping).toString() : '',
        gradeEBBR: gradeMathe ? convertExamPointsToGrade( gradeMathe, EBBR_matheGradeMapping).toString() : '',
        maxPoints: examGrades.mathematik.maxPoints
      },
      fremdsprache: {
        pointsSchriftlich: gradeFremdspracheSchriftlich,
        pointsMuendlich: gradeFremdspracheMuendlich,
        gradeSchriftlich_MSA:  gradeFremdspracheSchriftlich_MSA.toString(),
        gradeMuendlich_MSA: gradeFremdspracheMuendlich_MSA.toString(),
        gradeSchriftlich_eBBR: gradeFremdspracheSchriftlich_EBBR.toString(),
        gradeMuendlich_eBBR: gradeFremdspracheMuendlich_EBBR.toString(),
        gradeMSA: gradeFremdspracheMSA ? gradeFremdspracheMSA.toString() : '',
        gradeEBBR: gradeFremdspracheEBBR ? gradeFremdspracheEBBR.toString() : '',
        maxPointsSchriftlich: examGrades.fremdsprache.maxPointsSchriftlich,
        maxPointsMuendlich: examGrades.fremdsprache.maxPointsMuendlich,
      },
      // praesentationSchriflich: {
      //   points: gradePraesentationSchriftlich,
      //   gradeMSA: gradePraesentationSchriftlich ? convertExamPointsToGrade( gradePraesentationSchriftlich, MSA_PraesentationGradeMappingSchritlich).toString() : '',
      //   gradeEBBR: gradePraesentationSchriftlich ? convertExamPointsToGrade( gradePraesentationSchriftlich, EBBR_PraesentationGradeMappingSchrifltich).toString() : '',
      //   maxPoints: examGrades.praesentation.maxPointsSchriftlich
      // },
       praesentation: {
         points: gradePraesentation,
         gradeMSA: gradePraesentation ? convertExamPointsToGrade( gradePraesentation, MSA_praesentationGradeMapping).toString() : '',
         gradeEBBR: gradePraesentation ? convertExamPointsToGrade( gradePraesentation, EBBR_praesentationGradeMapping).toString() : '',
         maxPoints: examGrades.praesentation.maxPoints
       }


    };
    // return the calculated grades
    return calculatedGrades;
  }

  public static calculateExam(grades: Array<any>): boolean {
    let passed = true;
    let fiveCounter = 0;
    let threeOrBetterCounter = 0;

    // check for msaGrades if there is a 6
    for (const grade of grades) {
      if (grade === '6') {
        passed = false;
        return passed;
      }
      else if (grade === '5') {
        fiveCounter++;

        if(fiveCounter >= 2) {
          passed = false;
          return passed;
        }
      }
      if (grade === '1' || grade === '2' || grade === '3') {
        threeOrBetterCounter++;
      }


    }
    if (fiveCounter===1){
      // check if there is a 3 or less
      if (threeOrBetterCounter >= 1) {
        passed = true;
      } else {
        return false;
      }

    }
    return passed;
  }

  //calculate if student passed the exams
    public static calculateExamStatus(examGrades: ExamGrades): { msaPassed: boolean; ebbrPassed: boolean; fremdspracheGrade_MSA: string; fremdspracheGrade_EBBR: string } {
        let msaPassed = true;
        let ebbrPassed = true;

      const fremdspracheSchrifltich_MSA = convertExamPointsToGrade(examGrades.fremdsprache.pointsSchriftlich, MSA_fremdspracheGradeMappingSchritlich);
      const fremdspracheMuendlich_MSA = convertExamPointsToGrade(examGrades.fremdsprache.pointsMuendlich, MSA_fremdspracheGradeMappingMuendlich);
      const fremdspracheGrade_MSA = calculateFremdsprache(fremdspracheSchrifltich_MSA, fremdspracheMuendlich_MSA);

      const fremdspracheSchrifltich_EBBR = convertExamPointsToGrade(examGrades.fremdsprache.pointsSchriftlich, MSA_fremdspracheGradeMappingSchritlich);
      const fremdspracheMuendlich_EBBR = convertExamPointsToGrade(examGrades.fremdsprache.pointsMuendlich, MSA_fremdspracheGradeMappingMuendlich);
      const fremdspracheGrade_EBBR = calculateFremdsprache(fremdspracheSchrifltich_EBBR, fremdspracheMuendlich_EBBR);

        // variable for all gradeMSA and gradeEBBR stored in array
        const msaGrades = Object.values(examGrades).map(subject => subject.gradeMSA);
        const ebbrGrades = Object.values(examGrades).map(subject => subject.gradeEBBR);

        // MSA Check
        msaPassed = this.calculateExam(msaGrades);
        ebbrPassed = this.calculateExam(ebbrGrades);

      return { msaPassed, ebbrPassed, fremdspracheGrade_MSA, fremdspracheGrade_EBBR };
    }

}