import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import AgentsComp from "../components/AgentsComp";

const Agents = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Medical' /> */}

        {/* DashBoardLayerEight */}
        <AgentsComp />
      </MasterLayout>
    </>
  );
};

export default Agents;
