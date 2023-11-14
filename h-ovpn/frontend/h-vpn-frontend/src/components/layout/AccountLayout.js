import { Outlet, NavLink } from "react-router-dom"
import { Button } from "@mui/material"
export default function AccountLayout() {
  return (
    <>
        {/* <Button><NavLink to={"dashboard"}>dashboard</NavLink></Button>
        <Button><NavLink to={"profile"}>profile</NavLink></Button> */}
        
        <Outlet/>
    </>
    
  )
}
