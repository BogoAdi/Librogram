import React from "react";
import { useState } from 'react';
import { Box, Avatar } from '@mui/material';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useEffect } from "react";
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";
const FollowersList = ({ onClose, userId }) => {
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
            const response = await api.get(`/user/${userId}`, null, { headers: { Authorization: `Bearer ${accessToken}` } });
            setFriends(response.data.friends);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(true);

    //for each time the accessToken is re-randered
    useEffect(() => {
        GetFriends();
    }, [accessToken]);


    const handleFollowersModalClose = () => {
        setIsFollowersModalOpen(false);
        onClose();
    };
    return (
        <Modal show={isFollowersModalOpen} onHide={handleFollowersModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Followers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {friends &&
                        friends.map((friend) => (
                            <ListGroup.Item>
                                <Box display="flex" alignItems="center">
                                    <Avatar src="https://via.placeholder.com/50" className="me-3" />
                                    <span>User 1</span>
                                </Box>
                            </ListGroup.Item>
                        ))
                    }
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleFollowersModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    );
}

export default FollowersList;