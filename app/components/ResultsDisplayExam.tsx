import { ExamGrades } from '../types/grades';
import { ExamCalculator } from '../services/examCalculator';

interface ResultsDisplayProps {
    examGrades: ExamGrades;
}

export function ResultsDisplayExam({ examGrades }: ResultsDisplayProps) {

    return (

        <div className="bg-transparent text-white font-medium flex flex-col gap-3">
            <div
                className={ExamCalculator.calculateExamStatus(examGrades).bbrPassed ? "text-green-400" : "text-red-400"}>
                {`BBR: ${ExamCalculator.calculateExamStatus(examGrades).bbrPassed ? 'Bestanden' : 'Nicht bestanden'}`}
            </div>
            <div
                className={ExamCalculator.calculateExamStatus(examGrades).ebbrPassed ? "text-green-400" : "text-red-400"}>
                {`eBBR: ${ExamCalculator.calculateExamStatus(examGrades).ebbrPassed ? 'Bestanden' : 'Nicht bestanden'}`}
            </div>
            <div
                className={ExamCalculator.calculateExamStatus(examGrades).msaPassed ? "text-green-400" : "text-red-400"}>
                {`MSA/MSAgo: ${ExamCalculator.calculateExamStatus(examGrades).msaPassed ? 'Bestanden' : 'Nicht bestanden'}`}
            </div>
            <span className={"m-px"}>
        <a className={"text-sm"}>Du bestehst den Prüfungsteil, für MSA und eBBR, wenn du in allen Prüfungen 4 oder besser
          bist. <br/>
          - Eine 5 kann mit einer 3 oder besser ausgleichen werden <br/>
          - Zwei 5en oder eine 6 ist durchgefallen
        </a>
        <p className={"text-sm"}></p>
          </span>

        </div>
    );
}