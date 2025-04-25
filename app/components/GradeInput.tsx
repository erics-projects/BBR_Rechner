import { AllGradeInputs } from '../types/grades';

interface GradeInputProps {
  grades: AllGradeInputs;
  onInputChange: (category: 'kernfaecher' | 'faecher', subject: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLevelChange: (category: 'kernfaecher' | 'faecher', subject: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function GradeInput({ grades, onInputChange, onLevelChange }: GradeInputProps) {
  const displayNames = {
    kernfaecher: {
      deutsch: 'Deutsch',
      mathe: 'Mathematik',
      ersteFremdsprache: 'Erste Fremdsprache'
    },
    faecher: {
      wAT: 'WAT (Wirtschaft Arbeit Technik)',
      biologie: 'Biologie',
      physik: 'Physik',
      chemie: 'Chemie',
      ethik: 'Ethik',
      geWi: 'GeWi (Gesellschaftswissenschaften)',
      musik: 'Musik',
      kunst: 'Kunst',
      sport: 'Sport',
      französich: 'Französisch'
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Kernfächer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(grades.kernfaecher).map(([subject, value]) => (
            <div key={subject} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  {displayNames.kernfaecher[subject as keyof typeof displayNames.kernfaecher]}
                  {value.level === 'M' ? (
                    <span className="text-sm text-blue-500 ml-2"> </span>
                  ) : (
                    <div className="flex items-center gap-1 ml-2">
                      <input
                        type="checkbox"
                        checked={value.level === 'E'}
                        onChange={onLevelChange('kernfaecher', subject)}
                        className="form-checkbox h-4 w-4"
                      />
                      <span className="text-sm text-gray-600">E</span>
                    </div>
                  )}
                </label>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-3/4 sm:w-40">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="1"
                    value={value.points}
                    onChange={onInputChange('kernfaecher', subject)}
                    className="w-full border rounded p-2 dark:bg-gray-800"
                    placeholder="0-15"
                  />
                  <div className="text-xs text-gray-500 mt-1">Punkte (0-15)</div>
                </div>
                {value.points !== '' && (
                  <div className="mt-2 text-lg">
                    {value.grade}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Fächer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(grades.faecher).map(([subject, value]) => (
            <div key={subject} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  {displayNames.faecher[subject as keyof typeof displayNames.faecher]}
                  {value.level === 'M' ? (
                    <span className="text-sm text-blue-500 ml-2"></span>
                  ) : (
                    <div className="flex items-center gap-1 ml-2">
                      <input
                        type="checkbox"
                        checked={value.level === 'E'}
                        onChange={onLevelChange('faecher', subject)}
                        className="form-checkbox h-4 w-4"
                      />
                      <span className="text-sm text-gray-600">E</span>
                    </div>
                  )}
                </label>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-3/4 sm:w-40">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="1"
                    value={value.points}
                    onChange={onInputChange('faecher', subject)}
                    className="w-full border rounded p-2 dark:bg-gray-800"
                    placeholder="0-15"
                  />
                  <div className="text-xs text-gray-500 mt-1">Punkte (0-15)</div>
                </div>
                {value.points !== '' && (
                  <div className="mt-2 text-lg">
                    {value.grade}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
