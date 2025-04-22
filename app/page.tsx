'use client';
import Image from "next/image";
import { useState } from "react";
import { GradeInput } from "./components/GradeInput";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { ExamGradeInput } from "./components/ExamGradeInput";
import { GradeCalculator } from "./services/gradeCalculator";
import { ExamCalculator } from "./services/examCalculator";
import { AllGradeInputs, GradeStats, ExamGrades, GradeWithLevel } from "./types/grades";

export default function Home() {
  const [grades, setGrades] = useState<AllGradeInputs>({
    kernfaecher: {
      deutsch: { grade: '', level: 'G' },
      mathe: { grade: '', level: 'G' },
      ersteFremdsprache: { grade: '', level: 'G' }
    },
    faecher: {
      biologie: { grade: '', level: 'G' },
      physik: { grade: '', level: 'G' },
      chemie: { grade: '', level: 'G' },
      geographie: { grade: '', level: 'G' },
      geschichte: { grade: '', level: 'G' },
      politik: { grade: '', level: 'G' },
      musik: { grade: '', level: 'G' },
      kunst: { grade: '', level: 'G' },
      sport: { grade: '', level: 'G' }
    }
  });

  const [examGrades, setExamGrades] = useState<ExamGrades>({
    deutsch: { grade: '', level: 'G' },
    mathematik: { grade: '', level: 'G' },
    fremdsprache: { grade: '', level: 'G' },
    praesentation: { grade: '', level: 'G' }
  });

  const [gradeStats, setGradeStats] = useState<GradeStats>({
    status: '',
    average: 0,
    uebergangGymnasialeOberstufe: false
  });

  const [examResult, setExamResult] = useState('');

  const handleInputChange = (category: 'kernfaecher' | 'faecher', subject: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGrades(prev => {
        const updatedCategory = {
          ...prev[category],
          [subject]: {
            ...(prev[category][subject as keyof typeof prev[typeof category]] as GradeWithLevel),
            grade: e.target.value
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
        const updatedCategory = {
          ...prev[category],
          [subject]: {
            ...(prev[category][subject as keyof typeof prev[typeof category]] as GradeWithLevel),
            level: e.target.checked ? 'E' : 'G'
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
      setExamGrades(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          grade: e.target.value
        }
      }));
    };

  const handleExamLevelChange = (field: keyof ExamGrades) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setExamGrades(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          level: e.target.checked ? 'E' : 'G'
        }
      }));
    };

  const calculateGrades = () => {
    const result = GradeCalculator.calculateGrades(grades);
    setGradeStats(result);
  };

  const calculateExamGrades = () => {
    const result = ExamCalculator.calculateExamGrades(examGrades);
    setExamResult(result);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="text-center mb-8 flex flex-col items-center gap-6">
          <Image
            src="/elouco_logo.png"
            alt="Elouco logo"
            width={64}
            height={64}
            className="w-16 h-16"
            priority
          />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Abschlussnotenrechner
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            erweiterte Berufsbildungsreife (eBBR) Notenrechner für Berlin
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
            Berechnen
          </button>
          <ResultsDisplay gradeStats={gradeStats} />
        </div>

        <ExamGradeInput 
          examGrades={examGrades}
          onInputChange={handleExamInputChange}
          onLevelChange={handleExamLevelChange}
          onCalculate={calculateExamGrades}
        />

        {examResult && (
          <div className={`font-medium mt-4 ${examResult.includes('bestanden') && !examResult.includes('nicht') ? 'text-green-400' : 'text-red-400'}`}>
            Prüfungen: {examResult}
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-center text-foreground">
          Vielen Dank für Ihren Besuch
        </p>
      </footer>
    </div>
  );
}
