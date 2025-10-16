import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useEffect } from "react";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const ViewPageComp = () => {
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState("");

  const [imagePreview, setImagePreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3682/3682281.png"
  );

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Toggle function for password field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Toggle function for confirm password field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // const readURL = (input) => {
  //   if (input.target.files && input.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImagePreview(e.target.result);
  //     };
  //     reader.readAsDataURL(input.target.files[0]);
  //   }
  // };

  useEffect(() => {
    const getProfileData = () => {
      axios
        .get(BASE_URL + "/super-admin-pannel/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ correct for JSON body
          },
        })
        .then((response) => {
          console.log("response of profile", response.data.data);

          setProfileData(response?.data?.data);
          setImagePreview(response?.data?.data?.profileImage);

          setFormData({
            firstName: response?.data?.data?.firstName,
            lastName: response?.data?.data?.lastName,
            email: response?.data?.data?.email,
            isEmailVerified: response?.data?.data?.isEmailVerified,
            profileImage: response?.data?.data?.profileImage,
            countryCode: response?.data?.data?.countryCode,
            phoneNumber: response?.data?.data?.phoneNumber,
            isPhoneNumberVerified: response?.data?.data?.isPhoneNumberVerified,
            password: response?.data?.data?.password,
            address: response?.data?.data?.address,
            gender: response?.data?.data?.gender,
            // role: response?.data?.data?.role,
            role: "",
            userType: "individual",
            isActive: true,
            termsAndConditions: false,
            companyId: response?.data?.data?.companyId,
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    getProfileData();
  }, []);

  // console.log("profileData", profileData);

  // =================================
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    isEmailVerified: false,
    profileImage: null,
    countryCode: "+1",
    phoneNumber: "",
    isPhoneNumberVerified: false,
    password: "",
    address: "",
    gender: "MALE",
    role: "ADMIN",
    userType: "individual",
    isActive: true,
    termsAndConditions: false,
    companyId: "",
  });

  console.log("formData", formData);
  // const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // 📌 Handle input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // 📌 Handle Image Upload
  const readURL = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 📌 Validate fields
  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.countryCode)
      newErrors.countryCode = "Country code is required";

    if (!/^\+\d{1,3}$/.test(formData.countryCode)) {
      newErrors.countryCode = "Invalid country code (e.g. +1)";
    }

    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    else if (!/^[0-9]{8,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone must be 8–15 digits";
    }

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📌 Handle submit
  const handleSubmit = () => {
    // if (!validate()) return;

    console.log("Form Data Submitted:", formData.profileImage);

    const data = new FormData();

    // Append text fields
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("countryCode", formData.countryCode);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("gender", formData.gender);
    data.append("role", "admin");
    data.append("userType", formData.userType);
    data.append("address", formData.address);
    data.append("isActive", formData.isActive);
    data.append("companyId", formData.companyId);

    // Append file only if selected
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }
    console.log("Form Data Submitted:", formData.profileImage, data);
    axios
      .post(BASE_URL + `/super-admin-pannel/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // ✅ optional, axios can also auto-set it
        },
      })
      .then((response) => {
        console.log("response", response);
        if (response.status == 200) {
          Swal.fire({
            title: "Thank you!",
            text: response?.data?.message,
            icon: "success",
          });
        } else {
          Swal.fire(response?.data?.message);
        }
      })
      .catch((error) => {
        console.log("error", error);
        Swal.fire(error?.response?.data?.message);
      });
  };

  // =========================================================================================
  const [formData2, setFormData2] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors2, setErrors2] = useState({});

  const [oldPasswordVisible2, setOldPasswordVisible2] = useState(false);
  const [newPasswordVisible2, setNewPasswordVisible2] = useState(false);
  const [confirmPasswordVisible2, setConfirmPasswordVisible2] = useState(false);

  // Toggle functions
  const toggleOldPasswordVisibility1 = () => {
    setOldPasswordVisible2((prev) => !prev);
  };

  const toggleNewPasswordVisibility2 = () => {
    setNewPasswordVisible2((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility3 = () => {
    setConfirmPasswordVisible2((prev) => !prev);
  };

  // Handle input change
  const handleChange2 = (e) => {
    setFormData2({ ...formData2, [e.target.name]: e.target.value }); // ✅ use setFormData2
    setErrors2({ ...errors2, [e.target.name]: "" }); // ✅ use setErrors2
  };

  // Validate form
  const validateForm2 = () => {
    let newErrors = {};
    if (!formData2.oldPassword)
      newErrors.oldPassword = "Old password is required";
    if (!formData2.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData2.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!formData2.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData2.newPassword !== formData2.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors2(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit2 = (e) => {
    e.preventDefault();
    if (validateForm2()) {
      console.log("Submitted values:", formData2, {
        old_password: formData2.oldPassword,
        new_password: formData2.newPassword,
      }); // ✅ fixed to formData2
      alert("Password change form submitted! Check console.");

      axios
        .post(
          BASE_URL + `/super-admin-pannel/change-passowrd`,
          {
            old_password: formData2.oldPassword,
            new_password: formData2.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkNmZhMWMxLTRhNzEtNGQyNi04ZDFjLWQxNzRkMjUzOTRmNCIsInJvbGUiOiJTVVBFUkFETUlOIiwiZW1haWwiOiJzdXBlcmFkbWluQHlvcG1haWwuY29tIiwiaWF0IjoxNzU2NDU5NTU2LCJleHAiOjE3NTY1NDU5NTZ9.OM2JAvJtT8c2tRmY1De0T7FgXhfU0KVQKr2KhNHNlR0`, // ✅ attach token here
              "Content-Type": "application/json", // ✅ correct for JSON body
            },
          }
        )
        .then((response) => {
          console.log("response", response);
          if (response.status == 200) {
            Swal.fire({
              title: "Thank you!",
              text: response?.data?.message,
              icon: "success",
            });

            setFormData2({
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          } else {
            Swal.fire(response?.data?.message);
          }
        })
        .catch((error) => {
          console.log("error", error);

          Swal.fire(error?.response?.data?.message);
        });
    }
  };

  return (
    <div className="row gy-4">
      <div className="col-lg-4">
        <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
          {/* <img
            src="assets/images/auto-proof_logo.png"
            alt=""
            className="w-100 object-fit-cover"
          /> */}

          <div style={{ backgroundColor: "#c2bdb2", padding: "10px" }}>
            <img
              src="assets/images/auto-proof_logo.png"
              alt=""
              class="w-100 object-fit-cover"
            />
          </div>

          <div className="pb-24 ms-16 mb-24 me-16  mt--100">
            <div className="text-center border border-top-0 border-start-0 border-end-0">
              <img
                src={imagePreview}
                alt=""
                className="border-3 border-black border-width-4-px w-200-px h-200-px rounded-circle object-fit-cover"
                style={{
                  height: "130px",
                  width: "135px",
                  borderRadius: "50%",
                  marginTop: "10px",
                  marginLeft: "7px",
                }}
              />

              {/* <FaCircleUser style={{ fontSize: "50px" }} /> */}
              <h6 className="mb-0 mt-16">
                {profileData.firstName + " " + profileData.lastName}
              </h6>
              <span className="text-secondary-light mb-16">
                {profileData.email}
              </span>
            </div>
            <div className="mt-24">
              <h6 className="text-xl mb-16">Personal Info</h6>
              <ul>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light">
                    Full Name
                  </span>
                  <span className="w-70 text-secondary-light fw-medium">
                    : {profileData.firstName + " " + profileData.lastName}
                  </span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light">
                    {" "}
                    Email
                  </span>
                  <span className="w-70 text-secondary-light fw-medium">
                    : {profileData.email}
                  </span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light">
                    {" "}
                    Phone Number
                  </span>
                  <span className="w-70 text-secondary-light fw-medium">
                    : {profileData.phoneNumber}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card h-100">
          <div className="card-body p-24">
            <ul
              className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center px-24 active"
                  id="pills-edit-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-edit-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-edit-profile"
                  aria-selected="true"
                >
                  Edit Profile
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center px-24"
                  id="pills-change-passwork-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-change-passwork"
                  type="button"
                  role="tab"
                  aria-controls="pills-change-passwork"
                  aria-selected="false"
                  tabIndex={-1}
                >
                  Change Password
                </button>
              </li>
              {/* <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center px-24"
                  id="pills-notification-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-notification"
                  type="button"
                  role="tab"
                  aria-controls="pills-notification"
                  aria-selected="false"
                  tabIndex={-1}
                >
                  Notification Settings
                </button>
              </li> */}
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-edit-profile"
                role="tabpanel"
              >
                <h6 className="text-md text-primary-light mb-16">
                  Profile Image
                </h6>

                {/* Upload Image */}
                <div className="mb-24 mt-16">
                  <div className="avatar-upload">
                    <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={readURL}
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
                        style={{
                          backgroundImage: `url(${imagePreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          height: "120px",
                          width: "120px",
                          borderRadius: "50%",
                          marginTop: "10px",
                          marginLeft: "12px",

                          //                           background-image: url(https://cdn-icons-png.flaticon.com/512/3682/3682281.png);
                          //     background-size: cover;
                          //     background-position: center center;
                          //     height: 120px;
                          //     width: 120px;
                          //     border-radius: 50%;
                          //     margin-top: 10px;
                          //     margin-left: 12px;
                          // }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form>
                  <div className="row">
                    {/* First Name */}
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          className="form-control radius-8"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        {errors.firstName && (
                          <small className="text-danger">
                            {errors.firstName}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label className="form-label">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          className="form-control radius-8"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && (
                          <small className="text-danger">
                            {errors.lastName}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          id="email"
                          className="form-control radius-8"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <small className="text-danger">{errors.email}</small>
                        )}
                      </div>
                    </div>

                    {/* Country Code */}
                    <div className="col-sm-2">
                      <div className="mb-20">
                        <label className="form-label">Country Code *</label>
                        <input
                          type="text"
                          id="countryCode"
                          className="form-control radius-8"
                          value={formData.countryCode}
                          onChange={handleChange}
                        />
                        {errors.countryCode && (
                          <small className="text-danger">
                            {errors.countryCode}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="col-sm-4">
                      <div className="mb-20">
                        <label className="form-label">Phone Number *</label>
                        <input
                          type="text"
                          id="phoneNumber"
                          className="form-control radius-8"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                        {errors.phoneNumber && (
                          <small className="text-danger">
                            {errors.phoneNumber}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Password */}

                    {/* Address */}
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          id="address"
                          className="form-control radius-8"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label className="form-label">Gender *</label>
                        <select
                          id="gender"
                          className="form-control radius-8 form-select"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label className="form-label">Role *</label>
                        <select
                          id="role"
                          className="form-control radius-8 form-select"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="SUPERADMIN">Super Admin</option>
                        </select>
                      </div>
                    </div>

                    {/* User Type */}
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label className="form-label">User Type *</label>
                        <select
                          id="userType"
                          className="form-control radius-8 form-select"
                          value={formData.userType}
                          onChange={handleChange}
                        >
                          <option value="individual">Individual</option>
                          <option value="company">Company</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="button"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                      onClick={() => setFormData({})}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn custum-btn-primary  text-md px-56 py-12 radius-8"
                      onClick={handleSubmit}
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
              <div
                className="tab-pane fade"
                id="pills-change-passwork"
                role="tabpanel"
                aria-labelledby="pills-change-passwork-tab"
                tabIndex="0"
              >
                <form onSubmit={handleSubmit2}>
                  {/* Old Password */}
                  <div className="mb-20">
                    <label
                      htmlFor="oldPassword"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Old Password <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={oldPasswordVisible2 ? "text" : "password"}
                        className="form-control radius-8"
                        id="oldPassword"
                        name="oldPassword"
                        value={formData2.oldPassword}
                        onChange={handleChange2}
                        placeholder="Enter Old Password*"
                      />
                      <span
                        className={`toggle-password ${
                          oldPasswordVisible2
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={toggleOldPasswordVisibility1}
                      ></span>
                    </div>
                    {errors2.oldPassword && (
                      <small className="text-danger">
                        {errors2.oldPassword}
                      </small>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="mb-20">
                    <label
                      htmlFor="newPassword"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      New Password <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={newPasswordVisible2 ? "text" : "password"}
                        className="form-control radius-8"
                        id="newPassword"
                        name="newPassword"
                        value={formData2.newPassword}
                        onChange={handleChange2}
                        placeholder="Enter New Password*"
                      />
                      <span
                        className={`toggle-password ${
                          newPasswordVisible2
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={toggleNewPasswordVisibility2}
                      ></span>
                    </div>
                    {errors2.newPassword && (
                      <small className="text-danger">
                        {errors2.newPassword}
                      </small>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-20">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Confirm Password{" "}
                      <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={confirmPasswordVisible2 ? "text" : "password"}
                        className="form-control radius-8"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData2.confirmPassword}
                        onChange={handleChange2}
                        placeholder="Confirm Password*"
                      />
                      <span
                        className={`toggle-password ${
                          confirmPasswordVisible2
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={toggleConfirmPasswordVisibility3}
                      ></span>
                    </div>
                    {errors2.confirmPassword && (
                      <small className="text-danger">
                        {errors2.confirmPassword}
                      </small>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="btn custum-btn-primary radius-8"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPageComp;
