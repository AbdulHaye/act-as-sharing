import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Facebook, Twitter, Instagram, Mail } from "lucide-react";
import "../../styles/footer.css";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/contact`,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }
      );

      // Check if the response status is in the 2xx range (success)
      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-pattern"></div>
      <div className="footer-glow"></div>

      <div className="container">
        <div className="row footer-top">
          <div className="col-md-4 col-lg-3 mb-4 mb-md-0">
            <div className="footer-brand">
              <Heart size={24} className="heart-icon" />
              <span className="brand-text">COMMONCHANGE</span>
            </div>
            <p className="footer-tagline">
              Bringing communities together to share meals and make a difference
              through collective giving.
            </p>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/CommonChange/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a href="mailto:Support@CommonChange.com" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="col-md-3 col-lg-3 mb-4 mb-md-0">
            <h5 className="footer-heading">Contact</h5>
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <a
                href="mailto:Support@CommonChange.com"
                className="contact-value"
              >
                Support@CommonChange.com
              </a>
            </div>
            {/* <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <a href="tel:4073600777" className="contact-value">
                (407) 360-0778
              </a>
            </div> */}
          </div>

          <div className="col-md-5 col-lg-6">
            <h5 className="footer-heading">Get In Touch</h5>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control cute-input"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-label="Name"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control cute-input"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-label="Email Address"
                  />
                </div>
              </div>
              <div className="form-group">
                <textarea
                  className="form-control cute-input"
                  placeholder="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  aria-label="Message"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>
        </div>

        <div className="footer-divider">
          <div className="divider-glow"></div>
        </div>

        <div className="row footer-bottom">
          <div className="col-md-6 text-center text-md-start">
            <p className="copyright">
              © {currentYear} COMMONCHANGE. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="footer-legal">
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Use</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
