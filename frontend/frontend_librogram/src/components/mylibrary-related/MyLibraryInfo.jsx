import React, { useEffect } from "react";
import Sidebar from "../Sidebar";
import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

import FollowersList from "../dialog-boxes/FollowersList";
import EditLibraryDetails from "../dialog-boxes/EditLibraryDetails.";
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";
import { Link } from 'react-router-dom'
import CreateLibrary from "./CreateLibrary";
const MyLibraryInfo = () => {
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
            const response = await api.get(`/library/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setLibrary(response.data);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    const [user, setUser] = useState(null);
    const GetUserDetails = async () => {
        try {
            const response = await api.get(`/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setUser(response.data);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        if (decodedTokenId !== "") {
            GetUserDetails();
            GetLibraryInfo();
        }
    }, [accessToken]);
    useEffect(() => {
        console.log(library);
    }, [library])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDialogOpened, setIsDialogOpened] = useState(false);
    const [isCreateLibraryOpen, setIsCreateLibraryOpen] = useState(false);
    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleEditClose = () => {
        setIsEditModalOpen(false);
    };
    const handleFollowersClick = () => {
        setIsDialogOpened(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpened(false);
    };

    const handleSaveChanges = () => {
        setLibrary(null);
        setReload(true);
        setIsEditModalOpen(false);
    };
    const [reload, setReload] = useState(false);
    const [userReload, setUserReload] = useState(false);
    useEffect(() => {
        if (reload === true) {
            GetLibraryInfo();
            setReload(false);
        }
    }, [reload])
    useEffect(() => {
        if (userReload === true) {
            GetUserDetails();
            setUserReload(false);
        }
    }, [userReload])
    useEffect(() => {
        console.log(library);
    }, [library])
    const emptyGuid = '00000000-0000-0000-0000-000000000000';

    const handleSaveLibrary = () => {
        GetLibraryInfo();
        setUser(null);
        setUserReload(true);
        setIsCreateLibraryOpen(false);
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-2">
                    <div className="position-fixed">
                        <Sidebar />
                    </div>
                </div>
                {library !== null &&
                    <div className="col-lg-10">
                        <div className="px-5 ps-lg-5 my-1">
                            <div className="text-center mt-5 mb-2">
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Box position="relative">
                                            <img
                                                src={library.profileImage}
                                                alt="Library Photo"
                                                style={{ width: '750px', height: '400px' }}
                                            />
                                            <IconButton style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                                <Edit onClick={handleEditClick} />
                                            </IconButton>
                                            {isEditModalOpen &&
                                                <EditLibraryDetails onClose={handleEditClose} onSave={handleSaveChanges} />
                                            }
                                        </Box>
                                        <Box mt={4}>
                                            <Typography variant="h4">{library.name}</Typography>
                                            <Typography variant="subtitle1">
                                                Owner: {library.owner.name}
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
                {user && user.personalLibraryId === emptyGuid &&
                    <>
                        <div className="col-lg-10">
                            <div className="px-5 ps-lg-5 my-1">
                                <div className="text-center mt-5 mb-2">
                                    <Box display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        minHeight="100vh"
                                    >
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            alignItems="center"
                                            padding="20px"
                                        >
                                            <button className="btn btn-success"
                                                onClick={() => setIsCreateLibraryOpen(true)} >
                                                Create your personal library
                                            </button>
                                        </Box>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {
                    isCreateLibraryOpen && <CreateLibrary onSave={handleSaveLibrary} onClose={() => setIsCreateLibraryOpen(false)} />
                }
            </div>

        </div >
    );
};

export default MyLibraryInfo;


