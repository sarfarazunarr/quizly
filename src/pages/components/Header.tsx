import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userData from '../auth/getdata';

function Header() {
    const [user, setUser] = useState({
        id: 0, username: '', email: '', profileImage: '',
    });
    useEffect(() => {
        userData(setUser);
    }, []);
    return (
        <header>
            <nav className="bg-white border-gray-200 border-b px-4 lg:px-6 py-2.5 ">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" className="flex items-center">
                        <img src="https://www.svgrepo.com/show/225210/earth-globe-earth.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap ">Quizly</span>
                    </ Link>
                    <div className="flex items-center lg:order-2">
                        {!user && (
                            <>
                                <Link to="/login" className="text-gray-800  hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2  focus:outline-none ">Log in</ Link>
                                <Link to="/register" className="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2  focus:outline-none ">Get started</ Link>
                            </>
                        )}
                        {user && (
                            <>
                                <h3 className='text-xl text-gray-800 pr-5 font-semibold'>Hi {user.username}</h3>
                                <Link to="/profile" className="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2  focus:outline-none ">View Profile</ Link>
                            </>
                        )}

                    </div>

                </div>
            </nav>
        </header>
    )
}

export default Header
