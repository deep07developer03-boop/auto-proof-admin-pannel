import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import RentalByFleetSubscriptionComp from "../components/RentalByFleetSubscriptionComp";

const RentalByFleetSubscription = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}

        {/* NotificationLayer */}
        <RentalByFleetSubscriptionComp />
      </MasterLayout>
    </>
  );
};

export default RentalByFleetSubscription;
