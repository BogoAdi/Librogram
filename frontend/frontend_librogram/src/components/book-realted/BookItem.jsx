import React from 'react';
import { Link } from 'react-router-dom';

export default function BookItem({ book }) {
  return (
    <>
      <div className="col-lg-3 col-md-4 col-sm-6 my-3">
        <Link className="text-decoration-none text-black" to={`/book/${book.uniqueBookId}`}>
          <div
            className="book-item p-3 text-center bg-light bg-opacity-25 rounded-2 shadow-sm mouse-pointer"
            style={{ maxWidth: '500px' }}
          >
            <div
              className="book-fixed-height d-flex flex-column align-items-center mb-3"
              style={{ height: '300px' }}
            >
              <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <img
                  className="w-auto h-auto"
                  src={book.picture}
                  alt=""
                  style={{ maxHeight: '200px', maxWidth: '250px', marginLeft: '200px', marginRight: '50px', marginBottom: '50px' }}
                />
              </div>
            </div>
            <h5 className="mb-1 mt-2 text-truncate" style={{ whiteSpace: 'pre-wrap' }}>{book.title}</h5>
            <p className="py-0 my-0 text-secondary fw-lighter fs-7 text-truncate" style={{ whiteSpace: 'pre-wrap' }}>Author: {book.author}</p>
            <p className="py-0 my-0 text-secondary fw-lighter fs-7 text-truncate" style={{ whiteSpace: 'pre-wrap' }}>Library: {book.library.name}</p>
            <p className="py-0 my-0 text-secondary fw-lighter fs-7 text-truncate" style={{ whiteSpace: 'pre-wrap' }}>category: {book.category}</p>
            <p className="py-0 my-0 text-secondary fw-lighter fs-7">{book.status === 0 ? 'available' : 'borrowed'}</p>
          </div>
        </Link>
      </div>
    </>
  );
}