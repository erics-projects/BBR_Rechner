'use client';
import Image from "next/image";
import { useState } from "react";

interface KernfaecherInputs {
  deutsch: string;
  mathe: string;
  ersteFremdsprache: string;
}

interface FaecherInputs {
  biologie: string;
  physik: string;
  chemie: string;
  geographie: string;
  geschichte: string;
  politik: string;
  musik: string;
  kunst: string;
  sport: string;
}

interface AllGradeInputs {
  kernfaecher: KernfaecherInputs;
  faecher: FaecherInputs;
}

export default function Home() {
  const [grades, setGrades] = useState<AllGradeInputs>({
    kernfaecher: {
      deutsch: '',
      mathe: '',
      ersteFremdsprache: ''
    },
    faecher: {
      biologie: '',
      physik: '',
      chemie: '',
      geographie: '',
      geschichte: '',
      politik: '',
      musik: '',
      kunst: '',
      sport: ''
    }
  });

  const handleInputChange = (category: 'kernfaecher' | 'faecher', subject: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGrades(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [subject]: e.target.value
        }
      }));
    };

  const [gradeStats, setGradeStats] = useState<{ status: string, kernfaecher: string, faecher: string }>({
    status: '',
    kernfaecher: '',
    faecher: ''
  });

  const countGrades = () => {
    // Initialize counters for both categories
    const kernfaecherCounts = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 };
    const faecherCounts = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 };

    let kernfaecher3orBetter = Object.values(grades.kernfaecher).filter(grade => grade !== '6' && grade !== '5' && grade !== '4' && grade !== '').length;
    let faecher3orBetter = Object.values(grades.faecher).filter(grade => grade !== '6' && grade !== '5' && grade !== '4' && grade !== '').length;
    //combine kernfaecher and faecher 3orBetter
    let kernfaecherFaecher3orBetter = kernfaecher3orBetter + faecher3orBetter;
    // Count Kernfaecher and Fächer grades that are 2 or better
    let kernfaecher2orBetter = Object.values(grades.kernfaecher).filter(grade => grade !== '6' && grade !== '5' && grade !== '4' && grade !== '3' && grade !== '').length;
    let faecher2orBetter = Object.values(grades.faecher).filter(grade => grade !== '6' && grade !== '5' && grade !== '4' && grade !== '3' && grade !== '').length;
    
    // combine kernfaecher and faecher 2 or better
    let kernfaecherFaecher2orBetter = kernfaecher2orBetter + faecher2orBetter;

     
    // Count Kernfaecher grades
    Object.values(grades.kernfaecher).forEach(grade => {
      if (grade !== '') {
        kernfaecherCounts[grade as keyof typeof kernfaecherCounts]++;
      }
    });

    // Count regular Faecher grades
    Object.values(grades.faecher).forEach(grade => {
      if (grade !== '') {
        faecherCounts[grade as keyof typeof faecherCounts]++;
      }
    });

    // Check for failing grades (5 or 6) using the count objects
    const hasFiveOrSixKernfaecher = kernfaecherCounts['5'] > 0 || kernfaecherCounts['6'] > 0;
    const hasFiveOrSixFaecher = faecherCounts['5'] > 0 || faecherCounts['6'] > 0;

    // wenn es eine 6 im Kernfach gibt, dann ist es nicht bestanden und/oder zwei 5 in Kernfächern
    if (kernfaecherCounts['6'] > 0 || kernfaecherCounts['5'] > 1) {
      setGradeStats({
        status: 'Nicht bestanden: 6 oder 2x5 in einem Kernfach.',
        kernfaecher: '',
        faecher: ''
      });
      return;
    }      
    // und wenn es zwei 6er gibt in faechern dann ist es auch nicht bestanden
    if (faecherCounts['6'] > 1) {
      setGradeStats({
        status: 'Nicht bestanden: 2x 6 in Fächer.',
        kernfaecher: '',
        faecher: ''
      });
      return;
    }

    // 1x 6 in Faecher und 2 in Kernfächer und/oder Fächer
    if (faecherCounts['6']==1 && kernfaecherFaecher2orBetter < 2) {
      setGradeStats({
        status: 'Nicht bestanden: 1x 6 in Fächer und keine 2 zweien in Kernfächer und/oder Fächer.',
        kernfaecher: '',
        faecher: ''
      });
      return;
    }
    // wenn 1x 6 in Fächer und 2x eine 2 oder weniger in Fächer und/oder Kernfächer, dann lösch die guten Noten aus den Fächer und Kernfächer 
    else if (faecherCounts['6'] == 1 && kernfaecherFaecher2orBetter >= 2) {
      kernfaecherFaecher2orBetter -= 2;
      kernfaecherFaecher3orBetter -= 2;

      // wenn in Fächer zwei 2en und/oder 1en sind, dann lösche die 2en aus fächer3orBetter
      if (faecher2orBetter >= 2) {
        faecher3orBetter -= 2;
        faecher2orBetter -= 2;
      }

      // wenn in Fächer eine 2 und in Kernfächer eine 2 oder besser ist, dann lösche die 2 aus fächer3orBetter, kernfächer3orBetter
      else if (faecher2orBetter == 1 && kernfaecher2orBetter >= 1) {
        faecher3orBetter -= 1;
        kernfaecher3orBetter -= 1;
        faecher2orBetter -= 1;
        kernfaecher2orBetter -= 1;
      }
      // else if wenn in Kernfächer 2 besser als 2 sind, dann lösche die 2 aus kernfächer3orBetter
      else if (kernfaecher2orBetter >= 2) {
        kernfaecher3orBetter -= 2;
        kernfaecher2orBetter -= 2;
      }
    } 




    // 1x 5 in Kernfächer und 1x 5 in Fächer und dafür 1x eine 3 oder weniger in Kernfächer und Fächer ist bestanden, wenn nicht, dann nicht bestanden
    if (kernfaecherCounts['5'] == 1 && faecherCounts['5'] == 1 && (kernfaecher3orBetter < 1 && faecher3orBetter < 1 )) {
      setGradeStats({
        status: 'Nicht bestanden: 1x 5 in Kernfächer und 1x 5 in Fächer und nicht genug 3er.',
        kernfaecher: '',
        faecher: ''
      });
      return;
    }

    // wenn 1x 5 in Kernfächer und 1x 5 in Fächer und dafür 1x eine 3 oder weniger in Kernfächer und Fächer ist, dann lösche 1x aus faecher3orBetter und 1x aus kernfaecher3orBetter
    else if (kernfaecherCounts['5'] == 1 && faecherCounts['5'] == 1 && (kernfaecher3orBetter >= 1 || faecher3orBetter >= 1 )) {
      kernfaecherFaecher3orBetter -= 1;
      if (faecher3orBetter >= 1) {
        faecher3orBetter -= 1;
      }
      else if (kernfaecher3orBetter >= 1) {
        kernfaecher3orBetter -= 1;
      }
      return;
    }



    // 2x5 in Fächer und dafür 2x eine 3 oder weniger in Kernfächer und Fächer ist bestanden, wenn nicht, dann nicht bestanden
    if (faecherCounts['5'] >= 2 && kernfaecherFaecher3orBetter < 2) {
      console.log(kernfaecherFaecher3orBetter, "warum hier, wenn das hier kleiner 2 ist?");
      setGradeStats({
        status: 'Nicht bestanden: 2x 5 in Fächer und nicht genug 3er.',
        kernfaecher: '',
        faecher: ''
      });
      return;
    }



    // Create status message with detailed information
    const statusMessage = 'Bestanden: ';

    // Create summary strings
    const kernfaecherSummary = `Kernfächer: ${Object.entries(kernfaecherCounts)
      .filter(([_, count]) => count > 0)
      .map(([grade, count]) => `Note ${grade}: ${count}x`)
      .join(', ')}`;

    const faecherSummary = `Fächer: ${Object.entries(faecherCounts)
      .filter(([_, count]) => count > 0)
      .map(([grade, count]) => `Note ${grade}: ${count}x`)
      .join(', ')}`;

    setGradeStats({
      status: statusMessage,
      kernfaecher: kernfaecherSummary,
      faecher: faecherSummary
    });
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
            BBR-Notenrechner
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Berufsbildungsreife (BBR) Notenrechner für Berlin
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

        <div className="flex flex-col gap-6 w-full max-w-4xl">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Kernfächer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(grades.kernfaecher).map(([subject, value]) => {
                const displayName = {
                  deutsch: 'Deutsch',
                  mathe: 'Mathematik',
                  ersteFremdsprache: 'Erste Fremdsprache'
                }[subject] || subject;
                
                return (
                  <div key={subject} className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      {displayName}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      step="1"
                      value={value}
                      onChange={handleInputChange('kernfaecher', subject)}
                      className="border rounded p-2 dark:bg-gray-800"
                      placeholder="1-6"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Fächer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(grades.faecher).map(([subject, value]) => {
                const displayName = {
                  biologie: 'Biologie',
                  physic: 'Physik',
                  chemie: 'Chemie',
                  geographie: 'Geographie',
                  geschichte: 'Geschichte',
                  politik: 'Politik',
                  musik: 'Musik',
                  kunst: 'Kunst',
                  sport: 'Sport'
                }[subject] || subject;

                return (
                  <div key={subject} className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      {displayName}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      step="1"
                      value={value}
                      onChange={handleInputChange('faecher', subject)}
                      className="border rounded p-2 dark:bg-gray-800"
                      placeholder="1-6"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            onClick={countGrades}
          >
            Berechnen
          </button>
          {gradeStats.status && (
            <div className="bg-transparent text-white font-medium flex flex-col gap-2">
              <div className={gradeStats.status.includes('Bestanden') ? 'text-green-400' : 'text-red-400'}>
                {gradeStats.status}
              </div>
              <div>{gradeStats.kernfaecher}</div>
              <div>{gradeStats.faecher}</div>
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Textfield: "Vielen Dank für Ihren Besuch" */}
        <p className="text-sm text-center text-foreground">
          Vielen Dank für Ihren Besuch </p>
      </footer>
    </div>
  );
}
