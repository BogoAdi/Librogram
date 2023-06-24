import React from "react";
import BooksDisplayed from "./BooksDisplayed";
import { Box } from "@mui/material";
import Sidebar from "../Sidebar";

const AllBooks = () => {


    return (
        <>

            <Box sx={{ m: 2 }}>
                <BooksDisplayed />
            </Box >
        </>
    );
}
export default AllBooks;