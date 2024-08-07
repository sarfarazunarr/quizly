import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const ViewScore = () => {
  interface Submission {
    id?: number //This is id
    quiz_id?: string | number | undefined
    submission_data?: string
    user_name?: string
    Email?: string
    score?: string
    submitted_at?: string
  }

  const [score, setScore] = useState<Submission>();
  const [submission_id, setSubmission_id] = useState('');
  const [intro, setIntro] = useState(true);
  const [result, setResult] = useState(false);
  let origin = import.meta.env.VITE_API_ORIGIN;    
  
  const scoredata = async () => {
    let notify = toast.loading("Getting Data....");
    try {
      const response = await axios.get(`${origin}quiz/get-score.php?id=${submission_id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      if (response.status === 200) {
        setScore(response.data);
        toast.update(notify, {render: "Data Recieved", type: "success", autoClose: 500, isLoading: false});
        setIntro(false);
        setResult(true);
      }
    } catch (error: any) {
      toast.update(notify, {render: "Error occured", type: "error", autoClose: 500, isLoading: false});
      console.log(error);
      
      return error;
    }
  };
  const share = () => {
    navigator.share({title: `My Score on Quiz`, text: `I have got ${score?.score} score in quiz test. Follow link to attempt quiz!`, url: `${location.origin}/quiz/${score?.quiz_id}`})
  }
  const revert = () => {
    setResult(false);
    setIntro(true);
  }
  return (
    <div className="flex h-[90vh] justify-center items-center flex-col">
      {intro && (
        <>
          <h3 className='text-3xl text-blue-950 font-semibold text-center pb-2'>View Your Score!</h3>
          <p className='w-1/4 mx-auto pb-2 text-justify text-sm text-gray-600'>If your attempted quiz has descriptive answers then your score could be updated else it will be same score as you seen on result page after attempting quiz.</p>

          <input type="text" id='submission_id' name='submission_id' className='px-3 py-2 outline-none border border-gray-500 text-gray-900 font-semibold my-2 rounded-sm focus:border-blue-600 transition-colors duration-150' onChange={(e) => setSubmission_id(e.target.value)} placeholder='Enter Submission ID...' />
          <button className='bg-blue-800 px-3 py-2 rounded-md text-white font-semibold hover:bg-black' onClick={scoredata}>View Score</button>
        </>
      )}
      {result && (
        <>
          <h3 className='text-3xl text-blue-950 font-semibold text-center pb-2'>Your Score: {score?.score}</h3>
          <p className='w-1/4 mx-auto pb-2 text-justify text-sm text-gray-600'>Test attempted by {score?.user_name} on {score?.submitted_at}.</p>
          <button className='bg-blue-800 px-3 py-2 rounded-md text-white font-semibold hover:bg-black' onClick={share}>Share with Friends</button>
          <p className='text-red-500 text-center py-2 cursor-pointer' onClick={revert}>Check Again</p>
        </>
      )}
    </div>
  )
}

export default ViewScore
