'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { GradeInput } from "./components/GradeInput";
import { ResultsDisplayGrades } from "./components/ResultsDisplayGrades";
import { ResultsDisplayExam } from "./components/ResultsDisplayExam";
import { ExamGradeInput } from "./components/ExamGradeInput";
import { GradeCalculator } from "./services/gradeCalculator";
import { ExamCalculator } from "./services/examCalculator";
import { AllGradeInputs, GradeStats, ExamGrades, GradeWithLevel, convertPointsToGrade, convertPointsToGradeG} from "./types/grades";

export default function Home() {
  const [grades, setGrades] = useState<AllGradeInputs>({
    kernfaecher: {
      deutsch: { points: '', gradeE: '', gradeG: '', level: 'G' },
      mathe: { points: '', gradeE: '', gradeG: '', level: 'G' },
      ersteFremdsprache: { points: '', gradeE: '', gradeG: '', level: 'G' }
    },
    faecher: {
      wAT: { points: '', gradeE: '', gradeG: '', level: 'M' },
      biologie: { points: '', gradeE: '', gradeG: '', level: 'G' },
      physik: { points: '', gradeE: '', gradeG: '', level: 'G' },
      chemie: { points: '', gradeE: '', gradeG: '', level: 'G' },
      ethik: { points: '', gradeE: '', gradeG: '', level: 'M' },
      geWi: { points: '', gradeE: '', gradeG: '', level: 'M' },
      musik: { points: '', gradeE: '', gradeG: '', level: 'M' },
      kunst: { points: '', gradeE: '', gradeG: '', level: 'M' },
      sport: { points: '', gradeE: '', gradeG: '', level: 'M' },
      französich: { points: '', gradeE: '', gradeG: '', level: 'M' }
    }
  });

  const [examGrades, setExamGrades] = useState<ExamGrades>({
    deutsch: { points: '', gradeMSA: '', gradeEBBR: '', maxPoints: '112' },
    mathematik: { points: '', gradeMSA: '', gradeEBBR: '', maxPoints: '60' },
    fremdsprache: { points: '', gradeMSA: '', gradeEBBR: '', maxPoints: '75' },
    praesentation: { points: '', gradeMSA: '', gradeEBBR: '', maxPoints: '35' },
  });

  const [gradeStats, setGradeStats] = useState<GradeStats>({
    ebbrPassed: false,
    ebbrStatus: '',
    msaPassed: false,
    msaStatus: '',
    bbrPassed: false,
    bbrStatus: '',
    averageG: 0,
    averageE: 0,
    uebergangGymnasialeOberstufe: false,
    uebergangReason: undefined
  });

  const handleInputChange = (category: 'kernfaecher' | 'faecher', subject: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const points = e.target.value;
      setGrades(prev => {
        const currentGrade = prev[category][subject as keyof typeof prev[typeof category]] as GradeWithLevel;
        const gradeE = points ? convertPointsToGrade(Number(points)).toString() : '';
        const gradeG = points ? convertPointsToGradeG(Number(points)).toString() : '';
        
        const updatedCategory = {
          ...prev[category],
          [subject]: {
            ...(prev[category][subject as keyof typeof prev[typeof category]] as GradeWithLevel),
            points,
            gradeE,
            gradeG
          }
        };
        return {
          ...prev,
          [category]: updatedCategory
        };
      });
    };

  const handleLevelChange = (category: 'kernfaecher' | 'faecher', subject: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGrades(prev => {
        const currentGrade = prev[category][subject as keyof typeof prev[typeof category]] as GradeWithLevel;
        
        // Don't allow changing M-level grades
        if (currentGrade.level === 'M') return prev;

        const newLevel = e.target.checked ? 'E' : 'G';
        // Recalculate grade based on new level if points exist
        const gradeE = currentGrade.points ? convertPointsToGrade(Number(currentGrade.points)).toString() : '';
        const gradeG = currentGrade.points ? convertPointsToGradeG(Number(currentGrade.points)).toString() : '';

        const updatedCategory = {
          ...prev[category],
          [subject]: {
            ...currentGrade,
            level: newLevel,
            gradeE,
            gradeG
          }
        };
        return {
          ...prev,
          [category]: updatedCategory
        };
      });
    };

  const handleExamInputChange = (field: keyof ExamGrades) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const points = e.target.value;

        setExamGrades(prev => {
          const updatedExamGrades = {
            ...prev,
            [field]: {
              ...prev[field],
              points
            }
          };

          // Recalculate grades based on updated points
          const recalculatedGrades = ExamCalculator.calculateExamGrades(updatedExamGrades);

          return recalculatedGrades;
        });
      };

  const calculateGrades = () => {
    const result = GradeCalculator.calculateGrades(grades);
    setGradeStats(result);
  };

  // create calculateExamGrades function
  // that uses the ExamCalculator class to calculate the exam grades
  // updates the ExamGrades state with the calculated grades
    const calculateExamGrades = () => {
        const result = ExamCalculator.calculateExamGrades(examGrades);
        setExamGrades(result);
      setShowExamResults(true); // Show results after calculation
    }

  const [showExamResults, setShowExamResults] = useState(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="text-center mb-8 flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Abschlussrechner
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            erweiterte Berufsbildungsreife (eBBR) und MSA Notenrechner für Berlin
          </p>
    
          <a
            href="https://www.berlin.de/sen/bildung/schule/pruefungen-und-abschluesse/abschluesse-an-der-iss-nach-klasse-9-und-10/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Alle Informationen finden Sie hier: berlin.de/...
          </a>
        </div>

        <GradeInput 
          grades={grades}
          onInputChange={handleInputChange}
          onLevelChange={handleLevelChange}
        />

        <div className="flex items-center gap-4">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            onClick={calculateGrades}
          >
            Testen
          </button>
          <ResultsDisplayGrades gradeStats={gradeStats} />
        </div>

        <ExamGradeInput 
          examGrades={examGrades}
          onInputChange={handleExamInputChange}
          onCalculate={calculateExamGrades}
        />
        {showExamResults && <ResultsDisplayExam examGrades={examGrades} />}
        {/*<ResultsDisplayExam examGrades={examGrades} />*/}
        {/*{examResult && (
          <div className={`font-medium mt-4 ${examResult.includes('bestanden') && !examResult.includes('nicht') ? 'text-green-400' : 'text-red-400'}`}>
            Prüfungen: {examResult}
          </div>
        )}*/}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-center text-foreground">
          Vielen Dank für Ihren Besuch
        </p>
      </footer>
    </div>
  );
}
