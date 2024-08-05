import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const AllQuizzes = () => {
    interface Quiz {
        created_at: string
        created_by: number
        description: string
        category: string
        id: number
        title: string
    }
    const [quiz, setQuiz] = useState<Quiz[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const quizdata = async () => {
            try {
                const response = await axios.get(`http://localhost/quizline/quiz/public_quizzes.php`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
                console.log(response)
                if (response.status === 200) {
                    setQuiz(response.data);
                    console.log(response.data)
                }
            } catch (error: any) {
                return error;
            }
        };

        quizdata();
    }, [])

    const searchQuiz = () => {
        setQuiz(quiz.filter((q) => q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.description.toLowerCase().includes(searchQuery.toLowerCase())))
    }
    return (
        <div>
            <section className="relatve">
                <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">

                    <div className="mx-auto mb-12 w-full max-w-3xl text-center md:mb-16 lg:mb-20">
                        <h1 className="mb-4 text-4xl font-bold md:text-6xl">Find the Best Quizzes!</h1>
                        <p className="mx-auto mb-5 max-w-[528px] text-xl text-[#636262] lg:mb-8">Test yourself with best quizzes that helps you to make your knowledge sharp and give you a next level of command some other topics!</p>
                        <div className="flex justify-center">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Enter quiz title"
                                    className="rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:border-blue-500"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="bg-blue-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded-r-md" onClick={searchQuiz}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <img src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905b9f809b5c8180ce30c5_pattern-1.svg" alt="" className="absolute bottom-0 left-0 right-auto top-auto -z-10 inline-block md:bottom-1/2 md:left-0 md:right-auto md:top-auto" />
                <img src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905ba1538296b3f50a905e_pattern-2.svg" alt="" className="absolute bottom-auto left-auto right-0 top-0 -z-10 hidden sm:inline-block" />
            </section>
            <section className='w-4/5 mx-auto grid grid-cols-4 mb-5 gap-2'>
                {quiz && quiz.length == 0 && (
                    <p className='w-full text-center text-gray-500 py-10'>Not Found Quiz</p>
                )}
                {quiz && (
                    quiz.map((item: Quiz, index) => (
                        <div key={index} className='rounded-md bg-blue-950  w-full h-80 border-gray-400 hover:border-white border-2 hover:shadow-xl hover:shadow-blue-400 size-[25%] group transition-all duration-300'>
                                <img src={`http://localhost/quizline/uploads/${item.category}.jpg`} className='w-full h-2/4 object-cover object-center rounded-t-md' />
                                <div className='px-5 py-3'>
                                    <h6 title={item.title} className='text-left font-bold capitalize py-2 text-xl text-white truncate'>{item.title}</h6>
                                    <p className='text-gray-500 text-sm'>{item.description.slice(0, 50)}...</p>
                                    <div className='flex justify-between'>
                                        <div className=''></div>
                                    </div>
                                    <div className='flex justify-center pt-3 transition-all duration-300'>
                                        <Link to={`/attempt/` + item.id} className='border-blue-500 bg-white text-black border hover:bg-blue-600 rounded-md mr-2 px-2 py-1 hover:text-white'>Attempt Quiz</Link>
                                        <Link to={"/quiz/" + item.id} className='border-blue-500 bg-transparent border hover:bg-blue-600 rounded-md px-2 text-white py-1'>View</Link>
                                       
                                    </div>
                                </div>
                            </div>
                )))}
                
            </section>
        </div>
    )
}

export default AllQuizzes
