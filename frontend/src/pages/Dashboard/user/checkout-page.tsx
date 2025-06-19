import React from "react";
import { useParams, useLocation } from "react-router-dom";
import CheckoutForm from "../../../components/payment/checkout-form";

const CheckoutPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get("amount") || "0.00";
  const subscriptionType = queryParams.get("subscription") || "one-time";

  return (
    <main
      className="d-flex align-items-center justify-content-center min-vh-100 py-5"
      style={{ backgroundColor: "var(--background-light)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <CheckoutForm eventId={eventId!} amount={amount} subscriptionType={subscriptionType} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;