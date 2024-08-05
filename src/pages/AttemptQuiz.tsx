import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AttemptQuiz = () => {
    interface Quiz {
        cover_image: string
        created_at: string
        created_by: number
        description: string
        category: string
        id: number
        title: string
    }
    interface Question {
        id?: number,
        quiz_id?: string | undefined,
        question_text?: string,
        question_type?: string,
        answers?: string,
        possible_answers?: string[],
        correct_answer?: string
    }
    interface Submission {
        Email: string
        user_name: string
        quiz_id: string | number | undefined
        submission_data: string
        score: number
        submitted_at: Date
    }
    interface Submissiondata {
        question_Text: string,
        submitted_answer: string,
        correct_answer: string
    }
    const { id } = useParams();
    const [quiz, setQuiz] = useState<Quiz>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [intro, setIntro] = useState(true);
    const [submission, setSubmission] = useState<Submission>({
        Email: "",
        user_name: "",
        quiz_id: id,
        submission_data: "",
        score: 1,
        submitted_at: new Date()
    });
    const [submissiondata, setSubmissiondata] = useState<Submissiondata[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questionBoard, setQuestionBoard] = useState(false);
    const [possible_answers, setPossible_answers] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [descriptiveAnswer, setDescriptiveAnswer] = useState("");
    const [result, setResult] = useState(false);


    useEffect(() => {
        const quizdata = async () => {
            try {
                const response = await axios.get(`http://localhost/quizline/quiz/get-quiz.php?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
                if (response.status === 200) {
                    setQuiz(response.data);
                }
            } catch (error: any) {
                return error;
            }
        };
        const questionsdata = async () => {
            try {
                const response = await axios.get(`http://localhost/quizline/question/questions.php?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
                console.log(response)
                if (response.status === 200) {
                    setQuestions(response.data);
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
                return error;
            }
        };
        questionsdata();
        quizdata();
    }, [id])


    const start = () => {
        if (submission?.Email && submission?.user_name) {
            setIntro(false);
            setQuestionBoard(true);
            setPossible_answers(JSON.parse(questions[currentQuestion]?.possible_answers));
            console.log(possible_answers)
        } else {
            toast.error('Please enter your details', { autoClose: 1000 });
        }
    }


    const next =  (title: string | undefined, type: string, correct_answer: string) => {
        if (type === 'MCQs' && title !== undefined) {
            const data = { question_Text: title, submitted_answer: selectedAnswer, correct_answer };
            setSubmissiondata((prev) => [...prev, data]);
            if (selectedAnswer === correct_answer) {
                setSubmission({...submission, score: submission.score + 1});
            }
            setSelectedAnswer('');
        } else if (type === 'Descriptive' && title !== undefined) {
            const data = { question_Text: title, submitted_answer: descriptiveAnswer, correct_answer };
            setSubmissiondata((prev) => [...prev, data]);
            setDescriptiveAnswer('');
        }
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setPossible_answers(JSON.parse(questions[currentQuestion + 1]?.possible_answers));
        } else {
            setSubmission({
                ...submission,
                submission_data: JSON.stringify(submissiondata),
            })
            
            setQuestionBoard(false)
            setResult(true)
        }
    };

    useEffect(() => {
        if (submission.submission_data !== "") {
          submitdata();
        }
      }, [submission.submission_data]);

    const submitdata = async () => {
        
        let notify = toast.loading("Submitting Data...")
        try {
           const response = await axios.post('http://localhost/quizline/quiz/submit.php', submission, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response)
            if (response.status === 201) {
                toast.update(notify, { render: "Quiz Submitted!", type: "success", autoClose: 1000, isLoading: false });
                resetForm();
            }
        } catch (error: any) {
            toast.update(notify, { render: "Error Occured", type: "error", autoClose: 1000, isLoading: false });
            console.error('Error:', error);
        }
    };

    const resetForm = () => {
        submission.Email = "",
        submission.score = 1,
        submission.user_name = "",
        submission.submission_data = "",
        submission.quiz_id = id

    }

    return (
        <div>
            <h3 className='text-3xl text-gray-800 font-bold text-center py-10'>Attempt {quiz?.title}</h3>
            {intro && (
                <div className='w-2/5 mx-auto h-full flex flex-col justify-center items-center'>
                    <h3 className='font-semibold text-2xl text-gray-800 py-5'>Instructions</h3>
                    <p className='text-gray-700 pb-2'>
                        <ol className='list-decimal text-sm text-gray-800'>
                            <li>Don't Move to other tabs! After 3 warnings you will be blocked for 3 hours.</li>
                            <li>You can not go to previous question after clicking on next.</li>
                            <li>Email is required if your questions are descriptive.</li>
                        </ol>
                        <div className='w-full flex items-center justify-center gap-1 my-5 flex-col'>
                            <input type='text' id='name' className='px-3 py-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-800 transition-colors duration-150 text-gray-800' onChange={(e) => setSubmission({ ...submission, user_name: e.target.value })} value={submission?.user_name} placeholder='Enter Name...'></input>
                            <input type='email' id='email' className='px-3 py-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-800 transition-colors duration-150 text-gray-800' placeholder='Enter Email...' value={submission?.Email} onChange={(e) => setSubmission({ ...submission, Email: e.target.value })}></input>
                            <button className='px-3 py-2 rounded-md border-2 border-blue-800 bg-blue-800 transition-colors duration-150 text-white font-semibold hover:bg-blue-950' onClick={start}>Start Quiz</button>
                        </div>
                    </p>
                </div>
            )}

            {questionBoard && questions.length > 0 && (
                <div className='w-2/3 flex mx-auto p-5 border-2 border-blue-500 rounded-md gap-1 my-5 flex-col'>
                    <h3 id='question' className='text-2xl text-left text-gray-800 font-bold'>{questions[currentQuestion].question_text}</h3>
                    {questions[currentQuestion].question_type === 'MCQs' && (
                        <div className='flex flex-col gap-1'>
                            {possible_answers.map((answer, index) => (
                                <div key={index} className={`${answer == selectedAnswer ? 'bg-blue-600 w-full text-white font-semibold rounded-md' : ''} text-gray-700 p-2 bg-slate-200 my-1`} onClick={() => setSelectedAnswer(answer)}>{answer}</div>
                            ))}
                        </div>
                    )}
                    {questions[currentQuestion].question_type === 'Descriptive' && (
                        <div className='flex flex-col gap-2'>
                            <textarea id='answer' className='px-3 py-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-800 transition-colors duration-150 text-gray-800' placeholder='Enter Answer...' value={descriptiveAnswer} onChange={(e) => setDescriptiveAnswer(e.target.value)}></textarea>
                        </div>
                    )}
                    <div className='flex justify-end'>
                        <button className='bg-blue-900 text-white px-3 py-2 rounded-md hover:bg-black transition-colors duration-200' onClick={() => next(questions[currentQuestion].question_text, questions[currentQuestion].question_type, questions[currentQuestion].correct_answer)}>Next</button>
                    </div>
                </div>
            )}


            {result && (
                <div className="result-container flex justify-center items-center flex-col bg-gray-200 p-5 rounded-md my-5">
                    <h3 className='text-center text-3xl font-bold text-gray-800 py-5'>Your Score: {submission.score}</h3>
                    <div className="text-lg font-semibold">Name: {submission.user_name}</div>
                    <div className="text-lg font-semibold">Email: {submission.Email}</div>
                    <Link className="bg-blue-500 text-white px-3 py-2 rounded-md mt-5 hover:bg-blue-700" to={'/'}>Go to Homepage</Link>
                </div>
            )}
        </div>
    )
}

export default AttemptQuiz

