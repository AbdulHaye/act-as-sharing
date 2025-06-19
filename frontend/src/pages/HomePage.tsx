"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import ImpactStories from "../components/home/ImpactStories";
import { useEvent } from "../context/EventContext";
import axiosInstance from "../api/axiosInstance";
import "../styles/home-page.css";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const HomePage: React.FC = () => {
  const handleLoginClick = () => {
    toast.info("Please login first");
  };

  const { isAuthenticated } = useAuth();
  const { events = [], loading: isLoading, error, getPublicEvents } = useEvent();
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6; // Default limit from API
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    personName: "",
    relationship: "",
    immediateNeed: "",
    preferredDate: "",
    additionalInfo: "",
  });

  const [focusedInputs, setFocusedInputs] = useState({
    fullName: false,
    phone: false,
    email: false,
    personName: false,
    immediateNeed: false,
    preferredDate: false,
    additionalInfo: false,
  });

  const handleFormClose = () => {
    setShowForm((prev) => !prev);
  };

  const baseUrl =
    import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getPublicEvents({ page: currentPage, limit: eventsPerPage });
        if (response && response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, [getPublicEvents, currentPage]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Failed to load image:", e.currentTarget.src);
    e.currentTarget.style.display = "none";
    e.currentTarget.nextElementSibling!.style.display = "flex";
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes("@")) {
      toast.error("Please enter a correct email");
      return;
    }
    const phoneRegex = /^\d{9,20}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone must be between 9 and 20 digits");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post("/request", formData, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      toast.success("Request submitted successfully!");
      setShowForm(false);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        personName: "",
        relationship: "",
        immediateNeed: "",
        preferredDate: "",
        additionalInfo: "",
      });
    } catch (err: any) {
      toast.error(
        "Failed to submit request: " + (err.response?.data?.message || err.message)
      );
      console.error("Submit error:", err);
    }
  };

  const handleFocus = (name: string) => {
    setFocusedInputs((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name: string) => {
    if (!formData[name]) {
      setFocusedInputs((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleKeyDown = (e: React.KeyboardEvent, pageNumber: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      paginate(pageNumber);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className="home-page">
      <Hero />
      <HowItWorks />

      <section className="featured-events py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="section-title">Upcoming Meals</h2>
              <p className="section-subtitle">
                Join these upcoming meal gatherings or host your own
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="text-center">
              <p>Loading events...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-danger">
              <p>Error: {error}</p>
            </div>
          )}

          {!isLoading && !error && events.length === 0 && (
            <div className="text-center">
              <p>No upcoming events found.</p>
            </div>
          )}

          {!isLoading && !error && events.length > 0 && (
            <>
              <div className="row">
                {events.map((event) => (
                  <div key={event._id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="position-relative">
                        {event.imageUrl ? (
                          <img
                            src={`${baseUrl}${event.imageUrl}`}
                            alt={event.title}
                            className="card-img-top"
                            style={{ height: "160px", objectFit: "cover" }}
                            onError={handleImageError}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{
                              height: "160px",
                              display: event.imageUrl ? "none" : "flex",
                            }}
                          >
                            <Calendar size={32} className="text-muted" />
                          </div>
                        )}
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{event.title}</h5>
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <Calendar size={16} className="text-primary me-2" />
                            <small>
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <MapPin size={16} className="text-primary me-2" />
                            <small>{event.location}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Users size={16} className="text-primary me-2" />
                            <small>{event.guestCount} Attendees</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <DollarSign size={16} className="text-primary me-2" />
                            <small>
                              Raised: ${event.currentAmount} of ${event.goalAmount}
                            </small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <small>
                              Hosted by: {event.recipient?.name || "Unknown Host"}
                            </small>
                          </div>
                        </div>
                        <Link
                          to={`/events/${event._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/payment/${event._id}`}
                          className="btn btn-primary btn-sm ms-2"
                        >
                          Donate
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Events pagination" className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        «
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(index + 1)}
                          onKeyDown={(e) => handleKeyDown(e, index + 1)}
                          aria-current={currentPage === index + 1 ? "page" : undefined}
                          aria-label={`Page ${index + 1}`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        »
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}

          <div className="text-center mt-5">
            <button
              className="btn btn-primary btn-request-assistance"
              onClick={handleFormClose}
            >
              Request Assistance
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                className={`assistance-form-section ${showForm ? "form-visible" : ""}`}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2 className="form-title">
                  Need Assistance? We're Here to Help.
                </h2>
                <p className="form-subtitle">
                  CommonChange is committed to supporting those in need. If you
                  or someone you know requires food, clothing, supplies, or
                  other assistance, please fill out the form below. Our team
                  will review your request and reach out as soon as possible.
                </p>
                <form onSubmit={handleFormSubmit} className="assistance-form">
                  <div className="form-group">
                    <h3>Requester Information</h3>
                    <div className="form-floating">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("fullName")}
                        onBlur={() => handleBlur("fullName")}
                        required
                        className={`form-control ${
                          focusedInputs.fullName || formData.fullName
                            ? "has-value"
                            : ""
                        }`}
                      />
                      <label
                        htmlFor="fullName"
                        className={
                          focusedInputs.fullName || formData.fullName
                            ? "active"
                            : ""
                        }
                      >
                        Full Name *
                      </label>
                    </div>

                    <div className="form-floating">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("phone")}
                        onBlur={() => handleBlur("phone")}
                        required
                        className={`form-control ${
                          focusedInputs.phone || formData.phone
                            ? "has-value"
                            : ""
                        }`}
                      />
                      <label
                        htmlFor="phone"
                        className={
                          focusedInputs.phone || formData.phone ? "active" : ""
                        }
                      >
                        Phone *
                      </label>
                    </div>

                    <div className="form-floating">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={() => handleBlur("email")}
                        required
                        className={`form-control ${
                          focusedInputs.email || formData.email
                            ? "has-value"
                            : ""
                        }`}
                      />
                      <label
                        htmlFor="email"
                        className={
                          focusedInputs.email || formData.email ? "active" : ""
                        }
                      >
                        Email *
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <h3>Person(s) in Need</h3>
                    <div className="form-floating">
                      <input
                        type="text"
                        id="personName"
                        name="personName"
                        value={formData.personName}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("personName")}
                        onBlur={() => handleBlur("personName")}
                        className={`form-control ${
                          focusedInputs.personName || formData.personName
                            ? "has-value"
                            : ""
                        }`}
                      />
                      <label
                        htmlFor="personName"
                        className={
                          focusedInputs.personName || formData.personName
                            ? "active"
                            : ""
                        }
                      >
                        Name *
                      </label>
                    </div>

                    <div className="form-select-container">
                      <label htmlFor="relationship">
                        Relationship to Requester *
                      </label>
                      <select
                        id="relationship"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                      >
                        <option value="" disabled>
                          Relationship
                        </option>
                        <option value="Self">Self</option>
                        <option value="Friend">Friend</option>
                        <option value="Family">Family</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-floating">
                      <textarea
                        id="immediateNeed"
                        name="immediateNeed"
                        value={formData.immediateNeed}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("immediateNeed")}
                        onBlur={() => handleBlur("immediateNeed")}
                        required
                        className={`form-control ${
                          focusedInputs.immediateNeed || formData.immediateNeed
                            ? "has-value"
                            : ""
                        }`}
                      ></textarea>
                      <label
                        htmlFor="immediateNeed"
                        className={
                          focusedInputs.immediateNeed || formData.immediateNeed
                            ? "active"
                            : ""
                        }
                      >
                        Immediate Need *
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-floating">
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("preferredDate")}
                        onBlur={() => handleBlur("preferredDate")}
                        className={`form-control ${
                          focusedInputs.preferredDate || formData.preferredDate
                            ? "has-value"
                            : ""
                        }`}
                      />
                      <label
                        htmlFor="preferredDate"
                        className={
                          focusedInputs.preferredDate || formData.preferredDate
                            ? "active"
                            : ""
                        }
                      >
                        Preferred Date for Assistance *
                      </label>
                    </div>

                    <div className="form-floating">
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("additionalInfo")}
                        onBlur={() => handleBlur("additionalInfo")}
                        className={`form-control ${
                          focusedInputs.additionalInfo ||
                          formData.additionalInfo
                            ? "has-value"
                            : ""
                        }`}
                      ></textarea>
                      <label
                        htmlFor="additionalInfo"
                        className={
                          focusedInputs.additionalInfo ||
                          formData.additionalInfo
                            ? "active"
                            : ""
                        }
                      >
                        Additional Information *
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-submit">
                      Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ImpactStories />

      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <h2 className="cta-title">Ready to Make a Difference?</h2>
                <p className="cta-text">
                  Host a meal, invite friends, and create meaningful impact in
                  your community.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-primary btn-lg me-3">
                    Get Started
                  </Link>
                ) : (
                  <button
                    className="btn btn-primary btn-lg me-3"
                    onClick={handleLoginClick}
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;