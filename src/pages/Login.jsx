// import React from "react";
// import LoginComp from "../components/Login";

// const Login = () => {
//   return (
//     <>
//       <LoginComp />
//     </>
//   );
// };

// export default Login;
import React, { useState } from "react";
import axios from "axios";
import { TbBrandOpenSourceFilled } from "react-icons/tb";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" }); // clear error on typing
  };

  // form validation
  const validateForm = () => {
    let newErrors = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Email or Phone is required";
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.emailOrPhone) && // check if not email
      !/^\d{10}$/.test(formData.emailOrPhone) // check if not phone (10 digits)
    ) {
      newErrors.emailOrPhone = "Enter a valid email or phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Login Data:", formData); // ✅ print data
      alert("Login successful (check console for submitted data)");

      axios
        .post(BASE_URL + `/super-admin-pannel/login-super-admin`, {
          email_or_phoneNumber: formData?.emailOrPhone,
          password: formData?.password,
        })
        .then((response) => {
          console.log("response of login", response.data.user);

          if (response.status === 200) {
            // ✅ store token in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            Swal.fire({
              title: "Thank you!",
              text: response?.data?.message || "Login successful!",
              icon: "success",
            });

            navigate("/");
          } else {
            Swal.fire(response?.data?.message || "Login failed!");
          }
        })
        .catch((error) => {
          console.log("error", error);

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error?.response?.data?.message,
          });
        });
    }
  };

  return (
    <div>
      <div className="container login-container align-items-center justify-content-center">
        <div className="card login-card">
          <img src="assets/images/auto-proof_logo.png" alt="Logo" />
          <div className="card-body">
            <h3
              className="card-title text-center mb-4"
              style={{ marginBottom: "20px" }}
            >
              Login to Your Account
            </h3>
            <form onSubmit={handleSubmit}>
              {/* Email / Phone */}
              <div className="mb-3 mt-4">
                <label htmlFor="emailOrPhone" className="form-label">
                  Enter Your Email or Phone Number
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.emailOrPhone ? "is-invalid" : ""
                  }`}
                  id="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="Enter Your Email or Phone Number"
                  required
                />
                {errors.emailOrPhone && (
                  <div className="invalid-feedback">{errors.emailOrPhone}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                  required
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100 al_btn">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
