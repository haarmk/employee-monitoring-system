import React, { useState } from 'react'
import "./ResetPassword.css"
import { bakendBaseUrl } from './BaseUrl'
import { useEffect } from 'react';
import { error } from 'jquery';

const ResetPassword = () => {
    const url = window.location.href;
    const token = url.split("=")
    const finalToken = token[1]
    const [okStatus, setOkStatus]=useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [matchPassword, setMatchPassword] = useState(true)



    const[error, setError]=useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        if (password === confirmPassword) {
            setMatchPassword(true);
            try {
                const response = await fetch(`${bakendBaseUrl}/auth/reset-password`, {
                    method: 'POST',
                    body: JSON.stringify({
                        token: finalToken,
                        newPassword: password
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });

                if (response.status === 403) {
                    setError("Session timeout");
                }
                const json = await response.json();
                if(json.status === 'Success'){
                    setOkStatus(json.status)
                    setTimeout(()=>{
                        window.location.href="/"
                    },3000)
                }
               
            } catch (error) {
                // console.log("Error:", error.message);
            }
            // console.log("Passwords match");
        } else {
            setMatchPassword(false);
          
        }
    }


    return (
        <div className="resetpass-main">
            <div className='password'>
                <h3>Reset Password</h3>
                <form className='input' onSubmit={handleSubmit}>
                    <input type="text" value={password} placeholder='Enter your new password' onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" value={confirmPassword} placeholder='Re-Enter your new password' onChange={(e) => setConfirmPassword(e.target.value)} />
                    {!matchPassword && <p className="not-match-error">Passwords do not match</p>}
                    {(error != null)? <p className="not-match-error">{error}</p> : ""}
                    {(okStatus != 'Success')? "" : <p className="ok-status">Password reset successfully</p>}
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
