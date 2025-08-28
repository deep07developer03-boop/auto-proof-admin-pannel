import React, { useState } from "react";
import axios from "axios";

const EditSubscriptionPlanCom = () => {
  const [formData, setFormData] = useState({
    planTitle: "",
    planDescription: "",
    planDuration: "",
    planUnits: "",
    planPrice: "",
    isActive: true,
    features: {
      freeAccount: false,
      prepaidUnits: "",
      historySaving: "",
      bestPricePerUnit: false,
    },
  });

  const [errors, setErrors] = useState({});

  // ✅ Validate before submit
  const validate = () => {
    let newErrors = {};

    if (!formData.planTitle.trim()) newErrors.planTitle = "Title is required";
    if (!formData.planDescription.trim())
      newErrors.planDescription = "Description is required";

    if (!formData.planDuration) newErrors.planDuration = "Duration is required";
    else if (formData.planDuration <= 0)
      newErrors.planDuration = "Duration must be greater than 0";

    if (!formData.planUnits) newErrors.planUnits = "Units are required";
    else if (formData.planUnits <= 0)
      newErrors.planUnits = "Units must be greater than 0";

    if (!formData.planPrice) newErrors.planPrice = "Price is required";
    else if (formData.planPrice <= 0)
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
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/subscription-plan",
        formData
      );
      alert("Plan added successfully ✅");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error adding plan:", error);
      alert("Failed to add plan ❌");
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-sm-12">
          <div className="card p-3">
            <h6>Add Subscription Plan</h6>
            <form onSubmit={handleSubmit} className="row g-3">
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
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${
                    errors.planPrice ? "is-invalid" : ""
                  }`}
                  name="planPrice"
                  value={formData.planPrice}
                  onChange={handleChange}
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

export default EditSubscriptionPlanCom;
