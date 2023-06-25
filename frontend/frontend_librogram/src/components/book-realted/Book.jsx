import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";

import { Snackbar, Alert } from '@mui/material';
export default function Book() {
  const [bookData, setBookData] = useState(null);
  const [duration, setDuaration] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { instance, inProgress, accounts } = useMsal();
  const [decodedTokenId, setDecodedTokenId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [isThisBookFav, setIsThisBookFav] = useState(false);
  const [retriveAccessToken, setRetriveAccessToken] = useState(false);
  useEffect(() => {
    const acquireAccessToken = async () => {
      const accessTokenRequest = {
        scopes: ["api://41fef766-32af-4ef8-9e15-13f2ca714ea8/UserImpersonation"],
        account: accounts[0],
      };
      console.log("here");
      if (inProgress === InteractionStatus.None) {
        try {
          const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
          const token = accessTokenResponse.accessToken;
          console.log(accessTokenResponse.accessToken);
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
  }, [instance, inProgress, accounts, decodedTokenId, retriveAccessToken]);

  const GetBookData = async () => {
    try {
      const response = await api.get(`/book/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setBookData(response.data);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };
  const borrowBook = async () => {
    try {
      const response = await api.post('/borrowing', { uniqueBookId: id, duration: duration, userId: decodedTokenId, startDate: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${accessToken}` } });
      console.log(response.data);
      GetBookData();
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDetails = async () => {
    try {
      console.log(decodedTokenId);
      const response = await api.get(`/user/${decodedTokenId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } });
      console.log(response.data);
      setUserDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessages, setAlertMessages] = useState([]);
  const handleAlertClose = (index) => {
    setAlertMessages((messages) => messages.filter((_, i) => i !== index));
  };

  const addAlertMessage = (message, severity) => {
    setAlertMessages((messages) => [...messages, { message, severity }]);
    setAlertOpen(true);
  };

  const addToFavs = async (bookId, option) => {
    try {
      if (accessToken !== "") {
        const response = await api.patch(`/book/set-as-favourite?option=${option}&bookId=${bookId}&personalId=${decodedTokenId}`, null
          , { headers: { Authorization: `Bearer ${accessToken}` } });
        console.log(response.data);
        setRetriveAccessToken(false);
      }

      if (option === false) {
        setIsThisBookFav(false);
        addAlertMessage("Book removed from favourite list", "success");
      }
      else {
        setIsThisBookFav(true);
        addAlertMessage("Book added to favourites", "success");
      }

    } catch (error) {
      addAlertMessage("An error occurred", "error");
    }
  }

  useEffect(() => {
    console.log(retriveAccessToken);
  }, [retriveAccessToken])
  const addToPersonalLib = async (libraryId, bookId) => {
    try {
      if (libraryId === '00000000-0000-0000-0000-000000000000') {
        setAlertMessages((messages) => [...messages, "You don't have a personal Library. Create one then you can add books."]);
        setAlertOpen(true);
      }

      const response = await api.post(`library/${libraryId}/addbook/${bookId}`, null,
        { headers: { Authorization: `Bearer ${accessToken}` } });
      addAlertMessage("Book added to your personal Library", "success");
    } catch (error) {
      console.log(accessToken);
      addAlertMessage(error.response.data, "error");
    }
  }
  useEffect(() => {
    if (decodedTokenId !== "") {
      GetBookData();
      getUserDetails();
    }
  }, [accessToken]);

  useEffect(() => {
    if (bookData !== null && userDetails !== null && decodedTokenId !== "") {
      console.log(userDetails.favouriteBooks.some((uniqueBookId) => uniqueBookId === bookData.uniqueBookId));
      setIsThisBookFav(userDetails.favouriteBooks.some((book) => book.uniqueBookId === bookData.uniqueBookId))
    }
  }, [accessToken, bookData, userDetails]);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        animation={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Borrow this book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="py-3">

            <input
              onChange={(e) => setDuaration(e.target.value)}
              className="form-control w-100"
              name="path"
              placeholder="Enter The Duration"
              type="number"
            />

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" className='text-white' onClick={() => { handleClose(); borrowBook(); }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="overflow-hidden">
        <div className="row">
          <div className="col-2">
            <div className="position-fixed col-lg-2">
              <Sidebar />
            </div>
          </div>
          {userDetails !== null && bookData &&
            <div className="col-10 px-lg-5 px-2 my-3">
              <div className="row">
                <div className="col-lg-4">
                  <div className='p-5'>
                    <img className='w-100 rounded-2' src={bookData.picture} alt="" />
                    <h4 className='text-center p-3 pb-0 fw-bolder'>{bookData.title}</h4>
                    <p className='text-center text-secondary fw-light'>{bookData.author}</p>
                  </div>
                </div>
                <div className="col-lg-8 my-1">
                  <div className='p-lg-5 px-5'>
                    <p className='d-none d-lg-block'><span className='fw-bold'>Category</span> : {bookData.category}</p>
                    <p className='d-none d-lg-block'><span className='fw-bold'>Status</span> : {bookData.status !== 0 ? "Unavailable" : "Available"}</p>
                    <p className='text-secondary d-none d-lg-block fs-6'><span className='fw-bold text-black'>Description</span> : {bookData.description}</p>
                    {bookData.status !== 0 ? null : <button variant="primary" onClick={handleShow} className='btn btn-danger w-100 mb-3'>Borrow this book now</button>}
                    <div className="d-flex justify-content-between">
                      {isThisBookFav === false ? (
                        <button className="btn btn-success" onClick={() => {
                          setRetriveAccessToken(true);
                          addToFavs(bookData.uniqueBookId, true);
                        }}>
                          <i className="bi bi-bookmark-heart"></i>
                          Add this book to Favourites
                        </button>
                      )
                        : (<button className="btn btn-success" onClick={() => { setRetriveAccessToken(true); addToFavs(bookData.uniqueBookId, false); }}>
                          <i className="bi bi-bookmark-heart"></i>
                          Remove this book from Favourites
                        </button>
                        )
                      }
                      <button className="btn btn-dark" onClick={() => addToPersonalLib(userDetails.personalLibraryId, bookData.uniqueBookId)}>
                        <i className="bi bi-building-add"></i>
                        Add this book to your Library
                      </button>
                      {alertMessages.map((alert, index) => (
                        <Snackbar
                          key={index}
                          open={alertOpen}
                          autoHideDuration={3000}
                          onClose={() => handleAlertClose(index)}
                        >
                          <Alert onClose={() => handleAlertClose(index)} severity={alert.severity}>
                            {alert.message}
                          </Alert>
                        </Snackbar>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

    </>
  )
}
