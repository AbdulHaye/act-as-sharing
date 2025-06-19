import React from 'react';
import { Users, Calendar, Heart, MessageCircle, DollarSign, Award } from 'lucide-react';
import '../../styles/how-it-works.css';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}

const Step: React.FC<StepProps> = ({ icon, title, description, step }) => {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="step-card">
        <div className="step-number">{step}</div>
        <div className="step-icon">{icon}</div>
        <h3 className="step-title">{title}</h3>
        <p className="step-description">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Calendar size={42} />,
      title: "Schedule a Meal",
      description: "Create an event and set a date, time, and location for your meal gathering.",
      step: 1
    },
    {
      icon: <Users size={42} />,
      title: "Invite Friends",
      description: "Send invitations to friends and family who want to make a difference together.",
      step: 2
    },
    {
      icon: <Heart size={42} />,
      title: "Share a Story",
      description: "Tell your guests about someone in need and why their support matters.",
      step: 3
    },
    {
      icon: <DollarSign size={42} />,
      title: "Collect Contributions",
      description: "Pool your resources during the meal to reach your giving goal together.",
      step: 4
    },
    {
      icon: <MessageCircle size={42} />,
      title: "Create a Message",
      description: "Craft a heartfelt message or video from your group to the recipient.",
      step: 5
    },
    {
      icon: <Award size={42} />,
      title: "Make an Impact",
      description: "Deliver the pooled funds and message to make a meaningful difference.",
      step: 6
    }
  ];

  return (
    <section className="how-it-works py-5">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-lg-8 mx-auto">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              A simple process to create meaningful impact through shared meals and collective giving
            </p>
          </div>
        </div>

        <div className="row">
          {steps.map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              step={step.step}
            />
          ))}
        </div>

        {/* <div className="text-center mt-4">
          
          <button className="btn btn-primary btn-lg">Host Your Meal</button>
        </div> */}
      </div>
    </section>
  );
};

export default HowItWorks;