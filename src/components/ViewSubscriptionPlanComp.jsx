import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { MdModeEdit } from "react-icons/md";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ViewSubscriptionPlanComp = () => {
  const { planId } = useParams();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    planTitle: "",
    planDescription: "",
    planDuration: "", // number in UI but hold as string, convert on submit
    planUnits: "1",
    planPrice: "", // convert to string/decimal as backend expects
    isActive: true,
    features: {
      freeAccount: false,
      prepaidUnits: "",
      historySaving: "",
      bestPricePerUnit: false,
    },
    discountPercent: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.planTitle.trim()) e.planTitle = "Title is required";
    if (!formData.planDescription.trim())
      e.planDescription = "Description is required";
    if (!formData.planDuration || Number(formData.planDuration) <= 0)
      e.planDuration = "Duration must be > 0";
    if (formData.planPrice === "" || Number(formData.planPrice) < 0)
      e.planPrice = "Price must be ≥ 0";
    if (!String(formData.features.historySaving ?? "").trim())
      e.historySaving = "History saving period is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/payment/view-plan/${planId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        // Some APIs return {success, data: {...}}, others return the object directly
        const plan = res?.data?.data ?? res?.data ?? {};

        // Map safely (adjust features keys to your backend schema)
        setFormData({
          planTitle: plan.planTitle ?? "",
          planDescription: plan.planDescription ?? "",
          planDuration: String(plan.planDuration ?? ""),
          planUnits: String(plan.planUnits ?? "0"),
          planPrice: String(plan.planPrice ?? ""),
          isActive: plan.isActive ?? true,
          discountPercent: plan?.discountPercent,
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

  console.log("formData", formData);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-sm-12">
          <div className="card p-3">
            <div className="row">
              <div className="col-sm-3">
                <h6>Plan Title</h6>
                <p>{formData.planTitle || "—"}</p>
              </div>

              <div className="col-sm-3">
                <h6>Plan Description</h6>
                <p>{formData.planDescription || "—"}</p>
              </div>

              <div className="col-sm-3">
                <h6>Plan Duration</h6>
                <p>{formData.planDuration || "—"}</p>
              </div>

              <div className="col-sm-3">
                <h6>Plan Units</h6>
                <p>{formData.planUnits || "—"}</p>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-sm-3">
                <h6>Plan Price</h6>
                <p>{formData.planPrice || "—"}</p>
              </div>

              <div className="col-sm-3">
                <h6>isActive</h6>
                <p>{(formData?.isActive && "Yes") || "No"}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <h6>Features</h6>
                <p>freeAccount: {formData?.features?.freeAccount || "—"}</p>
                <p>prepaidUnits: {formData?.features?.prepaidUnits || "—"}</p>
                <p>historySaving: {formData?.features?.historySaving || "—"}</p>
                <p>
                  bestPricePerUnit:{" "}
                  {formData?.features?.bestPricePerUnit || "—"}
                </p>
                <p>discountPercent: {formData?.discountPercent || "—"} % </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubscriptionPlanComp;
