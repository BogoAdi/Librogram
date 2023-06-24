import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";

import api from "../../API/api";
import BookItem from './BookItem';
import { Box, CircularProgress, Alert, AlertTitle } from "@mui/material"
const BooksDisplayed = () => {
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

    const GetAllBooks = async () => {
        try {
            const response = await api.get(`/book?takeDublicates=true`, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log(response.status);
            setAllBooks(response.data);
            setIsLoading(false);
            setApiError(false);
        } catch (error) {
            console.log(`Error: ${error.message}`);
            setApiError(true);
        }
    };
    const [allBooks, setAllBooks] = useState([]);
    const [bookName, setBookName] = useState('');
    const [apiError, setApiError] = useState(false);
    const SearchBookByName = async (title) => {
        try {
            const response1 = await api.get(`/book/search-by-title?title=${title}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            const response2 = await api.get(`/book/search-by-author?author=${title}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            const bookSet = new Set([...response1.data, ...response2.data]);
            const allBooks = Array.from(bookSet);
            setAllBooks(allBooks);
            setIsLoading(false);
            setBookName("");
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    function validateAndSearch(e) {
        setIsLoading(true);
        e.preventDefault();
        if (bookName === "")
            GetAllBooks();
        SearchBookByName(bookName);
    }

    useEffect(() => {
        GetAllBooks();
    }, [accessToken]);
    const [isLoading, setIsLoading] = useState(true);
    return (
        <>
            <div className="row">
                <div className="col-2">
                    <div className="position-fixed">
                        <Sidebar />
                    </div>
                </div>
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
                        <div className="col-10 px-lg-5 px-2 my-3">
                            <div >
                                <input onChange={(e) => { setBookName(e.target.value) }} type="search" className='form-control d-inline my-4 col-md-3' placeholder='Enter Book or Author Name  ...' name="name" id="name" />
                                <button onClick={validateAndSearch} className='btn btn-danger text-white d-inline-block ms-3 h-50'>search</button>
                            </div>
                            <div className="row">
                                {allBooks.length ? allBooks.map((book, index) => (
                                    <BookItem key={index} book={book} />
                                )) : <div className="text-center fs-4 fw-bold">No Books Found</div>}
                            </div>
                        </div>
                    )
                }
                {apiError &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Could not retrive data from the api — <strong>check it out!</strong>
                    </Alert>
                }
            </div>

        </>
    );
}
export default BooksDisplayed;