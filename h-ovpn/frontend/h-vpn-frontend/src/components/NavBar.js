import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import navLogo from "../assets/images/vpnLogo.png"
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { green } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectUser} from '../features/user/userSlice';
import { selectIsLogedIn, selectCurrentToken } from '../features/auth/authSlice';
import { useGetUserQuery } from '../features/user/usersApiSlice';



const pages = [{prompt:"Dashboard",path:"/"}, {prompt:"About",path:"/about"},  {prompt:"Contact Us",path:"/contact"}, {prompt:"Our Services",path:"/our-services"}];
const settings = [{prompt:"Profile",path:"/account/user/profile"}, {prompt:"Dashboard",path:"/account"}, {prompt:"Logout",path:"/auth/logout"}];
const authPages = [{prompt:"Login",path:"/auth/login"}, {prompt:"Signup",path:"/auth/signup"}]


function NavBar() {
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const isLogedIn = useSelector(selectIsLogedIn);
  const token = useSelector(selectCurrentToken);
  const {data:user} = useGetUserQuery({skip:!isLogedIn});
  const navigate = useNavigate()
  
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    
    setAnchorElUser(null);
    
  };


  return (
    <AppBar
    component="nav"
     position="sticky" 
    //  sx={{backgroundImage: `linear-gradient(60deg,rgb(255, 0, 255), blue)`, }}
     >
     
      <Container maxWidth="xl" >
        <Toolbar disableGutters>
        <Link to={"/home"}>
        <Box
            component="img"
            sx={{
              
            // height: "auto",
            // maxHeight: { xs: 100, md: 50 },
            maxWidth: { xs: 75, md: 75 },
            display: { xs: 'none', md: 'flex' },
           
            }}
            mr={{  md: 5, lg: 10, xl: 15 }}
            alt="logo"
            src={navLogo}
         />
       
        </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none',  } }} m={-2.5} >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              marginThreshold={0}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              PaperProps={{
                  style: {
                        width: "100%",
                        maxWidth: "100%",
                        left: 0,
                        right: 0,
                       
                  }
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              
              sx={{
                display: { xs: 'block', md: 'none',},
                
                
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                divider
                component={Link}
                to={page.path}
                key={page.prompt} 
                onClick={(e)=>handleCloseNavMenu(e)}
                sx={{
                  width:"100%",
                //  border:'1px solid red', 
                 display:'flex',
                 justifyContent:'center',
                 alignItems:'center',
                 }}   
                
                >
                  {page.prompt}
                </MenuItem>
                    
                
              ))}
            </Menu>
          </Box>
          
         
          <Grid container sx={{display: { xs: 'flex', md: 'none' },}}>
          
            <Box
                component="img"
                // noWrap
                // alignItems="center"
                sx={{
                    margin: "auto",
                    // display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    height: "auto",
                    width: "auto",
                    maxHeight: { xs: 100, sm:125, md: 150, lg: 175, xl: 200  },
                    maxWidth: { xs: 100, sm:125, md: 150, lg: 175, xl: 200  },
                    alignItems:"center",
                }}
                alt="logo"
                src={navLogo}
                onClick={()=> navigate("/")}
            />
            {/* </Link> */}
         </Grid>

        {/* <Grid container marginLeft={"auto"} sx={{display: { xs: 'none', md: 'grid' } }}> */}
            <Box margin="auto" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} marginLeft={3} marginRight={1} >
                {pages.map((page) => (
                <Button
                    key={page.prompt}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={page.path}
                    sx={{ 
                         my: 2,
                         color: 'white', 
                         display: 'block', 
                         fontSize:"1rem",
                         fontWeight: 500, 
                         }}
                >
                    {page.prompt}
                </Button>
                ))}
            </Box>
        {/* </Grid> */}



          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="">
              <IconButton onClick={(e)=>handleOpenUserMenu(e)} sx={{ p: 0,fontSize: { xs: 28, sm: 30, md: 35, lg: 40, xl: 45 } }}>
                {isLogedIn?
                <Avatar alt={user?.firstName} src={user?.image} sx={{ color: green[50], width: { xs: 28, sm: 30, md: 35, lg: 40, xl: 45 }, height: { xs: 28, sm: 30, md: 35, lg: 40, xl: 45 } }}/>
                :
                <AccountCircleIcon sx={{ color: green[50], fontSize: { xs: 28, sm: 30, md: 35, lg: 40, xl: 45 } }}/>
                }
              </IconButton>
                
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {isLogedIn? 
              settings.map((setting) => (
                <MenuItem key={setting.prompt} onClick={(e) => handleCloseUserMenu(e)}>
                    <Link to={setting.path} style={{ textDecoration: 'none' }}>{setting.prompt}</Link>
                    
                </MenuItem>
              ))
              :
              authPages.map((auth) => (
                <MenuItem key={auth.path} onClick={(e) => handleCloseUserMenu(e)}>
                  <Link to={auth.path}>{auth.prompt}</Link>
                </MenuItem>
              ))

              }
            </Menu>
          </Box>
          {/* <Box>
            <Link to={"/orders/cart"}>
                <ShoppingCartIcon sx={{color:"white", mt: '5px', ml:1, fontSize: { xs: 27, sm: 29, md: 34, lg: 39, xl: 44 }}} />
            </Link>
          </Box> */}
          
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
