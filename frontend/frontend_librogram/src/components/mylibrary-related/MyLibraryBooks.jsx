import React from "react";
import Sidebar from "../Sidebar";
import BooksTable from "./BooksTable";
import { useState, useEffect } from "react";
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { v4 as uuidv4 } from 'uuid';
import api from "../../API/api";
import cloneDeep from 'lodash/cloneDeep';

const MyLibraryBooks = () => {
    const [books, setBooks] = useState([]);
    const { instance, inProgress, accounts } = useMsal();
    const [decodedTokenId, setDecodedTokenId] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [libraryId, setLibraryId] = useState(null);
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

    const GetBookFromLibrary = async () => {
        try {
            const response = await api.get(`/library/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setLibraryId(response.data.id);
            setBooks(response.data.books);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        if (decodedTokenId !== "") {
            GetBookFromLibrary();
        }
    }, [accessToken]);


    const [key, setKey] = useState(uuidv4());
    const updateRows = (updatedRow) => {
        console.log(updatedRow);
        const newObject = [];
        const obj = JSON.parse(updatedRow);
        console.log(obj.uniqueBookId);
        for (let i = 0; i < books.length; i++) {
            if (books[i].uniqueBookId === obj.uniqueBookId)
                newObject.push(obj);
            else
                newObject.push(books[i]);
        }
        console.log(newObject);
        const deepCopyNewBooks = JSON.parse(JSON.stringify(newObject));
        console.log(deepCopyNewBooks);
        setBooks(deepCopyNewBooks);
        const uniqueId = uuidv4();
        setKey(uniqueId);
    };
    const deleteRows = (rows) => {
        console.log(rows);
        const _ = require('lodash');
        const updatedRowBooks = _.cloneDeep(rows);
        setBooks(updatedRowBooks);
        const uniqueId = uuidv4();
        setKey(uniqueId);
        console.log('books:', Object.is(books, updatedRowBooks));
        console.log(books);
    };
    const addBook = (book) => {
        const _ = require('lodash');
        let clone = _.cloneDeep(books);
        clone.unshift(book);
        setBooks(clone);
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-2">
                    <div className="position-fixed">
                        <Sidebar />
                    </div>
                </div>
                {books.length !== 0 &&
                    <div className="col-lg-10">
                        <div className="px-5 ps-lg-5 my-1">
                            <div className="text-center mt-5 mb-2">
                                <BooksTable key={key}
                                    rows={books}
                                    onUpdateRows={updateRows}
                                    userId={decodedTokenId}
                                    onDeleteRows={deleteRows}
                                    onSave={addBook}
                                    libraryId={libraryId} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default MyLibraryBooks;