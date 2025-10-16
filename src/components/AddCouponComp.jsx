import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AddCouponComp = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState("");

  const [company, setCompany] = useState("");
  const [user, setUser] = useState("");
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [inspectionUnits, setInspectionUnits] = useState(null);

  const token = localStorage.getItem("token");
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

  const Units = [
    { total_units: 15 },
    { total_units: 20 },
    { total_units: 30 },
    { total_units: 50 },
    { total_units: 75 },
    { total_units: 100 },
  ];

  const getClientList = async (page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/super-admin-pannel/with-coupons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ correct for JSON body
          },

          params: {
            page,
            limit: pagination.limit,
            search: searchTerm || undefined,
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

  useEffect(() => {
    getClientList(pagination.page, searchTerm);
  }, [pagination.page, searchTerm]);

  // handle pagination click
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  function formatDateToDDMMYYYY(dateString) {
    if (!dateString) return null;

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  const generateCoupon = async (e) => {
    e.preventDefault();

    // Validate: at least one must be selected
    if (!company && !inspectionUnits) {
      setError(
        "Please select a company or a inspectionUnits before generating a coupon."
      );
      setCoupon("");
      return;
    }

    setError("");
    // Generate a random coupon code
    const code = `DISC100-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;
    setCoupon(code);
    console.log("Generated Coupon:", code, "For:", company || user);

    const payload = {
      companyId: company,
      userId: user,
      couponCode: code,
      inspectionUnits: inspectionUnits ?? null, // NUMBER (or null)
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/super-admin-pannel/add_coupon_code`,
        payload
      );

      console.log("Response:", response);
      if (response.status == 200) {
        Swal.fire({
          title: "Thank you!",
          text: response?.data?.message,
          icon: "success",
        });

        getCompanyWithCoupons();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (error) {
      console.log("error", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/super-admin-pannel/getUserAndCompanyList`
      );

      console.log("Response:", response?.data?.data);

      setUsers(response?.data?.data?.users);
      setCompanies(response?.data?.data?.companies);
    } catch (error) {
      console.error("Error adding plan:", error);
      alert("Failed to add plan ❌");
    }
  };

  // companies/with-coupons
  const getCompanyWithCoupons = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/super-admin-pannel/companies/with-coupons`
      );

      console.log("Response: of getCompanyWithCoupons", response?.data?.data);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error ", error);
      alert("Failed ❌");
    }
  };

  useEffect(() => {
    fetchData();
    getCompanyWithCoupons();
  }, []);

  console.log("data to show", users, companies);
  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-sm-12">
          <div className="card p-3">
            <form onSubmit={generateCoupon}>
              <div className="row g-3">
                {/* Company Select companyName */}
                <div className="col-sm-6">
                  <label className="form-label">Select company</label>
                  <select
                    className="form-select"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {companies &&
                      companies.map((item, index) => {
                        return (
                          <option value={item.companyId} key={index}>
                            {item?.companyName}
                          </option>
                        );
                      })}

                    {/* <option value="CompanyA">Company A</option>
                  <option value="CompanyB">Company B</option> */}
                  </select>
                </div>

                <div className="col-sm-6">
                  <label className="form-label">Select Units</label>
                  <select
                    className="form-select"
                    value={inspectionUnits}
                    onChange={(e) => setInspectionUnits(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {Units &&
                      Units.map((item, index) => {
                        return (
                          <option value={item.total_units} key={index}>
                            {item?.total_units}
                          </option>
                        );
                      })}

                    {/* <option value="CompanyA">Company A</option>
                  <option value="CompanyB">Company B</option> */}
                  </select>
                </div>
                {/* User Select */}
                {/* <div className="col-sm-6">
                  <label className="form-label">Select user</label>
                  <select
                    className="form-select"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {users &&
                      users.map((item, index) => {
                        return (
                          <option value={item.userId} key={index}>
                            {item?.firstName + " " + item?.lastName}
                          </option>
                        );
                      })}
                  </select>
                </div> */}

                {/* Button */}
                <div className="col-sm-12">
                  <button type="submit" className="btn custum-btn-primary">
                    Generate coupon code
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Validation/Error */}
          {error && <div className="text-danger mt-2">{error}</div>}

          {/* Generated Coupon */}
          {coupon && (
            <div className="alert alert-success mt-3">
              Coupon Code Generated: <strong>{coupon}</strong>
            </div>
          )}
        </div>

        {/* "companyId": "1a654e59-9f50-493f-868e-e0de2ef02219",
            "companyName": "SAAPKQ Sonsnew01",
            "couponCode": "DISC100-1TNC7L",
            "inspectionUnits": 75,
            "isActive": true,
            "updatedAt": "2025-09-22T11:44:38.149Z",
            "admin": {
                "userId": "8ae0489d-18ae-47e4-bd17-aa2071ac94f6",
                "firstName": "raman",
                "lastName": "kumar Singh",
                "email": "rishuindivisualtest4@yopmail.com",
                "role": "ADMIN",
                "isActive": true
            } */}
        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th>Sr N°</th>

                  <th>companyId</th>
                  <th>companyName</th>

                  <th>coupon added Date</th>
                  <th>inspectionUnits</th>
                  <th>Company Created by </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data?.map((item, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>

                        {/* <td>
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </td> */}
                        <td>{item.companyId}</td>
                        <td>{item.companyName}</td>

                        <td>{formatDateToDDMMYYYY(item.updatedAt)}</td>

                        <td>{item.inspectionUnits}</td>
                        <td>
                          {item.admin.firstName + " " + item.admin.firstName}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center">
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
            {/* <span>
              Showing{" "}
              {Math.min(
                (pagination.page - 1) * pagination.limit + 1,
                pagination.total
              )}{" "}
              to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} entries
            </span> */}

            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
              <li
                className={`page-item ${
                  pagination.page === 1 ? "disabled" : ""
                }`}
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
    </div>
  );
};

export default AddCouponComp;
