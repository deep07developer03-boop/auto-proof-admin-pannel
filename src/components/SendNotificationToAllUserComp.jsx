import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const SendNotificationToAllUserComp = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.type.trim()) newErrors.type = "Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formData);

      axios
        .post(
          BASE_URL + "/super-admin-pannel/send-notification-to-all",
          formData
        )
        .then((response) => {
          console.log("response", response);

          Swal.fire({
            title: "Thank You!",
            text: "Notification sent to all users successfully",
            icon: "success",
          });

          setFormData({
            title: "",
            message: "",
            type: "",
          });
        })
        .catch((error) => {
          console.log("error", error);

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });

          setFormData({
            title: "",
            message: "",
            type: "",
          });
        });
    } else {
      Swal.fire("Validation failed! Please fill all required fields.");
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-sm-12">
          <div className="card shadow " style={{ padding: "20px" }}>
            {/* <h4 className="mb-4 text-center">Send Notification To All Users</h4> */}

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                {/* Title */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>

                {/* Type */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`form-select ${errors.type ? "is-invalid" : ""}`}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="info">INFO</option>
                    <option value="alert">ALERT</option>
                    <option value="warning">WARNING</option>
                    <option value="system">SYSTEM</option>
                  </select>
                  {errors.type && (
                    <div className="invalid-feedback">{errors.type}</div>
                  )}
                </div>
              </div>

              {/* Message (full row) */}
              <div className="mb-3">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className={`form-control ${
                    errors.message ? "is-invalid" : ""
                  }`}
                />
                {errors.message && (
                  <div className="invalid-feedback">{errors.message}</div>
                )}
              </div>

              {/* Submit button */}
              <div className="text-center">
                <button type="submit" className="btn btn-primary px-5">
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotificationToAllUserComp;
