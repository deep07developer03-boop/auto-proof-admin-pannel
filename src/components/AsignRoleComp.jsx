import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const AsignRoleComp = () => {
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
        BASE_URL + `/super-admin-pannel/userList`,
        {
          params: {
            page,
            limit: pagination.limit,
            search, // backend should handle search
            role, // backend should handle filter
          },
        }
      );

      console.log("response getUserList", response.data.users);
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

  const handleRoleChange = (userDetail, selectedRole) => {
    try {
      axios
        .post(
          BASE_URL + `/super-admin-pannel/asign-role/${userDetail.userId}`,
          { role: selectedRole }
        )
        .then((response) => {
          console.log("response", response);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
              <div className="d-flex align-items-center flex-wrap gap-3">
                <form className="navbar-search">
                  <input
                    type="text"
                    className="bg-base h-40-px w-auto"
                    name="search"
                    placeholder="Search"
                  />
                  <Icon icon="ion:search-outline" className="icon" />
                </form>
                <select
                  className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                  defaultValue="Status"
                >
                  <option value="Status" disabled>
                    Status
                  </option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="card-body p-24">
              <div className="table-responsive scroll-sm">
                <table className="table bordered-table sm-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">
                        <div className="d-flex align-items-center gap-10">
                          S.L
                        </div>
                      </th>
                      <th scope="col">Username</th>
                      <th scope="col">email</th>
                      <th scope="col" className="text-center">
                        UserType
                      </th>
                      <th scope="col" className="text-center">
                        Asign Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((user, index) => (
                        <tr key={user.id}>
                          <td>
                            {(pagination.page - 1) * pagination.limit +
                              index +
                              1}
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <span>
                                {user.firstName + " " + user.lastName}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <span>{user.email}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="bg-success-focus text-success-600 px-24 py-4 radius-4 fw-medium text-sm">
                              {user.userType}
                            </span>
                          </td>

                          <td className="text-center">
                            <select
                              className="form-select"
                              aria-label="Assign Role"
                              value={user.role || ""} // <-- keeps the current role selected
                              onChange={(e) =>
                                handleRoleChange(user, e.target.value)
                              }
                            >
                              <option value="">Assign Role</option>
                              <option value="SUPERADMIN">SUPERADMIN</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
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
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                <span>Showing 1 to 10 of 12 entries</span>
                <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                  <li className="page-item">
                    <Link
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                      to="#"
                    >
                      <Icon icon="ep:d-arrow-left" className="" />
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link
                      className="page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md bg-primary-600 text-white"
                      to="#"
                    >
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                      to="#"
                    >
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                      to="#"
                    >
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                      to="#"
                    >
                      4
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                      to="#"
                    >
                      5
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                      to="#"
                    >
                      {" "}
                      <Icon icon="ep:d-arrow-right" className="" />{" "}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignRoleComp;
