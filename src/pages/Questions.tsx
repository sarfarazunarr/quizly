import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Questions = () => {
    interface Quiz {
        cover_image: string
        created_at: string
        created_by: number
        description: string
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

    const { id } = useParams();
    const [quiz, setQuiz] = useState<Quiz>()
    const [question, setQuestion] = useState<Question>({ quiz_id: id });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [create, setCreate] = useState(false);
    const [update, setUpdate] = useState(false);
    const [refresh, setRefresh] = useState(0);

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
                    console.log(response.data)
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
                return error;
            }
        };
        questionsdata();
        quizdata();

    }, [refresh, id])

    const showData = (e: any, id: number) => {
        if (e.target.innerText == 'Open') e.target.innerText = "Close"
        else e.target.innerText = "Open"
        let final_id = id.toString()

        document.getElementById(final_id)?.classList.toggle('hidden')
    }

    const createQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let notify = toast.loading("Creating Question...")

        try {

            const response = await axios.post('http://localhost/quizline/question/add.php', question, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if (response.status === 201) {
                toast.update(notify, { render: "Question Created!", type: "success", autoClose: 1000, isLoading: false });
                setRefresh(refresh + 1);
                setCreate(false);
                resetForm();
            }
        } catch (error: any) {
            toast.update(notify, { render: "Error Occured", type: "error", autoClose: 1000, isLoading: false });
            console.error('Error:', error);
        }
    };

    const setupdate = (e: any, info: Question) => {
        setUpdate(true);
        setQuestion(info);

    }
    
    const updateQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
       
        let notify = toast.loading('Updating Question...');
        try {
            const response = await axios.put('http://localhost/quizline/question/update.php', question, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if (response.status === 200) {
                toast.update(notify, { render: "Question Updated", autoClose: 1000, isLoading: false, type: "success" })
                
                setRefresh(refresh + 1);
                setUpdate(false)
            }
        } catch (error: any) {
            toast.update(notify, {
                render: 'Error updating question',
                type: 'error',
                isLoading: false,
                autoClose: 1000
            });
            console.log(error);
        }
        resetForm();

        setUpdate(false);
    }
    
    const deleteQuestion = async ( id:number) => {
        const finalid = id.toString();
       
        let notify = toast.loading('Deleting Question...');
        try {
            const response = await axios.delete('http://localhost/quizline/question/delete.php', {
                data: {id: finalid},
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true,
              });

            if (response.status === 200) {
                toast.update(notify, { render: "Question Deleted", autoClose: 1000, isLoading: false, type: "success" })
                setRefresh(refresh + 1);
            }
        } catch (error: any) {
            toast.update(notify, {
                render: 'Error Deleting question',
                type: 'error',
                isLoading: false,
                autoClose: 1000
            });
            console.log(error);
        }
        resetForm();
    
        setUpdate(false);
    }

    const resetForm = () => {
        question.question_text = "",
        question.question_type = "",
        question.correct_answer = "",
        question.possible_answers = [],
        question.answers = ""
    }

    return (
        <section className="relatve">
            <div className="mx-auto w-full max-w-7xl p-5">
                <h3 className='text-3xl text-center text-gray-800 font-semibold py-3'>{quiz?.title}</h3>
                <p className='text-xs text-center text-gray-500'>Created At: {quiz?.created_at}</p>
            </div>
            <div className="mx-auto flex justify-between w-full max-w-7xl p-5">
                <h3 className='text-3xl text-gray-800 font-semibold py-3'>Manage Questions</h3>
                <button className='bg-blue-700 rounded-md h-10 px-3 hover:bg-blue-950 transition-colors duration-200 text-white font-semibold' onClick={() => setCreate(true)}>Add Question</button>
            </div>
            <div className='mx-auto flex flex-col justify-between w-full max-w-3xl p-5'>
                {questions.map((item, index) => {
                    const possibleAnswers = JSON.parse(item?.possible_answers);
                    return (
                        <div key={index} className='question w-full p-3 group'>
                            <div className='flex bg-slate-300 rounded-md  p-3 justify-between'>
                                <h3 className='text-xl text-gray-800 font-normal'>{item.question_text}</h3>
                                <div className='flex justify-end items-center gap-2'>
                                <div className='flex justify-center pt-3 opacity-20 group-hover:opacity-100 transition-all duration-300'>
                                   
                                    <button className='border-green-500 bg-transparent border hover:bg-green-600 rounded-md px-2 text-white mx-3' onClick={(e: any) => setupdate(e, item)}>Edit</button>
                                    <button className='border-red-500 bg-transparent border hover:bg-red-600 rounded-md px-2 text-white' onClick={() => deleteQuestion(item.id)}>Delete</button>
                                </div>
                                    <span className='px-2 py-1 bg-green-600 text-white font-semibold rounded-md'>{item.question_type}</span>
                                    <span className={`${item.question_type == 'MCQs' ? 'block' : "hidden"} text-gray-600 cursor-pointer`} onClick={(e) => showData(e, index)}>Open</span>
                                </div>
                            </div>
                            <div id={`${index}`} className='my-2 hidden w-full rounded-md bg-slate-200 p-5'>
                                <ul className='list-none'>
                                {possibleAnswers.map((ans:string, key:number) => {
                                    return (
                                        <li key={key} className={`${ans == item.correct_answer ? 'bg-green-600 text-white font-semibold rounded-md' : ''} text-gray-700 px-2`}>{ans}</li>
                                    )
                                })}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>



            {create && (
                <div id="new-question" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] bg-blue-700/35 filter backdrop-blur-md max-h-full">
                    <div className="relative p-4 w-full max-w-md max-h-full bg-blue-950 rounded-md">
                        <h3 className="text-left text-3xl text-white font-bold pt-5">Add Question</h3>
                        <hr className="border border-gray-100" />

                        <form className="my-5 mx-auto" onSubmit={(e) => createQuestion(e)}>
                            <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" value={question?.question_text} onChange={(e) => setQuestion({ ...question, question_text: e.target.value })} placeholder='Enter Title'></input>
                            <select className="bg-transparent text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 w-full" value={question?.question_type || ''} onChange={(e) => setQuestion({ ...question, question_type: e.target.value })} >
                                <option className='bg-blue-600 hover:bg-black transition-colors duration-200 p-3 text-white font-semibold' value={''}>Select Type</option>
                                <option className='bg-blue-600 hover:bg-black transition-colors duration-200 p-3 text-white font-semibold' value={'MCQs'}>MCQs</option>
                                <option className='bg-blue-600 hover:bg-black transition-colors duration-200 p-3 text-white font-semibold' value={'Descriptive'}>Descriptive</option>
                            </select>
                            <div id='mcqs' className={`${question?.question_type == 'MCQs' ? 'block' : 'hidden'} `}>
                                <label className='text-white pt-3'>Enter Answers</label>
                                <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" onChange={(e) => setQuestion({ ...question, answers: e.target.value })} placeholder={`e.g: Option1, Option2..`}></input>

                                <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" onChange={(e) => setQuestion({ ...question, correct_answer: e.target.value })} placeholder={`Correct Answer`}></input>
                            </div>
                            <p className={`${question?.question_type == 'Descriptive' ? 'block' : 'hidden'} text-xs text-white font-semibold text-center py-3`}>Answer will be submitted directly! You have to check it manually!</p>
                            <div className="flex justify-center items-center my-2">
                                <button type="submit" className="bg-white px-3 py-2 rounded-md text-purple-700 font-semibold hover:bg-transparent/20 hover:text-white disabled:bg-white disabled:text-gray-600 disabled:cursor-not-allowed" >Add Question</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {update && (
                <div id="update-question" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] bg-blue-700/35 filter backdrop-blur-md max-h-full">
                    <div className="relative p-4 w-full max-w-md max-h-full bg-blue-950 rounded-md">
                        <h3 className="text-left text-3xl text-white font-bold pt-5">Update Question</h3>
                        <hr className="border border-gray-100" />

                        <form className="my-5 mx-auto" onSubmit={(e) => updateQuestion(e)}>
                            <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" value={question?.question_text} onChange={(e) => setQuestion({ ...question, question_text: e.target.value })} placeholder='Enter Title'></input>
                            <select className="bg-transparent text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 w-full" value={question?.question_type || ''} onChange={(e) => setQuestion({ ...question, question_type: e.target.value })} >
                                <option className='bg-blue-600 hover:bg-black transition-colors duration-200 p-3 text-white font-semibold' value={''}>Select Type</option>
                                <option className='bg-blue-600 hover:bg-black transition-colors duration-200 p-3 text-white font-semibold' value={'MCQs'}>MCQs</option>
                                <option className='bg-blue-600 hover:bg-black transition-colors duration-200 p-3 text-white font-semibold' value={'Descriptive'}>Descriptive</option>
                            </select>
                            <div id='mcqs' className={`${question?.question_type == 'MCQs' ? 'block' : 'hidden'} `}>
                                <label className='text-white pt-3'>Enter Answers</label>
                                <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" onChange={(e) => setQuestion({ ...question, answers: e.target.value })} placeholder={"Enter All Answers..."}></input>

                                <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" onChange={(e) => setQuestion({ ...question, correct_answer: e.target.value })} placeholder={`Correct Answer`} value={question.correct_answer}></input>
                            </div>
                            <p className={`${question?.question_type == 'Descriptive' ? 'block' : 'hidden'} text-xs text-white font-semibold text-center py-3`}>Answer will be submitted directly! You have to check it manually!</p>
                            <div className="flex justify-center items-center my-2">
                                <button type="submit" className="bg-white px-3 py-2 rounded-md text-purple-700 font-semibold hover:bg-transparent/20 hover:text-white disabled:bg-white disabled:text-gray-600 disabled:cursor-not-allowed" >Update Question</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Questions
