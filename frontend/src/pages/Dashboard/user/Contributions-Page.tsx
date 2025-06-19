"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";

// Define interfaces for better TypeScript support
interface User {
  firstname: string;
  lastname: string;
  email: string;
}

interface Event {
  title: string;
}

interface Contribution {
  _id: string;
  eventId: Event | null;
  userId: User | null;
  amount: number;
  status: string;
  createdAt: string;
}

interface EditFormData {
  eventId: { title: string };
  userId: { firstname: string; lastname: string; email: string };
  amount: string;
  status: string;
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
          <p>Are you sure you want to delete this contribution? This action cannot be undone.</p>
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
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
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
          width: 400px;
          max-width: 90%;
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
      `}</style>
    </div>
  );
};

const ContributionsPage: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    eventId: { title: "" },
    userId: { firstname: "", lastname: "", email: "" },
    amount: "",
    status: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contributionIdToDelete, setContributionIdToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalContributions: 0,
    limit: 10,
  });

  const fetchContributions = async (page: number = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/contributions?page=${page}&limit=${pagination.limit}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      console.log("Fetched contributions data:", response.data);

      // Sort contributions by createdAt in descending order (most recent first)
      const sortedContributions = [...response.data.contributions].sort(
        (a: Contribution, b: Contribution) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          // Fallback to 0 if dates are invalid to avoid NaN issues
          return isNaN(dateB.getTime()) ? 0 : isNaN(dateA.getTime()) ? -1 : dateB.getTime() - dateA.getTime();
        }
      );

      // Debug log to verify sorting
      console.log("Sorted contributions:", sortedContributions.map(c => ({ _id: c._id, createdAt: c.createdAt })));

      setContributions(sortedContributions);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalContributions: response.data.pagination.totalContributions,
        limit: response.data.pagination.limit,
      });
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch contributions: " + (err.response?.data?.message || err.message));
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleDelete = (contributionId: string) => {
    console.log("Preparing to delete contribution with ID:", contributionId);
    setContributionIdToDelete(contributionId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!contributionIdToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/contributions/${contributionIdToDelete}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      toast.info("Contribution deleted successfully");
      fetchContributions(pagination.currentPage);
    } catch (err: any) {
      setError("Failed to delete contribution: " + (err.response?.data?.message || err.message));
      console.error("Delete error:", err);
    } finally {
      setShowDeleteModal(false);
      setContributionIdToDelete(null);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContribution) return;

    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        eventId: { title: editFormData.eventId.title }, // Keep event title as is from backend
        userId: {
          firstname: editFormData.userId.firstname,
          lastname: editFormData.userId.lastname,
          email: editFormData.userId.email,
        },
        amount: parseFloat(editFormData.amount),
        status: editFormData.status, // Keep status as is from backend
      };

      await axiosInstance.put(`/contributions/${selectedContribution._id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      setContributions(
        contributions.map((c) =>
          c._id === selectedContribution._id ? { ...c, ...updatedData } : c
        )
      );
      setSelectedContribution(null);
      setError(null);
      toast.info("Contribution updated successfully");
      fetchContributions(pagination.currentPage);
    } catch (err: any) {
      setError("Failed to update contribution: " + (err.response?.data?.message || err.message));
      console.error("Edit error:", err);
    }
  };

  const openEditModal = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setEditFormData({
      eventId: { title: contribution.eventId?.title || "" },
      userId: {
        firstname: contribution.userId?.firstname || "",
        lastname: contribution.userId?.lastname || "",
        email: contribution.userId?.email || "",
      },
      amount: contribution.amount?.toString() || "",
      status: contribution.status || "",
    });
  };

  const closeEditModal = () => {
    setSelectedContribution(null);
    setError(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <DashboardLayout>
      <div className="container-fluid p-4" style={{ width: "100%", overflowX: "auto" }}>
        <div className="card border-0 shadow-sm bg-white" style={{ width: "100%" }}>
          <div className="card-header bg-white">
            <h5 className="card-title mb-0 text-lg font-semibold">Donations</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive" style={{ width: "100%", maxHeight: "calc(100vh - 250px)" }}>
              <table className="table-custom w-full text-sm">
                <thead className="sticky top-0 bg-primary text-white">
                  <tr>
                    <th className="table-header px-4 py-2" style={{ minWidth: "5%" }}>ID</th>
                    <th className="table-header px-4 py-2" style={{ minWidth: "20%" }}>Event Title</th>
                    <th className="table-header px-4 py-2" style={{ minWidth: "15%" }}>User Name</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ minWidth: "20%" }}>Email</th>
                    <th className="table-header px-4 py-2" style={{ minWidth: "15%" }}>Amount</th>
                    <th className="table-header px-4 py-2" style={{ minWidth: "15%" }}>Date</th>
                    <th className="table-header px-4 py-2" style={{ minWidth: "10%" }}>Status</th>
                    {user?.role === "admin" && (
                      <th className="table-header px-4 py-2" style={{ minWidth: "15%" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {contributions.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role === "admin" ? 8 : 7} className="text-center py-5">
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
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7" />
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 8v1m0 4v3m-4-2h8" />
                        </svg>
                        <h5 className="text-muted">No records found</h5>
                      </td>
                    </tr>
                  ) : (
                    contributions.map((contribution, index) => (
                      <tr key={contribution._id} className="hover:bg-gray-50">
                        <td className="table-cell px-4 py-2" style={{ minWidth: "5%" }}>
                          {(pagination.currentPage - 1) * pagination.limit + index + 1}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ minWidth: "20%" }}>
                          {contribution.eventId?.title || "N/A"}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ minWidth: "15%" }}>
                          {contribution.userId
                            ? `${contribution.userId.firstname || ""} ${contribution.userId.lastname || ""}`.trim() ||
                              "N/A"
                            : "N/A"}
                        </td>
                        <td
                          className="table-cell px-4 py-2 truncate d-none d-md-table-cell"
                          style={{ minWidth: "20%" }}
                        >
                          {contribution.userId?.email || "N/A"}
                        </td>
                        <td
                          className="table-cell px-4 py-2 text-success font-semibold"
                          style={{ minWidth: "15%" }}
                        >
                          ${contribution.amount?.toFixed(2) || "0.00"}
                        </td>
                        <td className="table-cell px-4 py-2" style={{ minWidth: "15%" }}>
                          {formatDate(contribution.createdAt)}
                        </td>
                        <td className="table-cell px-4 py-2" style={{ minWidth: "10%" }}>
                          {contribution.status || "N/A"}
                        </td>
                        {user?.role === "admin" && (
                          <td className="table-cell px-4 py-2" style={{ minWidth: "15%" }}>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => openEditModal(contribution)}
                              >
                                <Edit size={16} /> Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(contribution._id)}
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-white py-3 border-t border-gray-200">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
                <div className="mb-2 mb-sm-0 text-sm">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalContributions)} of{" "}
                  {pagination.totalContributions} contributions
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination mb-0 flex space-x-2">
                    <li
                      className={`page-item ${pagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <button
                        className="page-link px-3 py-1 border rounded"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          pagination.currentPage === i + 1 ? "bg-primary text-white" : "bg-white"
                        } border rounded`}
                      >
                        <button className="page-link px-3 py-1" onClick={() => handlePageChange(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        pagination.currentPage === pagination.totalPages ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <button
                        className="page-link px-3 py-1 border rounded"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {selectedContribution && user?.role === "admin" && (
          <div
            className="modal"
            tabIndex={-1}
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Contribution</h5>
                  <button type="button" className="btn-close" onClick={closeEditModal}></button>
                </div>
                <form onSubmit={handleEdit}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                      <label className="form-label">Event Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.eventId.title}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.userId.firstname}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            userId: { ...editFormData.userId, firstname: e.target.value },
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.userId.lastname}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            userId: { ...editFormData.userId, lastname: e.target.value },
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editFormData.userId.email}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            userId: { ...editFormData.userId, email: e.target.value },
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={editFormData.amount}
                        onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.status}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setContributionIdToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      </div>

      <style jsx>{`
        .table-custom {
          border-collapse: collapse;
          width: 100%;
        }
        .table-header {
          font-weight: 600;
        }
        .table-cell {
          border-bottom: 1px solid #dee2e6;
        }
        .text-primary {
          color: #5144A1;
        }
        .bg-primary {
          background-color: #5144A1;
        }
        .text-success {
          color: #28a745;
        }
        .text-muted {
          color: #6c757d;
        }
        @media (max-width: 640px) {
          .table-custom {
            font-size: 0.75rem;
          }
          .table-header,
          .table-cell {
            padding: 0.5rem;
          }
          .pagination {
            flex-wrap: wrap;
            justify-content: center;
          }
          .page-link {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .table-custom {
            font-size: 0.875rem;
          }
          .table-header,
          .table-cell {
            padding: 0.75rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ContributionsPage;