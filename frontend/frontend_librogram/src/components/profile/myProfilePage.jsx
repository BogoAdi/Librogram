import React from "react";
import { useState, useEffect } from "react";

import { Box, Typography, Avatar, IconButton, Button } from '@mui/material';
import PostContainer from "../Post";

import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";

import Sidebar from "../Sidebar";

import { Edit } from '@mui/icons-material';
import EditProfileInfo from "../dialog-boxes/EditProfileInfo";
import FriendsList from "../dialog-boxes/FriendsList";
import FollowedLibrary from "../dialog-boxes/FollowedLibraries";
import FavouriteBooks from "../dialog-boxes/FavouriteBooks";

const MyProfilePage = () => {
    const [posts, setPosts] = useState([]);
    const { instance, inProgress, accounts } = useMsal();
    const [decodedTokenId, setDecodedTokenId] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [reload, setReload] = useState(false);

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


    const GetPostsByUserId = async (userId) => {
        try {
            const response = await api.get(`/api/posts/of-user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log(response.status);
            setPosts(response.data);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    const GetUserDetails = async () => {
        try {
            setUserDetails(null);
            const response = await api.get(`/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setUserDetails(response.data);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        if (decodedTokenId !== "") {
            GetUserDetails();
            GetPostsByUserId(decodedTokenId);
        }
    }, [accessToken]);


    const [userDetails, setUserDetails] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleEditClose = () => {
        setIsEditModalOpen(false);
    };
    const handleSaveChanges = async () => {
        setUserDetails(null);
        setPosts(null);
        setReload(true);
        setIsEditModalOpen(false);
    };
    useEffect(() => {
        if (reload === true) {
            GetPostsByUserId(decodedTokenId);
            GetUserDetails();
            setReload(false);
        }
    }, [reload])
    useEffect(() => {
        console.log(posts);
        console.log(userDetails);
    }, [posts, userDetails])

    //FOR FRIENDS POP UP
    const [isFriendDialogOpened, setIsFriendDialogOpened] = useState(false);
    const handleFriendsClick = () => {
        setIsFriendDialogOpened(true);
    }
    const handleCloseFriendDialog = () => {
        setIsFriendDialogOpened(false);
    };

    // for followed libraries
    const [isFollowedLibrariesDialogOpened, setIsFollowedLibrariesDialogOpened] = useState(false);
    const handleLibrariesClick = () => {
        setIsFollowedLibrariesDialogOpened(true);
    }
    const handleCloseLibrariesDialog = () => {
        setIsFollowedLibrariesDialogOpened(false);
    };

    // for favourite books
    const [isBooksDialogOpened, setIsBooksDialogOpened] = useState(false);
    const handleBooksClick = () => {
        setIsBooksDialogOpened(true);
    }
    const handleCloseBooksdDialog = () => {
        setIsBooksDialogOpened(false);
    };
    const handleUpdatePost = (postId, updatedValue) => {
        posts.map((post) => {
            console.log(post.commentsCount);
            if (post.id === postId) {
                return { ...post, propertyToUpdate: updatedValue };
            }
            return post;
        });
    };

    const getPostById = async (postId) => {
        try {
            const response = await api.get(`/api/posts/${postId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            return response.data;
        } catch (err) {
            if (err.response) {
                console.log(err.message);

            } else {
                console.log(`Error: ${err.message}`);
            }
        }
    }


    const handleChangesFromComments = async (postId) => {
        try {
            const newVal = await getPostById(postId);
            const updatedPosts = JSON.parse(JSON.stringify(posts));
            const index = updatedPosts.findIndex((post) => post.id === postId);
            console.log(index);
            console.log(newVal);
            if (index !== -1) {
                updatedPosts[index] = newVal;
                setPosts(updatedPosts);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useState(() => {
        console.log(posts);
    }, [posts])

    const handlePostReacted = async (postId) => {
        try {
            const newVal = await getPostById(postId);
            const updatedPosts = JSON.parse(JSON.stringify(posts));
            const index = updatedPosts.findIndex((post) => post.id === postId);
            console.log(newVal);
            if (index !== -1) {
                updatedPosts[index] = newVal;
                setPosts(updatedPosts);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <>
                <div className="overflow-hidden">
                    <div className="row">
                        <div className="col-2">
                            <div className="position-fixed col-lg-2">
                                <Sidebar />
                            </div>
                        </div>
                        {posts && userDetails &&
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Box position="relative" top="10px" display="flex" alignItems="center">


                                    <Box
                                        position="relative"
                                        top="10px"
                                        display="flex"
                                        alignItems="center"
                                        style={{ position: 'relative' }}
                                    >
                                        <Avatar
                                            src={userDetails.profilePicture}
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                margin: '0 20px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Box>
                                    {isEditModalOpen &&
                                        <EditProfileInfo onClose={handleEditClose} onSave={handleSaveChanges} />
                                    }
                                    <Box>
                                        <Typography variant="h4">{userDetails.name}</Typography>
                                        <Box display="flex" alignItems="center">
                                            <Button onClick={handleFriendsClick}>
                                                <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Friends</Typography>
                                            </Button>
                                            <Button onClick={handleLibrariesClick}>
                                                <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Followed Libraries</Typography>
                                            </Button>
                                            <Button onClick={handleBooksClick}>
                                                <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Favourite Books</Typography>
                                            </Button>
                                            <IconButton
                                                onClick={handleEditClick}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                                {isFriendDialogOpened && decodedTokenId &&
                                    <FriendsList userId={decodedTokenId} onClose={handleCloseFriendDialog}
                                    />
                                }
                                {isFollowedLibrariesDialogOpened && decodedTokenId &&
                                    <FollowedLibrary userId={decodedTokenId} onClose={handleCloseLibrariesDialog}
                                    />
                                }
                                {isBooksDialogOpened && decodedTokenId &&
                                    <FavouriteBooks userId={decodedTokenId} onClose={handleCloseBooksdDialog}
                                    />
                                }

                                {posts && decodedTokenId !== "" && posts.length > 0 ? (
                                    posts.map((post) => (
                                        <PostContainer post={post} userId={decodedTokenId}
                                            onUpdatePost={handleUpdatePost} onUpdateReactions={() => handlePostReacted(post.id)} onChangesOnComments={() => handleChangesFromComments(post.id)}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body1">No posts available.</Typography>
                                )}
                            </Box>
                        }
                    </div>
                </div>
            </>

        </>
    );
}
export default MyProfilePage;