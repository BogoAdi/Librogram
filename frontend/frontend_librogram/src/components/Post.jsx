import React, { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import { Box, Typography, IconButton, MenuItem, Menu, Button, Card, Paper } from '@mui/material';
import { FavoriteBorderOutlined, ChatBubbleOutlineOutlined, ShareOutlined } from '@mui/icons-material';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";

import api from "../API/api";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


import { Dialog, DialogTitle, DialogContent, ButtonBase, Avatar } from "@mui/material";
import { FaHeart, FaThumbsUp, FaSadTear, FaLaughSquint, FaAngry } from 'react-icons/fa';
import CommentContainer from "./CommentConatiner";

const PostContainer = ({ post, userId, onUpdatePost, onChangesOnComments, onUpdateReactions }) => {
    const { instance, inProgress, accounts } = useMsal();
    const [decodedTokenId, setDecodedTokenId] = useState("");
    const [isDeleted, setIsDeleted] = useState(false);
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

    const handleEditEndpoint = async (postId, newData) => {
        try {
            const response = await api.patch(`/api/posts/${postId}`, newData, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log(response.status);
            onUpdatePost(post.id, response.data);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };

    const handleDelete = async (postId) => {
        try {
            const response = await api.delete(`/api/posts/${postId}?userId=${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log(response.status);
            setIsDeleted(true);
            // Handle successful deletion
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };

    const [showFullText, setShowFullText] = useState(false);

    const handleClickText = () => {
        setShowFullText(!showFullText);
    };
    const renderBodyText = (text) => {
        if (showFullText || text.length <= 300) {
            const sanitizedHTML = DOMPurify.sanitize(text);
            return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
        } else {
            const truncatedText = text.slice(0, 300);
            const sanitizedHTML = DOMPurify.sanitize(truncatedText);
            const finalText = <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
            return (
                <span>
                    {finalText}
                    <span style={{ color: '#0066cc', cursor: 'pointer' }} onClick={handleClickText}>
                        ...show more
                    </span>
                </span>
            );
        }
    };
    const openEditPost = (text) => {
        setOriginalPostContent(text);
        setPostContent(text);
        setIsEditing(true);
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const [lastEditTimeDiff, setLastEditTimeDiff] = useState(null);

    useEffect(() => {

        // Calculate the time difference between lastEditDate and current date
        const currentDate = new Date();
        const lastEditDate = new Date(post.lastEditDate);
        const timeDiff = currentDate - lastEditDate;

        // Calculate the time difference in minutes, hours, and days
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        const hoursDiff = Math.floor(minutesDiff / 60);
        const daysDiff = Math.floor(hoursDiff / 24);

        let formattedTimeDiff;
        if (minutesDiff < 60) {
            formattedTimeDiff = `${minutesDiff} minutes ago`;
        } else if (hoursDiff < 24) {
            formattedTimeDiff = `${hoursDiff} hours ago`;
        } else {
            formattedTimeDiff = `${daysDiff} days ago`;
        }
        setLastEditTimeDiff(formattedTimeDiff);

        // Clean up the effect
        return () => {
            setLastEditTimeDiff(null);
        };
    }, [post.lastEditDate]);

    const [isEditing, setIsEditing] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [originalPostContent, setOriginalPostContent] = useState("");


    const handleSaveChanges = (postId) => {
        const newData = {
            text: postContent,
            userId: decodedTokenId
        }
        handleEditEndpoint(postId, newData);
        setIsEditing(false);
    };
    const handleEditorChange = (content) => {
        setPostContent(content);
    };

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ];
    const module = {
        toolbar: toolbarOptions
    };
    const editorStyles = {
        height: '150px',
        margin: '10px'
    };


    //part for the reactions
    const [reactions, setReactions] = useState([]);
    const [doneLoading, setDoneLoading] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const handleReactionsClick = () => {
        setShowReactions(!showReactions);
        getAllReactionsForPost(post.id);
    };
    const getAllReactionsForPost = async (postId) => {
        try {
            const response = await api.get(`/reaction/of-post/${postId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setReactions(response.data);
            setDoneLoading(true);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    function getReactionIcon(reaction) {
        let ReactionIcon;
        switch (reaction) {
            case 'Love':
                ReactionIcon = FaHeart;
                break;
            case 'Like':
                ReactionIcon = FaThumbsUp;
                break;
            case 'Sad':
                ReactionIcon = FaSadTear;
                break;
            case 'Laugh':
                ReactionIcon = FaLaughSquint;
                break;
            case 'Angry':
                ReactionIcon = FaAngry;
                break;
            default:
                ReactionIcon = null;
        }
        return ReactionIcon;
    }

    const [isCommentOpen, setIsCommentOpen] = useState(false);
    //reactions actions
    const verifyIfReacted = () => {
        if (doneLoading === true) {
            const result = reactions.filter(x => x.userId === decodedTokenId);
            setReacted(result.length === 0 ? false : true);
        }
    };
    const SetReaction = async (postId) => {
        try {
            const reactionData = new FormData();
            reactionData.append('postId', postId);
            reactionData.append('reaction', 'Love');
            reactionData.append('userId', decodedTokenId);
            await api.post(`/reaction`, reactionData, { headers: { Authorization: `Bearer ${accessToken}` } });
            setReacted(true);
            onUpdateReactions();
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const RemoveReaction = async (postId) => {
        try {
            await api.delete(`/reaction/${postId}?userId=${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setReacted(false);
            onUpdateReactions();
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const [reacted, setReacted] = useState(false);
    const handleClickHeart = () => {
        if (reacted === false) {
            SetReaction(post.id);
        }
        else if (reacted === true) {
            RemoveReaction(post.id);
        }
    };

    useEffect(() => {
        if (decodedTokenId !== "") {
            getAllReactionsForPost(post.id);
            verifyIfReacted();
        }

    }, [decodedTokenId, doneLoading])

    useEffect(() => {
        console.log(post.commentsCount);
    }, [post])
    return (
        <>{isDeleted !== true && post &&
            <Card key={post.id} style={{ margin: '16px', padding: '16px' }}>
                <Box width="100%" display="flex" flexDirection="column" alignItems="center" margin="20px">
                    <Box width="1000px" marginY="40px">
                        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="10px">
                            <Box display="flex" alignItems="center">
                                <Box marginRight="10px">
                                    <Avatar
                                        src={post.profileDTO.profilePicture}
                                        alt="Profile"
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="h6">{post.profileDTO.name}</Typography>
                                    <Typography variant="subtitle2" style={{ color: '#8C8C8C' }}>
                                        {lastEditTimeDiff}
                                    </Typography>
                                </Box>
                            </Box>
                            {post.profileDTO.userId === userId &&
                                <IconButton onClick={handleClick}>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                elevation={0}
                                getContentAnchorEl={null}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                {isEditing ? (
                                    [
                                        <MenuItem
                                            key="cancel"
                                            onClick={() => {
                                                setPostContent(originalPostContent);
                                                setIsEditing(false);
                                                handleClose();
                                            }}
                                        >
                                            Cancel
                                        </MenuItem>
                                    ]
                                ) : (
                                    [
                                        <MenuItem
                                            key="edit"
                                            onClick={() => {
                                                handleClose();
                                                openEditPost(post.text);
                                            }}
                                        >
                                            <EditOutlined style={{ marginRight: '8px' }} />
                                            Edit
                                        </MenuItem>,
                                        <MenuItem
                                            key="delete"
                                            onClick={() => {
                                                handleClose();
                                                handleDelete(post.id);
                                            }}
                                        >
                                            <DeleteOutline style={{ marginRight: '8px' }} />
                                            Delete
                                        </MenuItem>
                                    ]
                                )}
                            </Menu>
                        </Box>

                        {isEditing ? (
                            <>
                                <ReactQuill
                                    modules={module}
                                    value={postContent}
                                    onChange={handleEditorChange}
                                    editorStyles={editorStyles}
                                    theme="snow"
                                    style={{
                                        margin: '20px',
                                        maxWidth: '100%',
                                        cursor: 'text',
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-word'
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSaveChanges(post.id)}
                                >
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Typography
                                variant="body1"
                                style={{
                                    margin: '20px',
                                    maxWidth: '100%',
                                    cursor: 'pointer',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word'
                                }}
                                onClick={handleClickText}
                            >
                                {renderBodyText(post.text)}
                            </Typography>
                        )}
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Box display="flex" alignItems="center">
                                    <IconButton onClick={handleClickHeart} style={{ color: reacted ? 'red' : 'inherit' }}>
                                        <FavoriteBorderOutlined />
                                    </IconButton>
                                    <ButtonBase component="span" onClick={handleReactionsClick}>
                                        {post.reactions.length !== 0 ? post.reactions[0].count : 0} reactions
                                    </ButtonBase>
                                </Box>
                                {showReactions && (
                                    <Dialog
                                        open={handleReactionsClick}
                                        onClose={handleReactionsClick}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                        sx={{
                                            width: '800px',
                                            height: '600px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            margin: 'auto',
                                        }}
                                    >
                                        <DialogTitle id="alert-dialog-title">
                                            {"All the people who reacted to this: "}
                                        </DialogTitle>
                                        <DialogContent>
                                            <Box display="flex" alignItems="center" padding={2} >
                                                {reactions.map((reaction) => {
                                                    const ReactionIcon = getReactionIcon(reaction.reaction);
                                                    return (
                                                        <Box display="flex" alignItems="center" margin={2} key={reaction.id}>
                                                            <Box display="flex" alignItems="center" margin={2} >
                                                                <Avatar src={reaction.user.profilePicture} alt={reaction.user.name} sx={{ width: 40, height: 40, marginRight: 1 }} />
                                                                <Typography variant="body2" sx={{ marginRight: 1 }}>
                                                                    {reaction.user.name}
                                                                </Typography>
                                                                {ReactionIcon && <ReactionIcon sx={{ width: 20, height: 20, margin: 1 }} />}
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </Box>
                            <Box display="flex" alignItems="center" marginLeft={2}>
                                <IconButton onClick={() => {
                                    setIsCommentOpen(!isCommentOpen)
                                }}>
                                    <ChatBubbleOutlineOutlined />
                                </IconButton>
                                <Typography variant="body2">{post.commentsCount} comments</Typography>
                            </Box>

                        </Box>
                    </Box>
                    {
                        isCommentOpen &&
                        <CommentContainer postId={post.id} onSubmit={() => {
                            onChangesOnComments(post.id);
                        }} />
                    }
                </Box>
            </Card>
        }
        </>

    );
}

export default PostContainer;
