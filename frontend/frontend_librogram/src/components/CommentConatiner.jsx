import React from "react";
import { useState, useEffect } from "react";
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../API/api";

import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import Tooltip from "@mui/material/Tooltip";
import DOMPurify from 'dompurify';
const CommentContainer = ({ postId, onSubmit }) => {
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
    const [comments, setComments] = useState([]);
    const getAllComments = async () => {
        try {
            const response = await api.get(`/by-post/${postId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log(response.status);
            setComments({});
            setComments(response.data);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    const GetUserDetails = async () => {
        try {
            const response = await api.get(`/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log(response.status);
            setUserDetails(response.data);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    const PostComment = async () => {
        try {
            const formattedText = newComment.replace(/\n/g, "<br>");
            const commentData = new FormData();
            commentData.append('postId', postId);
            commentData.append('text', formattedText);
            commentData.append('userId', decodedTokenId);
            const response = await api.post(`/api/comment`, commentData, { headers: { Authorization: `Bearer ${accessToken}` } });
            getAllComments();
            setNewComment("");
            onSubmit();
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    const [userDetails, setUserDetails] = useState({});
    useEffect(() => {
        if (decodedTokenId !== "") {
            getAllComments();
            GetUserDetails();
        }
    }, [accessToken])

    const handleInputChange = (ev) => {
        setNewComment(ev.target.value);
    }
    const [newComment, setNewComment] = useState("");

    const getTime = (time) => {
        const currentDate = new Date();
        const lastEditDate = new Date(time);
        const timeDiff = currentDate - lastEditDate;

        // Calculate the time difference in minutes, hours, and days
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        const hoursDiff = Math.floor(minutesDiff / 60);
        const daysDiff = Math.floor(hoursDiff / 24);

        // Format the time difference based on the duration
        let formattedTimeDiff;
        if (minutesDiff < 1)
            formattedTimeDiff = `just now`;
        else if (minutesDiff < 60 && minutesDiff > 1) {
            formattedTimeDiff = `${minutesDiff} minutes ago`;
        } else if (hoursDiff < 24) {
            formattedTimeDiff = `${hoursDiff} hours ago`;
        } else {
            formattedTimeDiff = `${daysDiff} days ago`;
        }

        return formattedTimeDiff;
    }
    useEffect(() => {
        console.log(newComment);
    }, [newComment])
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await api.delete(`api/comment/${commentId}?userId=${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log(response.data);
            getAllComments();
            onSubmit();
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    //EditComment Logic

    const [editedComment, setEditedComment] = useState("");
    const [editId, setEditId] = useState("");

    const handleEditClick = (id) => {
        const comment = comments.find((comment) => comment.id === id);
        let text = comment.text;
        setEditedComment(text.replace(/<br\s*\/?>/gi, '\n'));
        setEditId(id);
    };

    const handleCancelClick = () => {
        setEditedComment("");
        setEditId("");
    };

    const handleSaveClick = (id) => {
        handleEditComment(id);
        setEditedComment("");
        setEditId("");
    };

    const handleCommentChange = (event) => {
        setEditedComment(event.target.value);
    };
    const handleEditComment = async (commentId) => {
        try {
            const formattedText = editedComment.replace(/\n/g, "<br>");
            const commentData = new FormData();
            commentData.append('text', formattedText);
            commentData.append('userId', decodedTokenId);
            const response = await api.patch(`api/comment/${commentId}`, commentData, { headers: { Authorization: `Bearer ${accessToken}` } });
            getAllComments();
            onSubmit();
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    const renderBodyText = (text) => {
        const sanitizedHTML = DOMPurify.sanitize(text);
        return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
    };
    return (
        <>
            <Box width="100%" display="flex" flexDirection="column" alignItems="center" margin="20px">
                <Box width="1000px" marginY="40px">
                    <Box display="flex" alignItems="flex-start">
                        <Box marginRight="10px">
                            <Avatar
                                src={userDetails.profilePicture}
                                alt="Profile"
                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                            />
                        </Box>
                        <Box flex="1">
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                PostComment();
                            }}>
                                <textarea
                                    type="text"
                                    onChange={handleInputChange}
                                    placeholder="Enter your comment"
                                    className="comment-input"
                                    rows={newComment.split('\n').length + 1}
                                    style={{
                                        marginBottom: '10px',
                                        borderRadius: '10px',
                                        padding: '10px',
                                        backgroundColor: '#F5F5F5',
                                        width: '100%',
                                        whiteSpace: 'pre-wrap', // Preserve line breaks and formatting
                                    }}
                                    value={newComment}
                                />
                                <button className="btn btn-success" type="submit">Post</button>
                            </form>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="flex-start">
                        <div style={{ marginTop: '20px' }}>
                            {comments.map((comment, index) => (
                                <Box key={index} display="flex" alignItems="center" marginBottom="10px">
                                    <Box marginRight="10px">
                                        <Avatar
                                            src={comment.user.profilePicture}
                                            alt="Profile"
                                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                        />
                                    </Box>
                                    <Box display="flex" alignItems="flex-start" backgroundColor="#F5F5F5">
                                        {editId === comment.id ? (
                                            <textarea
                                                value={editedComment}
                                                onChange={handleCommentChange}
                                                rows={editedComment.split('\n').length + 1}
                                                style={{
                                                    marginBottom: '10px',
                                                    borderRadius: '10px',
                                                    padding: '10px',
                                                    backgroundColor: '#F5F5F5',
                                                    width: window.innerWidth < '900px' ? '100%' : '800px',
                                                    whiteSpace: 'pre-wrap', // Preserve line breaks and formatting
                                                }}

                                            />
                                        ) : (
                                            <>
                                                <Typography variant="body1" style={{ fontSize: '16px' }}>
                                                    <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                                                        {comment.user.name}
                                                        {comment.userId === decodedTokenId && (
                                                            <Box display="flex" alignItems="center" marginTop="5px">
                                                                <Tooltip title={"Delete Comment"}>
                                                                    <IconButton
                                                                        size="small"
                                                                        aria-label="Delete"
                                                                        onClick={() => handleDeleteComment(comment.id)}
                                                                        style={{ color: 'red', marginLeft: '10px', marginRight: '10px' }}
                                                                    >
                                                                        <DeleteOutlineOutlined fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={"Edit Comment"}>
                                                                    <IconButton
                                                                        size="small"
                                                                        aria-label="Edit"
                                                                        onClick={() => handleEditClick(comment.id)}
                                                                        style={{ color: 'black', marginLeft: '10px', marginRight: '10px' }}
                                                                    >
                                                                        <EditOutlined fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                    </Typography>
                                                    {renderBodyText(comment.text)}
                                                    <Box>
                                                        <Typography variant="h8">{getTime(comment.lastEditDate)}</Typography>
                                                    </Box>
                                                </Typography>



                                            </>
                                        )}
                                    </Box>
                                    {editId === comment.id && (
                                        <Box display="flex" alignItems="center">
                                            <button className="btn btn-success" style={{ marginRight: '10px' }} onClick={() => handleSaveClick(comment.id)}>Save</button>
                                            <button className="btn btn-danger" style={{ marginRight: '10px' }} onClick={handleCancelClick}>Cancel</button>
                                        </Box>
                                    )}


                                </Box>

                            ))}
                        </div>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default CommentContainer;