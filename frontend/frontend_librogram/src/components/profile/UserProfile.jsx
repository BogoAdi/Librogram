import React from "react";
import { useState, useEffect } from "react";

import { Box, Typography, Avatar, IconButton, Tooltip, Button } from '@mui/material';
import { LibraryAddCheckOutlined } from '@mui/icons-material';
import PostContainer from "../Post";

import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";

import Sidebar from "../Sidebar";
import { useParams } from "react-router-dom";
import FriendsList from "../dialog-boxes/FriendsList";
import FavouriteBooks from "../dialog-boxes/FavouriteBooks";
import FollowedLibraries from "../dialog-boxes/FollowedLibraries";
const UserProfile = () => {
    const [posts, setPosts] = useState([]);
    const { instance, inProgress, accounts } = useMsal();
    const [decodedTokenId, setDecodedTokenId] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const { id } = useParams();
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
                        GetPostsByUserId(id);
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
    const [userDetails, setUserDetails] = useState(null);

    const GetUserDetails = async (userId) => {
        try {
            const response = await api.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setUserDetails(response.data);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        GetPostsByUserId(id);
        GetUserDetails(id);
    }, [accessToken]);

    //friends dialog box
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
    const GetPersonalUserDetails = async (userId) => {
        try {
            const response = await api.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (response.data.friends?.find(friend => friend.id === id))
                setIsThisUserFriend(true);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const [isThisUserFriend, setIsThisUserFriend] = useState(false);
    useEffect(() => {
        if (decodedTokenId !== "") {
            GetPersonalUserDetails(id);
        }
    }, [decodedTokenId])

    const SetAsFriend = async () => {
        try {
            var option = !isThisUserFriend;
            const response = await api.patch(`/user/follow?option=${option}&userId=${id}&personalId=${decodedTokenId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log(response.data);
            if (response.data === true) {
                setIsThisUserFriend(!isThisUserFriend);
            }
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
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
                                    <Avatar src={userDetails.profilePicture} alt="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
                                        style={{ width: '150px', height: '150px', margin: '0 20px' }} />
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
                                            {isThisUserFriend === false ?
                                                <Tooltip className="btn btn-success" title="Add as a friend" placement="top">
                                                    <IconButton className="btn btn-success" onClick={() => SetAsFriend()}>
                                                        <LibraryAddCheckOutlined style={{ color: 'green' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                : <Tooltip className="btn btn-success" title="Remove friend" placement="top">
                                                    <IconButton className="btn btn-danger" onClick={() => SetAsFriend()}>
                                                        <LibraryAddCheckOutlined style={{ color: 'red' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        </Box>
                                    </Box>
                                </Box>
                                {isFriendDialogOpened && decodedTokenId &&
                                    <FriendsList userId={id} onClose={handleCloseFriendDialog}
                                    />
                                }
                                {isFollowedLibrariesDialogOpened && decodedTokenId &&
                                    <FollowedLibraries userId={id} onClose={handleCloseLibrariesDialog}
                                    />
                                }
                                {isBooksDialogOpened && decodedTokenId &&
                                    <FavouriteBooks userId={id} onClose={handleCloseBooksdDialog}
                                    />
                                }
                                {posts && decodedTokenId !== "" && posts.length > 0 ? (
                                    posts.map((post) => (
                                        <PostContainer post={post} userId={decodedTokenId}
                                            onUpdateReactions={() => handlePostReacted(post.id)}
                                            onChangesOnComments={() => handleChangesFromComments(post.id)} />
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
export default UserProfile;