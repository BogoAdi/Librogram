import React, { useEffect } from "react";
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from "../../API/api";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import jwt_decode from 'jwt-decode';

const EditProfileInfo = ({ onClose, onSave }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(true);
    const [profileImage, setProfileImage] = useState('https://via.placeholder.com/750x400');
    const [profileName, setProfileName] = useState('');
    const [photoDisplayed, setPhotoDisplayed] = useState();
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

    const UserDetails = async () => {
        try {
            const response = await api.get(`/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setPhotoDisplayed(response.data.profilePicture);
            setProfileName(response.data.name);
            setLoading(false);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const [loading, setLoading] = useState(false);
    const EditUserInfo = async () => {
        try {
            console.log(profileImage);
            const formData = new FormData();
            if (profileImage !== undefined)
                formData.append('File', profileImage);
            formData.append('Name', profileName);

            const response = await api.patch(`/user/${decodedTokenId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            onSave(); 
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        if (decodedTokenId !== "") {
            UserDetails();
        }
    }, [accessToken])

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        onClose(); 
    };

    const handleSaveChanges = () => {
        EditUserInfo()
        setIsEditModalOpen(false);
       
    };

    const handleNameChange = (event) => {
        const newName = event.target.value;
        setProfileName(newName);
    };



    const handleBrowseImage = (event) => {
        const file = event.target.files[0];
        setPhotoDisplayed(URL.createObjectURL(file));
        console.log("here");
        if (file) {
            setProfileImage(event.target.files[0]);
        }
    }

    useEffect(() => {
        console.log(photoDisplayed);
    }, [photoDisplayed])
    return (
        <>

            <Modal show={isEditModalOpen} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <img src={photoDisplayed} alt="ProfilePic" style={{ width: '100%', height: 'auto' }} />
                        </div>
                    }

                    <Form>
                        Browse Image
                        <input
                            type="file"
                            onChange={handleBrowseImage}
                            className='form-control my-2'
                            id='photo'
                            name='path'
                            placeholder='Choose Your Photo'
                        />
                        <Form.Group controlId="userName">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter new user name"
                                value={profileName}
                                onChange={handleNameChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditProfileInfo;