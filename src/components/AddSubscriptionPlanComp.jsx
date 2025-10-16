import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { MdModeEdit } from "react-icons/md";
import { DiscountModal } from "./DiscountManager";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AddSubscriptionPlan = () => {
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

  // defaults
  const [formData, setFormData] = useState({
    basePrice: "1.99", // €1.99 by default
    planTitle: "",
    planDescription: "",
    planDuration: "",
    planUnits: "1", // default 1 unit (no min-3)
    planPrice: "1.99", // 1.99 * 1
    isActive: true,
    features: {
      freeAccount: false,
      prepaidUnits: "",
      historySaving: "",
      bestPricePerUnit: false,
    },
  });

  // Recalculate price whenever basePrice or planUnits change (no clamping)
  useEffect(() => {
    const base = parseFloat(formData.basePrice) || 0;
    const unitsNum = parseInt(formData.planUnits || "0", 10) || 0;
    const total = (base * unitsNum).toFixed(2);

    if (formData.planPrice !== total) {
      setFormData((prev) => ({
        ...prev,
        planPrice: total,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.basePrice, formData.planUnits]);

  const [errors, setErrors] = useState({});

  // ✅ Validate before submit
  const validate = () => {
    let newErrors = {};

    if (!formData.planTitle.trim()) newErrors.planTitle = "Title is required";
    if (!formData.planDescription.trim())
      newErrors.planDescription = "Description is required";

    if (!formData.planDuration) newErrors.planDuration = "Duration is required";
    else if (Number(formData.planDuration) <= 0)
      newErrors.planDuration = "Duration must be greater than 0";

    // base price > 0
    if (formData.basePrice === "" || Number(formData.basePrice) <= 0)
      newErrors.basePrice = "Base price must be greater than 0";

    // any positive integer units
    if (!formData.planUnits) newErrors.planUnits = "Units are required";
    else if (Number(formData.planUnits) <= 0)
      newErrors.planUnits = "Units must be greater than 0";

    // planPrice is auto; still guard against 0
    if (!formData.planPrice || Number(formData.planPrice) <= 0)
      newErrors.planPrice = "Price must be greater than 0";

    if (!formData.features.historySaving.trim())
      newErrors.historySaving = "History saving period is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData.features) {
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
      return;
    }

    // normal fields (no min-3 clamp for planUnits)
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const getSubscriptionPlans = async (page = 1) => {
    try {
      const response = await axios.get(
        BASE_URL + "/payment/plans-with-pagination",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            page,
            limit: pagination.limit,
            search: searchTerm || undefined,
            numberPlate: searchTerm || undefined,
            userType: userType || undefined,
            checkType: checkType || undefined,
          },
        }
      );

      setSubscriptionPlans(response?.data?.data || []);
      setPagination(response?.data?.pagination || pagination);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  useEffect(() => {
    getSubscriptionPlans(pagination.page, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.post(
        BASE_URL + "/payment/create-plan",
        formData,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      Swal.fire({
        title: "Thank You!",
        text: "Plan added successfully!",
        icon: "success",
      });

      // reset to defaults (keep base price 1.99, 1 unit, auto price)
      setFormData({
        basePrice: "1.99",
        planTitle: "",
        planDescription: "",
        planDuration: "",
        planUnits: "1",
        planPrice: "1.99",
        isActive: true,
        features: {
          freeAccount: false,
          prepaidUnits: "",
          historySaving: "",
          bestPricePerUnit: false,
        },
      });

      getSubscriptionPlans(pagination.page, searchTerm);
    } catch (error) {
      console.error("Error adding plan:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message || "Failed to add plan",
      });
    }
  };

  const handleDelete = async (planId) => {
    try {
      if (planId) {
        await axios.delete(BASE_URL + `/payment/delete-plan/${planId}`);
        Swal.fire({
          title: "Thank You!",
          text: "Plan Deleted successfully!",
          icon: "success",
        });
        getSubscriptionPlans(pagination.page, searchTerm);
      }
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message,
      });
    }
  };

  const toggleSubscriptionPlan = async (planId) => {
    try {
      await axios.put(BASE_URL + `/payment/toggle-plan/${planId}`);
      Swal.fire({
        title: "Thank You!",
        text: "Plan Status Changed successfully!",
        icon: "success",
      });
      getSubscriptionPlans(pagination.page, searchTerm);
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message,
      });
    }
  };

  const [modalShow, setModalShow] = useState(false);
  const [discountPlanId, setDiscountPlanId] = useState("");

  const handleSave = async (discount) => {
    try {
      const res = await fetch(
        BASE_URL + `/payment/discount/${discountPlanId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ discountPercent: Number(discount) }),
        }
      );
      await res.json();
      setModalShow(false);
      getSubscriptionPlans(pagination.page, searchTerm);
      setDiscountPlanId("");
      Swal.fire({
        title: "Thank You!",
        text: "Discount added successfully!",
        icon: "success",
      });
    } catch (err) {
      console.error("Error updating discount", err);
    }
  };

  const handleDiscount = (planId) => {
    setDiscountPlanId(planId);
    setModalShow(true);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-sm-12">
          <div className="card p-3">
            <h6>Add Subscription Plan</h6>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Base Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-control ${
                    errors.basePrice ? "is-invalid" : ""
                  }`}
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                />
                {errors.basePrice && (
                  <div className="invalid-feedback">{errors.basePrice}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">Plan Title</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.planTitle ? "is-invalid" : ""
                  }`}
                  name="planTitle"
                  value={formData.planTitle}
                  onChange={handleChange}
                />
                {errors.planTitle && (
                  <div className="invalid-feedback">{errors.planTitle}</div>
                )}
              </div>

              <div className="col-md-12">
                <label className="form-label">Plan Description</label>
                <textarea
                  className={`form-control ${
                    errors.planDescription ? "is-invalid" : ""
                  }`}
                  name="planDescription"
                  value={formData.planDescription}
                  onChange={handleChange}
                />
                {errors.planDescription && (
                  <div className="invalid-feedback">
                    {errors.planDescription}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">Duration (days)</label>
                <input
                  type="number"
                  className={`form-control ${
                    errors.planDuration ? "is-invalid" : ""
                  }`}
                  name="planDuration"
                  value={formData.planDuration}
                  onChange={handleChange}
                />
                {errors.planDuration && (
                  <div className="invalid-feedback">{errors.planDuration}</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">Units</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={`form-control ${
                    errors.planUnits ? "is-invalid" : ""
                  }`}
                  name="planUnits"
                  value={formData.planUnits}
                  onChange={handleChange}
                />
                {errors.planUnits && (
                  <div className="invalid-feedback">{errors.planUnits}</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${
                    errors.planPrice ? "is-invalid" : ""
                  }`}
                  name="planPrice"
                  value={formData.planPrice}
                  readOnly // 🔒 auto-calculated
                />
                {errors.planPrice && (
                  <div className="invalid-feedback">{errors.planPrice}</div>
                )}
              </div>

              <div className="col-md-6 form-check d-flex align-items-center">
                <input
                  className="form-check-input ms-3"
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label className="form-check-label ms-2">Active</label>
              </div>

              <hr />
              <h6>Features</h6>

              <div className="col-md-6 form-check d-flex align-items-center">
                <input
                  className="form-check-input ms-3"
                  type="checkbox"
                  name="freeAccount"
                  checked={formData.features.freeAccount}
                  onChange={handleChange}
                />
                <label className="form-check-label ms-3">Free Account</label>
              </div>
              <div className="col-md-6 form-check d-flex align-items-center">
                <input
                  className="form-check-input ms-3"
                  type="checkbox"
                  name="bestPricePerUnit"
                  checked={formData.features.bestPricePerUnit}
                  onChange={handleChange}
                />
                <label className="form-check-label ms-3">
                  Best Price Per Unit
                </label>
              </div>
              <div className="col-md-6">
                <label className="form-label">Prepaid Units</label>
                <input
                  type="number"
                  className="form-control"
                  name="prepaidUnits"
                  value={formData.features.prepaidUnits}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">History Saving</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.historySaving ? "is-invalid" : ""
                  }`}
                  name="historySaving"
                  value={formData.features.historySaving}
                  onChange={handleChange}
                />
                {errors.historySaving && (
                  <div className="invalid-feedback">{errors.historySaving}</div>
                )}
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Save Plan
                </button>
              </div>
            </form>
          </div>

          <div className="card-body p-24">
            <div className="table-responsive scroll-sm">
              <table className="table bordered-table sm-table mb-0">
                <thead>
                  <tr>
                    <th>Sr N°</th>
                    <th>Plan Title</th>
                    <th>Plan Description</th>
                    <th>Plan Price</th>
                    <th>Plan Duration </th>
                    <th className="text-center">Action </th>
                    <th>Activate/Deactivate </th>
                    <th>Discount </th>
                  </tr>
                </thead>

                <tbody>
                  {subscriptionPlans.length > 0 ? (
                    subscriptionPlans?.map((item, index) => {
                      return (
                        <tr key={item.planId || index}>
                          <td>{index + 1} </td>
                          <td>{item.planTitle}</td>
                          <td>{item.planDescription}</td>
                          <td>{item.planPrice} €</td>
                          <td>{item.planDuration} Days</td>
                          <td>
                            <div className="text-center d-flex align-items-center justify-content-center">
                              <Link
                                to={`/view-subscription-plan/${item.planId}`}
                              >
                                <GrFormView
                                  style={{
                                    fontSize: "27px",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>

                              <Link
                                to={`/update-subscription-plan/${item.planId}`}
                              >
                                <MdModeEdit
                                  style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>

                              <MdDelete
                                style={{ fontSize: "20px", cursor: "pointer" }}
                                onClick={() => handleDelete(item?.planId)}
                              />
                            </div>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm custum-btn-primary"
                              onClick={() =>
                                toggleSubscriptionPlan(item?.planId)
                              }
                            >
                              {item?.isActive ? "Disable" : "Enable"}
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm custum-btn-primary"
                              onClick={() => handleDiscount(item?.planId)}
                            >
                              Add Discount
                            </button>
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
                to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} entries
              </span>

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

            <DiscountModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubscriptionPlan;

// =========================================
// const AddSubscriptionPlan = () => {
//   const token = localStorage.getItem("token");
//   const [data, setData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [checkType, setCheckType] = useState("");
//   const [userType, setUserType] = useState(""); // for userType filter
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 1,
//   });

//   // defaults
//   const [formData, setFormData] = useState({
//     basePrice: "1.99", // €1.99 by default
//     planTitle: "",
//     planDescription: "",
//     planDuration: "",
//     planUnits: "3", // min 3 units by default
//     planPrice: "5.97", // 1.99 * 3
//     isActive: true,
//     features: {
//       freeAccount: false,
//       prepaidUnits: "",
//       historySaving: "",
//       bestPricePerUnit: false,
//     },
//   });

//   useEffect(() => {
//     // Recalculate price whenever basePrice or planUnits change
//     const base = parseFloat(formData.basePrice) || 0;
//     const unitsNum = Math.max(3, parseInt(formData.planUnits || "0", 10) || 0);
//     const total = (base * unitsNum).toFixed(2);
//     setFormData((prev) => ({
//       ...prev,
//       planUnits: String(unitsNum),
//       planPrice: total,
//     }));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formData.basePrice, formData.planUnits]);

//   const [errors, setErrors] = useState({});

//   // ✅ Validate before submit
//   // ✅ Validate before submit
//   const validate = () => {
//     let newErrors = {};

//     if (!formData.planTitle.trim()) newErrors.planTitle = "Title is required";
//     if (!formData.planDescription.trim())
//       newErrors.planDescription = "Description is required";

//     if (!formData.planDuration) newErrors.planDuration = "Duration is required";
//     else if (Number(formData.planDuration) <= 0)
//       newErrors.planDuration = "Duration must be greater than 0";

//     // enforce minimum 3 units
//     if (!formData.planUnits) newErrors.planUnits = "Units are required";
//     else if (Number(formData.planUnits) < 3)
//       newErrors.planUnits = "Minimum 3 units";

//     // planPrice is auto; still guard against 0
//     if (!formData.planPrice || Number(formData.planPrice) <= 0)
//       newErrors.planPrice = "Price must be greater than 0";

//     if (!formData.features.historySaving.trim())
//       newErrors.historySaving = "History saving period is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name in formData.features) {
//       setFormData((prev) => ({
//         ...prev,
//         features: {
//           ...prev.features,
//           [name]: type === "checkbox" ? checked : value,
//         },
//       }));
//       return;
//     }

//     if (name === "planUnits") {
//       // clamp to minimum 3; keep numeric only
//       const nextUnits = Math.max(3, parseInt(value || "0", 10) || 0);
//       setFormData((prev) => ({ ...prev, planUnits: String(nextUnits) }));
//       return;
//     }

//     // normal fields
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // ✅ Validate before submit

//   const [subscriptionPlans, setSubscriptionPlans] = useState([]);

//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const getSubscriptionPlans = async (page = 1) => {
//     try {
//       const response = await axios.get(
//         BASE_URL + "/payment/plans-with-pagination",

//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json", // ✅ correct for JSON body
//           },

//           params: {
//             page,
//             limit: pagination.limit,
//             search: searchTerm || undefined,
//             numberPlate: searchTerm || undefined, // backend expects numberPlate
//             userType: userType || undefined, // backend expects userType
//             checkType: checkType || undefined, // in case you want dynamic checkType
//           },
//         }
//       );

//       console.log("response", response?.data?.pagination);
//       setSubscriptionPlans(response?.data?.data);
//       setPagination(response?.data?.pagination || pagination);
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= pagination.totalPages) {
//       setPagination((prev) => ({ ...prev, page }));
//     }
//   };

//   useEffect(() => {
//     getSubscriptionPlans(pagination.page, searchTerm);
//   }, [pagination.page, searchTerm]);

//   // useEffect(() => {
//   //   getSubscriptionPlans();
//   // }, []);
//   console.log("getSubscriptionPlans", subscriptionPlans);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;
//     console.log("formData", formData);
//     try {
//       const response = await axios.post(
//         BASE_URL + "/payment/create-plan",
//         formData
//       );

//       Swal.fire({
//         title: "Thank You!",
//         text: "Plan added successfully!",
//         icon: "success",
//       });

//       console.log("Response:", response.data);
//       setFormData({
//         planTitle: "",
//         planDescription: "",
//         planDuration: "",
//         planUnits: "",
//         planPrice: "",
//         isActive: true,
//         features: {
//           freeAccount: false,
//           prepaidUnits: "",
//           historySaving: "",
//           bestPricePerUnit: false,
//         },
//       });

//       getSubscriptionPlans(pagination.page, searchTerm);
//     } catch (error) {
//       console.error("Error adding plan:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: error?.response?.data?.message,
//       });
//     }
//   };

//   const handleDelete = async (planId) => {
//     try {
//       if (planId) {
//         const response = await axios.delete(
//           BASE_URL + `/payment/delete-plan/${planId}`
//         );

//         console.log("response", response);

//         Swal.fire({
//           title: "Thank You!",
//           text: "Plan Deleted successfully!",
//           icon: "success",
//         });

//         getSubscriptionPlans(pagination.page, searchTerm);
//       }
//     } catch (error) {
//       console.log("error", error);

//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: error?.response?.data?.message,
//       });
//     }
//   };

//   const toggleSubscriptionPlan = (planId) => {
//     try {
//       const toggle = axios.put(BASE_URL + `/payment/toggle-plan/${planId}`);

//       console.log("toggle", toggle);

//       Swal.fire({
//         title: "Thank You!",
//         text: "Plan Status Changed successfully!",
//         icon: "success",
//       });

//       getSubscriptionPlans(pagination.page, searchTerm);
//     } catch (error) {
//       console.log("error", error);

//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: error?.response?.data?.message,
//       });
//     }
//   };

//   const [modalShow, setModalShow] = useState(false);
//   const [discountPlanId, setDiscountPlanId] = useState("");

//   const handleSave = async (discount) => {
//     try {
//       // Call your backend API (adjust endpoint as needed)
//       const res = await fetch(
//         BASE_URL + `/payment/discount/${discountPlanId}`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ discountPercent: Number(discount) }),
//         }
//       );
//       const data = await res.json();
//       console.log("Updated plan:", data);

//       setModalShow(false);
//       getSubscriptionPlans(pagination.page, searchTerm);
//       setDiscountPlanId("");

//       Swal.fire({
//         title: "Thank You!",
//         text: "Discount added successfully!",
//         icon: "success",
//       });
//       // optionally refresh list / show toast
//     } catch (err) {
//       console.error("Error updating discount", err);
//     }
//   };

//   const handleDiscount = (planId) => {
//     // discount/:planId
//     setDiscountPlanId(planId);
//     setModalShow(true);
//   };

//   return (
//     <div className="container-fluid mt-4">
//       <div className="row">
//         <div className="col-sm-12">
//           <div className="card p-3">
//             <h6>Add Subscription Plan</h6>
//             <form onSubmit={handleSubmit} className="row g-3">
//               <div className="col-md-6">
//                 <label className="form-label">Base Price (€)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   className={`form-control ${
//                     errors.basePrice ? "is-invalid" : ""
//                   }`}
//                   name="basePrice"
//                   value={formData.basePrice}
//                   onChange={handleChange}
//                 />
//                 {errors.basePrice && (
//                   <div className="invalid-feedback">{errors.basePrice}</div>
//                 )}
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Plan Title</label>
//                 <input
//                   type="text"
//                   className={`form-control ${
//                     errors.planTitle ? "is-invalid" : ""
//                   }`}
//                   name="planTitle"
//                   value={formData.planTitle}
//                   onChange={handleChange}
//                 />
//                 {errors.planTitle && (
//                   <div className="invalid-feedback">{errors.planTitle}</div>
//                 )}
//               </div>

//               <div className="col-md-12">
//                 <label className="form-label">Plan Description</label>
//                 <textarea
//                   className={`form-control ${
//                     errors.planDescription ? "is-invalid" : ""
//                   }`}
//                   name="planDescription"
//                   value={formData.planDescription}
//                   onChange={handleChange}
//                 />
//                 {errors.planDescription && (
//                   <div className="invalid-feedback">
//                     {errors.planDescription}
//                   </div>
//                 )}
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Duration (days)</label>
//                 <input
//                   type="number"
//                   className={`form-control ${
//                     errors.planDuration ? "is-invalid" : ""
//                   }`}
//                   name="planDuration"
//                   value={formData.planDuration}
//                   onChange={handleChange}
//                 />
//                 {errors.planDuration && (
//                   <div className="invalid-feedback">{errors.planDuration}</div>
//                 )}
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Units</label>
//                 <input
//                   type="number"
//                   min="3"
//                   step="1"
//                   className={`form-control ${
//                     errors.planUnits ? "is-invalid" : ""
//                   }`}
//                   name="planUnits"
//                   value={formData.planUnits}
//                   onChange={handleChange}
//                 />
//                 {errors.planUnits && (
//                   <div className="invalid-feedback">{errors.planUnits}</div>
//                 )}
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Price (€)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className={`form-control ${
//                     errors.planPrice ? "is-invalid" : ""
//                   }`}
//                   name="planPrice"
//                   value={formData.planPrice}
//                   readOnly // 🔒 auto-calculated
//                 />
//                 {errors.planPrice && (
//                   <div className="invalid-feedback">{errors.planPrice}</div>
//                 )}
//               </div>

//               <div className="col-md-6 form-check d-flex align-items-center">
//                 <input
//                   className="form-check-input ms-3"
//                   type="checkbox"
//                   name="isActive"
//                   checked={formData.isActive}
//                   onChange={handleChange}
//                 />
//                 <label className="form-check-label ms-2">Active</label>
//               </div>

//               <hr />
//               <h6>Features</h6>

//               <div className="col-md-6 form-check d-flex align-items-center">
//                 <input
//                   className="form-check-input ms-3"
//                   type="checkbox"
//                   name="freeAccount"
//                   checked={formData.features.freeAccount}
//                   onChange={handleChange}
//                 />
//                 <label className="form-check-label ms-3">Free Account</label>
//               </div>
//               <div className="col-md-6 form-check d-flex align-items-center">
//                 <input
//                   className="form-check-input ms-3"
//                   type="checkbox"
//                   name="bestPricePerUnit"
//                   checked={formData.features.bestPricePerUnit}
//                   onChange={handleChange}
//                 />
//                 <label className="form-check-label ms-3">
//                   Best Price Per Unit
//                 </label>
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Prepaid Units</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="prepaidUnits"
//                   value={formData.features.prepaidUnits}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label">History Saving</label>
//                 <input
//                   type="text"
//                   className={`form-control ${
//                     errors.historySaving ? "is-invalid" : ""
//                   }`}
//                   name="historySaving"
//                   value={formData.features.historySaving}
//                   onChange={handleChange}
//                 />
//                 {errors.historySaving && (
//                   <div className="invalid-feedback">{errors.historySaving}</div>
//                 )}
//               </div>

//               <div className="col-12">
//                 <button type="submit" className="btn btn-primary">
//                   Save Plan
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className="card-body p-24">
//             <div className="table-responsive scroll-sm">
//               <table className="table bordered-table sm-table mb-0">
//                 <thead>
//                   <tr>
//                     <th>Sr N°</th>

//                     {/* <th>companyId</th> delete-plan/:planId */}
//                     <th>Plan Title</th>

//                     <th>Plan Description</th>
//                     <th>Plan Price</th>
//                     <th>Plan Duration </th>

//                     <th className="text-center">Action </th>
//                     <th>Activate/Deactivate </th>
//                     <th>Discount </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {subscriptionPlans.length > 0 ? (
//                     subscriptionPlans?.map((item, index) => {
//                       return (
//                         <tr>
//                           <td>{index + 1} </td>
//                           <td>{item.planTitle}</td>
//                           <td>{item.planDescription}</td>
//                           <td>{item.planPrice} €</td>
//                           <td>{item.planDuration} Days</td>
//                           <td>
//                             <div className="text-center d-flex align-items-center justify-content-center">
//                               <Link
//                                 to={`/view-subscription-plan/${item.planId}`}
//                               >
//                                 <GrFormView
//                                   style={{
//                                     fontSize: "27px",
//                                     cursor: "pointer",
//                                   }}
//                                 />
//                               </Link>

//                               <Link
//                                 to={`/update-subscription-plan/${item.planId}`}
//                               >
//                                 <MdModeEdit
//                                   style={{
//                                     fontSize: "20px",
//                                     cursor: "pointer",
//                                   }}
//                                 />
//                               </Link>

//                               <MdDelete
//                                 style={{ fontSize: "20px", cursor: "pointer" }}
//                                 onClick={() => handleDelete(item?.planId)}
//                               />
//                             </div>
//                           </td>
//                           <td>
//                             <button
//                               type="button"
//                               class="btn btn-sm custum-btn-primary"
//                               onClick={() =>
//                                 toggleSubscriptionPlan(item?.planId)
//                               }
//                             >
//                               {item?.isActive ? "Disable" : "Enable"}
//                             </button>
//                           </td>
//                           <td>
//                             <button
//                               type="button"
//                               class="btn btn-sm custum-btn-primary"
//                               onClick={() => handleDiscount(item?.planId)}
//                             >
//                               Add Discount
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr>
//                       <td colSpan="13" className="text-center">
//                         No data found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
//               <span>
//                 Showing{" "}
//                 {Math.min(
//                   (pagination.page - 1) * pagination.limit + 1,
//                   pagination.total
//                 )}{" "}
//                 to{" "}
//                 {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
//                 of {pagination.total} entries
//               </span>

//               <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
//                 <li
//                   className={`page-item ${
//                     pagination.page === 1 ? "disabled" : ""
//                   }`}
//                 >
//                   <Link
//                     to="#"
//                     className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                   >
//                     <Icon icon="ep:d-arrow-left" />
//                   </Link>
//                 </li>

//                 {Array.from({ length: pagination.totalPages }, (_, i) => (
//                   <li key={i + 1} className="page-item">
//                     <Link
//                       to="#"
//                       className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${
//                         pagination.page === i + 1
//                           ? "bg-primary-600 text-white"
//                           : "bg-neutral-200 text-secondary-light"
//                       }`}
//                       onClick={() => handlePageChange(i + 1)}
//                     >
//                       {i + 1}
//                     </Link>
//                   </li>
//                 ))}

//                 <li
//                   className={`page-item ${
//                     pagination.page === pagination.totalPages ? "disabled" : ""
//                   }`}
//                 >
//                   <Link
//                     to="#"
//                     className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                   >
//                     <Icon icon="ep:d-arrow-right" />
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <DiscountModal
//               show={modalShow}
//               onHide={() => setModalShow(false)}
//               onSave={handleSave}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSubscriptionPlan;
