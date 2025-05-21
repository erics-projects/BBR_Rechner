import { ExamGrades } from '../types/grades';
import { ExamCalculator } from '../services/examCalculator';

interface ResultsDisplayProps {
    examGrades: ExamGrades;
}

export function ResultsDisplayExam({ examGrades }: ResultsDisplayProps) {
    // Only render if there is at least one exam filled
    if (
        !examGrades ||
        !Object.values(examGrades).some(exam =>
            exam &&
            Object.values(exam).some(value => value !== undefined && value !== null && value !== '')
        )
    ) {
        return null;
    }

    const subjects = Object.entries(examGrades);

    return (

        <div className="bg-transparent text-white font-medium flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Ergebnisse</h2>
            <div
                className={ExamCalculator.calculateExamStatus(examGrades).msaPassed ? "text-green-400" : "text-red-400"}>
                {`MSA Grade: ${ExamCalculator.calculateExamStatus(examGrades).msaPassed ? 'Passed' : 'Failed'}`}
            </div>
            <div
                className={ExamCalculator.calculateExamStatus(examGrades).ebbrPassed ? "text-green-400" : "text-red-400"}>
                {`EBBR Grade: ${ExamCalculator.calculateExamStatus(examGrades).ebbrPassed ? 'Passed' : 'Failed'}`}
            </div>

            {/* Display each subject's MSA and EBBR grades */}
            {subjects.map(([subject, grades]) => (

                // Display each subject's MSA and EBBR grades
                <div key={subject} className="flex flex-col">
                    <div className="text-green-400">{`${subject.charAt(0).toUpperCase() + subject.slice(1)} MSA Grade: ${grades.gradeMSA}`}</div>
                    <div className="text-green-400">{`${subject.charAt(0).toUpperCase() + subject.slice(1)} EBBR Grade: ${grades.gradeEBBR}`}</div>
                </div>
            ))}
        </div>
    );
}