import { GradeStats } from '../types/grades';

interface ResultsDisplayProps {
  gradeStats: GradeStats;
}

export function ResultsDisplay({ gradeStats }: ResultsDisplayProps) {
  // Only render if we have grades to display
  if (!gradeStats.average) {
    return null;
  }

  return (
    <div className="bg-transparent text-white font-medium flex flex-col gap-3">
      <div className={`text-xl font-bold ${gradeStats.average > 4.2 ? 'text-red-400' : 'text-green-400'}`}>
        Durchschnitt: {gradeStats.average}
      </div>

      <div className={gradeStats.bbrPassed ? 'text-green-400' : 'text-red-400'}>
        {gradeStats.bbrStatus}
      </div>

      <div className={gradeStats.ebbrPassed ? 'text-green-400' : 'text-red-400'}>
        {gradeStats.ebbrStatus}
      </div>

      <div className={gradeStats.msaPassed ? 'text-green-400' : 'text-yellow-400'}>
        {gradeStats.msaStatus}
      </div>

      <div className={gradeStats.uebergangGymnasialeOberstufe ? 'text-green-400' : 'text-yellow-400'}>
        {gradeStats.uebergangReason}
      </div>
    </div>
  );
}