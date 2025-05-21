import { ExamGrades } from '../types/grades';
import { ExamCalculator } from '../services/examCalculator';

interface ResultsDisplayProps {
    examGrades: ExamGrades;
}

export function ResultsDisplayExam({ examGrades }: ResultsDisplayProps) {

    return (

        <div className="bg-transparent text-white font-medium flex flex-col gap-3">
            <div
                className={ExamCalculator.calculateExamStatus(examGrades).ebbrPassed ? "text-green-400" : "text-red-400"}>
                {`eBBR: ${ExamCalculator.calculateExamStatus(examGrades).ebbrPassed ? 'Bestanden' : 'Nicht bestanden'}`}
            </div>
            <div
                className={ExamCalculator.calculateExamStatus(examGrades).msaPassed ? "text-green-400" : "text-red-400"}>
                {`MSA: ${ExamCalculator.calculateExamStatus(examGrades).msaPassed ? 'Bestanden' : 'Nicht bestanden'}`}
            </div>


        </div>
    );
}