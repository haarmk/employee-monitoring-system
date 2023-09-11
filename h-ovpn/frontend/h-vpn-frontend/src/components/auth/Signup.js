import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { NavLink } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSignupMutation } from '../../features/auth/authApiSlice';
import "./Signup.css";


function Signup() {

    const [sendDataToSignUp, signUpsReso] = useSignupMutation()
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [passwordsMatch, setPasswordMatch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)

    async function handleSubmit(e) {
        setLoading(true)
        setDisabled(true)
        e.preventDefault();
        if (passwordConfirmation !== password) {
            setPasswordMatch(true);
            setTimeout(() => {
                setPasswordMatch(false);

            }, 2000)
            setLoading(false)
            setDisabled(false)
        }
        else if (password === passwordConfirmation) {
            const postData = {
                firstName: firstName,
                lastName: lastName,
                password: password,
                email: email
            }
            await sendDataToSignUp({ payload: postData })

        }

    }

    useEffect(() => {
        if (signUpsReso.isSuccess == true) {
            toast("Please check your email and verify the link")
            navigate("/")
        }

        else if(signUpsReso.isError == true) {
            setLoading(false)
            setDisabled(false)
            toast("Email address is already in use")
        }
    }, [signUpsReso.isSuccess, signUpsReso.isError])

    const redirectSignTOLogin = () => {
        navigate("/auth/login")
    }



    return (

        <div className="background-image-signup">
            <div className="imge-singup"></div>
            <div className='form-root-container'>
                <h2>Create an account</h2>
                <form onSubmit={handleSubmit}>

                    <input type="text" name="firstName" value={firstName} className="signup-input" placeholder=' First Name' onChange={(e) => setFirstName(e.target.value)} required disabled={loading} />

                    <input type="text" name="lastName" value={lastName} className="signup-input" placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} required disabled={loading} />

                    <input type="email" name="email" value={email} className="signup-input" placeholder='  Email' onChange={(e) => setEmail(e.target.value)} required disabled={loading} />

                    <input type="password" name="password" value={password} className="signup-input" placeholder=' Password' onChange={(e) => setPassword(e.target.value)} required disabled={loading} />

                    <input type="password" name="confirmPassword" placeholder='  Confirm Password' value={passwordConfirmation} className="signup-input" onChange={(e) => setPasswordConfirmation(e.target.value)} disabled={loading} />

                    {passwordsMatch ? (<p className='signup-error'>Password doesn't match</p>) : ""}

                    <button type="submit" className='btn-sign--sign signp-btn' disabled={loading}>
                        {loading ? (<p><CircularProgress size="1.7rem" color="primary" /></p>) : (<p>SIGN UP</p>)}
                    </button>
                </form>
                <NavLink to="/LoginWithMe" className='redirect-nav-to-login'>
                    <p onClick={redirectSignTOLogin} className='login-redirect-link'>Already have an account? <span className='link-to-log'>Login</span></p>
                </NavLink>
            </div>
        </div>
    )
}


export default Signup;

