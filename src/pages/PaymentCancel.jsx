import React from "react";

const PaymentCancel = () => {
  return (
    <>
      <div className="bg-light d-flex justify-content-center align-items-center vh-100">
        <div
          className="card shadow-lg  text-center"
          style={{ maxWidth: "500px", borderRadius: "1rem", padding: "20px" }}
        >
          <div className="mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              fill="red"
              className="bi bi-x-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
          <h2 className="text-danger fw-bold">Payment Cancelled</h2>
          <p className="text-muted">
            It looks like you cancelled the payment. You can try again anytime.
          </p>
          <a href="/" className="btn btn-danger mt-3 px-4 rounded-pill">
            Back to Plans
          </a>
        </div>
      </div>
    </>
  );
};

export default PaymentCancel;
