import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import UpdateSubscriptionPlanComp from "../components/UpdateSubscriptionPlanComp";

const IndivisualUser = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="Investment" /> */}

        {/* DashBoardLayerFive */}
        <UpdateSubscriptionPlanComp />
      </MasterLayout>
    </>
  );
};

export default IndivisualUser;
