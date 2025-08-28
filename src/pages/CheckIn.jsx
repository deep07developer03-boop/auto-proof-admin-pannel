import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";

import CheckInComp from "../components/CheckInComp";

const HomePageEight = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Medical' /> */}

        {/* DashBoardLayerEight */}
        <CheckInComp />
      </MasterLayout>
    </>
  );
};

export default HomePageEight;
