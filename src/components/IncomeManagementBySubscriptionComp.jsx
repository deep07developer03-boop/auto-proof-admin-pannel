import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react/dist/iconify.js";

// import Icon from '...'; // keep your Icon import
const BASE_URL = process.env.REACT_APP_BASE_URL;

function formatDateToDDMMYYYY(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

const IncomeManagementBySubscriptionComp = () => {
  const token = localStorage.getItem("token");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // table controls
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(""); // Paid | Failed | Pending
  const [sortBy, setSortBy] = useState("paymentDate");
  const [sortDir, setSortDir] = useState("DESC");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    sumAmount: 0,
  });

  // debounce search (300ms)
  const [typedQuery, setTypedQuery] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(typedQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [typedQuery]);

  const fetchData = async (page = 1) => {
    setLoading(true);
    setErr(null);

    const source = axios.CancelToken.source();
    try {
      const res = await axios.get(
        `${BASE_URL}/super-admin-pannel/subscriptions/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            pageSize: pagination.limit,
            search: searchTerm || undefined,
            status: status || undefined,
            sortBy,
            sortDir,
          },
          cancelToken: source.token,
        }
      );

      const { data, meta } = res.data || {};
      setRows(data || []);
      setPagination((p) => ({
        ...p,
        page: meta?.page ?? p.page,
        limit: meta?.pageSize ?? p.limit,
        total: meta?.totalItems ?? p.total,
        totalPages: meta?.totalPages ?? p.totalPages,
        sumAmount: meta?.sumAmount ?? 0,
      }));
    } catch (e) {
      if (!axios.isCancel(e)) setErr(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
    return () => source.cancel();
  };

  // refetch on controls change
  useEffect(() => {
    fetchData(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, searchTerm, status, sortBy, sortDir]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  const handleLimitChange = (e) => {
    const next = Number(e.target.value) || 10;
    setPagination((prev) => ({ ...prev, limit: next, page: 1 }));
  };

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(key);
      setSortDir("ASC");
    }
  };

  const startIndex = useMemo(
    () => (pagination.page - 1) * pagination.limit,
    [pagination.page, pagination.limit]
  );

  return (
    <div className="card-body p-24">
      {/* Filters / Controls */}
      <div className="d-flex gap-2 mb-16 align-items-center flex-wrap">
        <input
          className="form-control"
          style={{ maxWidth: 260 }}
          placeholder="Search invoice/txn/plan/user…"
          value={typedQuery}
          onChange={(e) => setTypedQuery(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: 180 }}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        <p className="">
          Total Amount : <strong>{pagination.sumAmount.toFixed(2)}</strong> €
        </p>
        <select
          className="form-select ms-auto"
          style={{ maxWidth: 120 }}
          value={pagination.limit}
          onChange={handleLimitChange}
        >
          {[10, 20, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>

      <div className="table-responsive scroll-sm">
        <table className="table bordered-table sm-table mb-0">
          <thead>
            <tr>
              <th>Sr Nº</th>
              <th
              // onClick={() => toggleSort("invoiceNumber")} role="button"
              >
                Plan Id{" "}
                {/* {sortBy === "invoiceNumber"
                  ? sortDir === "ASC"
                    ? "▲"
                    : "▼"
                  : ""} */}
              </th>
              <th onClick={() => toggleSort("planTitle")} role="button">
                Plan{" "}
                {sortBy === "planTitle" ? (sortDir === "ASC" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => toggleSort("amount")} role="button">
                Amount{" "}
                {sortBy === "amount" ? (sortDir === "ASC" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => toggleSort("paymentDate")} role="button">
                Payment Date{" "}
                {sortBy === "paymentDate"
                  ? sortDir === "ASC"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th onClick={() => toggleSort("paymentStatus")} role="button">
                Status{" "}
                {sortBy === "paymentStatus"
                  ? sortDir === "ASC"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th>Purchased Units</th>
              <th>Plan Duration</th>
              <th>Plan Expiry</th>

              <th>Subscriber</th>
              <th>Txn ID</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Loading…
                </td>
              </tr>
            ) : err ? (
              <tr>
                <td colSpan="9" className="text-danger text-center">
                  {err}
                </td>
              </tr>
            ) : rows?.length ? (
              rows.map((r, idx) => (
                <tr key={r.historyId}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{r.planId || "-"}</td>
                  <td>{r.plan?.planTitle || r.planName || "-"}</td>
                  <td>{Number(r.amount)?.toFixed(2)} €</td>
                  <td>{formatDateToDDMMYYYY(r.paymentDate)}</td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (r.paymentStatus === "Paid"
                          ? "bg-success"
                          : r.paymentStatus === "Failed"
                          ? "bg-danger"
                          : "bg-warning")
                      }
                    >
                      {r.paymentStatus}
                    </span>
                  </td>

                  <td>{r.plan ? `${r.purchasedUnits || ""}`.trim() : "-"}</td>
                  <td>
                    {r.plan ? `${r.plan?.planDuration || ""}`.trim() : "-"}
                    days
                  </td>
                  <td>
                    {r.subscriber
                      ? `${
                          formatDateToDDMMYYYY(r.subscriber.planExpiry) || ""
                        }`.trim()
                      : "-"}
                  </td>
                  <td>
                    {/* subscriber’s owning user if included */}
                    {r.subscriber?.subscriberUser
                      ? `${r.subscriber.subscriberUser.firstName || ""} ${
                          r.subscriber.subscriberUser.lastName || ""
                        }`.trim()
                      : "-"}
                    <div className="text-muted">
                      {r.subscriber?.subscriberUser?.email || ""}
                    </div>
                  </td>

                  <td
                    style={{
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {r.transactionId}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / totals */}
      <div className="mt-12 d-flex align-items-center justify-content-between">
        <span className="text-muted">
          Showing {rows.length ? startIndex + 1 : 0}–
          {Math.min(startIndex + rows.length, pagination.total)} of{" "}
          {pagination.total}
        </span>
      </div>

      {/* Pagination */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-16">
        <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
          <li
            className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}
          >
            <Link
              to="#"
              className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              {/* <Icon icon="ep:d-arrow-left" /> */} ‹
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
              {/* <Icon icon="ep:d-arrow-right" /> */} ›
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IncomeManagementBySubscriptionComp;
