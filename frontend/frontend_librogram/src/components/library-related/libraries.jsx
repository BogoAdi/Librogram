import React from "react";
import { Card, CardContent, CardMedia, Typography, Grid, TextField} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";

const Libraries = () => {
    const [libraries, setLibraries] = useState([]);
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

    const GetAllLibraries = async () => {
        try {
            const response = await api.get(`/library`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setLibraries(response.data);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        if (decodedTokenId !== "") {
            GetAllLibraries();
        }
    }, [accessToken]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [page, setPage] = useState(1);
    const librariesPerPage = 6;

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const SearchClicked = (event) => {
        setFilter(event.target.value);
    };

    const handleSort = (event) => {
        setSortOrder(event.target.value);
    };

    const librariesToShow = libraries
        .filter((library) =>
            library.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((library) => {
            if (filter === '') {
                return true;
            }
            return library.location === filter;
        })
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.books - b.books;
            } else if (sortOrder === 'desc') {
                return b.books - a.books;
            } else {
                return 0;
            }
        });

    const startIndex = (page - 1) * librariesPerPage;
    const endIndex = startIndex + librariesPerPage;
    const librariesToShowOnPage = librariesToShow.slice(startIndex, endIndex);


    const [follwoedLibs, setFollowLibs] = useState([]);
    const GetPersonalUserDetails = async (userId) => {
        try {
            const response = await api.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setFollowLibs(response.data.followedLibraries);
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        if (decodedTokenId !== "") {
            GetPersonalUserDetails(decodedTokenId);
        }
    }, [accessToken])
    useEffect(() => {
        console.log(follwoedLibs);
    }, [follwoedLibs])
    const FollowLib = async (option, library) => {
        try {

            const response = await api.patch(`/library/follow?option=${option}&libraryId=${library.id}&personalId=${decodedTokenId}`, null,
                { headers: { Authorization: `Bearer ${accessToken}` } });
            if (response.data === true) {
                const updatedFollowedList = JSON.parse(JSON.stringify(follwoedLibs)); // Deep copy of the libraries array
                if (option === true) {
                    const updatedLib = { ...library };
                    updatedFollowedList.push(updatedLib);
                    setFollowLibs(updatedFollowedList);
                }
                else {
                    const newFollowedLibs = updatedFollowedList.filter((lib) => lib.id !== library.id);
                    setFollowLibs(newFollowedLibs);
                }

            }
        } catch (error) {
            // Handle error
            console.log(`Error: ${error.message}`);
        }
    };

    const isThisLibFollowed = (id) => {
        if (follwoedLibs.find(x => x.id === id)) {
            return true;
        } else
            return false;
    }
    return (
        <>
            <div style={{ position: 'relative', minHeight: 'calc(100vh - 240px)' }}>
                <div style={{ top: 0, left: 0, width: '100%', marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 }}>
                    <Typography variant="h2" component="h2" style={{ textAlign: 'center' }}>
                        Available Libraries
                    </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px auto', maxWidth: '1200px' }}>
                    <div>
                        <TextField
                            id="search"
                            label="Search"
                            variant="outlined"
                            size="small"
                            style={{ marginRight: 10 }}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <Grid style={{ margin: '20px auto', maxWidth: '1200px' }} container spacing={2}>
                    {librariesToShow.slice((page - 1) * librariesPerPage, page * librariesPerPage).map((library) => (
                        <Grid item xs={12} sm={6} md={4} key={library.id}>
                            <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', marginBottom: '20px' }}>
                                <CardMedia style={{ height: 300, margin: '10px' }} image={library.profileImage} title={library.name} />
                                <CardContent style={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="h2" gutterBottom>
                                        {library.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                        {library.location}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Books: {library.numberOfBooks}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Followers: {library.numberofFollowers}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        TotalBorrowings: {library.totalBorrowings}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Description: {library.description}
                                    </Typography>
                                </CardContent>
                                <div className="d-flex justify-content-between" style={{ alignItems: 'center', margin: '10px' }}>
                                    <Link to={`/library-navigation/${library.id}`} style={{ textDecoration: 'none' }} >
                                        <button className="btn btn-dark">
                                            See Library
                                        </button>
                                    </Link>
                                    {follwoedLibs && isThisLibFollowed(library.id) === false &&
                                        <button className="btn btn-success" onClick={() => FollowLib(true, library)}>
                                            <i className="bi bi-person-plus"></i>
                                            Follow
                                        </button>
                                    }
                                    {follwoedLibs && isThisLibFollowed(library.id) &&
                                        <button className="btn btn-danger" onClick={() => FollowLib(false, library)}>
                                            <i className="bi bi-person-dash-fill"></i>
                                            Unfollow
                                        </button>
                                    }
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid >
                <div style={{ position: 'relative', bottom: 0, left: 0, width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                        <Pagination
                            count={Math.ceil(librariesToShow.length / librariesPerPage)}
                            page={page}
                            onChange={handleChangePage}
                        />
                    </div>
                </div>
            </div >
        </>
    );
}
export default Libraries;