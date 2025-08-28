import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";

import CheckInComp from "../components/CheckInComp";
import CompletedInspectionComp from "../components/CompletedInspectionComp";

const HomePageEight = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Medical' /> */}

        {/* DashBoardLayerEight */}
        <CompletedInspectionComp />
      </MasterLayout>
    </>
  );
};

export default HomePageEight;
