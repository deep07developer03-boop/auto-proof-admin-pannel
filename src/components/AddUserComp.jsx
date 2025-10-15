import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const AddUserComp = () => {
  const token = localStorage.getItem("token");

  const [companies, setCompanies] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    password: "",
    address: "",
    gender: "",
    role: "",
    userType: "",
    companyId: "",
  });

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await axios.get(
          BASE_URL + "/super-admin-pannel/companies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // ✅ correct for JSON body
            },
          }
        );
        console.log("response of companies", response.data.data);
        setCompanies(response?.data?.data || []);
      } catch (error) {
        console.log("error fetching companies:", error);
      }
    };

    getCompanies();
  }, []); // ✅ empty array so it runs only once on mount

  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10)
      newErrors.phoneNumber = "Valid phone number required";
    if (!formData.password.trim() || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!formData.gender) newErrors.gender = "Gender required";
    if (!formData.role) newErrors.role = "Role required";
    if (!formData.userType) newErrors.userType = "User type required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Submitted Data:", {
      ...formData,
      profileImage: imagePreviewUrl || null,
    });

    axios
      .post(
        BASE_URL + "/super-admin-pannel/add-user",
        {
          ...formData,
          profileImage: imagePreviewUrl || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            //  "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("response", response);
        if (response.status === 201) {
          Swal.fire({
            title: "Thank You",
            text: response?.data?.message || "",
            icon: "success",
          });

          handleCancel();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response?.data?.message || "",
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error?.response?.data?.message || "something went wrong",
        });
      });
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+91",
      phoneNumber: "",
      password: "",
      address: "",
      gender: "",
      role: "",
      userType: "",
      companyId: "",
    });

    setImagePreviewUrl("");
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body p-24">
        <div className="row justify-content-center">
          <div className="col-xxl-12 col-xl-12 col-lg-12">
            <div className="card border">
              <div className="card-body">
                <h6 className="text-md text-primary-light mb-16">
                  Profile Image
                </h6>
                {/* Upload Image Start */}
                <div className="mb-24 mt-16">
                  <div className="avatar-upload">
                    <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                      >
                        <Icon icon="solar:camera-outline" className="icon" />
                      </label>
                    </div>
                    <div className="avatar-preview">
                      <div
                        id="imagePreview"
                        style={{
                          backgroundImage: imagePreviewUrl
                            ? `url(${imagePreviewUrl})`
                            : "",
                          width: "100px",
                          height: "100px",
                          backgroundSize: "cover",
                          borderRadius: "50%",

                          marginTop: "24px",
                          marginLeft: "25px",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* Upload Image End */}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* First Name */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        className="form-control radius-8"
                        placeholder="Enter First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {errors.firstName && (
                        <div className="text-danger">{errors.firstName}</div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        className="form-control radius-8"
                        placeholder="Enter Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {errors.lastName && (
                        <div className="text-danger">{errors.lastName}</div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    {/* Email */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        id="email"
                        className="form-control radius-8"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <div className="text-danger">{errors.email}</div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">Phone *</label>
                      <div className="d-flex gap-2">
                        {/* Country Code Select */}
                        <select
                          id="countryCode"
                          className="form-control radius-8"
                          style={{ maxWidth: "140px" }}
                          value={formData.countryCode}
                          onChange={handleChange}
                        >
                          <option value="">Code</option>
                          <option value="+1">🇺🇸 +1 (USA)</option>
                          <option value="+44">🇬🇧 +44 (UK)</option>
                          <option value="+49">🇩🇪 +49 (Germany)</option>
                          <option value="+33">🇫🇷 +33 (France)</option>
                          <option value="+61">🇦🇺 +61 (Australia)</option>
                          <option value="+91">🇮🇳 +91 (India)</option>
                          <option value="+81">🇯🇵 +81 (Japan)</option>
                          <option value="+971">🇦🇪 +971 (UAE)</option>
                        </select>

                        {/* Phone Number Input */}
                        <input
                          type="text"
                          id="phoneNumber"
                          className="form-control radius-8"
                          placeholder="Enter Phone"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Validation Errors */}
                      {errors.countryCode && (
                        <div className="text-danger">{errors.countryCode}</div>
                      )}
                      {errors.phoneNumber && (
                        <div className="text-danger">{errors.phoneNumber}</div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    {/* Password */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">Password *</label>
                      <input
                        type="password"
                        id="password"
                        className="form-control radius-8"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && (
                        <div className="text-danger">{errors.password}</div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">Address *</label>
                      <input
                        type="text"
                        id="address"
                        className="form-control radius-8"
                        placeholder="Enter Address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errors.address && (
                        <div className="text-danger">{errors.address}</div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    {/* Gender */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">Gender *</label>
                      <select
                        id="gender"
                        className="form-control radius-8"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                      {errors.gender && (
                        <div className="text-danger">{errors.gender}</div>
                      )}
                    </div>

                    {/* Role */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">Role *</label>
                      <select
                        id="role"
                        className="form-control radius-8"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="">Select Role</option>
                        <option value="SUPERADMIN">Super Admin</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      {errors.role && (
                        <div className="text-danger">{errors.role}</div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    {/* User Type */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">User Type *</label>
                      <select
                        id="userType"
                        className="form-control radius-8"
                        value={formData.userType}
                        onChange={handleChange}
                      >
                        <option value="">Select User Type</option>
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                      </select>
                      {errors.userType && (
                        <div className="text-danger">{errors.userType}</div>
                      )}
                    </div>

                    {/* Company Id (Optional) */}
                    {/* Company (Optional) */}
                    <div className="col-md-6 mb-20">
                      <label className="form-label">Company</label>
                      <select
                        id="companyId"
                        className="form-control radius-8 form-select"
                        value={formData.companyId || ""} // controlled input
                        onChange={handleChange}
                      >
                        <option value="">Select a company</option>
                        {companies &&
                          companies.map((item) => (
                            <option key={item.companyId} value={item.companyId}>
                              {item.companyName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserComp;
