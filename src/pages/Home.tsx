import React from 'react'
import Header from './components/Header'

const Home = () => {
    return (
        <div>
            <section className="relatve">
                <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">

                    <div className="mx-auto mb-12 w-full max-w-3xl text-center md:mb-16 lg:mb-20">
                        <h1 className="mb-4 text-4xl font-bold md:text-6xl">Make your knowledge <span className=" px-4 text-blue-900">Sharp,</span>By Quizzes!</h1>
                        <p className="mx-auto mb-5 max-w-[528px] text-xl text-[#636262] lg:mb-8">Test yourself with best quizzes that helps you to make your knowledge sharp and give you a next level of command some other topics!</p>
                        <div className="flex justify-center">
                            <a href="/quizzes" className="mr-5 inline-block rounded-xl bg-black px-8 py-4 text-center font-semibold text-white [box-shadow:rgb(19,_83,_254)_6px_6px] md:mr-6">View Quizzes</a>
                            <a href="/login" className="flex max-w-full flex-row items-center justify-center rounded-xl border border-solid border-[#1353fe] px-6 py-3 font-semibold text-[#1353fe] [box-shadow:rgb(19,_83,_254)_6px_6px]">
                                <img src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905a575ec39b6784fc687c_Play.svg" alt="" className="mr-2 inline-block w-6" />
                                <p className="text-black">Create Your Own Quiz</p>
                            </a>
                        </div>
                    </div>
                </div>
                <img src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905b9f809b5c8180ce30c5_pattern-1.svg" alt="" className="absolute bottom-0 left-0 right-auto top-auto -z-10 inline-block md:bottom-1/2 md:left-0 md:right-auto md:top-auto" />
                <img src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905ba1538296b3f50a905e_pattern-2.svg" alt="" className="absolute bottom-auto left-auto right-0 top-0 -z-10 hidden sm:inline-block" />
            </section>
        </div>
    )
}

export default Home
