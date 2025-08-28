import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import SendNotificationToAllUserComp from "../components/SendNotificationToAllUserComp";

const SendNotificationPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}

        {/* NotificationLayer */}
        <SendNotificationToAllUserComp />
      </MasterLayout>
    </>
  );
};

export default SendNotificationPage;
