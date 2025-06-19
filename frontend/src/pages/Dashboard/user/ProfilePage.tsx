import type React from "react";
import { useState, useEffect } from "react";
import { User, Mail, Key, Save, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ProfileFormData {
  firstname: string;
  lastname: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstname: "",
    lastname: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setPasswordError(null);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordError(null);
    setSuccess(null);
    setLoading(true);

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|co)$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address (e.g., user@example.com)");
      setLoading(false);
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setPasswordError("New passwords do not match");
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setPasswordError("Current password is required to set a new password");
        setLoading(false);
        return;
      }
    }

    try {
      const updateData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      };

      const response = await axiosInstance.put(`/users/${user?.id}`, updateData, {
        headers: { "X-Skip-Redirect": "true" },
      });

      if (response.data.user || response.data) {
        const updatedUser = response.data.user || response.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.info("Profile updated successfully");
        setIsEditing(false);
      } else {
        throw new Error("No user data returned from API");
      }
    } catch (err: any) {
      console.error("Profile update error:", err.response?.data || err.message || err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <DashboardLayout userRole="host" userName="">
        <div className="container-fluid p-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null; // DashboardPage handles redirection
  }

  const userName = `${user.firstname || "User"} ${user.lastname || ""}`;
  const userRole = user.role || "host";

  return (
    <DashboardLayout userRole={userRole as "admin" | "host" | "guest"} userName={userName}>
      <div className="container-fluid p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div className="mb-3 mb-md-0">
            <h2 className="mb-1">My Profile</h2>
            <p className="text-muted">View and manage your account information</p>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-2">
            {/* <button
              className="btn btn-outline-primary mb-2 mb-sm-0"
              onClick={() => navigate("/reset-password")}
            >
              <Key size={16} className="me-2" />
              Update Password
            </button> */}
            <button className={`btn ${isEditing ? "btn-outline-secondary" : "btn-primary"}`} onClick={toggleEdit}>
              {isEditing ? (
                <>
                  <X size={16} className="me-2" />
                  Cancel
                </>
              ) : (
                <>
                  <User size={16} className="me-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex flex-column flex-md-row align-items-center">
              <div
                className="profile-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-3"
                style={{ width: "80px", height: "80px", fontSize: "1.75rem", flexShrink: 0 }}
              >
                {(user.firstname || "U").charAt(0).toUpperCase()}
                {(user.lastname || "").charAt(0).toUpperCase()}
              </div>
              <div className="text-center text-md-start">
                <h3 className="mb-1">
                  {user.firstname || "User"} {user.lastname || ""}
                </h3>
                <p className="mb-1">{(user.role || "host").charAt(0).toUpperCase() + (user.role || "host").slice(1)}</p>
                <small className="text-muted">Member since {formatDate(user.createdAt)}</small>
              </div>
            </div>
          </div>
          <div className="card-body">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h4 className="mb-3">Personal Information</h4>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label htmlFor="firstname" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label htmlFor="lastname" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        disabled={loading}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={toggleEdit} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="me-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="mb-4">
                  <h4 className="mb-3">Personal Information</h4>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <User size={18} className="text-primary me-2" />
                          <label className="text-muted small">Full Name</label>
                        </div>
                        <p className="mb-0 fw-medium">
                          {user.firstname || "User"} {user.lastname || ""}
                        </p>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <Mail size={18} className="text-primary me-2" />
                          <label className="text-muted small">Email Address</label>
                        </div>
                        <p className="mb-0 fw-medium">{user.email || "N/A"}</p>
                      </div>
                    </div>
                    {/* <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <Key size={18} className="text-primary me-2" />
                          <label className="text-muted small">Password</label>
                        </div>
                        <p className="mb-0 fw-medium">••••••••</p>
                      </div>
                    </div> */}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Account Information</h4>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small d-block mb-1">Account Type</label>
                        <p className="mb-0 fw-medium">
                          {(user.role || "host").charAt(0).toUpperCase() + (user.role || "host").slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small d-block mb-1">Member Since</label>
                        <p className="mb-0 fw-medium">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </DashboardLayout>
  );
};

export default ProfilePage;