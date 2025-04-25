'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { GradeInput } from "./components/GradeInput";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { ExamGradeInput } from "./components/ExamGradeInput";
import { GradeCalculator } from "./services/gradeCalculator";
import { ExamCalculator } from "./services/examCalculator";
import { AllGradeInputs, GradeStats, ExamGrades, GradeWithLevel, convertPointsToGrade, convertPointsToGradeG } from "./types/grades";

export default function Home() {
  const [grades, setGrades] = useState<AllGradeInputs>({
    kernfaecher: {
      deutsch: { points: '', grade: '', level: 'G' },
      mathe: { points: '', grade: '', level: 'G' },
      ersteFremdsprache: { points: '', grade: '', level: 'G' }
    },
    faecher: {
      wAT: { points: '', grade: '', level: 'M' },
      biologie: { points: '', grade: '', level: 'G' },
      physik: { points: '', grade: '', level: 'G' },
      chemie: { points: '', grade: '', level: 'G' },
      ethik: { points: '', grade: '', level: 'M' },
      geWi: { points: '', grade: '', level: 'M' },
      musik: { points: '', grade: '', level: 'M' },
      kunst: { points: '', grade: '', level: 'M' },
      sport: { points: '', grade: '', level: 'M' },
      französich: { points: '', grade: '', level: 'M' }
    }
  });

  const [examGrades, setExamGrades] = useState<ExamGrades>({
    deutsch: { points: '', grade: '', level: 'G' },
    mathematik: { points: '', grade: '', level: 'G' },
    fremdsprache: { points: '', grade: '', level: 'G' },
    praesentation: { points: '', grade: '', level: 'G' }
  });

  const [gradeStats, setGradeStats] = useState<GradeStats>({
    ebbrPassed: false,
    msaPassed: false,
    status: '',
    average: 0,
    uebergangGymnasialeOberstufe: false
  });

  const [examResult, setExamResult] = useState('');

  const handleInputChange = (category: 'kernfaecher' | 'faecher', subject: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const points = e.target.value;
      setGrades(prev => {
        const currentGrade = prev[category][subject as keyof typeof prev[typeof category]] as GradeWithLevel;
        const grade = points ?
          (currentGrade.level === 'G' ? convertPointsToGradeG(Number(points)) : convertPointsToGrade(Number(points))).toString()
          : '';
        
        const updatedCategory = {
          ...prev[category],
          [subject]: {
            ...(prev[category][subject as keyof typeof prev[typeof category]] as GradeWithLevel),
            points,
            grade
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

        const updatedCategory = {
          ...prev[category],
          [subject]: {
            ...currentGrade,
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
      const points = e.target.value;
      const grade = points ? convertPointsToGrade(Number(points)).toString() : '';
      
      setExamGrades(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          points,
          grade
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
            src="/elui_logo_schwarz.png"
            alt="Elui logo"
            width={200}
            height={200}
            className="w-3/5 sm:w-32 h-auto"
            priority
          />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Abschlussrechner
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
