import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import SendNotificationOnSheduledDateComp from "../components/SendNotificationOnSheduledDateComp";

const SendNotificationOnSheduledDate = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}

        {/* NotificationLayer */}
        <SendNotificationOnSheduledDateComp />
      </MasterLayout>
    </>
  );
};

export default SendNotificationOnSheduledDate;
