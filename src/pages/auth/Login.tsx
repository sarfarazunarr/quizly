import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const nav = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [message, setMessage] = useState('');
    const [pending, setPending] = useState(false)

    const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(prevData => ({
            ...prevData,
            [e.target.id]: e.target.value
        }));
    }

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true)
        try {
            const response = await axios.post('http://localhost/quizline/auth/login.php', data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setMessage(response.data.message);
                setPending(false)
                nav('/profile')
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage("Something Went Wrong!")
            setPending(false)
        }
    };
    return (
        <div className="bg-blue-200 min-h-screen flex flex-col">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 className="mb-8 text-3xl text-center">Log In</h1>
                    <form onSubmit={login}>
                        <input
                            type="text"
                            className="block border-2 border-gray-300 outline-none focus:border-blue-500 w-full p-3 rounded mb-4"
                            name="email"
                            placeholder="Email" id="email" value={data.email} onChange={onchange} />

                        <input
                            type="password"
                            className="block border-2 border-gray-300 outline-none focus:border-blue-500 w-full p-3 rounded mb-4"
                            name="password"
                            placeholder="Password" id="password" value={data.password} onChange={onchange} />
                        <p className="text-gray-600 text-center py-3">{message && message}</p>

                        <button
                            type="submit"
                            className="w-full text-center py-3 rounded bg-blue-500 text-white hover:bg-secondary-500 focus:outline-none my-1"
                        >{pending ? "Logging in..." : "Login"}</button>
                    </form>
                </div>

                <div className="text-grey-dark mt-6">
                    New Here?
                    <a className="no-underline border-b border-blue text-blue" href="/register">
                        Signup Now
                    </a>.
                </div>
            </div>
        </div>

    )
}

export default Login
