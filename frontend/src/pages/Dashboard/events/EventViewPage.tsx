import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../../../context/EventContext";
import { Calendar } from "lucide-react";

const EventViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, fetchEvents, error } = useEvent();

  // Base URL for the backend (temporary workaround until Cloudinary is implemented)
  const baseUrl =
    import.meta.env.VITE_BASE_URL ;

  useEffect(() => {
    if (id) {
      fetchEvents();
    }
  }, [id, fetchEvents]);

  const event = events.find((e) => e._id === id);

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Failed to load image:", e.currentTarget.src);
    e.currentTarget.style.display = "none"; // Hide broken image
    const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallbackElement) {
      fallbackElement.style.display = "flex"; // Show fallback
    }
  };

  if (!event) {
    return <div className="container mt-5">{error || "Event not found"}</div>;
  }

  // Format date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mt-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/" style={{ color: "#5144A1" }}>
              Home
            </a>
          </li>
          <li className="breadcrumb-item">
            <a href="/events" style={{ color: "#5144A1" }}>
              Events
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {event.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div
        className="p-4 mb-4"
        style={{ backgroundColor: "#5144A1", color: "white" }}
      >
        <h1 className="mb-0">{event.title}</h1>
      </div>

      {/* Status Indicator */}
      <div className="mb-3">
        <span
          className={`badge ${
            event.status === "ongoing" ? "bg-success" : "bg-secondary"
          }`}
        >
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>

      {/* Event Card */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className="nav-link active"
                href="#event-details"
                data-bs-toggle="tab"
                style={{ color: "#5144A1" }}
              >
                Event Details
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#recipient-story"
                data-bs-toggle="tab"
                style={{ color: "#5144A1" }}
              >
                Recipient Story
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#updates-comments"
                data-bs-toggle="tab"
                style={{ color: "#5144A1" }}
              >
                Updates & Comments
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          <div className="tab-content">
            <div className="tab-pane fade show active" id="event-details">
              <div className="row">
                {/* Image Section */}
                <div className="col-md-6 mb-4">
                  {event.imageUrl ? (
                    <>
                      <img
                        src={`${baseUrl}${event.imageUrl}`}
                        alt={event.title}
                        className="img-fluid rounded"
                        style={{ maxHeight: "300px", objectFit: "cover", display: "block" }}
                        onError={handleImageError}
                      />
                      <div
                        className="bg-light d-flex align-items-center justify-content-center rounded"
                        style={{ height: "300px", display: "none" }}
                      >
                        <Calendar size={32} className="text-muted" />
                      </div>
                    </>
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center rounded"
                      style={{ height: "300px", display: "flex" }}
                    >
                      <Calendar size={32} className="text-muted" />
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="col-md-6">
                  <h2>About This Event</h2>
                  <p>{event.description || "No description available"}</p>
                  <div className="row mb-3">
                    <div className="col-6">
                      <p style={{ color: "#5144A1" }}>
                        <Calendar size={16} className="me-2" /> Date: {formatDate(event.date)}
                      </p>
                    </div>
                    <div className="col-6">
                      <p style={{ color: "#5144A1" }}>
                        <span role="img" aria-label="clock">⏰</span> Time: {formatTime(event.time)}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-6">
                      <p style={{ color: "#5144A1" }}>
                        <span role="img" aria-label="location">📍</span> Location: {event.location}
                      </p>
                    </div>
                    <div className="col-6">
                      <p style={{ color: "#5144A1" }}>
                        <span role="img" aria-label="users">👥</span> Attendees: {event.guests.length} of {event.guestCount} spots filled
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p>
                      <strong>Funding Goal:</strong> ${event.goalAmount}
                    </p>
                    <p>
                      <strong>Current Amount:</strong> ${event.currentAmount}
                    </p>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${(event.currentAmount / event.goalAmount) * 100}%`,
                          backgroundColor: "#5144A1",
                        }}
                      ></div>
                    </div>
                    <p className="mt-2">
                      <strong>Contributions:</strong> {event.contributions.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-pane fade" id="recipient-story">
              <h2>Recipient Story</h2>
              <p>{event.recipient.story || "No story available"}</p>
              <p>
                <strong>Name:</strong> {event.recipient.name}
              </p>
              <p>
                <strong>Category:</strong> {event.recipient.categoryOfNeed}
              </p>
              <p>
                <strong>Funds Usage:</strong> {event.recipient.fundsUsage || "Not specified"}
              </p>
            </div>

            <div className="tab-pane fade" id="updates-comments">
              <h2>Updates & Comments</h2>
              <p>{event.messages.length > 0 ? event.messages.join(", ") : "No updates or comments available."}</p>
            </div>
          </div>

          {/* Host Section */}
          <div className="card mt-4">
            <div className="card-body">
              <h3>Your Host</h3>
              <p>
                <strong>Host:</strong> {event.hostId ? event.hostId : "Not Assigned"}
              </p>
              <p>
                Passionate about bringing people together to create positive change in our community.
              </p>
              {/* <button className="btn btn-outline-primary">Contact Host</button> */}
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default EventViewPage;