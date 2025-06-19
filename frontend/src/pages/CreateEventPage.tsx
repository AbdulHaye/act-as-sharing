import React from 'react';
import EventForm from '../components/events/EventForm';

const CreateEventPage: React.FC = () => {
  return (
    <div className="create-event-page py-5">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-lg-8 mx-auto">
            <h1 className="section-title">Host a Meal With Mission</h1>
            <p className="section-subtitle">
              Create a meaningful gathering to support someone in need through collective generosity
            </p>
          </div>
        </div>
        
        <EventForm />
      </div>
    </div>
  );
};

export default CreateEventPage;