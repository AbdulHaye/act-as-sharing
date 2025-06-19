import React from "react";
import { Link } from "react-router-dom";
import "../../styles/hero.css";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Hero: React.FC = () => {
  const handleLoginClick = () => {
    toast.info("Please login first");
  };

  const { isAuthenticated } = useAuth();
  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 hero-content">
            <h1 className="hero-title">
              Gather. Share. <span className="text-primary">Change Lives.</span>
            </h1>
            <p className="hero-subtitle">
              Host a meal with friends, pool your resources, and make a
              collective impact in someone's life.
            </p>
            <div className="hero-buttons">
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
              {/* <Link to="/dashboard" className="btn btn-primary btn-lg me-3">
                Host a Meal
              </Link> */}
              <Link
                to="/how-it-works"
                className="btn btn-outline-primary btn-lg"
              >
                Learn How
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">$320K+</span>
                <span className="hero-stat-label">Raised</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">470+</span>
                <span className="hero-stat-label">Families Helped</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">1,200+</span>
                <span className="hero-stat-label">Meals Hosted</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6 hero-image-container">
            <img
              src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Group of diverse friends enjoying a meal together"
              className="hero-image img-fluid"
            />
          </div>
        </div>
      </div>
      <div className="hero-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,128L80,112C160,96,320,64,480,64C640,64,800,96,960,106.7C1120,117,1280,107,1360,101.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
