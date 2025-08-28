import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";

import CheckOutComp from "../components/CheckOutComp";

const HomePageEight = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Medical' /> */}

        {/* DashBoardLayerEight */}
        <CheckOutComp />
      </MasterLayout>
    </>
  );
};

export default HomePageEight;
