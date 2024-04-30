"use client"
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface Question {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

export interface StoredQuestionsData {
    fileName: string;
    questions: Question[];
}

const QuestionFileInput: FunctionComponent = (props) => {
    const [questionsFile, setQuestionsFile] = useState<StoredQuestionsData | null>(() => {
        const storedQuestions = typeof window !== 'undefined' ? localStorage.getItem('questions') : null;
        return storedQuestions ? JSON.parse(storedQuestions) : null;
    });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Retrieve file name from localStorage and set it as the initial value for questionsFile
        const storedQuestions = typeof window !== 'undefined' ? localStorage.getItem('questions') : null;
        if (storedQuestions) {
            const file = JSON.parse(storedQuestions);
            setQuestionsFile(file);
        }
    }, []);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setError(null);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const fileData = e.target.result as string;
                    try {
                        const questions: Question[] = JSON.parse(fileData);

                        if (!Array.isArray(questions) || questions.length !== 10) {
                            setError('The file must contain an array of 10 questions.');
                            return;
                        }

                        for (const question of questions) {
                            if (
                                !question.question ||
                                !Array.isArray(question.options) ||
                                question.options.length !== 4 ||
                                !Number.isInteger(question.correctAnswerIndex) ||
                                question.correctAnswerIndex < 0 ||
                                question.correctAnswerIndex > 3
                            ) {
                                setError('Each question must have a "question" string, an array of 4 "options", and a "correctAnswerIndex" which is an integer between 0 and 3.');
                                return;
                            }
                        }

                        const storageData = {
                            fileName: file.name,
                            questions: questions,
                        };
                        if (typeof window !== 'undefined') localStorage.setItem('questions', JSON.stringify(storageData));
                        setQuestionsFile(storageData);
                        setError('')
                    } catch (error) {
                        setError('Error parsing JSON data.');
                    }
                }
            };
            reader.readAsText(file);
        } else {
            setQuestionsFile(null);
            if (typeof window !== 'undefined') localStorage.removeItem('questions');
        }

    };

    return (
        <div className=''>
            <div className="grid w-full max-w-sm items-center gap-4">
                <Label htmlFor="picture">Upload JSON file : </Label>
                <Input accept='.json' id="questions" type="file" className='hover:cursor-pointer' onChange={handleFileChange} />
                <Button disabled={questionsFile ? false : true} onClick={() => {
                    if (questionsFile) router.push('/quiz')
                }}>Start Quiz</Button>
                {questionsFile && (
                    <p>
                        Currently Selected File: {questionsFile.fileName}
                    </p>
                )}
                {error && <p className='text-red-500'>{error}</p>}
            </div>
        </div>
    );
};

export default QuestionFileInput;
