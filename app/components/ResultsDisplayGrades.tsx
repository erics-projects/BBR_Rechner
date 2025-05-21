import { GradeStats } from '../types/grades';

interface ResultsDisplayProps {
  gradeStats: GradeStats;
}

export function ResultsDisplayGrades({ gradeStats }: ResultsDisplayProps) {


  return (
    <div className="bg-transparent text-white font-medium flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className={`text-xl font-bold ${gradeStats.averageG > 4.2 ? 'text-red-400' : 'text-green-400'}`}>
          Durchschnitt BBR/eBBR: {gradeStats.averageG}
        </div>
        {gradeStats.averageE > 0 && (
          <div className={`text-xl font-bold ${gradeStats.averageE > 3.0 ? 'text-red-400' : 'text-green-400'}`}>
            Durchschnitt MSA: {gradeStats.averageE}
          </div>
        )}
      </div>

      <div className={gradeStats.bbrPassed ? 'text-green-400' : 'text-red-400'}>
        {gradeStats.bbrStatus}
      </div>

      <div className={gradeStats.ebbrPassed ? 'text-green-400' : 'text-red-400'}>
        {gradeStats.ebbrStatus}
      </div>

      <div className={gradeStats.msaPassed ? 'text-green-400' : 'text-red-400'}>
        {gradeStats.msaStatus}
      </div>

      <div className={gradeStats.uebergangGymnasialeOberstufe ? 'text-green-400' : 'text-red-400'}>
        {gradeStats.uebergangReason}
      </div>
    </div>
  );
}