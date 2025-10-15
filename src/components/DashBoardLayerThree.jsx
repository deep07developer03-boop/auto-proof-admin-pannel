import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { FaCircleUser } from "react-icons/fa6";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const DashBoardLayerThree = () => {
  const token = localStorage.getItem("token");
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
  const getUserList = async (page = 1) => {
    try {
      const response = await axios.get(
        BASE_URL + `/auth/userList`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ correct for JSON body
          },
        },
        {
          params: {
            page,
            limit: pagination.limit,
            search, // backend should handle search
            role, // backend should handle filter
          },
        }
      );

      setData(response?.data?.users || []);
      setPagination(response?.data?.pagination || {});
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    getUserList(pagination.page);
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
      </div>

      <div className="card-body p-24">
        {/* Table */}
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th>S.L</th>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Mobile Number</th>
                <th>Profile Image</th>
                <th className="text-center">User Type</th>
                {/* <th className="text-center">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((user, index) => (
                  <tr key={user.id}>
                    <td>
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td>{formatDateToDDMMYYYY(user?.createdAt)}</td>
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
                        <span>{user.firstName + " " + user.lastName}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.address ? user.address : "-"}</td>
                    <td>{user.mobileNumber ? user.mobileNumber : "-"}</td>
                    <td>
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="profile"
                          className="w-40-px h-40-px rounded-circle"
                        />
                      ) : (
                        <FaCircleUser style={{ fontSize: "32px" }} />
                      )}
                    </td>
                    <td className="text-center">
                      <span className="bg-success-focus text-success-600 px-24 py-4 radius-4 fw-medium text-sm">
                        {user.userType}
                      </span>
                    </td>
                    {/* <td className="text-center">
                      <div className="d-flex gap-10 justify-content-center">
                        <button className="btn btn-sm btn-info">👁</button>
                        <button className="btn btn-sm btn-success">✏️</button>
                        <button className="btn btn-sm btn-danger">🗑</button>
                      </div>
                    </td> */}
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

export default DashBoardLayerThree;
