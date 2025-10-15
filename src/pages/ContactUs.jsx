import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";

import CheckInComp from "../components/CheckInComp";
import ContactUsComp from "../components/ContactUsComp";

const ContactUs = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Medical' /> */}

        {/* DashBoardLayerEight */}
        <ContactUsComp />
      </MasterLayout>
    </>
  );
};

export default ContactUs;
