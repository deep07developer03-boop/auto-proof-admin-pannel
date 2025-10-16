import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { MdModeEdit } from "react-icons/md";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const toMoney = (n) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

const UpdateSubscriptionPlanComp = () => {
  const { planId } = useParams();
  const token = localStorage.getItem("token");

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

  const [errors, setErrors] = useState({});

  // ---------- Validation ----------
  const validate = () => {
    const newErrors = {};

    if (!formData.planTitle.trim()) newErrors.planTitle = "Title is required";
    if (!formData.planDescription.trim())
      newErrors.planDescription = "Description is required";

    if (!formData.planDuration) newErrors.planDuration = "Duration is required";
    else if (Number(formData.planDuration) <= 0)
      newErrors.planDuration = "Duration must be greater than 0";

    if (formData.basePrice === "" || Number(formData.basePrice) <= 0)
      newErrors.basePrice = "Base price must be greater than 0";

    if (!formData.planUnits) newErrors.planUnits = "Units are required";
    else if (Number(formData.planUnits) <= 0)
      newErrors.planUnits = "Units must be greater than 0";

    if (!formData.planPrice || Number(formData.planPrice) <= 0)
      newErrors.planPrice = "Price must be greater than 0";

    if (!formData.features.historySaving.trim())
      newErrors.historySaving = "History saving period is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Load existing plan ----------
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/payment/view-plan/${planId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const plan = res?.data?.data ?? res?.data ?? {};

        const base = Number(plan.basePrice ?? 1.99);
        const units = Number.isFinite(Number(plan.planUnits))
          ? Number(plan.planUnits)
          : 1;

        const price =
          (Number.isFinite(base) ? base : 0) *
          (Number.isFinite(units) ? units : 0);

        setFormData({
          basePrice: toMoney(Number.isFinite(base) ? base : 1.99),
          planTitle: plan.planTitle ?? "",
          planDescription: plan.planDescription ?? "",
          planDuration: String(plan.planDuration ?? ""),
          planUnits: String(units),
          planPrice: toMoney(price),
          isActive: plan.isActive ?? true,
          features: {
            freeAccount: !!plan.features?.freeAccount,
            prepaidUnits: String(plan.features?.prepaidUnits ?? ""),
            historySaving: String(plan.features?.historySaving ?? ""),
            bestPricePerUnit: !!plan.features?.bestPricePerUnit,
          },
        });
      } catch (err) {
        console.error("Fetch plan failed:", err?.response?.data || err.message);
      }
    })();
  }, [planId, token]);

  // ---------- Auto-calc planPrice whenever basePrice or planUnits change ----------
  useEffect(() => {
    const base = parseFloat(formData.basePrice);
    const units = parseInt(formData.planUnits || "0", 10);
    const total = toMoney(
      (Number.isFinite(base) ? base : 0) * (Number.isFinite(units) ? units : 0)
    );

    if (formData.planPrice !== total) {
      setFormData((prev) => ({ ...prev, planPrice: total }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.basePrice, formData.planUnits]);

  // ---------- Change handler ----------
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

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      basePrice: String(toMoney(parseFloat(formData.basePrice) || 0)),
      planDuration: Number(formData.planDuration),
      planUnits: Number(formData.planUnits ?? 0),
      planPrice: String(formData.planPrice), // keep as string if DECIMAL in DB
    };

    try {
      const res = await axios.put(
        `${BASE_URL}/payment/update-plan/${planId}`,
        payload,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      Swal.fire({
        title: "Updated!",
        text: "Plan updated successfully.",
        icon: "success",
      });
      console.log("Update response:", res.data);
    } catch (err) {
      console.error("Update failed:", err?.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err?.response?.data?.message || "Failed to update plan",
      });
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-sm-12">
          <div className="card p-3">
            <h6>Update Subscription Plan</h6>
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
                  readOnly
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
        </div>
      </div>
    </div>
  );
};

export default UpdateSubscriptionPlanComp;

// ====================================================
// const toMoney = (n) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

// const UpdateSubscriptionPlanComp = () => {
//   const { planId } = useParams();
//   const token = localStorage.getItem("token");

//   const [formData, setFormData] = useState({
//     basePrice: "1.99", // €1.99 by default
//     planTitle: "",
//     planDescription: "",
//     planDuration: "",
//     planUnits: "", // min 3 units by default
//     planPrice: "1.99", // 1.99 * 3
//     isActive: true,
//     features: {
//       freeAccount: false,
//       prepaidUnits: "",
//       historySaving: "",
//       bestPricePerUnit: false,
//     },
//   });

//   const [errors, setErrors] = useState({});

//   // ---------- Validation ----------
//   const validate = () => {
//     const newErrors = {};

//     if (!formData.planTitle.trim()) newErrors.planTitle = "Title is required";
//     if (!formData.planDescription.trim())
//       newErrors.planDescription = "Description is required";

//     if (!formData.planDuration) newErrors.planDuration = "Duration is required";
//     else if (Number(formData.planDuration) <= 0)
//       newErrors.planDuration = "Duration must be greater than 0";

//     // base price > 0
//     if (formData.basePrice === "" || Number(formData.basePrice) <= 0) {
//       newErrors.basePrice = "Base price must be greater than 0";
//     }

//     // enforce minimum 3 units
//     if (!formData.planUnits) newErrors.planUnits = "Units are required";

//     // planPrice is derived; still guard against 0
//     if (!formData.planPrice || Number(formData.planPrice) <= 0)
//       newErrors.planPrice = "Price must be greater than 0";

//     if (!formData.features.historySaving.trim())
//       newErrors.historySaving = "History saving period is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ---------- Load existing plan ----------
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/payment/view-plan/${planId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//         });

//         const plan = res?.data?.data ?? res?.data ?? {};

//         const base = Number(plan.basePrice ?? 1.99);
//         const rawUnits = Number(plan.planUnits ?? 0);
//         const units = Number(plan.rawUnits ?? 0);
//         const price = base * units;

//         setFormData({
//           basePrice: toMoney(Number.isFinite(base) ? base : 1.99),
//           planTitle: plan.planTitle ?? "",
//           planDescription: plan.planDescription ?? "",
//           planDuration: String(plan.planDuration ?? ""),
//           planUnits: String(units),
//           planPrice: toMoney(price),
//           isActive: plan.isActive ?? true,
//           features: {
//             freeAccount: !!plan.features?.freeAccount,
//             prepaidUnits: String(plan.features?.prepaidUnits ?? ""),
//             historySaving: String(plan.features?.historySaving ?? ""),
//             bestPricePerUnit: !!plan.features?.bestPricePerUnit,
//           },
//         });
//       } catch (err) {
//         console.error("Fetch plan failed:", err?.response?.data || err.message);
//       }
//     })();
//   }, [planId, token]);

//   // ---------- Auto-calc planPrice whenever basePrice or planUnits change ----------
//   useEffect(() => {
//     const base = parseFloat(formData.basePrice);
//     const units = Math.max(3, parseInt(formData.planUnits || "0", 10) || 0);
//     const total = toMoney((Number.isFinite(base) ? base : 0) * units);

//     // Avoid unnecessary state updates that could cause loops
//     if (formData.planUnits !== String(units) || formData.planPrice !== total) {
//       setFormData((prev) => ({
//         ...prev,
//         planUnits: String(units),
//         planPrice: total,
//       }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formData.basePrice, formData.planUnits]);

//   // ---------- Change handler ----------
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

//     // if (name === "planUnits") {
//     //   const nextUnits = Math.max(0, parseInt(value || "0", 10) || 0);
//     //   setFormData((prev) => ({ ...prev, planUnits: String(nextUnits) }));
//     //   return;
//     // }

//     // For basePrice, keep raw input but numeric-friendly; planPrice recalcs in useEffect
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // ---------- Submit ----------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const payload = {
//       ...formData,
//       basePrice: String(toMoney(parseFloat(formData.basePrice) || 0)),
//       planDuration: Number(formData.planDuration),
//       planUnits: Number(formData.planUnits ?? 0),
//       // Keep as string if your DB uses DECIMAL
//       planPrice: String(formData.planPrice),
//     };

//     try {
//       const res = await axios.put(
//         `${BASE_URL}/payment/update-plan/${planId}`,
//         payload,
//         { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
//       );

//       Swal.fire({
//         title: "Updated!",
//         text: "Plan updated successfully.",
//         icon: "success",
//       });
//       console.log("Update response:", res.data);
//     } catch (err) {
//       console.error("Update failed:", err?.response?.data || err.message);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: err?.response?.data?.message || "Failed to update plan",
//       });
//     }
//   };

//   return (
//     <div className="container-fluid mt-4">
//       <div className="row">
//         <div className="col-sm-12">
//           <div className="card p-3">
//             <h6>Update Subscription Plan</h6>
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
//                   readOnly
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
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateSubscriptionPlanComp;

// ============================================
// const UpdateSubscriptionPlanComp = () => {
//   const { planId } = useParams();
//   const token = localStorage.getItem("token");

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

//   const [errors, setErrors] = useState({});

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

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/payment/view-plan/${planId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//         });
//         // Some APIs return {success, data: {...}}, others return the object directly
//         const plan = res?.data?.data ?? res?.data ?? {};

//         // Map safely (adjust features keys to your backend schema)
//         setFormData({
//           basePrice: plan.basePrice ?? "", // €1.99 by default
//           planTitle: plan.planTitle ?? "",
//           planDescription: plan.planDescription ?? "",
//           planDuration: String(plan.planDuration ?? ""),
//           planUnits: String(plan.planUnits ?? "0"),
//           planPrice: String(plan.planPrice ?? ""),
//           isActive: plan.isActive ?? true,
//           features: {
//             freeAccount: !!plan.features?.freeAccount,
//             prepaidUnits: String(plan.features?.prepaidUnits ?? ""),
//             historySaving: String(plan.features?.historySaving ?? ""),
//             bestPricePerUnit: !!plan.features?.bestPricePerUnit,
//           },
//         });
//       } catch (err) {
//         console.error("Fetch plan failed:", err?.response?.data || err.message);
//       }
//     })();
//   }, [planId, token]);

//   // const handleChange = (e) => {
//   //   const { name, value, type, checked } = e.target;
//   //   if (name in formData.features) {
//   //     setFormData((prev) => ({
//   //       ...prev,
//   //       features: {
//   //         ...prev.features,
//   //         [name]: type === "checkbox" ? checked : value,
//   //       },
//   //     }));
//   //   } else {
//   //     if (name === "planUnits") {
//   //       // clamp to minimum 3; keep numeric only
//   //       const nextUnits = Math.max(3, parseInt(value || "0", 10) || 0);
//   //       setFormData((prev) => ({ ...prev, planUnits: String(nextUnits) }));
//   //       return;
//   //     }

//   //     setFormData((prev) => ({
//   //       ...prev,
//   //       [name]: type === "checkbox" ? checked : value,
//   //     }));
//   //   }
//   // };

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     // Convert to the types your backend expects
//     const payload = {
//       ...formData,
//       planDuration: Number(formData.planDuration),
//       planUnits: Number(formData.planUnits ?? 0),
//       // Keep planPrice as string if your DB is DECIMAL; otherwise Number()
//       planPrice: String(formData.planPrice),
//     };

//     try {
//       // UPDATE the existing plan (use your real update endpoint)
//       const res = await axios.put(
//         `${BASE_URL}/payment/update-plan/${planId}`,
//         payload,
//         { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
//       );

//       Swal.fire({
//         title: "Updated!",
//         text: "Plan updated successfully.",
//         icon: "success",
//       });
//       console.log("Update response:", res.data);
//     } catch (err) {
//       console.error("Update failed:", err?.response?.data || err.message);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: err?.response?.data?.message || "Failed to update plan",
//       });
//     }
//   };

//   console.log("formData", formData);

//   return (
//     <div className="container-fluid mt-4">
//       <div className="row">
//         <div className="col-sm-12">
//           <div className="card p-3">
//             <h6>Update Subscription Plan</h6>
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
//                 <label className="form-label">Price</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className={`form-control ${
//                     errors.planPrice ? "is-invalid" : ""
//                   }`}
//                   name="planPrice"
//                   value={formData.planPrice}
//                   onChange={handleChange}
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
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateSubscriptionPlanComp;
