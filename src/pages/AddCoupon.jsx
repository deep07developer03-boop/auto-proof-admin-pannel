import MasterLayout from "../masterLayout/MasterLayout";
import React from "react";
import AddCouponComp from "../components/AddCouponComp";

const AddCoupon = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title='Finance & Banking' /> */}

        {/* DashBoardLayerEleven */}
        <AddCouponComp />
      </MasterLayout>
    </>
  );
};

export default AddCoupon;
