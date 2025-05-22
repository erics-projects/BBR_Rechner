
//Grades for Jahrgang
export interface GradeWithLevel {
  points: string;
  gradeE: string;
  gradeG: string;
  level: 'E' | 'G' | 'M';
}

// Exam Grades
export interface ExamGrades {
  deutsch: {
    points: string;
    gradeMSA: string;
    gradeEBBR: string;
    maxPoints: string;
  };
  mathematik: {
    points: string;
    gradeMSA: string;
    gradeEBBR: string;
    maxPoints: string;
  };
  fremdsprache: {
    points: string;
    gradeMSA: string;
    gradeEBBR: string;
    maxPoints: string;
  };
  praesentation: {
    pointsSchriftlich: string;
    pointsMuendlich:string;
    gradeMSA: string;
    gradeEBBR: string;
    maxPointsSchriftlich: string;
    maxPointsMuendlich: string;
  };
  // praesentationSchriflich: {
  //   points: string;
  //   // gradeMSA: string;
  //   // gradeEBBR: string;
  //   maxPoints: string;
  // };
  // praesentationMuendlich: {
  //   points: string;
  //   // gradeMSA: string;
  //   // gradeEBBR: string;
  //   maxPoints: string;
  // };

}



export const convertPointsToGrade = (points: number): number => {
  if (points >= 13) return 1;
  if (points >= 10) return 2;
  if (points >= 7) return 3;
  if (points >= 4) return 4;
  if (points >= 1) return 5;
  return 6;
};
export const convertPointsToGradeG = (points: number): number => {
  if (points >= 10) return 1;
  if (points >= 7) return 2;
  if (points >= 5) return 3;
  if (points >= 3) return 4;
  if (points >= 1) return 5;
  return 6;
};

export interface KernfaecherInputs {
  deutsch: GradeWithLevel;
  mathe: GradeWithLevel;
  ersteFremdsprache: GradeWithLevel;
}

export interface FaecherInputs {
  wAT: GradeWithLevel;
  biologie: GradeWithLevel;
  physik: GradeWithLevel;
  chemie: GradeWithLevel;
  ethik: GradeWithLevel;
  geWi: GradeWithLevel;
  musik: GradeWithLevel;
  kunst: GradeWithLevel;
  sport: GradeWithLevel;
  französich: GradeWithLevel;
}

export interface AllGradeInputs {
  kernfaecher: KernfaecherInputs;
  faecher: FaecherInputs;
}

export interface GradeStats {
  ebbrPassed: boolean;
  ebbrStatus: string;
  msaPassed: boolean;
  msaStatus: string;
  bbrPassed: boolean;
  bbrStatus: string;
  averageG: number;  // For BBR/eBBR calculations
  averageE: number;  // For MSA/Übergang calculations
  uebergangGymnasialeOberstufe: boolean;
  uebergangReason?: string;
}