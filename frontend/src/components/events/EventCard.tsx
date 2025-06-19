import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import '../../styles/event-card.css';

interface EventCardProps {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  hostName: string;
  isPublic: boolean;
  attendees: number;
  maxAttendees: number;
  raised: number;
  goal: number;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  image,
  date,
  location,
  hostName,
  isPublic,
  attendees,
  maxAttendees,
  raised,
  goal
}) => {
  const progressPercentage = Math.min(Math.round((raised / goal) * 100), 100);

  return (
    <div className="event-card">
      <div className="event-card-image-container">
        <img src={image} alt={title} className="event-card-image" />
        <div className="event-card-host">Hosted by {hostName}</div>
      </div>
      <div className="event-card-content">
        <h3 className="event-card-title">{title}</h3>
        
        <div className="event-card-details">
          <div className="event-card-detail">
            <Calendar size={16} />
            <span>{date}</span>
          </div>
          <div className="event-card-detail">
            <MapPin size={16} />
            <span>{location}</span>
          </div>
        </div>
        
        <div className="event-card-stats">
          <div className="event-card-stat">
            <Users size={16} />
            <span>{attendees}/{maxAttendees} Attendees</span>
          </div>
          <div className="event-card-stat">
            <DollarSign size={16} />
            <span>${raised} of ${goal}</span>
          </div>
        </div>
        
        <div className="event-card-progress">
          <div 
            className="event-card-progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <Link to={`/events/${id}`} className="btn btn-primary btn-block mt-3">
          View Event
        </Link>
      </div>
    </div>
  );
};

export default EventCard;