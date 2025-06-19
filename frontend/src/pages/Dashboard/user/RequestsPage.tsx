"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { HandCoins, Trash2 } from "lucide-react";

// Helper function to truncate text after 15 words
const truncateText = (text: string, wordLimit: number = 15): string => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

// Interfaces for TypeScript
interface Request {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  personName: string;
  relationshipToRequester?: string;
  immediateNeed: string;
  preferredDate?: string;
  additionalInfo?: string;
  createdAt: string;
  __v?: number;
  donatedAmount?: number;
  status?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  limit: number;
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
          <p>Are you sure you want to delete this request? This action cannot be undone.</p>
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

interface DonationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (amount: number) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ show, onHide, onConfirm }) => {
  const [donationAmount, setDonationAmount] = useState<string>("");

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    onConfirm(amount);
    setDonationAmount("");
  };

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Donate to Request</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Donation Amount ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter donation amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Donate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [sortedRequests, setSortedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [requestIdToDelete, setRequestIdToDelete] = useState<string | null>(null);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
    limit: 10,
  });

  const fetchRequests = async (page: number = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/request?page=${page}&limit=${pagination.limit}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      console.log("Fetched requests data:", response.data);
      setRequests(response.data.requests || []);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalRequests: response.data.pagination.totalRequests,
        limit: response.data.pagination.limit,
      });
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch requests: " + (err.response?.data?.message || err.message));
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(pagination.currentPage);
  }, [pagination.currentPage]);

  useEffect(() => {
    if (requests.length > 0) {
      const sorted = [...requests].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || '1970-01-01');
        const dateB = new Date(b.createdAt || b.created_at || '1970-01-01');
        return dateB.getTime() - dateA.getTime();
      });
      console.log("Sorted requests:", sorted);
      setSortedRequests(sorted);
    } else {
      setSortedRequests([]);
    }
  }, [requests]);

  const handleDelete = (requestId: string) => {
    console.log("Preparing to delete request with ID:", requestId);
    setRequestIdToDelete(requestId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!requestIdToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/request/${requestIdToDelete}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      setRequests(requests.filter((r) => r._id !== requestIdToDelete));
      toast.success("Request deleted successfully");
      fetchRequests(pagination.currentPage);
    } catch (err: any) {
      setError("Failed to delete request: " + (err.response?.data?.message || err.message));
      console.error("Delete error:", err);
    } finally {
      setShowDeleteModal(false);
      setRequestIdToDelete(null);
    }
  };

  const handleDonate = async (requestId: string, amount: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(`/request/donate/${requestId}`, {
        donatedAmount: amount,
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      // Update the local state based on the response
      const updatedRequest = response.data;
      setRequests(requests.map((r) =>
        r._id === requestId ? { ...r, donatedAmount: updatedRequest.donatedAmount, status: updatedRequest.status } : r
      ));
      toast.success(`Donation of $${amount} processed successfully`);
      fetchRequests(pagination.currentPage);
    } catch (err: any) {
      setError("Failed to process donation: " + (err.response?.data?.message || err.message));
      console.error("Donation error:", err);
    } finally {
      setShowDonationModal(false);
      setSelectedRequestId(null);
    }
  };

  const openDonationModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowDonationModal(true);
  };

  const closeDonationModal = () => {
    setShowDonationModal(false);
    setSelectedRequestId(null);
    setError(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
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
      <div className="container-fluid p-4">
        <div className="card border-0 shadow-sm bg-white">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0 text-lg font-semibold">Requests</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <table className="table-custom w-full text-sm">
                <thead className="sticky top-0 bg-primary text-white">
                  <tr>
                    <th className="table-header px-4 py-2" style={{ width: "5%" }}>ID</th>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>Full Name</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ width: "10%" }}>Phone</th>
                    <th className="table-header px-4 py-2 d-none d-lg-table-cell" style={{ width: "15%" }}>Email</th>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>Person Name</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ width: "10%" }}>Relationship</th>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>Immediate Need</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ width: "10%" }}>Date</th>
                    <th className="table-header px-4 py-2 d-none d-lg-table-cell" style={{ width: "10%" }}>Additional Info</th>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>Donated_Amount</th>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>Status</th>
                    {user?.role === "admin" && (
                      <th className="table-header px-4 py-2" style={{ width: "15%" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role === "admin" ? 12 : 11} className="text-center py-5">
                        <svg width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7"/>
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 8v1m0 4v3m-4-2h8"/>
                        </svg>
                        <h5 className="text-muted">No data here</h5>
                      </td>
                    </tr>
                  ) : (
                    sortedRequests.map((request, index) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="table-cell px-4 py-2" style={{ width: "5%" }}>
                          {(pagination.currentPage - 1) * pagination.limit + index + 1}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "10%" }}>
                          {request.fullName}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-md-table-cell" style={{ width: "10%" }}>
                          {request.phone}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-lg-table-cell" style={{ width: "15%" }}>
                          {request.email}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "10%" }}>
                          {request.personName}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-md-table-cell" style={{ width: "10%" }}>
                          {request.relationshipToRequester || "Self"}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "10%" }}>
                          {request.immediateNeed}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-md-table-cell" style={{ width: "10%" }}>
                          {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : ""}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-lg-table-cell" style={{ width: "10%" }}>
                          {truncateText(request.additionalInfo || "")}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "10%" }}>
                          {request.donatedAmount ? `$${request.donatedAmount.toFixed(2)}` : "-"}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "10%" }}>
                          <span
                            className={`status-${request.status?.toLowerCase() || "pending"}`}
                          >
                            {request.status || "Pending"}
                          </span>
                        </td>
                        {user?.role === "admin" && (
                          <td className="table-cell px-4 py-2" style={{ width: "15%" }}>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => openDonationModal(request._id)}
                                // disabled={request.status === "completed"}
                              >
                                <HandCoins size={16} /> Donate
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(request._id)}
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
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalRequests)} of{" "}
                  {pagination.totalRequests} requests
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination mb-0 flex space-x-2">
                    <li className={`page-item ${pagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <button className="page-link px-3 py-1 border rounded" onClick={() => handlePageChange(pagination.currentPage - 1)}>
                        Previous
                      </button>
                    </li>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${pagination.currentPage === i + 1 ? "bg-primary text-white" : "bg-white"} border rounded`}>
                        <button className="page-link px-3 py-1" onClick={() => handlePageChange(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${pagination.currentPage === pagination.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <button className="page-link px-3 py-1 border rounded" onClick={() => handlePageChange(pagination.currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <DonationModal
          show={showDonationModal}
          onHide={closeDonationModal}
          onConfirm={(amount) => selectedRequestId && handleDonate(selectedRequestId, amount)}
        />

        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setRequestIdToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
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
        .table-custom {
          border-collapse: collapse;
          width: 100%;
        }
        .table-header {
          font-weight: 600;
          background-color: #5144A1;
          color: white;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .table-cell {
          border-bottom: 1px solid #dee2e6;
          padding: 8px;
        }
        .text-primary {
          color: #5144A1;
        }
        .bg-primary {
          background-color: #5144A1;
        }
        .text-muted {
          color: #6c757d;
        }
        .status-pending {
          color: #ff9800; /* Orange for Pending */
          font-weight: bold;
        }
        .status-completed {
          color: #4caf50; /* Green for Completed */
          font-weight: bold;
        }
        @media (max-width: 640px) {
          .table-custom {
            font-size: 0.75rem;
          }
          .table-header, .table-cell {
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
          .table-header, .table-cell {
            padding: 0.75rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default RequestsPage;