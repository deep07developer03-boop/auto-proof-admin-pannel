import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { FaCircleUser } from "react-icons/fa6";
const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const CompletedInspectionComp = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkType, setCheckType] = useState("");
  const [userType, setUserType] = useState(""); // for userType filter
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // "inspectionId": "d6106d52-b76b-4195-a9d9-2656337b72c8",
  //         "adminId": "93b535e1-e948-4644-a1ef-bd68a22282c1",
  //         "inspectorId": null,
  //         "clientId": "c697a43e-0f0b-4c7f-966b-596ef33f2c02",
  //         "companyId": null,
  //         "vehicleId": "fad0ba52-c586-4701-9d82-b3879a3ed8e0",
  //         "carOwnerId": "c81b3d1f-a0d9-4962-92a8-5058856061d1",
  //         "checkType": "check-in",
  //         "checkInDate": "2025-08-27T05:49:28.291Z",
  //         "checkOutDate": null,
  //         "comments": "Vehicle returned with minor damages noted, photos and signatures updated.",
  //         "createdAt": "2025-08-27T05:49:28.291Z",
  //         "updatedAt": "2025-08-27T05:49:28.291Z",
  //         "admin": {
  //             "userId": "93b535e1-e948-4644-a1ef-bd68a22282c1",
  //             "firstName": "rishu",
  //             "lastName": "kumar",
  //             "email": "rishu2@yopmail.com",
  //             "isEmailVerified": true,
  //             "profileImage": null,
  //             "countryCode": "+91",
  //             "phoneNumber": "9546456492",
  //             "isPhoneNumberVerified": false,
  //             "password": "$2b$10$O00YxfPzVmXaVUqHI9.ySe1QzdsNpGAmDEEy2c/HTahUEyFEgqxF.",
  //             "address": null,
  //             "gender": "MALE",
  //             "role": "ADMIN",
  //             "userType": "individual",
  //             "isActive": true,
  //             "termsAndConditions": true,
  //             "companyId": null,
  //             "createdAt": "2025-08-27T05:49:07.490Z",
  //             "updatedAt": "2025-08-27T05:49:07.490Z"
  //         },
  //         "vehicle": {
  //             "vehicleId": "fad0ba52-c586-4701-9d82-b3879a3ed8e0",
  //             "adminId": "93b535e1-e948-4644-a1ef-bd68a22282c1",
  //             "carOwnerId": null,
  //             "numberPlate": "PB03BB2131",
  //             "brand": "TOYOTA",
  //             "model": "Corolla",
  //             "mileage": 15200,
  //             "gasType": "Petrol",
  //             "gasLevel": "Half",
  //             "tyresCondition": "Good",
  //             "kmPerDay": 50,
  //             "extraKm": 12,
  //             "priceTotal": "12500.00",
  //             "insuranceCertificate": null,
  //             "checkList": {
  //                 "0": "Lights",
  //                 "1": "Horn",
  //                 "2": "Wipers",
  //                 "GPS": "true",
  //                 "CarPapers": "true",
  //                 "softyPack": "true",
  //                 "spareWheels": "true",
  //                 "chargingPort": "true"
  //             },
  //             "comments": "Minor scratch added during rental",
  //             "createdAt": "2025-08-27T05:49:28.275Z",
  //             "updatedAt": "2025-08-27T05:49:28.275Z"
  //         },
  //         "carOwner": {
  //             "carOwnerId": "c81b3d1f-a0d9-4962-92a8-5058856061d1",
  //             "adminId": "93b535e1-e948-4644-a1ef-bd68a22282c1",
  //             "firstName": "John",
  //             "lastName": "Doe",
  //             "email": "johndoe@example.com",
  //             "countryCode": "+91",
  //             "phoneNumber": "9876543210",
  //             "address": "123 Park Street, Delhi, India",
  //             "gender": "MALE",
  //             "checkList": [
  //                 "ID Proof",
  //                 "Address Proof"
  //             ],
  //             "createdAt": "2025-08-27T05:49:28.281Z",
  //             "updatedAt": "2025-08-27T05:49:28.281Z"
  //         }

  const getClientList = async (page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/super-admin-pannel/check-in-inspections`,
        {
          params: {
            page,
            limit: pagination.limit,
            numberPlate: searchTerm || undefined, // backend expects numberPlate
            userType: userType || undefined, // backend expects userType
            checkType: checkType || undefined, // in case you want dynamic checkType
          },
        }
      );

      setData(response?.data?.data || []);
      setPagination(response?.data?.pagination || pagination);
    } catch (err) {
      console.error("Error fetching inspections:", err);
    }
  };

  // initial load
  useEffect(() => {
    getClientList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // trigger fetch when searchTerm or checkType changes
  useEffect(() => {
    getClientList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, checkType]);

  // handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getClientList(newPage);
    }
  };

  //   export default (sequelize, DataTypes) => {
  //   const Company = sequelize.define(
  //     "Company",
  //     {
  //       companyId: {
  //         type: DataTypes.UUID,
  //         primaryKey: true,
  //         defaultValue: DataTypes.UUIDV4,
  //       },
  //       adminId: {
  //         // adminId
  //         type: DataTypes.UUID,
  //         allowNull: false,
  //         references: {
  //           model: "Users",
  //           key: "userId",
  //         },
  //       },
  //       companyName: {
  //         type: DataTypes.STRING,
  //         allowNull: false,
  //       },
  //       website: {
  //         type: DataTypes.STRING,
  //         allowNull: false,
  //         validate: {
  //           isUrl: true,
  //         },
  //         unique: true,
  //       },
  //       VatNumber: {
  //         type: DataTypes.STRING,
  //         allowNull: false,
  //         unique: true,
  //       },
  //       companyRegistrationNumber: {
  //         type: DataTypes.STRING,
  //         allowNull: false,
  //         unique: true,
  //       },
  //       shareCapital: {
  //         type: DataTypes.DECIMAL(15, 2),
  //         allowNull: true,
  //       },
  //       termAndConditions: {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       },
  //       companyPolicy: {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       },
  //       companyLogo: {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       },
  //       isActive: {
  //         type: DataTypes.BOOLEAN,
  //         defaultValue: true,
  //       },
  //     },
  //     { timestamps: true }
  //   );
  //   return Company;
  // };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="search"
              className="bg-base h-40-px w-auto"
              placeholder="Search"
              name="searchTerm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              {/* <tr>
                <th scope="col">#</th>

                <th scope="col">Company Id</th>
                <th scope="col">Company Name</th>
                <th scope="col">Website</th>
                <th scope="col">Vat Number</th>
                <th scope="col">Company Registration Number</th>
                <th scope="col">Share Capital</th>
                <th scope="col">Company Logo</th>
              </tr> */}

              <tr>
                <th>Sr N°</th>
                <th>Number Plate</th>
                <th>Date</th>
                <th>Agent Name</th>
                <th>User Type (Company, Individual, Fleet)</th>
                {/* <th className="text-center">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {console.log("check-in data", data)}

              {data.length > 0 ? (
                data?.map((item, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.vehicle.numberPlate}</td>
                      <td>{item.vehicle.createdAt}</td>
                      <td>
                        {item.admin.firstName + " " + item.admin.lastName}
                      </td>
                      <td>{item.admin.userType}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="12" className="text-center">
                    No data found
                  </td>
                </tr>
              )}
              {/* {data?.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.firstName + " " + item.lastName}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td>{item.gender}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.rentalDuration}</td>
                    <td>{item.drivingLicenseNumber}</td>
                    <td>{item.dateOfIssue}</td>
                    <td>{item.comments}</td>
                  </tr>
                );
              })} */}
              {/* {data?.map((item, index) => (
                <tr key={item.inspectionId}>
                  <td>
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>
                  <td>{item.inspectionId}</td>
                  <td>
                    {item.carOwner?.firstName} {item.carOwner?.lastName}
                  </td>
                  <td>
                    {item.client?.firstName} {item.client?.lastName}
                  </td>
                  <td>{item.vehicle?.brand}</td>
                  <td>{item.checkType}</td>
                  <td>
                    {item.inspector
                      ? `${item.inspector.firstName} ${item.inspector.lastName}`
                      : "-"}
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
          <span>
            Showing{" "}
            {Math.min(
              (pagination.page - 1) * pagination.limit + 1,
              pagination.total
            )}{" "}
            to {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            of {pagination.total} entries
          </span>

          <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
            <li
              className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}
            >
              <Link
                to="#"
                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                <Icon icon="ep:d-arrow-left" />
              </Link>
            </li>

            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <li key={i + 1} className="page-item">
                <Link
                  to="#"
                  className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${
                    pagination.page === i + 1
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-200 text-secondary-light"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Link>
              </li>
            ))}

            <li
              className={`page-item ${
                pagination.page === pagination.totalPages ? "disabled" : ""
              }`}
            >
              <Link
                to="#"
                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                <Icon icon="ep:d-arrow-right" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompletedInspectionComp;
