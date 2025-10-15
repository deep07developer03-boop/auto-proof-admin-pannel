import React from "react";

const PaymentSucces = () => {
  return (
    <>
      <div className="bg-light d-flex justify-content-center align-items-center vh-100">
        <div
          className="card shadow-lg text-center"
          style={{ maxWidth: "500px", borderRadius: "1rem", padding: "20px" }}
        >
          <div className="mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              fill="green"
              className="bi bi-check-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03l5.146-5.147-1.415-1.414L6.97 8.207 5.293 6.53 3.879 7.944l3.09 3.09z" />
            </svg>
          </div>
          <h2 className="text-success fw-bold">Payment Successful!</h2>
          <p className="text-muted">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>
          <a href="/" className="btn btn-success mt-3 px-4 rounded-pill">
            Go to Dashboard
          </a>
        </div>
      </div>
    </>
  );
};

export default PaymentSucces;
