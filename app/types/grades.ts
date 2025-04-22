export interface KernfaecherInputs {
  deutsch: string;
  mathe: string;
  ersteFremdsprache: string;
}

export interface FaecherInputs {
  biologie: string;
  physik: string;
  chemie: string;
  geographie: string;
  geschichte: string;
  politik: string;
  musik: string;
  kunst: string;
  sport: string;
}

export interface AllGradeInputs {
  kernfaecher: KernfaecherInputs;
  faecher: FaecherInputs;
}

export interface ExamGrades {
  deutsch: string;
  mathematik: string;
  fremdsprache: string;
  praesentation: string;
}

export interface GradeStats {
  status: string;
  kernfaecher: string;
  faecher: string;
}