import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { motion } from "framer-motion";

import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";

import api from "../../API/api";
import BookItem from '../book-realted/BookItem';
import { useParams } from 'react-router-dom';
const LibraryBooks = () => {
    const { id } = useParams();

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
            const response = await api.get(`/from/library/${id}?isExtended=true`, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log(response.status);
            setAllBooks(response.data);
            setLoading(false);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    const [allBooks, setAllBooks] = useState([]);
    const [bookName, setBookName] = useState('');
    const [loading, setLoading] = useState(false);

    const SearchBookByName = async (title) => {
        try {
            const response1 = await api.get(`/book/search-by-title?title=${title}&library-id=${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            const response2 = await api.get(`/book/search-by-author?author=${title}&library-id=${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            const bookSet = new Set([...response1.data, ...response2.data]);
            const allBooks = Array.from(bookSet);

            console.log(allBooks);
            setAllBooks(allBooks);
            setLoading(false);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    function validateAndSearch(e) {
        e.preventDefault();
        SearchBookByName(bookName);
    }

    useEffect(() => {
        GetAllBooks();
    }, [accessToken]);
    return (
        <>
            <div className="row">
                <div className="col-2">
                    <div className="position-fixed ">
                        <Sidebar />
                    </div>
                </div>
                <div className="col-10 px-lg-5 px-2 my-3">
                    <motion.span initial={{ y: -150 }} animate={{ y: 0 }} transition={{ delay: 0.8, duration: 1 }} className='mx-auto pe-5 pe-lg-0 p d-flex align-items-center justify-content-center'>
                        <input onChange={(e) => { setBookName(e.target.value) }} type="search" className='form-control d-inline my-4' placeholder='Enter Book or Author Name ...' name="name" id="name" />
                        <button onClick={validateAndSearch} className='btn btn-danger text-white d-inline-block ms-3 h-50'>search</button>
                    </motion.span>
                    <div className="row">
                        {allBooks.length ? allBooks.map((book, index) => (
                            <BookItem key={index} book={book} />
                        )) : <div className="text-center fs-4 fw-bold">No Books Found</div>}
                    </div>
                </div>
            </div>
        </>
    );
}
export default LibraryBooks;