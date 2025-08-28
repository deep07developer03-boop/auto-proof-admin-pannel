import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import RentalFleetComp from "../components/RentalFleetComp";

const RentalFleet = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}

        {/* NotificationLayer */}
        <RentalFleetComp />
      </MasterLayout>
    </>
  );
};

export default RentalFleet;
