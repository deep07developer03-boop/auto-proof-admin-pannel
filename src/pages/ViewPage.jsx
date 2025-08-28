import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import ViewPageComp from "../components/ViewPageComp";

const ViewPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}

        {/* CompanyLayer */}
        <ViewPageComp />
      </MasterLayout>
    </>
  );
};

export default ViewPage;
