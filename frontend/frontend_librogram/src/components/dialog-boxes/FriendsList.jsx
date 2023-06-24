import React from "react";
import { useState } from 'react';
import { Box, Avatar } from '@mui/material';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useEffect } from "react";
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";

const FriendsList = ({ onClose, userId }) => {
    const { instance, inProgress, accounts } = useMsal();
    const [decodedTokenId, setDecodedTokenId] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [friends, setFriends] = useState([]);
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

    const GetFriends = async () => {
        try {
            const response = await api.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setFriends(response.data.friends);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(true);

    //for each time the accessToken is re-rendered
    useEffect(() => {
        GetFriends();
    }, [accessToken]);

    const handleFriendsModalClose = () => {
        setIsFriendsModalOpen(false);
        onClose(); 
    };

    const CallEndpointForRemovalOfFriend = async (friendId) => {
        try {
            const response = await api.patch(`/user/follow?option=false&userId=${friendId}&personalId=${userId}`, null,{ headers: { Authorization: `Bearer ${accessToken}` } });
            const updatedFriendList = JSON.parse(JSON.stringify(friends)); 
            const filteredFriends = updatedFriendList.filter((user) => user.userId !== friendId);
            setFriends(filteredFriends);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const removeFriend = (friendId) => {
        CallEndpointForRemovalOfFriend(friendId);
    }
    return (
        <Modal show={isFriendsModalOpen} onHide={handleFriendsModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Friends: {friends.length}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {friends.length > 0 && friends.map((friend) => (
                        <ListGroup.Item key={friend.userId}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <Avatar src={friend.profilePhoto} className="me-3" />
                                    <span style={{ marginRight: '10px' }}>{friend.name}</span>
                                </Box>
                                {decodedTokenId === userId &&
                                    <Button variant="danger" onClick={() => removeFriend(friend.userId)}>Remove</Button>
                                }
                            </Box>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleFriendsModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    );
}

export default FriendsList;