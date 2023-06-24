import React from "react";
import { useState } from 'react';
import { Box, Avatar } from '@mui/material';
import { Modal, Button, ListGroup } from 'react-bootstrap';

import { useEffect } from "react";
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";
const FavouriteBooks = ({ onClose, userId }) => {
    const { instance, inProgress, accounts } = useMsal();
    const [decodedTokenId, setDecodedTokenId] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [books, setBooks] = useState([]);
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

    const GetBooks = async () => {
        try {
            const response = await api.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setBooks(response.data.favouriteBooks);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const [isBooksModalOpen, setIsBooksModalOpen] = useState(true);

    //for each time the accessToken is re-rendered
    useEffect(() => {
        GetBooks();
    }, [accessToken]);

    const handleBooksModalClose = () => {
        setIsBooksModalOpen(false);
        onClose();
    };
    const CallEndpointForRemovalOfBook = async (bookId) => {
        try {
            const response = await api.patch(`/book/set-as-favourite?option=false&bookId=${bookId}&personalId=${userId}`, null, { headers: { Authorization: `Bearer ${accessToken}` } });
            const updatedBookList = JSON.parse(JSON.stringify(books));
            const filterlist = updatedBookList.filter((book) => book.uniqueBookId !== bookId);
            setBooks(filterlist);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    const removeFromFavs = (bookId) => {
        CallEndpointForRemovalOfBook(bookId);
    }
    useEffect(() => {
        console.log(decodedTokenId);
        console.log(userId);
    }, [decodedTokenId])
    return (
        <Modal show={isBooksModalOpen} onHide={handleBooksModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Favourite Books {books.length}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {books.length > 0 && books.map((book) => (
                        <ListGroup.Item key={book.id}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <Avatar src={book.picture} className="me-3" />
                                    <span style={{ marginRight: '10px' }}> {book.title}</span>
                                    <span style={{ marginRight: '10px' }}> {book.author}</span>
                                </Box>
                                {decodedTokenId === userId &&
                                    <Button variant="danger" onClick={() => removeFromFavs(book.uniqueBookId)}>Remove</Button>
                                }
                            </Box>
                        </ListGroup.Item>
                    ))}
                </ListGroup >
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleBooksModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    );
}

export default FavouriteBooks;