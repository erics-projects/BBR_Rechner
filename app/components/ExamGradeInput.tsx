import { ExamGrades } from '../types/grades';

interface ExamGradeInputProps {
  examGrades: ExamGrades;
  // OnInputChange call the calculatedGrades function
    // to calculate the grades based on the points input
    onInputChange: (field: keyof ExamGrades) => (e: React.ChangeEvent<HTMLInputElement>) => void;

  // onInputChange: (field: keyof ExamGrades) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculate: () => void;
}

export function ExamGradeInput({ examGrades, onInputChange, onCalculate }: ExamGradeInputProps) {
  const displayNames = {
    deutsch: 'Deutsch',
    mathematik: 'Mathematik',
    fremdsprache: 'Erste Fremdsprache',
    praesentation: 'Präsentation'
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Prüfungen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(examGrades).map(([field, value]) => (
            <div key={field} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  {displayNames[field as keyof ExamGrades]}
                </label>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-2/3 sm:w-24">
                  <input
                    type="number"
                    min="0"
                    max={value.maxPoints}
                    step="1"
                    value={value.points}
                    onChange={onInputChange(field as keyof ExamGrades)}
                    className="w-full border rounded p-2 dark:bg-gray-800"
                    placeholder={`0-${value.maxPoints}`}
                  />
                </div>

                {value.points !== '' && (
                    <div className="mt-2 text-sm flex flex-col">
                      <span>eBBR: {value.gradeEBBR}</span>
                      <span>MSA: {value.gradeMSA}</span>
                    </div>
                )}
              </div>

            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            onClick={onCalculate}
          >
            Testen
          </button>
        </div>
      </div>
    </div>
  );
}