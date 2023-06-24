import React, { useEffect,  useState } from 'react'
import { motion } from "framer-motion"
import api from '../../API/api';
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { Alert } from '@mui/material';
import image from '../../media/book.png'
import { Modal, Button } from 'react-bootstrap';
export default function AddBook({ onClose, onSave, libraryId }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [author, setAuthor] = useState(null);
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSucces, setFormSucces] = useState(null);

  const { instance, inProgress, accounts } = useMsal();
  const [decodedTokenId, setDecodedTokenId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isAddBookOpen, setIsAddBookOpen] = useState(true);
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !author || !picture || !description) {
      setFormError('Please fill in all required fields.');
      setTimeout(() => {
        setFormError('');
      }, 3000);
      return;
    }
    const formData = new FormData();
    formData.append('Title', title);
    formData.append('Category', category);
    formData.append('Author', author);
    formData.append('Description', description);
    formData.append('LibraryId', libraryId);
    formData.append('File', picture);
    console.log(picture);
    try {
      const response = await api.post('/book', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setFormSucces("Book created");

      setTimeout(() => {
        setFormSucces('');
      }, 3000);
      onSave(response.data);


    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data);
        console.log(formError);
        setTimeout(() => {
          setFormError('');
        }, 3000);
      } else {
        console.log(error);
        setFormError(`An error occurred while adding the book. `);
        console.log(formError);
        setTimeout(() => {
          setFormError('');
        }, 3000);
      };
    }
  }

  const handleCloseAdd = () => {
    setIsAddBookOpen(false);
    onClose(); // Call the onClose function provided by the parent component
  }

  return (
    <> <Modal show={isAddBookOpen} onHide={handleCloseAdd} dialogClassName="modal-lg">
      <Modal.Header closeButton>
        <Modal.Title>New Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center min-vh-75">
          <motion.div
            initial={{ y: -1000 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.5, type: 'spring' }}
            className="p-5 w-100 text-center bg-white bg-opacity-25 my-2 shadow rounded-2"
            style={{ maxWidth: '800px', margin: 'auto' }}
          >
            <div className="my-4 w-100 text-center">
              <img
                className="profile-img-upload mx-auto d-block"
                src={image}
                alt=""
                style={{ margin: '20px', width: '150px', height: '150px' }}
              />
              <form onSubmit={handleSubmit}>
                <input onChange={(e) => setPicture(e.target.files[0])} type="file" className='form-control my-2' id='photo' name='path' placeholder='Choose Your Photo' />
                <input onChange={(e) => setTitle(e.target.value)} type="text" className='form-control my-2' id='name' name='name' placeholder='Enter Book Name' />
                <input onChange={(e) => setCategory(e.target.value)} type="text" className='form-control my-2' id='category' name='category' placeholder='Enter Book Category' />
                <input onChange={(e) => setAuthor(e.target.value)} type="text" className='form-control my-2' id='author' name='author' placeholder='Enter Book Author' />
                <textarea onChange={(e) => setDescription(e.target.value)} type="text" className='form-control my-2' id='description' name='description' placeholder='Enter Description about the book' rows={8} />
                <button className=' btn btn-danger w-100 rounded-2 text-light'>Add Book</button>
              </form>
            </div>
            {formError && <Alert severity="error">{formError}</Alert>}
            {formSucces &&
              <Alert severity="success">{formSucces}</Alert>
            }
          </motion.div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseAdd}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  )

}
