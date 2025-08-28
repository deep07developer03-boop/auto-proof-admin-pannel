import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const DashBoardLayerThree = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkType, setCheckType] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const getUserList = async (page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/inspection`, {
        params: {
          page,
          limit: pagination.limit,
          search: searchTerm || undefined,
          checkType: checkType || undefined,
        },
      });

      setData(response?.data?.data || []);
      setPagination(response?.data?.pagination || pagination);
    } catch (err) {
      console.error("Error fetching inspections:", err);
    }
  };

  // initial load
  useEffect(() => {
    getUserList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // trigger fetch when searchTerm or checkType changes
  useEffect(() => {
    getUserList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, checkType]);

  // handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getUserList(newPage);
    }
  };

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
          <select
            className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
            defaultValue="Select Status"
            onChange={(e) => setCheckType(e.target.value)}
          >
            <option value="Select Status" disabled>
              Check Type
            </option>
            <option value="">All</option>
            <option value="check-in">Check In</option>
            <option value="check-out">Check Out</option>
          </select>
        </div>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Inspection ID</th>
                <th scope="col">Car Owner</th>
                <th scope="col">Client</th>
                <th scope="col">Vehicle</th>
                <th scope="col">Check Type</th>
                <th scope="col">Inspector</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
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
              ))}
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
