import axios from 'axios';
import React, { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import userData from './auth/getdata';
import NotFound from './components/NotFound';

const Profile = () => {
    type QuizData = {
        id: string,
        title: string,
        category: string,
        description: string,
    }
    const [quiz, setQuiz] = useState<QuizData[]>([]);
    const [userdata, setUserdata] = useState({
        id: 0, username: '', email: '', profileImage: '',
    });
    const [create, setCreate] = useState(false);
    const [update, setUpdate] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [pending, setPending] = useState(false);
    const [data, setData] = useState<QuizData>({
        id: "",
        title: '',
        category: '',
        description: ''
    });

    useEffect(() => {
        userData(setUserdata);
        const getData = async () => {
            try {
                const response = await axios.get('http://localhost/quizline/quiz/quizzes.php', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
                if (response.status === 200) {
                    setQuiz(response.data);
                    console.log(response.data)
                    setPending(false);
                }
            } catch (error: any) {
                console.log(error)
                if (error.response.status == 404 || error.response.status == 400) {
                    console.log('Do nothing')
                }
                toast.error(error.response.data.message)
            }
        };
        getData();
    }, [refresh]);

    const createQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        try {

            const response = await axios.post('http://localhost/quizline/quiz/create.php', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if (response.status === 200) {
                toast.success(response.data.message, { autoClose: 1000 });
                setPending(false);
                setRefresh(refresh + 1);
                setCreate(false);

            }
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.response.data.message);
            setPending(false);
        }
    };

    const setupdate = (e: any, info: QuizData) => {
        setUpdate(true);
        setData(info)
    }

    const updateQuiz = async (e: FormEvent) => {
        setPending(true);
        e.preventDefault();

        let notify = toast.loading('Updating course...');
        try {
            const response = await axios.put('http://localhost/quizline/quiz/update.php', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if (response.status === 200) {
                toast.update(notify, { render: "Quiz Updated", autoClose: 1000, isLoading: false, type: "success" })
                setPending(false);
                setRefresh(refresh + 1);
                setUpdate(false)
            }
        } catch (error: any) {
            toast.update(notify, {
                render: 'Error updating course',
                type: 'error',
                isLoading: false,
                autoClose: 1000
            });
            console.log(error);
        }
        setData({
            id: "",
            title: '',
            description: '',
            category: '',
        })

        setUpdate(false);
    }

    const deleteQuiz = async (id: string) => {
        const finalid = id.toString();
        setPending(true);

        let notify = toast.loading('Deleting course...');
        try {
            const response = await axios.delete('http://localhost/quizline/quiz/delete.php', {
                data: { id: finalid },
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            console.log(response)
            if (response.status === 200) {
                toast.update(notify, { render: "Quiz Deleted", autoClose: 1000, isLoading: false, type: "success" })
                setPending(false);
                setRefresh(refresh + 1);
            }
        } catch (error: any) {
            toast.update(notify, {
                render: 'Error Deleting course',
                type: 'error',
                isLoading: false,
                autoClose: 1000
            });
            console.log(error);
        }
        setData({
            id: "",
            title: '',
            description: '',
            category: '',
        })

        setUpdate(false);
    }


    return (
        <>        
        {userdata.id && (
            <>
                <div className='p-5 border-b-2 border-gray-200'>
                    <div>
                        <img></img>
                    </div>
                    <h3 className='text-4xl font-bold'>Hi, {userdata.username}</h3>
                    <p className='text-gray-500 pb-3'>Welcome to Quizly! Create Your Own Quiz and share it with anyone you want!</p>
                </div>
                <h1 className='text-left text-blue-600 font-semibold text-3xl py-2 px-3'>Quizzes</h1>

                <div className='p-5 grid grid-cols-4 gap-2'>
                    {quiz && quiz.length > 0 && (
                        quiz.map((item, index) => {
                            return (
                                <div key={index} className='rounded-md bg-blue-950  w-full h-80 border-gray-400 hover:border-white border-2 hover:shadow-xl hover:shadow-blue-400 size-[25%] group transition-all duration-300'>
                                    <img src={`http://localhost/quizline/uploads/${item.category}.jpg`} className='w-full h-2/4 object-cover object-center rounded-t-md' />
                                    <div className='px-5 py-3'>
                                        <h6 title={item.title} className='text-left font-bold capitalize py-2 text-xl text-white truncate'>{item.title}</h6>
                                        <p className='text-gray-500'>{item.description.slice(0, 70)}...</p>
                                        <div className='flex justify-between'>
                                            <div className=''></div>
                                        </div>
                                        <div className='flex justify-center pt-3 opacity-20 group-hover:opacity-100 transition-all duration-300'>
                                            <Link to={"/add-questions/" + item.id} className='border-blue-500 bg-transparent border hover:bg-blue-600 rounded-md mr-2 px-2 text-white' >Questions</Link>
                                            <Link to={"/quiz/" + item.id} className='border-blue-500 bg-transparent border hover:bg-blue-600 rounded-md px-2 text-white'>View</Link>
                                            <button className='border-green-500 bg-transparent border hover:bg-green-600 rounded-md px-2 text-white mx-3' onClick={(e: any) => setupdate(e, item)}>Edit</button>
                                            <button className='border-red-500 bg-transparent border hover:bg-red-600 rounded-md px-2 text-white' onClick={() => deleteQuiz(item.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>

                            )
                        })

                    )}
                    <div className='rounded-md w-full h-64 border-gray-400 border-dashed hover:border-white border-2 hover:shadow-xl hover:shadow-blue-400 size-[25%] group transition-all duration-300 flex justify-center items-center flex-col cursor-pointer' onClick={() => setCreate(true)}>
                        <img src='https://www.svgrepo.com/show/526461/add-circle.svg' className='size-28 object-cover rounded-t-md filter invert opacity-50 group-hover:opacity-100' />
                        <h6 className='text-xl text-white font-semibold'>Create Course</h6>
                    </div>
                </div>

                {create && (
                    <div id="new-quiz" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] bg-blue-700/35 filter backdrop-blur-md max-h-full">
                        <div className="relative p-4 w-full max-w-md max-h-full bg-blue-950 rounded-md">
                            <h3 className="text-left text-3xl text-white font-bold pt-5">Create Quiz</h3>
                            <p className="text-gray-300 pb-5">Enter Basic Quiz Details</p>
                            <hr className="border border-gray-100" />

                            <form className="my-5 mx-auto" onSubmit={(e) => createQuiz(e)}>
                                <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" value={data?.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder='Enter Title'></input>
                                <textarea className="bg-transparent text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 h-40 w-full" value={data?.description || ''} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder='Enter Description' ></textarea>

                                <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" value={data?.category} onChange={(e) => setData({ ...data, category: e.target.value })} placeholder='Enter Category'></input>

                                <div className="flex justify-center items-center my-2">
                                    <button type="submit" className="bg-white px-3 py-2 rounded-md text-purple-700 font-semibold hover:bg-transparent/20 hover:text-white disabled:bg-white disabled:text-gray-600 disabled:cursor-not-allowed" disabled={pending}>Create Quiz</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {update && (
                    <div id="update-quiz" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] bg-blue-700/35 filter backdrop-blur-md max-h-full">
                        <div className="relative p-4 w-full max-w-md max-h-full bg-blue-950 rounded-md">
                            <h3 className="text-left text-3xl text-white font-bold pt-5">Update Quiz</h3>
                            <p className="text-gray-300 pb-5">Update Basic Quiz Details</p>
                            <hr className="border border-gray-100" />

                            <form className="my-5 mx-auto" onSubmit={(e) => updateQuiz(e)}>
                                <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" value={data?.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder='Enter Title'></input>
                                <textarea className="bg-transparent text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 h-40 w-full" value={data?.description || ''} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder='Enter Description' ></textarea>
                                <input type="text" className="bg-transparent w-full text-white border-2 border-white rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed my-2" value={data?.category} onChange={(e) => setData({ ...data, category: e.target.value })} placeholder='Enter Category'></input>

                                <div className="flex justify-center items-center my-2">
                                    <button type="submit" className="bg-white px-3 py-2 rounded-md text-purple-700 font-semibold hover:bg-transparent/20 hover:text-white disabled:bg-white disabled:text-gray-600 disabled:cursor-not-allowed" disabled={pending}>Update Quiz</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </>
        )}
        {!userdata.id && (
            
            <NotFound />
        )}
        </>


    )
}

export default Profile
