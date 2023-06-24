import React, { useState, useEffect } from 'react'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import resume from '../../media/resume.png';
import bookStack from '../../media/bookshelf.png';
import borrow from '../../media/borrow.png';
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from "../../API/api";

export default function MyLibraryNavigation() {
  const [user, setUser] = useState([]);
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

  const GetUserDetails = async () => {
    try {
      const response = await api.get(`/user/${decodedTokenId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setUser(response.data);
    } catch (error) {
      // Handle error
      console.log(`Error: ${error.message}`);
    }
  };
  useEffect(() => {
    if (decodedTokenId !== "") {
      GetUserDetails();
    }
  }, [accessToken]);

  const emptyGuid = '00000000-0000-0000-0000-000000000000';

  return (
    <>
      <div className="overflow-hidden">
        <div className="row">
          <div className="col-2">
            <div className="position-fixed col-lg-2">
              <Sidebar />
            </div>
          </div>

          <div className="col-10 px-lg-5 px-2 ">

            <div className="row align-items-center min-vh-100 ">
              <div className="col-lg-6 px-5">
                <Link className='text-decoration-none text-black' to={`/mylibrary-info`}>
                  <motion.div initial={{ scale: 0 }} animate={{ backgroundColor: '#ccd3ea', scale: 1 }}
                    transition={{ duration: 0.3 }} className=' book-item rounded shadow-sm mouse-pointer '
                  >
                    <img className='profile-img-upload mx-auto d-block' src={resume} alt="" />
                    <p className='text-center pb-5 fs-3 fw-bold'>Info</p>
                  </motion.div>
                </Link>
              </div>
              {user && user.personalLibraryId !== emptyGuid && (
                <>
                  <div className="col-lg-6 px-5">
                    <Link className='text-decoration-none text-black' to={`/mylibrary-books`}>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }} className='bg-custom-blue book-item rounded shadow-sm mouse-pointer '
                      >
                        <img className='profile-img-upload mx-auto d-block' src={bookStack} alt="" />
                        <p className='text-center pb-5 fs-3 fw-bold'>Books</p>
                      </motion.div>
                    </Link>
                  </div>
                  <div className="col-lg-6 px-5">
                    <Link className='text-decoration-none text-black' to={`/mylibrary-borrowings`}>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }} className='bg-custom-blue book-item rounded shadow-sm mouse-pointer ' >
                        <img className='profile-img-upload mx-auto d-block' src={borrow} alt="" />
                        <p className='text-center pb-5 fs-3 fw-bold'>Borrowings</p>
                      </motion.div>
                    </Link>
                  </div>
                </>
              )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
