import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography } from "@mui/material";
import AppLogo from "./AppLogo";
import image from "../media/backgoundImage.png";
import base_url from "../env/env.json";
const Login = () => {
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const { instance } = useMsal();
    useEffect(()=>{
        console.log(base_url.base_url);
        console.log(base_url.redirect_url);
    },[])
    function handleNavigate() {
        navigate('/home');
    }

    const handleSignIn = () => {
        instance.loginRedirect({
            scopes: ['user.read']
        });

    }

    useEffect(() => {
        setIsLoading(true);
        if (isAuthenticated) {
            handleNavigate();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundImage: `url(${image})`
            }}>
                <div style={{
                    width: '600px',
                    display: "inline-block",
                    backgroundColor: "white",
                    border: "2px solid black",
                    padding: "20px"
                }}>

                    {isLoading ? (
                        <CircularProgress />
                    ) :
                        (<Box
                            sx={{
                                position: "relative",
                                alignItems: 'center',
                                justifyContent: "center",
                                display: 'center'
                            }}
                        >

                            <Box sx={{
                                width: '100%',
                                padding: '0 20px',
                                flexDirection: 'center',
                                alignItems: 'center',
                                justifyContent: "center"

                            }}>
                                <AppLogo />
                                <Typography variant="h5" gutterBottom>
                                    Welcome to Librogram! This apps allows you to comunicate with other users
                                    in a social-network manner and also work with books, such as adding new books to your library, borrowing a book and accept or reject book borrowings.

                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    To get started log in!
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                }}>
                                    <button className="btn btn-success"
                                        style={{ fontSize: "20px", padding: "10px 20px", width: "200px" }}
                                        onClick={handleSignIn}>
                                        Login</button>
                                </Box>

                            </Box>
                        </Box >
                        )}
                </div>
            </div>
        </>
    );
}

export default Login;