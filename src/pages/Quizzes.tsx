import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import NotFound from './components/NotFound';
import Loading from './components/Loading';

const Quizzes = () => {
  const { id } = useParams();
  interface Quiz {
    cover_image: string
    created_at: string
    created_by: number
    description: string,
    category: string,
    id: number
    title: string
  }
  const [quiz, setQuiz] = useState<Quiz>();
  const [notfound, setNotfound] = useState(false);
  let origin = import.meta.env.VITE_API_ORIGIN;    

  useEffect(() => {
    const quizdata = async () => {
      try {
        const response = await axios.get(`${origin}quiz/get-quiz.php?id=${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });
        if (response.status === 200) {
          setQuiz(response.data);
        }
      } catch (error: any) {
        if(error.response.status == 404){
            setNotfound(true);
        }
        return error;
      }
    };

    quizdata();
  }, [id])


  const copy = () => {
    const copytext = location.href;
    navigator.clipboard.writeText(copytext).then(() => {
      toast.success("Link Copied", { autoClose: 500 });
    }).catch((e) => {
      toast.error("Unable to copy link", { autoClose: 500 });
      console.log(e);
    })
  }

  const share = (title:string, description:string) => {
    try {
      navigator.share({title: `Attempt ${title} Quiz`, text: `${description.slice(0, 10)}...`, url: location.href});
      
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div>
      {notfound && (
        <NotFound />
      )}
      {quiz && (
        <>
          <div id='quizdata' className={`w-full h-[300px] px-10 bg-gray-50 flex justify-center items-center flex-col`}>
            <h3 className='text-5xl text-blue-900 font-bold pt-10 pb-3 text-center capitalize'>{quiz.title}</h3>
            <p className='text-center text-xs text-gray-800'>Created At <span className='text-blue-800 font-semibold px-3'>{quiz.created_at}</span></p>
          </div>
          <div className='flex flex-row gap-3'>
            <div id='quizinfo' className='w-3/5 ml-20 bg-slate-300 p-5 -mr-20 rounded-md m-10'>
              <h3 className='text-black text-3xl py-3 font-semibold'>Description</h3>
              <p className='text-gray-700 text-[15px]'>{quiz.description}</p>
              <hr className='border-gray-400 my-2' />
              <div className='flex justify-start items-center gap-3'>
                <h3 className='text-xl font-semibold text-gray-700'>Share with friends</h3>
                <input className='bg-white border border-slate-400 outline-none p-2 rounded-md text-gray-900' value={location.href} readOnly onClick={copy}></input>
              </div>
            </div>
            <div id='quizcard' className='w-2/5 mr-20 ml-20 h-fit  m-10 bg-blue-900 p-5 rounded-md'>
              <h6 className="font-semibold text-2xl py-2 text-white">Quiz Info</h6>
              <ul className="list-none text-white font-normal ml-3">
                <li>Title: {quiz.title}</li>
                <li>Quiz ID: {quiz.id}</li>
                <li>Attempts: {quiz.created_by}</li>
                <li>Date: {quiz.created_at}</li>
              </ul>
              <div className='flex justify-center items-center my-5 gap-2'>
                <Link to={`/attempt/${quiz.id}`} className='bg-white px-3 py-1 rounded-md text-blue-950 font-semibold hover:bg-transparent hover:text-white hover:border-white border border-transparent'>Attempt Now</Link>
                <button className='bg-blue-950 px-3 py-1 rounded-md text-white font-semibold hover:bg-white hover:text-blue-950 hover:border-white border border-transparent' onClick={() => share(quiz.title, quiz.description)}>Share Now</button>
                <Link to={'/view-score'} className='bg-white px-3 py-1 rounded-md text-blue-800 font-semibold hover:bg-blue-950 hover:text-white hover:border-white border border-transparent'>View Score</Link>
              </div>
            </div>
          </div>
        </>

      )}
      {!quiz && (
        <Loading />
      )}
    </div>
  )
}

export default Quizzes
