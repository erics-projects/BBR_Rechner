import { GradeStats } from '../types/grades';

interface ResultsDisplayProps {
  gradeStats: GradeStats;
}

export function ResultsDisplay({ gradeStats }: ResultsDisplayProps) {
  if (!gradeStats.status && !gradeStats.ebbrPassed) {
    return null;
  }

  return (
    <div className="bg-transparent text-white font-medium flex flex-col gap-3">
      <div className={gradeStats.ebbrPassed ? 'text-green-400' : 'text-red-400'}>
        eBBR: {gradeStats.ebbrPassed ? 'Bestanden' : 'Nicht bestanden'}
      </div>

      <div className="text-foreground">
        Durchschnitt: {gradeStats.average}
      </div>

      {gradeStats.ebbrPassed && (
        <>
          <div className={gradeStats.msaPassed ? 'text-green-400' : 'text-yellow-400'}>
            MSA: {gradeStats.msaPassed ? 'Bestanden' : 'Nicht bestanden'}
          </div>

          <div className={gradeStats.uebergangGymnasialeOberstufe ? 'text-green-400' : 'text-yellow-400'}>
            Übergang Gymnasiale Oberstufe: {gradeStats.uebergangGymnasialeOberstufe ? 'Ja' : 'Nein'}
            {!gradeStats.uebergangGymnasialeOberstufe && gradeStats.uebergangReason && (
              <div className="text-sm text-gray-400 mt-1">
                Grund: {gradeStats.uebergangReason}
              </div>
            )}
          </div>
        </>
      )}

      {!gradeStats.ebbrPassed && gradeStats.status && (
        <div className="text-sm text-red-400 mt-2">
          {gradeStats.status}
        </div>
      )}
    </div>
  );
}