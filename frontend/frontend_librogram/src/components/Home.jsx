import React from 'react';

import Sidebar from './Sidebar';
import api from "../API/api";
import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import axios from "axios";
import { Avatar, Box } from "@mui/material";
import jwt_decode from 'jwt-decode';
import { Card, CardContent, Typography } from '@mui/material';
import PostContainer from './Post';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CircularProgress from '@mui/material/CircularProgress';
import { Alert, AlertTitle } from '@mui/material';
const Home = () => {

  const [posts, setPosts] = useState([]);
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

  const [newUser, setNewUser] = useState(false);
  const [graphData, setGraphData] = useState({});
  const [pic, setPic] = useState(".");
  function RequestProfileData(ApiName) {
    const accessTokenRequestG = {
      scopes: ["User.Read", "openid", "profile"],
      account: accounts[0],
    };
    if (inProgress === InteractionStatus.None) {
      instance
        .acquireTokenSilent(accessTokenRequestG)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          ApiName({ accessToken }).then((response) => {
            return response;
          });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect(accessTokenRequestG);
          }
          console.log(error);
        });

    }

  }
  const FetchProfileInfo = async ({ accessToken }) => {
    try {
      const response = await axios.get('https://graph.microsoft.com/v1.0/me', { headers: { Authorization: `Bearer ${accessToken}` } });
      console.log(response.data);
      setGraphData(response.data);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);
      }
    }
  }
  const FetchImage = async ({ accessToken }) => {
    try {
      const response = await axios.get('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: { Authorization: `Bearer ${accessToken}` }, responseType: 'blob'
      }).then(o => {
        const blob = response.data;
        const formData = new FormData();
        formData.append('file', blob, 'photo.jpg');
        setPic(formData);

      });
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        setPic("..");
      } else {
        console.log(`Error: ${err.message}`);
        setPic("..");
      }
    }
  }
  const [userInfo, setUserInfo] = useState({});
  const GetUserInfo = async () => {
    if (decodedTokenId !== "") {
      try {
        const response = await api.get(`/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
        console.log(response.status);
        setUserInfo(response.data);
        setIsLoading(false);
      } catch (err) {
        if (err.response.status === 404) {
          console.log("404");
          RequestProfileData(FetchProfileInfo)
          RequestProfileData(FetchImage)
          setNewUser(true);
        } else {
          console.log("aici");
          setApiError(true);
        }
      }
    }
  }

  useEffect(() => {
    if (newUser && graphData !== {} && accessToken && pic !== ".") {
      let user = {
        Id: decodedTokenId,
        Name: graphData.displayName,
        Email: graphData.mail,
        File: pic
      }
      console.log(user.Email);
      if (user.pic === ".." || user.pic === ".") {
        user.File = null;
      }
      if (user.Email !== undefined) {
        CreateNewUser(user);
      }

    }

  }, [newUser, pic, graphData, accessToken]);
  useEffect(() => {
    GetUserInfo();
  }, [instance, accounts, inProgress, decodedTokenId])




  const CreateNewUser = async (user) => {
    console.log("getUserId: " + decodedTokenId);
    console.log(user);
    try {
      const response = await api.post(`/user`, user, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.status);
      setUserInfo(response.data);
      setApiError(false);
      setIsLoading(false);
    } catch (err) {
      console.log("error while saving");
      console.log(user);
      setApiError(true);
    }
  }


  useEffect(() => {
    GetPosts();
  }, [instance, accounts, inProgress, userInfo])

  const GetPosts = async () => {
    if (decodedTokenId !== "") {
      try {
        const response = await api.get(`/api/posts`, { headers: { Authorization: `Bearer ${accessToken}` } });
        console.log(response.status);
        setPosts(response.data);
        setApiError(false);
        return response.data;
      } catch (err) {
        if (err.response) {
          setApiError(true);
        } else {
          setApiError(true);
        }
      }
    }
  }
  const [postContent, setPostContent] = useState("");

  const handleEditorChange = (content) => {
    setPostContent(content);
  };

  const handlePostSubmit = async () => {
    const result = await CreatePost();
    const newPost = await getPostById(result.id);
    let clone = JSON.parse(JSON.stringify(posts));
    clone.unshift(newPost);
    setPosts(clone);
    console.log(clone);
  };
  const CreatePost = async () => {
    try {
      const post = {
        userId: decodedTokenId,
        text: postContent
      };
      const response = await api.post(`/api/posts`, post, { headers: { Authorization: `Bearer ${accessToken}` } });
      setPostContent("");
      setApiError(false);
      return response.data;
    } catch (err) {
      if (err.response) {
        setApiError(true);

      } else {
        setApiError(true);
      }
    }
  }

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
      setApiError(false);
      return response.data;
    } catch (err) {
      if (err.response) {
        console.log(err.message);
        setApiError(true);
      } else {
        setApiError(true);
      }
    }
  }
  const handleChangesFromComments = async (postId) => {
    try {
      const newVal = await getPostById(postId);
      const updatedPosts = JSON.parse(JSON.stringify(posts));
      const index = updatedPosts.findIndex((post) => post.id === postId);
      setApiError(false);
      if (index !== -1) {
        updatedPosts[index] = newVal;
        setPosts(updatedPosts);
      }
    } catch (error) {
      setApiError(true);
    }
  }
  const handlePostReacted = async (postId) => {
    try {
      const newVal = await getPostById(postId);
      const updatedPosts = JSON.parse(JSON.stringify(posts));
      const index = updatedPosts.findIndex((post) => post.id === postId);
      setApiError(false);
      if (index !== -1) {
        updatedPosts[index] = newVal;
        setPosts(updatedPosts);
      }
    } catch (error) {
      setApiError(true);
    }
  }
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  return (
    <>
      {isLoading === true ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <CircularProgress />
        </Box >
      ) :
        (
          <div className="overflow-hidden">
            <div className="col-2">
              <div className="position-fixed">
                <Sidebar />
              </div>
            </div>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box display="flex" flexDirection="column" alignItems="center" width="1000px">
                <Card style={{ margin: '16px', padding: '16px', maxWidth: '1300px' }}>
                  <Box display="flex" alignItems="center">
                    <Box marginRight="10px">
                      <Avatar src={userInfo.profilePicture} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6">{userInfo.name}</Typography>
                      <Typography variant="subtitle2" style={{ color: '#8C8C8C' }}>{userInfo.email}</Typography>
                    </Box>
                  </Box>
                  <CardContent>
                    <ReactQuill
                      modules={module}
                      value={postContent}
                      onChange={handleEditorChange}
                      placeholder="Write something..."
                      theme='snow'
                    />
                    <Box display="flex" justifyContent="flex-end" marginTop="16px">
                      <button className="btn btn-success" onClick={handlePostSubmit}>
                        Post
                      </button>
                    </Box>
                  </CardContent>
                </Card>
                {posts !== null && decodedTokenId !== "" ? (
                  posts.map((post) => (
                    <PostContainer key={post.id} post={post} userId={decodedTokenId} onUpdatePost={handleUpdatePost} onUpdateReactions={() => handlePostReacted(post.id)} onChangesOnComments={() => handleChangesFromComments(post.id)} />
                  ))
                ) : (
                  <Typography variant="body1">No posts available.</Typography>
                )}
              </Box>
            </Box>
          </div>

        )}
      {apiError &&
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <strong>Could not retrive data from the api</strong>
        </Alert>
      }
    </>

  );
}


export default Home;