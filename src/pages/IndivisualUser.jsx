import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerFive from "../components/DashBoardLayerFive";
import IndivisualUserComp from "../components/IndivisualUserComp";

const IndivisualUser = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="Investment" /> */}

        {/* DashBoardLayerFive */}
        <IndivisualUserComp />
      </MasterLayout>
    </>
  );
};

export default IndivisualUser;
