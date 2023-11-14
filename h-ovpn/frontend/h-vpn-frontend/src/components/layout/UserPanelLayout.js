import React from 'react'
import { Outlet } from 'react-router-dom'
import UserPanelNavbar from '../common/UserPanelNavbar'
export default function UserPanelLayout() {
  return (
    <div>
    <UserPanelNavbar/>
    <Outlet/>

    </div>
  )
}
