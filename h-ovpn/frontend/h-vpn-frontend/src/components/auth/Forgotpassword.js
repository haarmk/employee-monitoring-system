import React, { useState } from 'react'
import "./Forgotpassword.css"
import { bakendBaseUrl } from './BaseUrl'
import emailImage from "../../assets/images/email.png"
import { NavLink } from 'react-bootstrap'
import { error } from 'jquery'
import { useNavigate } from 'react-router-dom'


const Forgotpassword = () => {
    const [email, setEmail] = useState("")
    const [verificationStatus, setVerficationStatus] = useState("")
    const [disableButton, setDisableButton] = useState(true)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const succesmsg="success"
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        
        fetch(`${bakendBaseUrl}/auth/reset-password-request`, {
          method: 'POST',
          body: JSON.stringify({
            email: email
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => {
            if (!response.ok) {
            
              throw new Error(response.status);
            }
            return response.json();
          })
          .then((json) => {
            setVerficationStatus(json);
            setIsFormSubmitted(true);
            setErrorMessage('Password reset link has been sent successfully ✔');
            setLoading(false);
          })
          .catch((error) => {
            if(error.message==='400'){
              setErrorMessage('Email is not registered');
              setLoading(false);
            }
            else if(error.message==='Failed to fetch'){
              setLoading(false);
              window.alert('Something went wrong... Please try again');
             
              window.location.reload()
            }

          });
      }

      function redirectToCustSuppo(){
         navigate("/contact")
      }

      

    // if (isFormSubmitted && verificationStatus.status === "success") {
    //     setTimeout(() => {
    //         window.location.href = "/"
    //         setLoading(false);
    //     }, 10000)
    // } else if (isFormSubmitted && verificationStatus.status !== "success"){
    //     // window.location.reload();
    // }


    return (
        <div className="forget-bg">
            <div className='emailverification'>
                <div className='email-image'>
                    <img src={emailImage} alt="vdsvd" />
                </div>
                <div className=''><h3>Enter Your Email</h3></div>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Enter Your Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    <div>To reset password click on the below button.</div>
                    <button type='submit' disabled={loading}>{loading ? "Sending..." : "Send Verification Link"}</button>
                    {errorMessage && <p className='email-error-msg'>{errorMessage}</p>}
                </form>
                <div className='cust-supp'>If you have trouble then contact our customer support</div>
                <div>
                    <NavLink to="/ContactUs" className="contact-support">
                        <button onClick={redirectToCustSuppo}>Contact Support</button>
                    </NavLink>
                </div>

            </div>
        </div>

    )
}

export default Forgotpassword
