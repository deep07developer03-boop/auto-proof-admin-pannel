import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const DashBoardLayerNine = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    bannerImage: null,
    defaultImage: null,
  });

  const [errors, setErrors] = useState({});

  // handle text/date input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle file input
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  // validation function
  const validate = () => {
    const newErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End Date is required";
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = "End Date must be after Start Date";
    }

    if (!formData.bannerImage) {
      newErrors.bannerImage = "Banner Image is required";
    }
    if (!formData.defaultImage) {
      newErrors.defaultImage = "Default Image is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // handle submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        // Build FormData for multipart/form-data
        const data = new FormData();
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("bannerImage", formData.bannerImage); // file
        data.append("defaultImage", formData.defaultImage); // file

        const response = await axios.post(
          BASE_URL + `/super-admin-pannel/add-advertisement`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("response", response);

        Swal.fire({
          title: "Thank You!",
          text: response?.data?.message,
          icon: "success",
        });
      } catch (error) {
        console.error("Upload failed:", error);
        Swal.fire("Error uploading advertisement");
      }
    } else {
      Swal.fire("Validation Failed");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card p-3">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-control"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                  {errors.startDate && (
                    <small className="text-danger">{errors.startDate}</small>
                  )}
                </div>

                <div className="col mb-3">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    className="form-control"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                  {errors.endDate && (
                    <small className="text-danger">{errors.endDate}</small>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label htmlFor="bannerImage" className="form-label">
                    Banner Image
                  </label>
                  <input
                    type="file"
                    name="bannerImage"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                  {errors.bannerImage && (
                    <small className="text-danger">{errors.bannerImage}</small>
                  )}
                </div>

                <div className="col">
                  <label htmlFor="defaultImage" className="form-label">
                    Default Image
                  </label>
                  <input
                    type="file"
                    name="defaultImage"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                  {errors.defaultImage && (
                    <small className="text-danger">{errors.defaultImage}</small>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardLayerNine;
