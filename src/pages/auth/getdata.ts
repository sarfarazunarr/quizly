import axios from "axios";
let origin = import.meta.env.VITE_API_ORIGIN;    

const userData = async (param:React.Dispatch<React.SetStateAction<{id:number, username: string, email: string, profileImage: string,}>>) => {
    let userdata;
    try {
        const response = await axios.get(`${origin}auth/data.php`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        if (response.status === 200) {
            userdata = response.data;
            param(userdata)
            return userdata;
        }
    } catch (error: any) {
        return error;
    }
};

export default userData;