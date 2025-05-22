export const convertPresentationToGrade = (pointsS: String, pointsM: String, gradeMappingSchriftlich: { [key: number]: String },gradeMappingMuendlich: { [key: number]: String }): string => {
    const pointsSchriftlich = Number(pointsS);
    const pointsMuendlich = Number(pointsM);
    let schrifltichGrade = '';
    let muendlichGrade = '';

    let counterSchriftlich = 0;
    let counterMuendlich = 0;
    for (const [threshold, grade] of Object.entries(gradeMappingSchriftlich).sort((a, b) => Number(b[0]) - Number(a[0]))) {
        if (pointsSchriftlich >= Number(threshold)) {
            schrifltichGrade = grade.toString();
            counterSchriftlich++;
        }
    }
    if (counterSchriftlich === 0) {
        schrifltichGrade = '6'; // Default grade if no thresholds are met
    }

    for (const [threshold, grade] of Object.entries(gradeMappingMuendlich).sort((a, b) => Number(b[0]) - Number(a[0]))) {
        if (pointsMuendlich >= Number(threshold)) {
            muendlichGrade = grade.toString();
            counterMuendlich++;
        }
    }
    if (counterSchriftlich === 0) {
        muendlichGrade = '6'; // Default grade if no thresholds are met
    }
    const presentationGrade = Number(schrifltichGrade) + Number(muendlichGrade);
    return presentationGrade.toString();

};