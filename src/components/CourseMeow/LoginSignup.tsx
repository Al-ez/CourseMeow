import './LoginSignup.css';
import email_icon from '../assets/email.png';
import name_icon from '../assets/name.png';
import password_icon from '../assets/password.png';
import cat_icon from '../assets/CourseMeow.png'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function LoginSignup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleEmailChange = (e: any) => {
      setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e: any) => {
      setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: any) => {
        setConfirmPassword(e.target.value);
    }

    function handleLogin(e: any) {
        e.preventDefault();
        return action==="Login" ? null : setAction("Login");
    }

    function handleSignup(e: any) {
        e.preventDefault();
        return action==="Sign up" ? null: setAction("Sign up");
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        if (action === "Sign up") { // sign up
            if (password === confirmPassword) {
                const response = await fetch('http://localhost:8080/create', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', },
                    body: JSON.stringify(userData),
                });

                if (response.status === 200) {
                    const token = await response.text(); // pass it to timetable page
                    navigate("/timetable", { state: { authToken: token, email: email  } });
                } else {
                    console.log("Email already taken");
                }

            } else { // passwords mismatch blocks login done
                console.log("Passwords don't match")
            }
        } else { // if its login
            const response = await fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', },
                    body: JSON.stringify(userData),
            });

            if (response.status === 200 ) {
                const token = await response.text(); // pass it to timetable page
                navigate("/timetable", { state: { authToken: token, email: email } });
            } else {
               console.log("Login failed");
            }
        }
    }

    const navigate = useNavigate();
    const [action, setAction] = useState("Login");
    return (
        <form className='page' onSubmit={handleSubmit}>
            <div className='top'>
                <img src={cat_icon} alt="" className='cat-icon'/>
                <h1>CourseMeow</h1>
            </div>    
            <div className='container'>
                <div className='header'>
                    <div className='text'>{action}</div>
                    <div className='underline'></div>
                </div>
                <div className='inputs'>
                    <div className='input'>
                        <img src={email_icon} alt="" className='email-icon'/>
                        <input 
                        type="email" 
                        placeholder='Email'
                        value={email}
                        onChange={handleEmailChange}
                        />
                    </div>
                    <div className='input'>
                        <img src={password_icon} alt="" className='password-icon'/>
                        <input 
                        type="password" 
                        placeholder='Password'
                        value={password}
                        onChange={handlePasswordChange}
                        />
                    </div>
                    {action==="Login"? <div></div>:<div className='input'>                
                        <img src={password_icon} alt="" className='name-icon'/>
                        <input 
                        type="password" 
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        />
                    </div>}
                </div>
                {action==="Sign up"?<div></div>: <div className="forgot-password">
                Forgot Password? <span>Click Here!</span></div>}
                <div className='submit-container'>
                    <button className={action==="Login" ? "submit gray": "submit"} onClick={handleSignup}>Sign Up</button>
                    <button className={action==="Sign up"? "submit gray": "submit"} onClick={handleLogin}>Login</button>
                    <button type='submit' className='enter'>Submit</button>
                </div>
            </div>
        </form>
    );
}

export default LoginSignup;