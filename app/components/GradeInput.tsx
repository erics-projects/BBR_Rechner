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
      biologie: 'Biologie',
      physik: 'Physik',
      chemie: 'Chemie',
      geographie: 'Geographie',
      geschichte: 'Geschichte',
      politik: 'Politik',
      musik: 'Musik',
      kunst: 'Kunst',
      sport: 'Sport'
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
                  <div className="flex items-center gap-1 ml-2">
                    <input
                      type="checkbox"
                      checked={value.level === 'E'}
                      onChange={onLevelChange('kernfaecher', subject)}
                      className="form-checkbox h-4 w-4"
                    />
                    <span className="text-sm text-gray-600">E</span>
                  </div>
                </label>
              </div>
              <input
                type="number"
                min="1"
                max="6"
                step="1"
                value={value.grade}
                onChange={onInputChange('kernfaecher', subject)}
                className="border rounded p-2 dark:bg-gray-800"
                placeholder="1-6"
              />
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
                  <div className="flex items-center gap-1 ml-2">
                    <input
                      type="checkbox"
                      checked={value.level === 'E'}
                      onChange={onLevelChange('faecher', subject)}
                      className="form-checkbox h-4 w-4"
                    />
                    <span className="text-sm text-gray-600">E</span>
                  </div>
                </label>
              </div>
              <input
                type="number"
                min="1"
                max="6"
                step="1"
                value={value.grade}
                onChange={onInputChange('faecher', subject)}
                className="border rounded p-2 dark:bg-gray-800"
                placeholder="1-6"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}