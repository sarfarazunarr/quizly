import axios from "axios";
import React, { useState } from "react"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const Register = () => {
    const [image, setImage] = useState<File | null>(null);
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        profileImage: ""
    });
    const [message, setMessage] = useState('');
    const [pending, setPending] = useState(false);

    const checkpass = () => {
        const password = document.getElementById('password') as HTMLInputElement;
        const confirmPassword = document.getElementById('confirm-password') as HTMLInputElement;

        if (password.value !== confirmPassword.value) {
            setMessage("Password does not match!");
        } else {
            setMessage('');
        }
    };

    const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(prevData => ({
            ...prevData,
            [e.target.id]: e.target.value
        }));
    };

    const register = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
    
        try {
            if (image) {
                await uploadImage();
            }
    
            const response = await axios.post('http://localhost/quizline/auth/register.php', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            console.log(response)
            if (response.status === 201) {
                setMessage(response.data.message);
                setPending(false);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            console.error('Error:', error);
            setPending(false);
        }
    };
    const uploadImage = async () => {
        let notify = toast.loading('Uploading Image...');
        try {
            const formData = new FormData();
            if (image) {
                formData.append('image', image);
            }
            const response = await axios.post(`${origin}uploadImage.php`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });
            if (response.status === 200) {
                toast.update(notify, {
                    render: 'Image uploaded!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
                setData({...data, profileImage: `${origin + response.data.imageUrl}`})
            }
        } catch (error) {
            toast.update(notify, {
                render: 'Something went wrong!',
                type: 'error',
                isLoading: false,
                autoClose: 2000,
            });
            console.error('Error:', error);
            setPending(false);
        }
    };
    return (
        <div className="bg-blue-200 min-h-screen flex flex-col">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                    <form onSubmit={register}>
                        <input
                            type="text"
                            className="block border-2 border-grey-light focus:border-blue-500 outline-none  w-full p-3 rounded mb-4"
                            name="fullname" id="username" onChange={onchange} value={data.username}
                            placeholder="Full Name" />

                        <input
                            type="text"
                            className="block border-2 border-grey-light focus:border-blue-500 outline-none  w-full p-3 rounded mb-4"
                            name="email" id="email" onChange={onchange} value={data.email}
                            placeholder="Email" />

                        <input
                            type="password"
                            className="block border-2 border-grey-light focus:border-blue-500 outline-none  w-full p-3 rounded mb-4"
                            name="password" id="password" onChange={onchange} value={data.password}
                            placeholder="Password" />
                        <input
                            type="password"
                            className="block border-2 border-grey-light focus:border-blue-500 outline-none  w-full p-3 rounded mb-4"
                            name="confirm_password"
                            placeholder="Confirm Password" id="confirm-password" onChange={checkpass} />
                        <div>
                            <input type="file" name="profileImage" id="profileImage" onChange={(e) => setImage(e.target.files![0])} />
                        </div>
                        <p className="text-gray-600 text-center py-3">{message && message}</p>
                        <button
                            type="submit"
                            className="w-full text-center py-3 rounded bg-blue-600 text-white hover:bg-secondary-600 focus:outline-none my-1"
                        >{pending ? "Creating..." : "Create Account"}</button>
                    </form>
                    <div className="text-center text-sm text-grey-dark mt-4">
                        By signing up, you agree to the
                        <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Terms of Service
                        </a> and
                        <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Privacy Policy
                        </a>
                    </div>
                </div>

                <div className="text-grey-dark mt-6">
                    Already have an account?
                    <a className="no-underline border-b border-blue text-blue" href="/login">
                        Log in
                    </a>.
                </div>
            </div>
        </div>
    )
}

export default Register
