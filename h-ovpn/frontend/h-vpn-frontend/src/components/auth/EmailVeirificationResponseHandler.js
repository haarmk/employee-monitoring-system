import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { bakendBaseUrl } from './BaseUrl';
import "./EmailVeirificationResponseHandler.css";

const EmailVeirificationResponseHandler = () => {
  // let token = window.location.href;
  // const finalToken = token.split('=')
  // token={"token":finalToken[1],"type":"hghj"}
  // console.log(token)

  // axios.post(`${bakendBaseUrl}/auth/verify-email`,token).then((response) => {
  //     console.log("vfgsd",response)

  // }).catch((error) => {
  //     console.log(error.response.status)
  //     window.alert('Token not valid')
  // })

  let token = window.location.href;
  const finalToken = token.split('=')
  token = { "token": finalToken[1], "type": "hghj" }
 
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    axios.post(`${bakendBaseUrl}/auth/verify-email`, token).then((response) => {
      Swal.fire(
        'Verification Done !',
        'Thank you for verifying your e-mail address',
        'success'
      )
      setTimeout(() => {
        window.location.href = "/"
      }, 3000)

    }).catch((error) => {
      if (error.message === "Network Error") {
        Swal.fire(
          'Connection Error!',
          'There was a problem connecting to the server. Please try again later.',
          'error'
        );
      } else {
        Swal.fire(
          'Token Expired!',
          'Token has expired. Please go to the login page.',
          'error'
        );
      }
      setTimeout(() => {
        window.location.href = "/LoginWithMe"
      }, 3000)
      setLoading(false)
    })
  }



  return (
    <div className='EmailVeirificationResponseHandler'>
      <div className="butt-func">
        <p className='xyz-title'>Verify your e-mail to activate your account and Finish verification process</p>
        <p className='xyz-title'>Thank you for choosing</p>
        <p className='xyz-title'>Please confirm the email address by clicking on the button below.</p>
        <button onClick={handleClick} disabled={loading}>{loading ? "Verifying..." : "Verify your E-mail"}</button>
      </div>
    </div>
  )
}

export default EmailVeirificationResponseHandler