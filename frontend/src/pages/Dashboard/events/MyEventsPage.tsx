
"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Info,
} from "lucide-react";
import { useEvent } from "../../../context/EventContext";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import EventEditModal from "../modals/EventEditModal";
import { toast } from "react-toastify";

interface Event {
  _id: string;
  title: string;
  location: string;
  date: string;
  goalAmount: number;
  currentAmount: number;
  guestCount: number;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: string;
  recipient: {
    name: string;
    categoryOfNeed: string;
  };
  status?: string;
  host?: string;
}

interface DeleteConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Deletion</h5>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline-secondary" onClick={onHide}>
            No
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const MyEventsPage: React.FC = () => {
  const { events, loading, error, getEvents, deleteEvent } = useEvent();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (user?._id) {
      console.log("Fetching events for user:", user._id);
      getEvents(1, pagination.limit).then((response) => {
        setPagination((prev) => ({
          ...prev,
          totalItems: response.pagination.totalEvents,
          totalPages: response.pagination.totalPages,
          currentPage: response.pagination.currentPage,
        }));
      });
    }
  }, [user?._id, getEvents, pagination.limit]);

  const sortedEvents = [...events].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const userEvents =
    user?.role === "admin"
      ? sortedEvents
      : sortedEvents.filter((event) => event.host === user?._id);

  const handleEditEvent = (event: Event) => {
    console.log("Editing event:", event);
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    console.log("Preparing to delete event with ID:", eventId);
    setEventIdToDelete(eventId);
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventIdToDelete) return;

    setIsDeleting(eventIdToDelete);
    setShowDeleteModal(false);
    try {
      await deleteEvent(eventIdToDelete);
      toast.success("Event deleted successfully");
    } catch (err) {
      console.error("Failed to delete event:", err);
    } finally {
      setIsDeleting(null);
      setEventIdToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate > now;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Failed to load image:", e.currentTarget.src);
    e.currentTarget.style.display = "none";
    e.currentTarget.nextElementSibling.style.display = "flex";
  };

  const filteredEvents = userEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.recipient.categoryOfNeed
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (filter === "upcoming") {
      return matchesSearch && isUpcoming(event.date);
    } else if (filter === "past") {
      return matchesSearch && !isUpcoming(event.date);
    }

    return matchesSearch;
  });

  useEffect(() => {
    const totalItems = filteredEvents.length;
    const totalPages = Math.ceil(totalItems / pagination.limit);
    setPagination((prev) => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages) || 1,
    }));
  }, [filteredEvents, pagination.limit]);

  const paginatedEvents = filteredEvents.slice(
    (pagination.currentPage - 1) * pagination.limit,
    pagination.currentPage * pagination.limit
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  if (!user) {
    return null;
  }

  const userName = `${user.firstname || "User"} ${user.lastname || ""}`;
  const userRole = user.role || "host";

  return (
    <DashboardLayout
      userRole={userRole as "admin" | "host" | "guest"}
      userName={userName}
    >
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">My Events</h2>
            <p className="text-muted">Manage all your hosted events</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="btn-group">
                <button
                  className={`btn ${
                    filter === "all" ? "ms-auto btn-primary" : "ms-auto btn-outline-primary"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All Events
                </button>
                <button
                  className={`btn ${
                    filter === "upcoming"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setFilter("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`btn ${
                    filter === "past" ? "ms-auto btn-primary" : "ms-auto btn-outline-primary"
                  }`}
                  onClick={() => setFilter("past")}
                >
                  Past
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading your events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-5">
                <svg
                  width="128"
                  height="128"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-3"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7"/>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 8v1m0 4v3m-4-2h8"/>
                </svg>
                <h5 className="text-muted">No records found</h5>
              </div>
            ) : (
              <div className="row g-4">
                {paginatedEvents.map((event) => (
                  <div key={event._id} className="col-12 col-md-6 col-xl-4">
                    <div
                      className={`card h-100 ${
                        !isUpcoming(event.date) ? "border-light" : "border"
                      } shadow-sm`}
                    >
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
                            style={{ height: "160px", display: event.imageUrl ? "none" : "flex" }}
                          >
                            <Calendar size={32} className="text-muted" />
                          </div>
                        )}

                        {!isUpcoming(event.date) && (
                          <span className="position-absolute top-0 end-0 m-2 badge bg-dark">
                            Past Event
                          </span>
                        )}
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{event.title}</h5>
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <Calendar size={16} className="text-primary me-2" />
                            <small>{formatDate(event.date)}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <MapPin size={16} className="text-primary me-2" />
                            <small>{event.location}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Users size={16} className="text-primary me-2" />
                            <small>Guest Max: {event.guestCount}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <DollarSign
                              size={16}
                              className="text-primary me-2"
                            />
                            <small>Goal: ${event.goalAmount}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Info size={16} className="text-primary me-2" />
                            <small>Recipient: {event.recipient.name}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Info size={16} className="text-primary me-2" />
                            <small>
                              Category: {event.recipient.categoryOfNeed}
                            </small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Info size={16} className="text-primary me-2" />
                            <small>Visibility: {event.isPublic ? "Public" : "Private"}</small>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small>Fundraising Progress</small>
                            <small>
                              ${event.currentAmount} of ${event.goalAmount}
                            </small>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${
                                  (event.currentAmount / event.goalAmount) * 100
                                }%`,
                                backgroundColor: "#5144A1",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between  button-group">
                          {(user.role === "admin" || (user.role === "host" && isUpcoming(event.date))) && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleEditEvent(event)}
                              >
                                <Edit size={16} className="me-1" />
                                <span>Edit</span>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteEvent(event._id)}
                                disabled={isDeleting === event._id}
                              >
                                <Trash2 size={16} className="me-1" />
                                <span>
                                  {isDeleting === event._id
                                    ? "Deleting..."
                                    : "Delete"}
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && filteredEvents.length > 0 && (
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 border-top">
                <div className="mb-2 mb-sm-0">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{" "}
                  {pagination.totalItems} events
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${pagination.currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${pagination.currentPage === i + 1 ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${pagination.currentPage === pagination.totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>

        <EventEditModal
          show={showEditModal}
          onHide={() => {
            console.log("Closing modal");
            setShowEditModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />

        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setEventIdToDelete(null);
          }}
          onConfirm={confirmDeleteEvent}
        />
      </div>

      <style jsx>{`
        .modal-backdrop {
          // position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          width: 1100px;
          max-width: 100%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .modal-header {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
        }
        .modal-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
        }
        .modal-body {
          padding: 1rem;
          color: #333;
        }
        .modal-footer {
          padding: 1rem;
          border-top: 1px solid #dee2e6;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .btn-danger {
          background-color: #dc3545;
          border-color: #dc3545;
          color: white;
        }
        .btn-danger:hover {
          background-color: #c82333;
          border-color: #bd2130;
        }
        .btn-outline-secondary {
          color: #6c757d;
          border-color: #6c757d;
        }
        .btn-outline-secondary:hover {
          background-color: #6c757d;
          color: white;
        }
        .text-primary {
          color: #5144A1 !important;
        }
        .bg-primary {
          background-color: #5144A1 !important;
        }
        .btn-primary {
          background-color: #5144A1;
          border-color: #5144A1;
        }
        .btn-primary:hover {
          background-color: #453b8c;
          border-color: #453b8c;
        }
        .btn-outline-primary {
          color: #5144A1;
          border-color: #5144A1;
        }
        .btn-outline-primary:hover {
          background-color: #5144A1;
          color: white;
        }
        .text-muted {
          color: #6c757d !important;
        }
        .card {
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .button-group {
          justify-content: flex-end;
        }
        @media (max-width: 576px) {
          .btn-group {
            flex-direction: column;
            width: 100%;
          }
          .btn-group .btn {
            width: 100%;
            margin-bottom: 0.5rem;
          }
          .card-body {
            padding: 0.75rem;
          }
          .pagination {
            flex-wrap: wrap;
            justify-content: center;
          }
          .page-link {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
          }
        }
        @media (max-width: 780px) {
          .button-group {
            flex-direction: column;
            gap: 0.5rem;
          }
          .button-group .btn {
            width: 100%;
            padding: 0.5rem;
            font-size: 0.9rem;
          }
          .button-group .btn-outline-secondary {
            order: 1;
          }
          .button-group .btn-outline-danger {
            order: 2;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default MyEventsPage;
