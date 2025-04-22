import { GradeStats } from '../types/grades';

interface ResultsDisplayProps {
  gradeStats: GradeStats;
}

export function ResultsDisplay({ gradeStats }: ResultsDisplayProps) {
  if (!gradeStats.status) {
    return null;
  }

  return (
    <div className="bg-transparent text-white font-medium flex flex-col gap-2">
      <div className={gradeStats.status.includes('Bestanden') && !gradeStats.status.includes('Nicht') ? 'text-green-400' : 'text-red-400'}>
        {gradeStats.status}
      </div>
      {gradeStats.average > 0 && (
        <div className="text-foreground">
          Durchschnitt: {gradeStats.average}
        </div>
      )}
      {gradeStats.status.includes('Bestanden') && (
        <div className={gradeStats.uebergangGymnasialeOberstufe ? 'text-green-400' : 'text-yellow-400'}>
          {gradeStats.uebergangGymnasialeOberstufe 
            ? 'Übergang Gymnasiale Oberstufe: Ja'
            : 'Übergang Gymnasiale Oberstufe: Nein'}
        </div>
      )}
    </div>
  );
}