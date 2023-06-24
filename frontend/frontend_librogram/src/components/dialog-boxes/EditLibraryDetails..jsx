import React, { useEffect } from "react";
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from "../../API/api";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import jwt_decode from 'jwt-decode';
const EditLibraryDetails = ({ onClose, onSave }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(true);
    const [libraryImage, setLibraryImage] = useState(null);
    const [libraryName, setLibraryName] = useState('');
    const [libraryLocation, setLibraryLocation] = useState('');
    const [libraryDescription, setLibraryDescription] = useState('');
    const [photoDisplayed, setPhotoDisplayed] = useState(null);
    const [libraryId, setLibraryId] = useState("");
    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        onClose();
    };

    const handleSaveChanges = async () => {
        await EditLibraryInfo();

    };


    const handleNameChange = (event) => {
        const newName = event.target.value;
        setLibraryName(newName);
    };

    const handleLocationChange = (event) => {
        const newLocation = event.target.value;
        setLibraryLocation(newLocation);
    };

    const handleDescriptionChange = (event) => {
        const newDescription = event.target.value;
        setLibraryDescription(newDescription);

    };

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
    const LibraryDetails = async () => {
        try {
            const response = await api.get(`/library/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setPhotoDisplayed(response.data.profileImage);
            setLibraryName(response.data.name);
            setLibraryDescription(response.data.description);
            setLibraryLocation(response.data.location);
            setLibraryId(response.data.id);

        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        if (decodedTokenId !== "") {
            LibraryDetails();
        }
    }, [accessToken])

    const EditLibraryInfo = async () => {
        try {
            let libaryInfo = {
                Name: libraryName,
                Location: libraryLocation,
                Description: libraryDescription,
                OwnerId: decodedTokenId,
                File: libraryImage
            }
            const response = await api.patch(`/library/${libraryId}`, libaryInfo, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            onSave(response.data);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const handleBrowseImage = (event) => {
        const file = event.target.files[0];
        setPhotoDisplayed(URL.createObjectURL(file));
        console.log("here");
        if (file) {
            setLibraryImage(event.target.files[0]);
        }
    }

    return (
        <>
            <Modal show={isEditModalOpen} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Library</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img src={photoDisplayed} alt="Library Image" style={{ width: '100%', height: 'auto' }} />
                    </div>
                    {libraryId &&
                        <Form>
                            <Form.Group controlId="libraryName">
                                <Form.Label>Library Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter library name"
                                    value={libraryName}
                                    onChange={handleNameChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="libraryLocation">
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter library location"
                                    value={libraryLocation}
                                    onChange={handleLocationChange}
                                />
                            </Form.Group>
                            Browse Image
                            <input
                                type="file"
                                onChange={handleBrowseImage}
                                className='form-control my-2'
                                id='photo'
                                name='path'
                                placeholder='Choose Your Photo'
                            />
                            <Form.Group controlId="libraryDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter library description"
                                    rows={3}
                                    value={libraryDescription}
                                    onChange={handleDescriptionChange}
                                />
                            </Form.Group>

                        </Form>
                    }
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

export default EditLibraryDetails;