import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";

import AddUserComp from "../components/AddUserComp";

const AddUser = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Medical' /> */}

        {/* DashBoardLayerEight */}
        <AddUserComp />
      </MasterLayout>
    </>
  );
};

export default AddUser;
