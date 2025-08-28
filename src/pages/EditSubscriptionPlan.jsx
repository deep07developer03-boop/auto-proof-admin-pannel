import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import EditSubscriptionPlanCom from "../components/EditSubscriptionPlanCom";

const HomePageEleven = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Finance & Banking' /> */}

        {/* DashBoardLayerEleven */}
        <EditSubscriptionPlanCom />
      </MasterLayout>
    </>
  );
};

export default HomePageEleven;
