import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import SubscriptionPlanComp from "../components/SubscriptionPlanComp";

const SubscriptionPlan = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Finance & Banking' /> */}

        {/* DashBoardLayerEleven */}
        <SubscriptionPlanComp />
      </MasterLayout>
    </>
  );
};

export default SubscriptionPlan;
