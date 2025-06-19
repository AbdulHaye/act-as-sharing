import type React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";

const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(true); // Always show modal on this page
  const [resetStage, setResetStage] = useState<"email" | "reset">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetFormData, setResetFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Handle token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    if (token) {
      setResetToken(token);
      setResetStage("reset");
      setShowModal(true);
    }
  }, [location]);

  const handleResetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/forgot-password", { email: resetEmail });
      toast.success(response.data.message || "Password reset email sent successfully");
      setShowModal(false); // Close modal after sending email
    } catch (err: any) {
      console.error("Forgot password error:", err.response?.data || err.message || err);
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Password validation
    const strongKeywords = ["secure", "strong", "unique", "password", "secret"];
    const hasKeyword = strongKeywords.some((keyword) =>
      resetFormData.newPassword.toLowerCase().includes(keyword)
    );

    if (resetFormData.newPassword !== resetFormData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (resetFormData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (!hasKeyword) {
      toast.warn("Consider adding a strong keyword (e.g., secure, strong, unique, password, secret) for better security");
    }

    try {
      const response = await axiosInstance.post("/users/reset-password", {
        token: resetToken,
        newPassword: resetFormData.newPassword,
      });
      toast.success(response.data.message || "Password reset successfully");
      setShowModal(false);
      setResetStage("email");
      setResetFormData({ newPassword: "", confirmPassword: "" });
      setResetToken("");
      navigate("/"); // Redirect to profile after successful reset
    } catch (err: any) {
      console.error("Reset password error:", err.response?.data || err.message || err);
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Forget Password Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setResetStage("email");
          setError(null);
          navigate("/"); // Redirect to profile if modal is closed
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {resetStage === "email" ? (
            <form onSubmit={handleForgetPasswordSubmit}>
              <div className="mb-3">
                <label htmlFor="resetEmail" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  name="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="form-control"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPasswordSubmit}>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={resetFormData.newPassword}
                  onChange={handleResetInputChange}
                  className="form-control"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={resetFormData.confirmPassword}
                  onChange={handleResetInputChange}
                  className="form-control"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResetPasswordPage;