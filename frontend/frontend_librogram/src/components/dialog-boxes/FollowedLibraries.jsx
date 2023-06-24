import React from "react";
import { useState } from 'react';
import { Box, Avatar } from '@mui/material';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useEffect } from "react";
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";
const FollowedLibraries = ({ onClose, userId }) => {
    const { instance, inProgress, accounts } = useMsal();
    const [decodedTokenId, setDecodedTokenId] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [libraries, setLibraries] = useState([]);
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

    const GetLibraries = async () => {
        try {
            const response = await api.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setLibraries(response.data.followedLibraries);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    const [isLibrariesModalOpen, setIsLibrariesModalOpen] = useState(true);

    //for each time the accessToken is re-rendered
    useEffect(() => {
        GetLibraries();
    }, [accessToken]);

    const handleFollowedLibsModalClose = () => {
        setIsLibrariesModalOpen(false);
        onClose(); // Call the onClose function provided by the parent component
    };
    const CallEndpointForUnfollowLib = async (libId) => {
        try {
            const response = await api.patch(`/library/follow?option=false&libraryId=${libId}&personalId=${userId}`,null, { headers: { Authorization: `Bearer ${accessToken}` } });
            const upadtedLibList = JSON.parse(JSON.stringify(libraries)); // Deep copy of the libraries array
            const filteredLibs = upadtedLibList.filter((lib) => lib.id !== libId);
            setLibraries(filteredLibs);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    const unFollowLib = (libId) => {
        CallEndpointForUnfollowLib(libId);
    }
    return (
        <Modal show={isLibrariesModalOpen} onHide={handleFollowedLibsModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Followed Libraries {libraries.length}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {libraries.length > 0 && libraries.map((lib) => (
                        <ListGroup.Item key={lib.id}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <Avatar src={lib.profileImage} className="me-3" />
                                    <span style={{ marginRight: '10px' }}>{lib.name}</span>
                                </Box>
                                {decodedTokenId === userId &&
                                    <Button variant="danger" onClick={() => unFollowLib(lib.id)}>Remove</Button>
                                }
                            </Box>
                        </ListGroup.Item>
                    ))}
                </ListGroup >
            </Modal.Body >
            <Modal.Footer>
                <Button variant="secondary" onClick={handleFollowedLibsModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal >

    );
}

export default FollowedLibraries;