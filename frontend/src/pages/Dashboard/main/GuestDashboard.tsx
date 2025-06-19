import type React from "react"
import { Link } from "react-router-dom"
import { Calendar, DollarSign, Users, Search, MapPin, Clock, ChevronRight, Star } from "lucide-react"
import DashboardLayout from "../../../components/dashboard/DashboardLayout"

// Mock data
const stats = [
  { id: 1, title: "Events Attended", value: "8", icon: <Calendar size={24} /> },
  { id: 2, title: "Total Donated", value: "$650", icon: <DollarSign size={24} /> },
  { id: 3, title: "Impact Made", value: "4 Families", icon: <Users size={24} /> },
]

const upcomingEvents = [
  {
    id: 1,
    name: "Sunday Brunch Fundraiser",
    host: "John Smith",
    date: "May 21, 2023",
    time: "10:00 AM",
    location: "123 Main St, Anytown",
  },
  {
    id: 2,
    name: "Dinner for Education",
    host: "Sarah Johnson",
    date: "June 5, 2023",
    time: "7:00 PM",
    location: "456 Oak Ave, Somewhere",
  },
]

const recommendedEvents = [
  {
    id: 1,
    name: "Charity Dinner",
    host: "Michael Brown",
    date: "May 25, 2023",
    time: "6:30 PM",
    location: "789 Pine St, Anytown",
    cause: "Homeless Shelter",
  },
  {
    id: 2,
    name: "Breakfast Fundraiser",
    host: "Emily Davis",
    date: "May 28, 2023",
    time: "9:00 AM",
    location: "321 Elm St, Somewhere",
    cause: "Children's Hospital",
  },
  {
    id: 3,
    name: "Community Lunch",
    host: "David Wilson",
    date: "June 2, 2023",
    time: "12:00 PM",
    location: "654 Maple Ave, Anytown",
    cause: "Food Bank",
  },
]

const pastEvents = [
  { id: 1, name: "Charity Dinner", host: "Robert Johnson", date: "April 15, 2023", donated: "$120", rating: 5 },
  { id: 2, name: "Breakfast Fundraiser", host: "Jennifer Lee", date: "March 22, 2023", donated: "$85", rating: 4 },
  { id: 3, name: "Community Lunch", host: "Thomas Wilson", date: "March 10, 2023", donated: "$150", rating: 5 },
  { id: 4, name: "Dinner for Healthcare", host: "Lisa Anderson", date: "February 28, 2023", donated: "$95", rating: 4 },
]

const GuestDashboard: React.FC = () => {
  return (
    <DashboardLayout userRole="guest" userName="Jane Guest">
      <div className="container-fluid p-4">
        {/* Welcome Banner */}
        <div className="card border-0 bg-primary text-white mb-4 shadow-sm">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-12 col-md-8">
                <h2 className="mb-2">Welcome back, Jane!</h2>
                <p className="mb-md-0">
                  You have <strong>2 upcoming events</strong> to attend. Your donations have helped{" "}
                  <strong>4 families</strong> so far.
                </p>
              </div>
              {/* <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                <Link to="/dashboard/find-events" className="btn btn-light">
                  <Search size={18} className="me-2" />
                  Find Events
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-4 mb-4">
          {stats.map((stat) => (
            <div key={stat.id} className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="stat-icon">{stat.icon}</div>
                  </div>
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-title text-muted mb-0">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        {/* <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Your Upcoming Events</h5>
            <Link to="/dashboard/events" className="btn btn-sm btn-link text-primary">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="card-body p-0">
            {upcomingEvents.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Event Name</th>
                      <th>Host</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="fw-semibold">{event.name}</td>
                        <td>{event.host}</td>
                        <td>{event.date}</td>
                        <td>{event.time}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <MapPin size={16} className="me-1 text-muted" />
                            <span>{event.location}</span>
                          </div>
                        </td>
                        <td>
                          <Link to={`/dashboard/events/${event.id}`} className="btn btn-sm btn-outline-primary">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <Calendar size={48} className="text-muted mb-3" />
                <h5>No Upcoming Events</h5>
                <p className="text-muted">You haven't registered for any events yet.</p>
                <Link to="/dashboard/find-events" className="btn btn-primary">
                  <Search size={18} className="me-2" />
                  Find Events
                </Link>
              </div>
            )}
          </div>
        </div> */}

        {/* Recommended Events */}
        {/* <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Recommended Events</h5>
          </div>
          <div className="card-body">
            <div className="row g-4">
              {recommendedEvents.map((event) => (
                <div key={event.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border">
                    <div className="card-body">
                      <h5 className="card-title mb-3">{event.name}</h5>
                      <div className="d-flex align-items-center mb-2">
                        <Users size={16} className="me-2 text-muted" />
                        <span>Hosted by {event.host}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Calendar size={16} className="me-2 text-muted" />
                        <span>{event.date}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Clock size={16} className="me-2 text-muted" />
                        <span>{event.time}</span>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <MapPin size={16} className="me-2 text-muted" />
                        <span>{event.location}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="badge bg-info">{event.cause}</span>
                        <Link to={`/dashboard/events/${event.id}`} className="btn btn-sm btn-outline-primary">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Past Events */}
        {/* <div className="card border-0 shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Past Events</h5>
            <Link to="/dashboard/events" className="btn btn-sm btn-link text-primary">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Event Name</th>
                    <th>Host</th>
                    <th>Date</th>
                    <th>Donated</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.name}</td>
                      <td>{event.host}</td>
                      <td>{event.date}</td>
                      <td className="text-success fw-semibold">{event.donated}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {[...Array(event.rating)].map((_, i) => (
                            <Star key={i} size={16} className="text-warning" />
                          ))}
                        </div>
                      </td>
                      <td>
                        <Link to={`/dashboard/events/${event.id}`} className="btn btn-sm btn-outline-secondary">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  )
}

export default GuestDashboard
