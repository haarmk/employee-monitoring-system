import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLoginMutation } from '../../features/auth/authApiSlice'
import { setCredentials } from '../../features/auth/authSlice'
import { setUser as setUserInRedux } from "../../features/user/userSlice"
import { useGetUserQuery } from "../../features/user/usersApiSlice"
import "./Login.css"
import { useErrorBoundary } from "react-error-boundary"
import { GOOGLE_AUTH_URL } from '../../constant/index'


const Login = (props) => {
    const { showBoundary } = useErrorBoundary()

    const userRef = useRef()
    const errRef = useRef()
    const [email, setUser] = useState('')
    const [password, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()
    const [login, loginRes] = useLoginMutation()
    const getUserRes = useGetUserQuery({ ship: !loginRes.isSuccess })
    const dispatch = useDispatch()
    const { state } = useLocation()
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const handleSubmit = async (e) => {
        setDisabled(true)
        setLoading(true)
        e.preventDefault()
        const res = await login({ email, password })
    }
    useEffect(() => {
        if (loginRes.isSuccess) {
            dispatch(setCredentials({ ...loginRes.data }))
            dispatch(setUserInRedux({ user: getUserRes.data }))
            setUser('')
            setPwd('')
            toast("Logged in successfully")
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('accessToken', loginRes.data.token)
            navigate(state?.from?.pathname || '/')
        }
        else if(loginRes.isError) {
            setDisabled(false)
            toast("Somthing went wrong!")
            setLoading(false)
        }
    }, [loginRes.isSuccess, getUserRes.isSuccess, loginRes.isError]);

    console.log(loginRes)
    const handleUserInput = (e) => setUser(e.target.value)
    const handlePwdInput = (e) => setPwd(e.target.value)

    function redirectToSignUp() {
        navigate('/auth/signup')
    }

    let content = ""

    content =
        <section className="login login-form-section">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <div className="image-login">

            </div>
            <div className="login-main-container">
                <h1>LOGIN</h1>
                <form onSubmit={handleSubmit}>
                    
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        value={email}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required disabled={loading}
                        placeholder='Enter your email'
                    />

                    
                    <input
                        type="password"
                        id="password"
                        onChange={handlePwdInput}
                        value={password}
                        required disabled={loading}
                        placeholder='Enter your password'
                    />
                    <button disabled={loading} className='signin-btnn'>
                        {loading ? (<p><CircularProgress size="1.7rem" color="primary"/></p>) : (<p>SIGN IN</p>)}
                    </button>
                </form>
                <div className="extra-links">
                    <a href={GOOGLE_AUTH_URL} > <h5 ><i class="fa-brands fa-google"></i> Login with Google</h5></a>
                    <Link  className='linktochangepass' to={'/auth/forgotpassword'}>Forgot password?</Link>
                    <p>Don't have an account? <span className='link-signup' onClick={redirectToSignUp}>Sign up</span> </p>
                </div>

            </div>
        </section>

    return <>
        {content}
    </>
}
export default Login