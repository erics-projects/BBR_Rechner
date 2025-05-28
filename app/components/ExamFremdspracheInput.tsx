import React from 'react';
import {ExamGrades} from "@/app/types/grades";

interface ExamFremdspracheInputProps {
    value: {
        pointsSchriftlich: string;
        pointsMuendlich: string;
        gradeSchriftlich_MSA: string;
        gradeMuendlich_MSA: string;
        gradeSchriftlich_eBBR: string;
        gradeMuendlich_eBBR: string;
        gradeMSA: string;
        gradeEBBR: string;
        maxPointsSchriftlich: string;
        maxPointsMuendlich: string;

    };
    onInputChange: (field: 'fremdsprache', subField: 'pointsSchriftlich' | 'pointsMuendlich') => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ExamFremdspracheInput({ value, onInputChange }: ExamFremdspracheInputProps) {
    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 ">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-start">
                        <label className="text-sm font-medium flex items-center gap-2">
                            Erste Fremdsprache
                        </label>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-1/3 sm:w-24">
                            <input
                                type="number"
                                min="0"
                                max={value.maxPointsSchriftlich}
                                step="1"
                                value={value.pointsSchriftlich}
                                onChange={onInputChange('fremdsprache', 'pointsSchriftlich')}
                                className="w-full border rounded p-2 dark:bg-gray-800"
                                placeholder={`0-${value.maxPointsSchriftlich}`}
                            />

                            <span className="text-sm">Schriftlich</span>
                            {value.pointsSchriftlich !== '' && (
                                <div className="mt-0 text-xs flex flex-col">
                                    <span>eBBR: {value.gradeSchriftlich_eBBR} | MSA: {value.gradeSchriftlich_MSA}</span>
                                </div>
                            )}
                        </div>
                        <div className="w-1/3 sm:w-24">
                            <input
                                type="number"
                                min="0"
                                max={value.maxPointsMuendlich}
                                step="1"
                                value={value.pointsMuendlich}
                                onChange={onInputChange('fremdsprache', 'pointsMuendlich')}
                                className="w-full border rounded p-2 dark:bg-gray-800"
                                placeholder={`0-${value.maxPointsMuendlich}`}
                            />
                            <span className="text-sm">Mündlich</span>
                            {value.pointsSchriftlich !== '' && (
                                <div className="mt-0 text-xs flex flex-col">
                                    <span>eBBR: {value.gradeMuendlich_eBBR} |  MSA: {value.gradeMuendlich_MSA}</span>
                                </div>
                            )}
                        </div>
                        {value.pointsMuendlich !== '' && value.pointsSchriftlich !== '' && (
                            <div className="mt-2 text-sm">
                                <p>eBBR: {value.gradeEBBR} </p>
                                <span>MSA: {value.gradeMSA}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
            )
            ;
            }