import React from "react";
import BorrowingsTable from "./BorrowingsTable";
import Sidebar from "../Sidebar";
import { useState, useEffect } from "react";
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { v4 as uuidv4 } from 'uuid';
import api from "../../API/api";

const MyLibraryBorrowings = ({ id }) => {
    const [borrowings, setBorrowings] = useState(null);
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

    const GetBorrowingsFromLibrary = async () => {
        try {
            const response = await api.get(`/library/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setBorrowings(response.data.borrowings);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        if (decodedTokenId !== "") {
            GetBorrowingsFromLibrary();
        }
    }, [accessToken]);


    const [key, setKey] = useState(uuidv4());
    const updateRows = (updatedRows) => {
        console.log(updatedRows);
        const _ = require('lodash');
        const updatedBorrowings = _.cloneDeep(updatedRows);
        setBorrowings(updatedBorrowings);
        const uniqueId = uuidv4();
        setKey(uniqueId);
        console.log('borrowings:', Object.is(borrowings, updatedBorrowings));
    };
    const updateStates = async () => {
        const result = await api.get(`/library/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
        const newSetBorrowings = result.data.borrowings;
        let clone = JSON.parse(JSON.stringify(newSetBorrowings));
        setBorrowings(clone);
        console.log(clone);
        const uniqueId = uuidv4();
        setKey(uniqueId);
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-2">
                    <div className="position-fixed">
                        <Sidebar />
                    </div>
                </div>
                {borrowings !== null &&
                    <div className="col-lg-10">
                        <div className="px-5 ps-lg-5 my-1">
                            <div className="text-center mt-5 mb-2">
                                <BorrowingsTable key={key} rows={borrowings} userId={decodedTokenId} onUpdateRows={updateRows} onUpdatedState={updateStates} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default MyLibraryBorrowings;