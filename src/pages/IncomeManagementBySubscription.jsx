import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import IncomeManagementBySubscriptionComp from "../components/IncomeManagementBySubscriptionComp";

const IncomeManagementBySubscription = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}

        {/* NotificationLayer */}
        <IncomeManagementBySubscriptionComp />
      </MasterLayout>
    </>
  );
};

export default IncomeManagementBySubscription;
