import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { FaCircleUser } from "react-icons/fa6";
import Swal from "sweetalert2";
import { GrFormView } from "react-icons/gr";
import { FaDownload } from "react-icons/fa6";
const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const CheckInComp = () => {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkType, setCheckType] = useState("");
  const [userType, setUserType] = useState(""); // for userType filter
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getClientList = async (page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/super-admin-pannel/check-in-inspections`,
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

  // initial load
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

  const handleDownloadPdf = async (inspectionId) => {
    const payload = {
      checkType: "check-in",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/inspection/pdf/${inspectionId}`,
        payload,
        {
          responseType: "blob", // Always keep blob for PDF
        }
      );

      // Try to detect if it's JSON instead of PDF
      const contentType = response.headers["content-type"];

      if (contentType && contentType.includes("application/json")) {
        // Convert blob back to JSON
        const text = await response.data.text();
        const json = JSON.parse(text);
        console.error("❌ Error:", json.message);
        alert(json.message); // or show in UI
      } else {
        // It's a PDF → download it
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `inspection-${inspectionId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error("❌ Download failed:", err);

      if (err.response && err.response.data) {
        // Convert blob back to text, then parse JSON
        err.response.data.text().then((text) => {
          try {
            const json = JSON.parse(text);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: json.message || "Something went wrong",
            });
          } catch {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to download PDF",
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Server error, please try again later",
        });
      }
    }
  };

  const handleViewPdf = async (inspectionId) => {
    const payload = {
      checkType: "check-in",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/super-admin-pannel/view-inspection/${inspectionId}`,
        payload
      );

      console.log("response of view inspection", response.data.data); // http://localhost:3002/reports/inspection_report_1758527664851.pdf

      //   if (!pdfUrl) throw new Error("No PDF URL returned from server.");

      // // Redirect the already-opened tab to the PDF
      const pdfUrl = response?.data?.data;

      if (!pdfUrl) {
        throw new Error("No PDF URL returned from server.");
      }

      // Open PDF in a new tab
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
      // Try to detect if it's JSON instead of PDF
    } catch (err) {
      console.error("❌ Download failed:", err);
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
        </div>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th>Sr N°</th>
                <th>Inspection Number</th>
                <th>Number Plate</th>
                <th>Date</th>
                <th>Agent Name</th>
                <th>User Type</th>
                <th>Download Inspection Pdf</th>
                {/* <th className="text-center">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {console.log("check-in data", data)}

              {data.length > 0 ? (
                data?.map((item, index) => {
                  return (
                    <tr>
                      <td>
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td>{item.inspectionNumber}</td>

                      <td>{item.vehicle.numberPlate}</td>
                      <td>{formatDateToDDMMYYYY(item.vehicle.createdAt)}</td>
                      <td>
                        {item.admin.firstName + " " + item.admin.lastName}
                      </td>
                      <td>{item.admin.userType}</td>
                      <td class="d-flex align-item-center text-center">
                        <GrFormView
                          style={{ fontSize: "28px", cursor: "pointer" }}
                          onClick={() => handleViewPdf(item?.inspectionId)}
                        />
                        <FaDownload
                          style={{ fontSize: "21px", cursor: "pointer" }}
                          onClick={() => handleDownloadPdf(item?.inspectionId)}
                        />
                        {/* <button
                          type="button"
                          className="btn custum-btn-primary btn-sm"
                          onClick={() => handleDownloadPdf(item?.inspectionId)}
                        >
                          Download pdf
                        </button> */}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
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

export default CheckInComp;
