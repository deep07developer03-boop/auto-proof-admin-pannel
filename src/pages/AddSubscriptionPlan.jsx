import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";

import AddSubscriptionPlanComp from "../components/AddSubscriptionPlanComp";

const HomePageEleven = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Finance & Banking' /> */}

        {/* DashBoardLayerEleven */}
        <AddSubscriptionPlanComp />
      </MasterLayout>
    </>
  );
};

export default HomePageEleven;
