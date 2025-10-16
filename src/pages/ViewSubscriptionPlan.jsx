import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import ViewSubscriptionPlanComp from "../components/ViewSubscriptionPlanComp";

const ViewSubscriptionPlan = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="Investment" /> */}

        {/* DashBoardLayerFive */}
        <ViewSubscriptionPlanComp />
      </MasterLayout>
    </>
  );
};

export default ViewSubscriptionPlan;
