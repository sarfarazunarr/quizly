import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify';

const Submission = () => {
    
    interface Submission {
        id?: number //This is id
        quiz_id?: string | number | undefined
        submission_data?: string
        user_name?: string
        Email?: string
        score?: string
        submitted_at?: string
    }

    const { id } = useParams();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [update, setUpdate] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [data, setData] = useState<Submission>();
    let origin = import.meta.env.VITE_API_ORIGIN;    

    useEffect(() => {
        const submissiondata = async () => {
            try {
                const response = await axios.get(`${origin}quiz/submissions.php?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
                if (response.status === 200) {
                    setSubmissions(response.data);
                }
            } catch (error: any) {
                return error;
            }
        };

        submissiondata();

    }, [refresh, id])

    const showData = (e: any, id: number) => {
        if (e.target.innerText == 'Open') e.target.innerText = "Close"
        else e.target.innerText = "Open"
        let final_id = id.toString()

        document.getElementById(final_id)?.classList.toggle('hidden')
    }


    const setupdate = (e: any, info: Submission) => {
        setUpdate(true);
        setData(info);

    }
    
    const updateScore = async (e: React.FormEvent) => {
        e.preventDefault();
       
        let notify = toast.loading('Updating Score...');
        try {
            const scoreData = {
                id: data?.id,
                quiz_id: data?.quiz_id,
                score: typeof data?.score === 'string' ? Number.parseInt(data.score, 10) : data?.score
            };
            console.log(scoreData); // Debugging log
            const response = await axios.put(`${origin}quiz/update-score.php`, scoreData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if (response.status === 200) {
                toast.update(notify, { render: "Score Updated", autoClose: 1000, isLoading: false, type: "success" });
                setRefresh(refresh + 1);
                setUpdate(false);
            } 
        } catch (error: any) {
            toast.update(notify, {
                render: 'Error updating Score',
                type: 'error',
                isLoading: false,
                autoClose: 1000
            });
            console.error(error); // Debugging log
        }
        setUpdate(false);
    }
    
    
    return (
        <section className="relatve">
            <div className="mx-auto flex justify-between w-full max-w-7xl p-5">
                <h3 className='text-3xl text-gray-800 font-semibold py-3'>View Submissions</h3>
            </div>
            <div className='mx-auto flex flex-col justify-between w-full max-w-3xl p-5'>
                {submissions?.map((data, index) => {
                    const quizdata = JSON.parse(data?.submission_data);
                    return (
                        <div key={index} className='question w-full p-3 group'>
                            <div className='flex bg-slate-300 rounded-md  p-3 justify-between'>
                                <h3 className='text-xl text-gray-800 font-normal'>{data?.user_name}</h3>
                                <div className='flex justify-end items-center gap-2'>
                                    <span className='px-2 py-1 bg-green-600 text-white font-semibold rounded-md'>Score: {data?.score}</span>
                                    <span className={`text-gray-600 cursor-pointer`} onClick={(e) => showData(e, index)}>View</span>
                                </div>
                            </div>
                            <div id={`${index}`} className='my-2 hidden w-full rounded-md bg-slate-200 p-5'>
                                <ul className='list-none'>
                                {quizdata.map((ans:{question_Text:string, submitted_answer:string, correct_answer: string}, key:number) => {
                                    return (
                                        <li key={key} className='text-black my-1 bg-gray-300 px-3 py-2 rounded-md'>{ans.question_Text} <br /> <span className='font-semibold pr-3'> User Answer:</span> {ans.submitted_answer} {ans.correct_answer ? <span className='font-semibold pl-3'>Correct Answer: {ans.correct_answer}</span> : ''}</li>
                                    )
                                })}
                                </ul>
                                <button className='border-blue-500 bg-blue-950 border hover:bg-black rounded-md px-2 text-white mx-3' onClick={(e: any) => setupdate(e, data)}>Update Score</button>
                            </div>
                        </div>
                    )
                })}
            </div>


            {update && (
                <div id="update-score" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] bg-blue-700/35 filter backdrop-blur-md max-h-full">
                    <div className="relative p-4 w-full max-w-md max-h-full bg-blue-950 rounded-md">
                        <h3 className="text-left text-3xl text-white font-bold pt-5">Update Score</h3>
                        <hr className="border border-gray-100" />

                        <form className="my-5 mx-auto" onSubmit={(e) => updateScore(e)}>
                            <input type="number" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" value={data?.score} onChange={(e) => setData({ ...data, score: e.target.value })} placeholder='Enter Score'></input>
                            <div className="flex justify-center items-center my-2">
                                <button type="submit" className="bg-white px-3 py-2 rounded-md text-purple-700 font-semibold hover:bg-transparent/20 hover:text-white disabled:bg-white disabled:text-gray-600 disabled:cursor-not-allowed" >Update Score</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Submission
