import React from "react";
import Sidebar from "../Sidebar";
import Libraries from "./libraries";


const LibrariesPage = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-2">
                    <div className="position-fixed">
                        <Sidebar />
                    </div>
                </div>
                <div className="col-lg-10">
                    <div className="px-5 ps-lg-5 my-1">
                        <div className="text-center mt-5 mb-2">
                            <Libraries />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibrariesPage;