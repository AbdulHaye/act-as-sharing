import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Heart, MessageCircle, DollarSign, Award, ChevronDown } from 'lucide-react';
import '../styles/how-it-works-page.css';
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const HowItWorksPage: React.FC = () => {
  // State to track which FAQ item is open (null if all are closed)
  const [openFaq, setOpenFaq] = useState<number | null>(null);


    const handleLoginClick = () => {
    toast.info("Please login first");
  };

    const { isAuthenticated } = useAuth();


  // Function to toggle FAQ items
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="how-it-works-page">
      <section className="how-it-works-hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="hero-title">How It Works</h1>
             <p className="mb-2" style={{ color: '#5144A1' }}>
  A simple step-by-step guide to hosting your own meal gathering and creating positive impact
</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="process-overview py-5">
        <div className="container">
          <div className="process-timeline">
            <div className="process-step">
              <div className="process-icon">
                <Calendar size={32} />
              </div>
              <div className="process-content">
                <h2>1. Schedule a Meal</h2>
                <p>
                  Create an event by selecting a date, time, and location for your meal gathering. This can be at your home, a restaurant, or even a virtual gathering.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Choose in-person or virtual format</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Set a convenient date and time</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Determine your guest capacity</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <Heart size={32} />
              </div>
              <div className="process-content">
                <h2>2. Identify a Need</h2>
                <p>
                  Select someone in your community who needs support. Share their story and how the funds raised will specifically help them overcome their current challenge.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Choose a recipient with a specific need</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Document their story with their permission</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Set a clear fundraising goal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <Users size={32} />
              </div>
              <div className="process-content">
                <h2>3. Invite Your Guests</h2>
                <p>
                  Send invitations to friends, family, and colleagues who might want to participate. Share the recipient's story and explain how their contributions will make an impact.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Easily send email invitations</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Share via social media or direct link</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Track RSVPs and contributions</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <DollarSign size={32} />
              </div>
              <div className="process-content">
                <h2>4. Gather and Contribute</h2>
                <p>
                  At your meal, enjoy food and conversation while collecting contributions toward your goal. Guests can contribute online or in person, with real-time progress tracking.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Secure online payment processing</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Watch your goal tracker update in real-time</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Share the recipient's story during the meal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <MessageCircle size={32} />
              </div>
              <div className="process-content">
                <h2>5. Create a Message</h2>
                <p>
                  Together with your guests, craft a personal message, card, or video for the recipient to accompany the financial gift. This adds a meaningful personal touch to your contribution.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Record video messages during your gathering</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Write collective notes of encouragement</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Capture photos of your gathering</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <Award size={32} />
              </div>
              <div className="process-content">
                <h2>6. Make an Impact</h2>
                <p>
                  After your event, the collected funds are securely transferred to the recipient. You'll receive confirmation and can share impact updates with your guests.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Secure fund disbursement to recipient</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Share follow-up updates with your guests</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Track your impact history and create future events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Common questions about hosting and participating in meal gatherings
              </p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="faq-accordion">
                {/* FAQ Item 1 */}
                <div className="faq-item">
                  <div 
                    className="faq-header" 
                    onClick={() => toggleFaq(1)}
                    role="button"
                    aria-expanded={openFaq === 1}
                    aria-controls="faq-collapse-1"
                  >
                    <h3 className="faq-question">Who can host a meal gathering?</h3>
                    <span className={`faq-toggle-icon ${openFaq === 1 ? 'open' : ''}`}>
                      <ChevronDown size={20} />
                    </span>
                  </div>
                  <div 
                    id="faq-collapse-1" 
                    className={`faq-body ${openFaq === 1 ? 'open' : 'closed'}`}
                  >
                    <p>
                      Anyone can host a meal gathering! Whether you're an individual, a family, a community group, or a business, you can create an event to support someone in need. Simply sign up, follow our step-by-step guide, and use our platform to invite guests and collect contributions.
                    </p>
                  </div>
                </div>

                {/* FAQ Item 2 */}
                <div className="faq-item">
                  <div 
                    className="faq-header" 
                    onClick={() => toggleFaq(2)}
                    role="button"
                    aria-expanded={openFaq === 2}
                    aria-controls="faq-collapse-2"
                  >
                    <h3 className="faq-question">How are funds disbursed to recipients?</h3>
                    <span className={`faq-toggle-icon ${openFaq === 2 ? 'open' : ''}`}>
                      <ChevronDown size={20} />
                    </span>
                  </div>
                  <div 
                    id="faq-collapse-2" 
                    className={`faq-body ${openFaq === 2 ? 'open' : 'closed'}`}
                  >
                    <p>
                      After your event ends, funds are securely processed and disbursed to the recipient via their preferred method (e.g., bank transfer or check). We verify recipients to ensure funds reach the intended person, and hosts receive confirmation to share with guests.
                    </p>
                  </div>
                </div>

                {/* FAQ Item 3 */}
                <div className="faq-item">
                  <div 
                    className="faq-header" 
                    onClick={() => toggleFaq(3)}
                    role="button"
                    aria-expanded={openFaq === 3}
                    aria-controls="faq-collapse-3"
                  >
                    <h3 className="faq-question">Can I contribute if I can't attend the meal?</h3>
                    <span className={`faq-toggle-icon ${openFaq === 3 ? 'open' : ''}`}>
                      <ChevronDown size={20} />
                    </span>
                  </div>
                  <div 
                    id="faq-collapse-3" 
                    className={`faq-body ${openFaq === 3 ? 'open' : 'closed'}`}
                  >
                    <p>
                      Yes, you can! Even if you can’t attend, you can contribute financially through the invitation link. You’ll receive updates on the impact and can send a message to be shared with the recipient.
                    </p>
                  </div>
                </div>

                {/* FAQ Item 4 */}
                <div className="faq-item">
                  <div 
                    className="faq-header" 
                    onClick={() => toggleFaq(4)}
                    role="button"
                    aria-expanded={openFaq === 4}
                    aria-controls="faq-collapse-4"
                  >
                    <h3 className="faq-question">What types of needs can be supported?</h3>
                    <span className={`faq-toggle-icon ${openFaq === 4 ? 'open' : ''}`}>
                      <ChevronDown size={20} />
                    </span>
                  </div>
                  <div 
                    id="faq-collapse-4" 
                    className={`faq-body ${openFaq === 4 ? 'open' : 'closed'}`}
                  >
                    <p>
                      We support needs like medical expenses, housing, education, small business funding, disaster relief, and more. The need must be specific with a clear goal, and hosts should transparently explain how funds will help.
                    </p>
                  </div>
                </div>

                {/* FAQ Item 5 */}
                <div className="faq-item">
                  <div 
                    className="faq-header" 
                    onClick={() => toggleFaq(5)}
                    role="button"
                    aria-expanded={openFaq === 5}
                    aria-controls="faq-collapse-5"
                  >
                    <h3 className="faq-question">Are there any fees for using the platform?</h3>
                    <span className={`faq-toggle-icon ${openFaq === 5 ? 'open' : ''}`}>
                      <ChevronDown size={20} />
                    </span>
                  </div>
                  <div 
                    id="faq-collapse-5" 
                    className={`faq-body ${openFaq === 5 ? 'open' : 'closed'}`}
                  >
                    <p>
                      We charge a 5% platform fee for operations and support, plus standard payment processing fees (approx. 2.9% + $0.30 per transaction). These are displayed during contributions, with 100% of the remaining funds going to the recipient.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="host-cta py-5">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-7 mb-4 mb-lg-0">
                <h2>Ready to Make a Difference?</h2>
                <p className="mb-0">
                  Create your meal gathering today and bring people together for a meaningful cause.
                </p>
              </div>
              <div className="col-lg-5 text-lg-end">
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
  </div>
  
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;