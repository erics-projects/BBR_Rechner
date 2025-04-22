export interface GradeWithLevel {
  grade: string;
  level: 'E' | 'G';
}

export interface KernfaecherInputs {
  deutsch: GradeWithLevel;
  mathe: GradeWithLevel;
  ersteFremdsprache: GradeWithLevel;
}

export interface FaecherInputs {
  biologie: GradeWithLevel;
  physik: GradeWithLevel;
  chemie: GradeWithLevel;
  geographie: GradeWithLevel;
  geschichte: GradeWithLevel;
  politik: GradeWithLevel;
  musik: GradeWithLevel;
  kunst: GradeWithLevel;
  sport: GradeWithLevel;
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
  status: string;
  average: number;
  uebergangGymnasialeOberstufe: boolean;
}