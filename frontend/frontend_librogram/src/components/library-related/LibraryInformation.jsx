import React from "react";
import Sidebar from "../Sidebar";
import { useState, useEffect } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import FollowersList from "../dialog-boxes/FollowersList";

import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";
import { useParams } from "react-router-dom";
const Libraryinformations = () => {
    const { id } = useParams();
    const [library, setLibrary] = useState(null);
    const { instance, inProgress, accounts } = useMsal();
    const [decodedTokenId, setDecodedTokenId] = useState("");
    const [accessToken, setAccessToken] = useState("");
    useEffect(() => {
        const acquireAccessToken = async () => {
            const accessTokenRequest = {
                scopes: ["api://41fef766-32af-4ef8-9e15-13f2ca714ea8/UserImpersonation"],
                account: accounts[0],
            };

            if (inProgress === InteractionStatus.None) {
                try {
                    const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
                    const token = accessTokenResponse.accessToken;
                    setAccessToken(token);

                    if (decodedTokenId === "") {
                        const id = jwt_decode(token).oid;
                        setDecodedTokenId(id);
                    }
                } catch (error) {
                    if (error instanceof InteractionRequiredAuthError) {
                        instance.acquireTokenRedirect(accessTokenRequest);
                    }
                    console.log(error);
                }
            }
        };

        acquireAccessToken();
    }, [instance, inProgress, accounts, decodedTokenId]);

    const GetLibraryInfo = async () => {
        try {
            const response = await api.get(`/library/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setLibrary(response.data);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        if (decodedTokenId !== "") {
            GetLibraryInfo();
            console.log(library);
        }
    }, [accessToken]);
    useEffect(() => {
        console.log(library);
    }, [library])

    const [isDialogOpened, setIsDialogOpened] = useState(false);
    const handleFollowersClick = () => {
        setIsDialogOpened(true);
    }
    const handleCloseDialog = () => {
        setIsDialogOpened(false);
    };
    
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-2">
                    <div className="position-fixed">
                        <Sidebar />
                    </div>
                </div>
                {library &&
                    <div className="col-lg-10">
                        <div className="px-5 ps-lg-5 my-1">
                            <div className="text-center mt-5 mb-2">
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Box position="relative">
                                            <img
                                                src="https://via.placeholder.com/750x400" // Replace with the library's photo URL
                                                alt="Library Photo"
                                                style={{ width: '750px', height: '400px' }}
                                            />
                                        </Box>

                                        <Box mt={4}>
                                            <Typography variant="h4">Library Name</Typography>
                                            <Typography variant="subtitle1">
                                                Owner: {library.owner.name} | Email: {library.owner.email}
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                Number of Books: {library.numberOfBooks}
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                Number of Active Borrowings: {library.activeBorrowings} | Number of Total Borrowings: {library.totalBorrowings}
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                Description of the library: {library.description}
                                            </Typography>
                                            <Typography variant="subtitle1">Location: {library.location}</Typography>
                                            <Typography
                                                variant="subtitle1"
                                                style={{ cursor: 'pointer' }}
                                                onClick={handleFollowersClick}
                                            >
                                                Number of Followers: {library.numberOfFollowers}
                                            </Typography>
                                        </Box>
                                        {isDialogOpened &&
                                            <FollowersList onClose={handleCloseDialog}
                                            />
                                        }
                                    </Box>
                                </Box>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Libraryinformations;


