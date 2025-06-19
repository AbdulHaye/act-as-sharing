import React from "react";
import { useParams } from "react-router-dom";
import DonationForm from "../../../components/payment/donation-form";

const DonationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  return (
    <main
      className="d-flex align-items-center justify-content-center min-vh-100 py-5"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <DonationForm eventId={eventId!} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DonationPage;