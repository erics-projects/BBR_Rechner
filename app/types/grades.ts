export interface GradeWithLevel {
  points: string;
  grade: string;
  level: 'E' | 'G' | 'M';
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

export interface ExamGrades {
  deutsch: GradeWithLevel;
  mathematik: GradeWithLevel;
  fremdsprache: GradeWithLevel;
  praesentation: GradeWithLevel;
}

export interface GradeStats {
  ebbrPassed: boolean;
  msaPassed: boolean;
  status: string;
  average: number;
  uebergangGymnasialeOberstufe: boolean;
  uebergangReason?: string;
}