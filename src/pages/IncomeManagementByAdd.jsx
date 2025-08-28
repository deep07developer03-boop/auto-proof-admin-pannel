import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import IncomeManagementByAddComp from "../components/IncomeManagementByAddComp";

const IncomeManagementByAdd = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}

        {/* NotificationLayer */}
        <IncomeManagementByAddComp />
      </MasterLayout>
    </>
  );
};

export default IncomeManagementByAdd;
