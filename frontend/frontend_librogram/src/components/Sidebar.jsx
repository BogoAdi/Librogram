import React from 'react'
import { Link } from 'react-router-dom'
import AppLogo from './AppLogo'
import Button from 'react-bootstrap/Button';
import { useMsal } from "@azure/msal-react";
export default function Sidebar() {
    const { instance } = useMsal();
    const handleLogOut = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
    };
    return (
        <>
            <div>
                <div className="p-0 min-vh-100 side-bar-bg-color">
                    <ul className="text-light list-unstyled">
                        <li className="p-3 pe-lg-5 d-lg-flex d-none  ">
                            <AppLogo />
                        </li>

                        <li className="p-3 pe-lg-5 sidebar-element">
                            <Link to="/home" className="nav-link px-0 px-lg-2"> <i className="bi-house" /><span className="px-lg-2 ms-1 d-none d-lg-inline">Home</span> </Link>
                        </li>
                        <li className="p-3 pe-lg-5 sidebar-element">
                            <Link to="/all-books" className="nav-link px-0 px-lg-2"> <i className="bi bi-book"></i><span className="px-lg-2 ms-1 d-none d-lg-inline">Books</span> </Link>
                        </li>
                        <li className="p-3 pe-lg-5 sidebar-element">
                            <Link to="/people" className="nav-link px-0 px-lg-2"> <i className="bi bi-people-fill"></i><span className="px-lg-2 ms-1 d-none d-lg-inline">People</span> </Link>
                        </li>
                        <li className="p-3 pe-lg-5 sidebar-element">
                            <Link to="/profile" className="nav-link px-0 px-lg-2"> <i className="bi bi-person-circle"></i><span className="px-lg-2 ms-1 d-none d-lg-inline">Profile</span> </Link>
                        </li>
                        <li className="p-3 pe-lg-5 sidebar-element">
                            <Link to="/libraries" className="nav-link px-0 px-lg-2"> <i className="bi bi-bookshelf"></i><span className="px-lg-2 ms-1 d-none d-lg-inline">Libraries</span> </Link>
                        </li>
                        <li className="p-3 pe-lg-5 sidebar-element">
                            <Button onClick={() => handleLogOut()} className="nav-link px-0 px-lg-2"> <i className="bi bi-box-arrow-left"></i><span className="px-lg-2 ms-1 d-none d-lg-inline">Logout</span> </Button>
                        </li>

                    </ul>
                </div>
            </div >
        </>
    )
}
