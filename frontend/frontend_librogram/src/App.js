import Home from './components/Home';
import Login from './components/login';
import React from "react";
import { Route, Routes } from "react-router-dom";
import { useIsAuthenticated } from '@azure/msal-react';
import MyProfilePage from './components/profile/myProfilePage';
import People from './components/people';
import MyBorrowings from './components/profile/myBorrowings';
import AllBooks from './components/book-realted/all-books';
import Book from './components/book-realted/Book';
import ProfileNavigation from './components/profile/ProfileNavigation';
import MyLibraryNavigation from './components/mylibrary-related/MyLibraryNavigation';
import MyLibraryBooks from './components/mylibrary-related/MyLibraryBooks';
import MyLibraryBorrowings from './components/mylibrary-related/MyLibraryBorrowings';
import MyLibraryInfo from './components/mylibrary-related/MyLibraryInfo';
import LibrariesPage from './components/LibrariesPage';
import Libraryinformations from './components/library-related/LibraryInformation';
import LibraryNavigation from './components/library-related/LibraryNavigation';
import LibraryBooks from './components/library-related/LibraryBooks';
import UserProfile from './components/profile/UserProfile';
function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/home" element={<Home />} />
      <Route exact path="/libraries" element={<LibrariesPage />} />
      <Route exact path="/myprofile" element={<MyProfilePage />} />
      <Route exact path="/all-books" element={< AllBooks />} />
      <Route exact path="/profile/:id" element={<UserProfile />} />
      <Route exact path="/people" element={<People />} />
      <Route exact path="/my-borrowings" element={<MyBorrowings />} />
      <Route exact path="/book/:id" element={<Book />} />
      <Route exact path="/profile" element={<ProfileNavigation />} />
      <Route exact path="/library-navigation" element={<MyLibraryNavigation />} />
      <Route exact path="/mylibrary-borrowings" element={<MyLibraryBorrowings />} />
      <Route exact path="/mylibrary-books" element={<MyLibraryBooks />} />
      <Route exact path="/mylibrary-info" element={<MyLibraryInfo />} />
      <Route exact path="/library-navigation/:id" element={<LibraryNavigation />} />
      <Route exact path="/library/:id/info" element={<Libraryinformations />} />
      <Route exact path="/library/:id/books" element={<LibraryBooks />} />
    </Routes>
  );
}

export default App;
