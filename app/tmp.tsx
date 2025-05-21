import {convertPointsToGrade, convertPointsToGradeG, ExamGrades} from "@/app/types/grades";

const handleExamInputChange = (field: keyof ExamGrades) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const points = e.target.value;
        const gradeMSA = points ? convertPointsToGrade(Number(points)).toString() : '';
        const gradeEBBR = points ? convertPointsToGradeG(Number(points)).toString() : '';

        setExamGrades(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                points,
                gradeMSA,
                gradeEBBR
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