import { ExamGrades } from '../types/grades';

export const convertExamPointsToGrade = (points: number, gradeMapping: { [key: number]: String }): string => {
  for (const [threshold, grade] of Object.entries(gradeMapping).sort((a, b) => Number(b[0]) - Number(a[0]))) {
    if (points >= Number(threshold)) {
      return grade.toString();
    }
  }
  return '6'; // Default grade if no thresholds are met
};

const MSA_deutschGradeMapping = {  112: '1',  100: '2',  88:  '3',  72:  '4',  36:  '5' };
const MSA_matheGradeMapping = { 56: '1',  45: '2',  38: '3',  30: '4',  9:  '5', };
const MSA_fremdspracheGradeMapping = {
  74: `1+`, 72: '1', 70: '1-',
  68: '2+', 65: '2', 63: '2-',
  61: '3+', 57: '3', 55: '3-',
  53: '4+', 47: '4', 45: '4-',
  43: '5+', 25: '5', 23: '5-'
};
const MSA_PraesentationGradeMapping = { 35: '1',  25: '2',  20:  '3',  15:  '4',  10:  '5' };

//EBBR Mapping
const EBBR_deutschGradeMapping = {   84: '1',  72: '2',  59: '3',  45: '4',  23: '5',};
const EBBR_matheGradeMapping = {  37: '1',  30: '2',  24: '3',  18: '4',  6:  '5', };
const EBBR_fremdspracheGradeMapping = {
  50: '1+',  48: '1',  47: '1-',
  45: '2+',  43: '2',  41: '2-',
  39: '3+',  35: '3',  33: '3-',
  31: '4+',  27: '4',  25: '4-',
  23: '5+',  15: '5',  13: '5-',
};
const EBBR_PraesentationGradeMapping = { 35: '1',  25: '2',  20:  '3',  15:  '4',  10:  '5' };



export class ExamCalculator {
  // Calculate grades for all subjects
  public static calculateExamGrades(examGrades: ExamGrades): ExamGrades {

    // change the points to grades
    // 1 point = 6; 2 points =5; 3 points = 4; 4 points = 3; 5 points = 2; 6 points = 1
     const calculatedGrades: ExamGrades = {
      deutsch: {
        points: examGrades.deutsch.points,
        gradeMSA: examGrades.deutsch.points ? convertExamPointsToGrade(Number(examGrades.deutsch.points), MSA_deutschGradeMapping).toString() : '',
        gradeEBBR: examGrades.deutsch.points ? convertExamPointsToGrade(Number(examGrades.deutsch.points), EBBR_deutschGradeMapping).toString() : '',
        maxPoints: examGrades.deutsch.maxPoints
      },
      mathematik: {
        points: examGrades.mathematik.points,
        gradeMSA: examGrades.mathematik.points ? convertExamPointsToGrade(Number(examGrades.mathematik.points), MSA_matheGradeMapping).toString() : '',
        gradeEBBR: examGrades.mathematik.points ? convertExamPointsToGrade(Number(examGrades.mathematik.points), EBBR_matheGradeMapping).toString() : '',
        maxPoints: examGrades.mathematik.maxPoints
      },
      fremdsprache: {
        points: examGrades.fremdsprache.points,
        gradeMSA: examGrades.fremdsprache.points ? convertExamPointsToGrade(Number(examGrades.fremdsprache.points), MSA_fremdspracheGradeMapping).toString() : '',
        gradeEBBR: examGrades.fremdsprache.points ? convertExamPointsToGrade(Number(examGrades.fremdsprache.points), EBBR_fremdspracheGradeMapping).toString() : '',
        maxPoints: examGrades.fremdsprache.maxPoints
      },
      praesentation: {
        points: examGrades.praesentation.points,
        gradeMSA: examGrades.praesentation.points ? convertExamPointsToGrade(Number(examGrades.praesentation.points), MSA_PraesentationGradeMapping).toString() : '',
        gradeEBBR: examGrades.praesentation.points ? convertExamPointsToGrade(Number(examGrades.praesentation.points), EBBR_PraesentationGradeMapping).toString() : '',
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
    // console.log('5 Counter final: ', fiveCounter);
    return passed;
  }

  //calculate if student passed the exams
    public static calculateExamStatus(examGrades: ExamGrades): { msaPassed: boolean; ebbrPassed: boolean } {
        let msaPassed = true;
        let ebbrPassed = true;

        // variable for all gradeMSA and gradeEBBR stored in array
        const msaGrades = Object.values(examGrades).map(subject => subject.gradeMSA);
        const ebbrGrades = Object.values(examGrades).map(subject => subject.gradeEBBR);

        // MSA Check
        msaPassed = this.calculateExam(msaGrades);
        ebbrPassed = this.calculateExam(ebbrGrades);

      return { msaPassed, ebbrPassed };
    }

}