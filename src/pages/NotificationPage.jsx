import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";

import NotificationLayer from "../components/NotificationLayer";

const NotificationPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}

        {/* NotificationLayer */}
        <NotificationLayer />
      </MasterLayout>
    </>
  );
};

export default NotificationPage;
