import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { FaCircleUser } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

import { BiSolidEdit } from "react-icons/bi";
const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const SubscriptionPlanComp = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  // Fetch API with pagination, search, filter
  const getUserList = async (page = 1, searchvalue) => {
    try {
      const response = await axios.get(
        BASE_URL + `/super-admin-pannel/subscriptions-plans`,
        {
          params: {
            page,
            limit: pagination.limit,
            searchvalue, // backend should handle search
            role, // backend should handle filter
          },
        }
      );

      console.log("data", response.data.data);
      setData(response?.data?.data || []);
      setPagination(response?.data?.pagination || {});
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };
  console.log("search", search);
  useEffect(() => {
    getUserList(pagination.page, search);
  }, [pagination.page, search, role]);

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

  console.log("user", data);

  //   createdAt
  // :
  // "2025-08-23T09:48:05.300Z"
  // features
  // :
  // {freeAccount: true, prepaidUnits: 500, historySaving: '2 Year', bestPricePerUnit: true}
  // isActive
  // :
  // true
  // planDescription
  // :
  // "25% Off Regular Price. Prepaid 500 Units."
  // planDuration
  // :
  // 690
  // planId
  // :
  // "c95658db-dd3b-4b5f-b1e0-f2bfcd9c8753"
  // planPrice
  // :
  // "746.25"
  // planTitle
  // :
  // "Pro Pack"
  // planUnits
  // :
  // 500
  // updatedAt
  // :
  // "2025-08-23T09:48:05.300Z"

  const handleDelete = (id) => {};

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          {/* Search */}
          <form
            className="navbar-search"
            onSubmit={(e) => {
              e.preventDefault();
              getUserList(1);
            }}
          >
            <input
              type="search"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>

          {/* Role filter */}
        </div>

        <div>
          <Link to="/add-subscription-plan" className="btn btn-info">
            Add Subscription Plan
          </Link>
        </div>
      </div>

      <div className="card-body p-24">
        {/* Table */}
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th>S.L</th>
                <th>Created At</th>
                <th>Plan Title</th>
                <th>Plan Description</th>
                <th>Plan Duration</th>
                <th>Plan Price</th>
                <th>Plan Units</th>

                <th className="text-center">PlanId</th>

                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td>{formatDateToDDMMYYYY(item?.createdAt)}</td>

                    <td>{item.planTitle}</td>
                    <td>{item.planDescription}</td>
                    <td>{item.planDuration}</td>
                    <td>{item.planPrice}</td>
                    <td>{item.planUnits}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {/* <img
                          src={
                            user.profileImage
                              ? user.profileImage
                              : "assets/images/user-list/user-list1.png"
                          }
                          alt="profile"
                          className="w-40-px h-40-px rounded-circle me-12"
                        /> */}
                        <span>{item.planId}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-10 justify-content-center">
                        <Link
                          to={`/edit-subscription-plan/${item.planId}`}
                          className="btn btn-sm btn-success"
                        >
                          <BiSolidEdit style={{ fontSize: "22px" }} />
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.planId)}
                        >
                          {" "}
                          <MdDelete style={{ fontSize: "22px" }} />{" "}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
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

export default SubscriptionPlanComp;
