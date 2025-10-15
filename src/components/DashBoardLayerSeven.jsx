import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { FaCircleUser } from "react-icons/fa6";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const DashBoardLayerSeven = () => {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkType, setCheckType] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 2,
    total: 0,
    totalPages: 0,
  });

  const getClientList = async (page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/super-admin-pannel/companies`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ correct for JSON body
          },
          params: {
            page,
            limit: pagination.limit,
            search: searchTerm || undefined,
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
  // useEffect(() => {
  //   getClientList(1);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    getClientList(pagination.page, searchTerm);
  }, [pagination.page, searchTerm]);

  // handle pagination click
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  // trigger fetch when searchTerm or checkType changes
  // useEffect(() => {
  //   getClientList();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchTerm, checkType]);

  // handle page change
  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= pagination.totalPages) {
  //     getClientList(newPage);
  //   }
  // };

  function formatDateToDDMMYYYY(dateString) {
    if (!dateString) return null;

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

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
              <tr>
                <th>Sr N°</th>
                <th>Date</th>
                <th className="text-center">Profile Image</th>
                <th>First Name</th>
                <th>Last Name</th>

                <th>Gender</th>
                <th>Company Name</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      {/* <td>{index + 1}</td> */}

                      <td>
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>

                      <td>{formatDateToDDMMYYYY(item.createdAt)}</td>
                      <td className="text-center">
                        {item.admin?.admin?.profileImage !== null ? (
                          <img
                            src={`` + item?.admin?.profileImage}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <FaCircleUser style={{ fontSize: "27px" }} />
                        )}
                      </td>
                      <td>{item.admin?.firstName}</td>
                      <td>{item.admin?.lastName}</td>
                      <td>{item.admin?.gender}</td>
                      <td>{item.companyName}</td>
                      <td>{item.admin?.phoneNumber}</td>
                      <td>{item.admin?.email}</td>
                      <td>{item.admin?.address}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No Data found
                  </td>
                </tr>
              )}
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
        {/* <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
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
        </div> */}

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

export default DashBoardLayerSeven;
