import React from "react";

import AsignRoleComp from "../components/AsignRoleComp";
import MasterLayout from "../masterLayout/MasterLayout";

const AssignRolePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}

        {/* AssignRoleLayer */}
        <AsignRoleComp />
      </MasterLayout>
    </>
  );
};

export default AssignRolePage;
