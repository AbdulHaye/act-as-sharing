import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import EventDetailPage from "./pages/Dashboard/events/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/Dashboard/main/AdminDashboard";
import HostDashboard from "./pages/Dashboard/main/HostDashboard";
import GuestDashboard from "./pages/Dashboard/main/GuestDashboard";
import ProfilePage from "./pages/Dashboard/user/ProfilePage";
import MyEventsPage from "./pages/Dashboard/events/MyEventsPage";
import ProtectedRoute from "./middleware/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EventProvider } from "./context/EventContext";
import EditEventPage from "./pages/Dashboard/events/EditEventPage";
import "./styles/main.css";
import "./styles/dashboard.css";
import InvitePage from "./pages/Dashboard/user/InvitePage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import DonationPage from "./pages/Dashboard/user/donation-page";
import CheckoutPage from "./pages/Dashboard/user/checkout-page";
import ContributionsPage from "./pages/Dashboard/user/Contributions-Page";
import UsersPage from "./pages/Dashboard/user/UsersPage";
import RequestsPage from "./pages/Dashboard/user/RequestsPage";
import ContactPage from "./pages/Dashboard/user/ContanctPage";
import StoriesPage from "./pages/Dashboard/user/StoriesPage";
import ResetPasswordPage from "./pages/Dashboard/user/ResetPasswordPage";
import VerifyEmail from "./components/auth/email-verify"; // Added import for VerifyEmail

const stripePromise = loadStripe(
  "pk_test_51RKJvKPpyC29nsjCXtgQCJt7s56TWDr4MHu9X4OsJtu3hg9OidR5FVDy3PkQrr44YvtrHqXEbxEJULtBDuDJ7EMm00fn72c7iI"
);

// Component to handle redirect bas
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const role = user.role || "host";
  return <Navigate to={`/dashboard/${role}`} replace />;
};

function App() {
  const location = useLocation();
  const hideNavbarAndFooter =
    location.pathname.startsWith("/payment/") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/verify-email"); // Added verify-email to hide Navbar and Footer

  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <EventProvider>
          <div className="app-container d-flex flex-column min-vh-100">
            {!hideNavbarAndFooter && <Navbar />}
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/checkout/:eventId" element={<CheckoutPage />} />
                <Route path="/payment/:eventId" element={<DonationPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                <Route
                  element={<ProtectedRoute allowedRoles={["admin", "host"]} />}
                >
                  <Route path="/create-event" element={<CreateEventPage />} />
                  <Route path="/dashboard/invite" element={<InvitePage />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute allowedRoles={["admin", "host", "guest"]} />
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />}>
                    <Route index element={<DashboardRedirect />} />
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="host" element={<HostDashboard />} />
                    <Route path="guest" element={<GuestDashboard />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="my-events" element={<MyEventsPage />} />
                    <Route
                      path="contributions"
                      element={<ContributionsPage />}
                    />
                    <Route path="users" element={<UsersPage />} />
                    <Route
                      path="request-assistance"
                      element={<RequestsPage />}
                    />
                    <Route path="contactus" element={<ContactPage />} />
                    <Route path="stories" element={<StoriesPage />} />
                  </Route>
                </Route>
              </Routes>
            </main>

            {!hideNavbarAndFooter && <Footer />}

            <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </EventProvider>
      </AuthProvider>
    </Elements>
  );
}

export default App;
