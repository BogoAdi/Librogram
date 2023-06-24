import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CardMedia, Box } from "@mui/material";
import {  Toolbar, Container, InputBase, CardActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from '../API/api';
const People = () => {
    const [users, setUsers] = useState([]);
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

    const GetLibraryInfo = async () => {
        try {
            const response = await api.get(`/user`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setUsers(response.data);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        if (decodedTokenId !== "") {
            GetLibraryInfo();
            console.log(users);
        }
    }, [accessToken]);
    const [hoveredCard, setHoveredCard] = useState(null);

    const handleCardHover = (friendIndex) => {
        setHoveredCard(friendIndex);
    };

    const handleCardLeave = () => {
        setHoveredCard(null);
    };
    const [friends, setFriends] = useState([]);
    const GetPersonalUserDetails = async (userId) => {
        try {
            const response = await api.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setFriends(response.data.friends);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };
    useEffect(() => {
        if (decodedTokenId !== "") {
            GetPersonalUserDetails(decodedTokenId);
        }
    }, [accessToken])

    const SetAsFriend = async (option, person) => {
        try {

            const response = await api.patch(`/user/follow?option=${option}&userId=${person.id}&personalId=${decodedTokenId}`, null,
                { headers: { Authorization: `Bearer ${accessToken}` } });
            if (response.data === true) {
                const updatedFriendList = JSON.parse(JSON.stringify(friends)); 
                if (option === true) {
                    const updatedPerson = { ...person, userId: person.id };
                    updatedFriendList.push(updatedPerson);
                    setFriends(updatedFriendList);
                }
                else {
                    const newFriendList = updatedFriendList.filter((user) => user.userId !== person.id);
                    setFriends(newFriendList);
                }

            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    const isThisUserFriend = (id) => {
        if (friends.find(x => x.userId === id)) {
            return true;
        } else
            return false;
    }
    useEffect(() => {
        console.log(friends)
    }, [friends])
    const emptyGuid = '00000000-0000-0000-0000-000000000000';

    //search part
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    const usersToShow = users
        .filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name - b.name;
            } else if (sortOrder === 'desc') {
                return b.name - a.name;
            } else {
                return 0;
            }
        });


    return (
        <>
            <div className="overflow-hidden">
                <div className="row">
                    <div className="col-2">
                        <div className="position-fixed col-lg-2">
                            <Sidebar />
                        </div>
                    </div>
                    {users &&
                        <div className="col-lg-10">
                            <div className="px-5 ps-lg-5 my-1">
                                <div className="text-center mt-5 mb-2">
                                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                                        <Toolbar style={{ flexWrap: 'wrap' }}>
                                            <Typography variant="h6" color="inherit" noWrap style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>

                                            </Typography>
                                            <div style={{ position: 'relative', borderRadius: '4px', backgroundColor: '#fff', marginRight: '16px', marginLeft: '0', width: '100%', minWidth: '200px', maxWidth: '400px' }}>
                                                <div style={{ padding: '8px', height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <SearchIcon />
                                                </div>
                                                <InputBase
                                                    placeholder="Search…"
                                                    style={{ paddingLeft: '40px', width: '100%', minWidth: '200px', maxWidth: '400px' }}
                                                    inputProps={{ 'aria-label': 'search' }}
                                                    onChange={handleSearch}
                                                />
                                            </div>
                                        </Toolbar>
                                        <Container maxWidth="lg" style={{ marginTop: '24px', marginBottom: '24px' }}>
                                            <Box mb={2}>
                                                <Typography variant="h6" >
                                                    <span>Total People ({usersToShow.length})</span>
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={4}>
                                                {usersToShow.map((friend, index) => (
                                                    <Grid item key={index} xs={12} sm={6} md={4}>
                                                        <Card
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                height: '100%',
                                                                transition: 'all 0.2s ease-in-out',
                                                                transform: hoveredCard === index ? 'scale(1.1)' : '',
                                                            }}
                                                            onMouseEnter={() => handleCardHover(index)}
                                                            onMouseLeave={handleCardLeave}
                                                        >
                                                            <CardMedia
                                                                style={{
                                                                    paddingTop: '50%',
                                                                    width: '200px',
                                                                    margin: 'auto',
                                                                }}
                                                                image={friend.profilePicture}
                                                            />
                                                            <CardContent style={{ flexGrow: 2 }} sx={{ flexDirection: 'column', display: 'flex', alignItems: 'center' }} >
                                                                <Box sx={{ display: 'flex', alignContent: 'center' }}>
                                                                    <Typography gutterBottom variant="h5" component="h2"  >
                                                                        {friend.name}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    {friend.email}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    Number of Favourite Books: {friend.numberOfFavouriteBooks}
                                                                </Typography>
                                                            </CardContent>
                                                            <CardActions
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    margin: '15px'
                                                                }}
                                                            >
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    Friends: {friend.numberOfFriends}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    Total Borrows: {friend.booksBorrowed}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    Posts: {friend.numberOfPosts}
                                                                </Typography>
                                                            </CardActions>
                                                            <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Link to={friend.personalLibraryId !== emptyGuid ? `/library-navigation/${friend.personalLibraryId}` : '#'}
                                                                    style={{ textDecoration: 'none', display: 'flex' }}>
                                                                    <button disabled={friend.personalLibraryId === emptyGuid}
                                                                        className="btn btn-danger"
                                                                    >See His Library</button>
                                                                </Link>
                                                                {friends && isThisUserFriend(friend.id) === false &&
                                                                    <button className="btn btn-success" onClick={() => SetAsFriend(true, friend)}>
                                                                        <i className="bi bi-person-plus"></i>
                                                                    </button>
                                                                }
                                                                {friends && isThisUserFriend(friend.id) &&
                                                                    <button className="btn btn-danger" onClick={() => SetAsFriend(false, friend)}>
                                                                        <i className="bi bi-person-dash-fill"></i>
                                                                    </button>
                                                                }
                                                                <Link to={`/profile/${friend.id}`} style={{ textDecoration: 'none' }} >
                                                                    <button className="btn btn-dark" size="small" style={{ marginLeft: 'auto' }}>
                                                                        See Profile
                                                                    </button>
                                                                </Link>
                                                            </CardActions>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Container>
                                    </div >
                                </div>
                            </div>
                        </div>
                    }
                </div >
            </div >
        </>
    );
}
export default People;
