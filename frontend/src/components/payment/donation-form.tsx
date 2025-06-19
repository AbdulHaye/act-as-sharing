"use client"

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Heart, ArrowLeft } from "lucide-react";

interface DonationFormProps {
  eventId: string;
  organizationName?: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ eventId, organizationName = "CommonChange" }) => {
  const [amount, setAmount] = useState<string>("0.00");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow only numbers and a single decimal point, up to 2 decimal places
    if (!/^\d*\.?\d{0,2}$/.test(raw) && raw !== "") return;

    setAmount(raw);

    const num = parseFloat(raw);
    if (!isNaN(num) && (num < 1 || num > 5000)) {
      setErrorMessage("Enter an amount between $1.00 and $5,000.00");
    } else {
      setErrorMessage(null);
    }
  };

  const handleAmountBlur = () => {
    const num = parseFloat(amount);

    if (!isNaN(num)) {
      setAmount(num.toFixed(2)); // Ensures 2 decimal places
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number.parseFloat(amount);
    if (numAmount < 1 || numAmount > 5000) {
      setErrorMessage("Enter an amount between $1.00 and $5,000.00");
      return;
    }
    setIsProcessing(true);
    setErrorMessage(null);
    setTimeout(() => {
      navigate(`/checkout/${eventId}?amount=${amount}`);
      setIsProcessing(false);
    }, 500);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const presetAmounts = [25, 50, 100, 250];

  return (
    <div className="card shadow-sm p-4 mx-auto mt-5" style={{ maxWidth: "600px", border: "1px solid #e5e7eb" }}>
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        className="btn btn-light btn-sm position-absolute top-3 start-3 rounded-circle"
        aria-label="Back"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="text-center mb-4">
        <div className="bg-light p-3 rounded-circle d-inline-block">
          <Heart className="text-primary" size={24} />
        </div>
      </div>

      <h2 className="text-center fw-bold mb-4" style={{ color: "#4D5E80" }}>Tax Deductible Donation</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <p className="text-uppercase text-muted small fw-bold mb-3">ENTER DONATION AMOUNT</p>

          <div className="position-relative mb-2">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0" style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333" }}>$</span>
              <input
                type="text"
                id="donationAmount"
                value={amount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                className="form-control border-start-0 bg-light text-center"
                style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", paddingLeft: "0.5rem" }}
                required
              />
            </div>
            {errorMessage && <p className="text-danger text-center mt-1">{errorMessage}</p>}
          </div>

          <div className="d-flex justify-content-center gap-2 mb-4">
            {presetAmounts.map((presetAmount) => (
              <button
                key={presetAmount}
                type="button"
                className={`btn btn-outline-secondary btn-sm ${Number(amount) === presetAmount ? "btn-primary" : ""}`}
                onClick={() => setAmount(presetAmount.toFixed(2))}
              >
                ${presetAmount}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center bg-light p-3 rounded">
          <p className="text-muted small">
            Help <span className="fw-semibold">{organizationName}</span> bless others in our local community through a one-time donation.
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-3 fw-medium"
          disabled={isProcessing || Number.parseFloat(amount) <= 0}
        >
          {isProcessing ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          ) : null}
          {isProcessing ? "Processing..." : "Checkout"}
        </button>
      </form>

      <div className="text-center mt-4 pt-3 border-top border-light">
        <div className="d-flex justify-content-center mb-2">
          <div className="bg-light p-2 rounded">
            <CreditCard size={16} className="text-muted" />
          </div>
        </div>
        <p className="text-muted small">Secure payment by Stripe</p>
      </div>
    </div>
  );
};

export default DonationForm;