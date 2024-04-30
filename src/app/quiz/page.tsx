"use client"
import { StoredQuestionsData } from "@/components/QuestionFileInput";
import QuestionItem from "@/components/QuestionItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FunctionComponent, useEffect, useLayoutEffect, useState } from "react";

const Page: FunctionComponent = () => {
    const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(true);
    const [questionNumber, setQuestionNumber] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('question-number');
            return data && !isNaN(Number(data)) ? parseInt(data) : 1;
        }
        return 1;
    });
    const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('correct-answers-count');
            return data && !isNaN(Number(data)) ? parseInt(data) : 0;
        }
        return 0;
    });
    const [tabSwitchCount, setTabSwitchCount] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('tab-switch-count');
            return data && !isNaN(Number(data)) ? parseInt(data) : 0;
        }
        return 0;
    });
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [isQuizVisible, setIsQuizVisible] = useState(false)
    const [isAnswersVisible, setIsAnswersVisible] = useState(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('quiz-submited');
            return data ? JSON.parse(data) : false;
        }
        return false;
    })

    const data = typeof window !== 'undefined' ? localStorage.getItem('questions') : null;
    let questions: StoredQuestionsData | null = null;
    if (data) {
        questions = JSON.parse(data)
    }

    const handleAnswerSelect = (index: number, option: string) => {
        setSelectedAnswers((prevSelectedAnswers) => {
            const newSelectedAnswers = [...prevSelectedAnswers];
            newSelectedAnswers[index] = option;
            return newSelectedAnswers;
        });
    };

    const handleNextClick = () => {
        if (questionNumber < 10) {
            setQuestionNumber(prev => prev + 1);
        }
    };

    const handlePreviousClick = () => {
        if (questionNumber > 1) {
            setQuestionNumber(prev => prev - 1);
        }
    };

    const handleSubmitClick = () => {
        exitFullscreen();
        setIsQuizVisible(false);
        setIsPromptVisible(false);
        setIsAnswersVisible(true);

        let correctAnswersCount = 0;
        selectedAnswers.forEach((selectedAnswer, index) => {
            const correctAnswer = questions?.questions[index].options[questions?.questions[index].correctAnswerIndex];
            console.log(`Question ${index + 1}: Selected Answer - ${selectedAnswer}, Correct Answer - ${correctAnswer}`);
            if (selectedAnswer === correctAnswer) {
                correctAnswersCount++;
            }
        });
        if (typeof window !== 'undefined') {
            localStorage.setItem('correct-answers-count', correctAnswersCount.toString());
        }
        setCorrectAnswersCount(correctAnswersCount);
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
                /* Firefox */
                (document as any).mozCancelFullScreen();
            } else if ((document as any).webkitExitFullscreen) {
                /* Chrome, Safari & Opera */
                (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) {
                /* IE/Edge */
                (document as any).msExitFullscreen();
            }
        };
    }

    // useEffect(() => {
    //     const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage !== null;
    //     setIsLocalStorageAvailable(isLocalStorageAvailable);
    // }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && typeof window !== 'undefined') {
                setTabSwitchCount((prevCount) => {
                    const newCount = prevCount + 1;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('tab-switch-count', newCount.toString());
                    }

                    if (newCount >= 5) {
                        handleSubmitClick();
                    }

                    return newCount;
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [handleSubmitClick, isLocalStorageAvailable]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('question-number', questionNumber.toString())
        }
    }, [questionNumber, isLocalStorageAvailable])

    useLayoutEffect(() => {
        const element: any = document.documentElement;
        const isFullscreenSupported =
            element.requestFullscreen ||
            element.mozRequestFullScreen ||
            element.webkitRequestFullscreen ||
            element.msRequestFullscreen;

        const enterFullscreen = () => {
            if (isFullscreenSupported) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    /* Firefox */
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    /* Chrome, Safari & Opera */
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    /* IE/Edge */
                    element.msRequestFullscreen();
                }
            } else {
                // Fullscreen not supported, show blocking pop-up
                alert('Fullscreen mode is not supported on your device.');
            }
        };

        const handleFullscreenChange = () => {
            const isFullscreenMode = document.fullscreenElement !== null;
            setIsFullscreen(isFullscreenMode);
            setIsPromptVisible(!isFullscreenMode);
            setIsQuizVisible(!isPromptVisible)
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            exitFullscreen();
        };
    }, []);

    useEffect(() => {
        if (isFullscreen) {
            setIsPromptVisible(false);
            setIsQuizVisible(true)
        }
    }, [isFullscreen]);

    useEffect(() => {
        if (isAnswersVisible && !isFullscreen) {
            setIsFullscreen(false);
            setIsPromptVisible(false);
        } else if (isFullscreen) {
            setIsPromptVisible(false);
            setIsQuizVisible(true);
        }
    }, [isFullscreen, isAnswersVisible, isPromptVisible])

    return (
        <main className="flex justify-center items-center h-screen bg-slate-300">
            {isPromptVisible === true && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Enter Fullscreen</h2>
                        <p className="mb-6">Please enter fullscreen mode to continue.</p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                                setIsPromptVisible(false);
                                const element: any = document.documentElement;
                                if (element.requestFullscreen) {
                                    element.requestFullscreen();
                                } else if (element.mozRequestFullScreen) {
                                    /* Firefox */
                                    element.mozRequestFullScreen();
                                } else if (element.webkitRequestFullscreen) {
                                    /* Chrome, Safari & Opera */
                                    element.webkitRequestFullscreen();
                                } else if (element.msRequestFullscreen) {
                                    /* IE/Edge */
                                    element.msRequestFullscreen();
                                }
                            }}
                        >
                            Enter Fullscreen
                        </button>
                    </div>
                </div>
            )}
            {isPromptVisible === false && questions && isQuizVisible === true && (
                <div className="flex items-center gap-y-8 flex-col bg-white px-28 py-16 rounded-md shadow-md min-h-[50vh] min-w-[70vw]">
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md">
                        Tab Switch Violations: {tabSwitchCount}/5
                    </div>
                    <h1 className="text-4xl font-bold top-0">Questions</h1>
                    <div className="flex flex-col w-full">
                        {<QuestionItem index={questionNumber - 1} options={questions.questions[questionNumber - 1].options} question={questions.questions[questionNumber - 1].question} key={questionNumber - 1} onAnswerSelect={handleAnswerSelect} selectedAnswers={selectedAnswers} />}
                    </div>
                    <div className="flex gap-x-2">
                        {questionNumber > 0 ? (
                            <Button onClick={handlePreviousClick}>Previous</Button>
                        ) : null}
                        {questionNumber < 10 ? (
                            <Button onClick={handleNextClick}>Next</Button>
                        ) : null}
                        {questionNumber === 10 ? (
                            <Button onClick={handleSubmitClick}>Submit</Button>
                        ) : null}
                    </div>
                </div>
            )}
            {
                isAnswersVisible && (
                    <div className="min-h-[50vh] min-w-[50vw] bg-white rounded-md shadow-md flex p-16 items-center flex-col">
                        <h1 className="text-3xl font-bold">Result</h1>
                        <p className="text-xl font-semibold mt-16">Correct Answers are {correctAnswersCount} out of 10.</p>
                        <Link href={'/'} onClick={() => {
                            if (typeof window !== 'undefined') {
                                localStorage.clear()
                            }
                        }} className="px-4 py-2 mt-4 rounded-md bg-blue-500 text-xl text-white">Take another quiz.</Link>
                    </div>
                )
            }
        </main>
    );
};

export default Page;