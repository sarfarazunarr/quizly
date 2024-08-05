import axios from "axios";
import { useEffect } from "react"
import { useNavigate } from "react-router";

const Logout = () => {
  const nav = useNavigate();

  const logout = async () => {
    try {
        const response = await axios.get('http://localhost/quizline/auth/logout.php', {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        console.log(response)
        if (response.status === 200) {
            nav('/login');
        }
    } catch (error: any) {
        return error;
    }
};
  useEffect(() => {
    logout();
  }, [])
  return (
    <div>
      Logging out...
    </div>
  )
}

export default Logout
