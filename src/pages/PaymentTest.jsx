import React from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url", process.env.REACT_APP_BASE_URL);

const PaymentTest = () => {
  const plan = {
    id: "prod_SxbhPPJmF2lz4n",
    name: "Flexible Pack",
    description: "Buy As Needed. Units Expire in 1 Year.",
    default_price: "price_1S1gTlQhWEXmIiFM8bsmc0xW",
    type: "service",
    active: true,
    updated: 1756528410,
  };

  const updatedDate = new Date(plan.updated * 1000).toLocaleDateString();
  // "id":
  // "price_1S1gTlQhWEXmIiFM8bsmc0xW"

  const subscribePlan = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/admin/subscription/create-checkout-session",
        {
          planId: "price_1S1iWmQhWEXmIiFMaqP6DN7g", // only send planId
        },
        {
          headers: {
            Authorization: "Bearer <your_token_here>",
          },
        }
      );

      console.log("Checkout session created:", response.data);
      window.location.href = response.data.url; // redirect to Stripe checkout
    } catch (error) {
      console.error(
        "Error creating checkout session:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card shadow-lg"
          style={{ width: "22rem", borderRadius: "1rem" }}
        >
          <div className="card-body">
            <h5 className="card-title fw-bold">{plan.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">ID: {plan.id}</h6>
            <p className="card-text">{plan.description}</p>

            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">
                <strong>Price ID:</strong> {plan.default_price}
              </li>
              <li className="list-group-item">
                <strong>Type:</strong> {plan.type}
              </li>
              <li className="list-group-item">
                <strong>Status:</strong>{" "}
                {plan.active ? (
                  <span className="text-success">Active</span>
                ) : (
                  <span className="text-danger">Inactive</span>
                )}
              </li>
              <li className="list-group-item">
                <strong>Updated:</strong> {updatedDate}
              </li>
            </ul>

            <div className="d-grid">
              <button
                className="btn btn-primary rounded-pill"
                onClick={subscribePlan}
              >
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentTest;
