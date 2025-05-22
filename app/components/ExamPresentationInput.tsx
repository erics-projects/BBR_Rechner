import React from 'react';

interface ExamPresentationInputProps {
    value: {
        pointsSchriftlich: string;
        pointsMuendlich: string;
        maxPointsSchriftlich: string;
        maxPointsMuendlich: string;
    };
    onInputChange: (subField: 'pointsSchriftlich' | 'pointsMuendlich') => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ExamPresentationInput({ value, onInputChange }: ExamPresentationInputProps) {
    return (
        <div className="flex gap-4">
            <div className="w-2/3 sm:w-24">
                <input
                    type="number"
                    min="0"
                    max={value.maxPointsSchriftlich}
                    step="1"
                    value={value.pointsSchriftlich}
                    onChange={onInputChange('pointsSchriftlich')}
                    className="w-full border rounded p-2 dark:bg-gray-800"
                    placeholder={`0-${value.maxPointsSchriftlich}`}
                />
                <span className="text-sm">Schriftlich</span>
            </div>
            <div className="w-2/3 sm:w-24">
                <input
                    type="number"
                    min="0"
                    max={value.maxPointsMuendlich}
                    step="1"
                    value={value.pointsMuendlich}
                    onChange={onInputChange('pointsMuendlich')}
                    className="w-full border rounded p-2 dark:bg-gray-800"
                    placeholder={`0-${value.maxPointsMuendlich}`}
                />
                <span className="text-sm">Mündlich</span>
            </div>
        </div>
    );
}