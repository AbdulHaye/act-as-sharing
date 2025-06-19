import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useEvent } from "../../../context/EventContext";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { toast } from "react-toastify";
import "../../../styles/invite-page.css"; 

const InvitePage: React.FC = () => {
  const { user } = useAuth();
  const { events, getHostSpecificEvents, loading, error, sendInvitation } = useEvent();
  const [email, setEmail] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch host-specific events when the component mounts
  useEffect(() => {
    if (user?._id) {
      getHostSpecificEvents();
    }
  }, [user, getHostSpecificEvents]);

  // Filter events to show only today or future events
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of the day for accurate comparison
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= today;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedEventId) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendInvitation(email, selectedEventId);
      toast.success("Invitation sent successfully");
      setEmail("");
      setSelectedEventId("");
    } catch (err: any) {
      toast.error(
        `Failed to send invitation: ${
          error || err.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // DashboardLayout handles redirection
  }

  const userName = `${user.firstname || "User"} ${user.lastname || ""}`;
  const userRole = user.role || "host";

  return (
    <DashboardLayout userRole={userRole as "admin" | "host" | "guest"} userName={userName}>
      <div className="container-fluid p-4">
        <h2 className="mb-4">Send Invitation</h2>
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Guest Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter guest email"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="event" className="form-label">
                  Select Event
                </label>
                <select
                  id="event"
                  className="form-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Select an event</option>
                  {upcomingEvents.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title} - {new Date(event.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </option>
                  ))}
                </select>
                {loading && (
                  <small className="text-muted">Loading events...</small>
                )}
                {!loading && upcomingEvents.length === 0 && (
                  <small className="text-muted">
                    No upcoming events available. Create an event first.
                  </small>
                )}
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? "Sending..." : "Send Invitation"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setEmail("");
                    setSelectedEventId("");
                  }}
                  disabled={isSubmitting || loading}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvitePage;