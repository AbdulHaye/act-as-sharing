import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/about-page.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="about-title">Our Mission</h1>
              <p className="about-subtitle">
                Bringing communities together to share meals and make a collective impact
              </p>
              <p className="about-text">
                commonchange was founded on a simple idea: when people gather around a table to share a meal, something magical happens. Conversations flow, connections deepen, and communities grow stronger.
              </p>
              <p className="about-text">
                We've harnessed this power of shared meals to create a platform where friends can come together not just to enjoy each other's company, but to collectively support individuals and families facing challenges in their communities.
              </p>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.pexels.com/photos/3184188/pexels-photo-3184188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Diverse group of friends enjoying a meal together" 
                className="about-image img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-values py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="section-title">Our Values</h2>
              <p className="section-subtitle">
                The principles that guide our mission and community
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="value-card">
                <div className="value-icon community-icon"></div>
                <h3 className="value-title">Community First</h3>
                <p className="value-text">
                  We believe in the power of local communities to support each other through both small and large challenges.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="value-card">
                <div className="value-icon connection-icon"></div>
                <h3 className="value-title">Meaningful Connection</h3>
                <p className="value-text">
                  Relationships matter more than transactions. We foster authentic connections between givers and recipients.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="value-card">
                <div className="value-icon transparency-icon"></div>
                <h3 className="value-title">Full Transparency</h3>
                <p className="value-text">
                  We ensure every dollar is accounted for and goes directly to those in need with clear reporting.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="value-card">
                <div className="value-icon impact-icon"></div>
                <h3 className="value-title">Lasting Impact</h3>
                <p className="value-text">
                  We aim for sustainable support that creates ripple effects of positive change within communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2 mb-5 mb-lg-0">
              <h2 className="section-title text-start">Our Story</h2>
              <p className="about-text">
                commonchange began in 2019 when our founder, Sarah Chen, hosted a dinner for eight friends to raise funds for a neighbor facing unexpected medical bills. What started as a one-time gathering quickly evolved as Sarah and her friends realized the powerful combination of shared meals and collective giving.
              </p>
              <p className="about-text">
                Since then, we've grown from a small group of friends in Portland to a nationwide movement of meal hosts who are changing lives in their communities, one gathering at a time.
              </p>
              <p className="about-text">
                To date, we've helped raise over $320,000 for families in need, funded 47 small business startups, covered medical expenses for 150+ individuals, and provided emergency housing for 64 families affected by disasters.
              </p>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="story-image-grid">
                <img 
                  src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Friends sharing a meal" 
                  className="story-image img-fluid"
                />
                <img 
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Community event planning" 
                  className="story-image img-fluid"
                />
                <img 
                  src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Volunteers planning an event" 
                  className="story-image img-fluid"
                />
                <img 
                  src="https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Group discussion at a table" 
                  className="story-image img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-join py-5">
        <div className="container">
          <div className="join-card">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="join-title">Join Our Mission</h2>
                <p className="join-text">
                  Ready to make a difference in your community? Host a meal, gather friends, and create meaningful impact together.
                </p>
                <div className="mt-4">
                 
                  <Link to="/how-it-works" className="btn btn-outline-light btn-lg">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;