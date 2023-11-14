import { useDispatch } from "react-redux"
import { Route, Routes } from 'react-router-dom'
import RequireAuth from './components/auth/RequireAuth'
import AuthLayout from './components/layout/AuthLayout'
import Login from './components/auth/Login'
import Dashboard from "./pages/Dashboard"



import Layout from './components/layout/Layout'



function App() {
  // const [isFirstTime, setisFirstTime] = useState(true)

  // const dispatch = useDispatch()

  // const { data, isLoading, isSuccess, isError, error } = useRefreshTokenQuery({ skip: !isFirstTime })
  // useEffect(() => {
  //   if (isSuccess) {
  //     setisFirstTime(false)
  //     dispatch(setCredentials(data))

  //   }


  // }, [isSuccess])



  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */} 
        <Route index element={<Dashboard />} />
        {/* <Route path="about" element={<></>} />
        <Route path="contact" element={<></>} />
        <Route path="our-services" element={<></>} /> */}
        <Route path="auth" element={<AuthLayout />} >
          <Route index element={<></>} />
          {/* <Route path='verify-email' element={<EmailVeirificationResponseHandler />} />
          <Route path='reset-password' element={<ResetPassword />} /> */}
          <Route path="login" element={<Login />} />
          {/* <Route path="logout" element={<Logout />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgotpassword" element={<Forgotpassword />} /> */}
        </Route>



        {/* protected routes */}
        <Route element={<RequireAuth />}>
          {/* <Route path="home" element={<Home />} /> */}

        </Route>


      </Route>


      <Route element={<RequireAuth />}>
        {/* <Route path="orders" element={<AuthLayout />} >
          <Route index element={<Orders />} />
          <Route path='cart' element={<Cart />} />
          <Route path='checkout' element={<Checkout />} />

        </Route> */}
        


      </Route>


    </Routes>

  )
}

export default App;