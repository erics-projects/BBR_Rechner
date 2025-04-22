import { ExamGrades } from '../types/grades';

interface ExamGradeInputProps {
  examGrades: ExamGrades;
  onInputChange: (field: keyof ExamGrades) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculate: () => void;
}

export function ExamGradeInput({ examGrades, onInputChange, onCalculate }: ExamGradeInputProps) {
  const displayNames = {
    deutsch: 'Deutsch',
    mathematik: 'Mathematik',
    fremdsprache: '1. Fremdsprache',
    praesentation: 'Präsentation'
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Prüfungsnoten</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(examGrades).map(([field, value]) => (
            <div key={field} className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {displayNames[field as keyof ExamGrades]}
              </label>
              <input
                type="number"
                min="1"
                max="6"
                step="1"
                value={value}
                onChange={onInputChange(field as keyof ExamGrades)}
                className="border rounded p-2 dark:bg-gray-800"
                placeholder="1-6"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            onClick={onCalculate}
          >
            Prüfungsnoten berechnen
          </button>
        </div>
      </div>
    </div>
  );
}