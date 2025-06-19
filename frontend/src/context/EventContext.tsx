import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { EventFormData } from '../modals/EventCreationForm';
import { useAuth } from '../context/AuthContext';

// Define your Event interface
export interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  guestCount: number;
  goalAmount: number;
  description: string;
  imageUrl?: string;
  recipientName: string;
  categoryOfNeed: string;
  recipientStory: string;
  recipientPhoto?: string;
  fundsUsage: string;
  createdBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  currentAmount: number;
  time: string;
  isPublic: boolean;
  uniqueUrl: string;
  guests: string[];
  contributions: string[];
  messages: string[];
  recipient: Recipient;
}

export interface Recipient {
  name: string;
  categoryOfNeed: string;
  story: string;
  photoUrl?: string | null;
  fundsUsage: string;
}

interface EventContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  createEvent: (formData: EventFormData) => Promise<void>;
  getEvents: (page?: number, limit?: number) => Promise<{ events: Event[], pagination: { currentPage: number, totalPages: number, totalEvents: number, limit: number } }>;
  getPublicEvents: (params?: GetPublicEventsParams) => Promise<{ events: Event[], pagination: { currentPage: number, totalPages: number, totalEvents: number, limit: number } }>;
  getHostSpecificEvents: (page?: number, limit?: number) => Promise<{ events: Event[], pagination: { currentPage: number, totalPages: number, totalEvents: number, limit: number } }>;
  updateEvent: (id: string, formData: Partial<EventFormData>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  sendInvitation: (toEmail: string, eventId: string) => Promise<void>;
  getEventById: (id: string) => Promise<Event | null>;
}

interface GetPublicEventsParams {
  page?: number;
  limit?: number;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, refreshToken } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all events (for admin/guest)
  const getEvents = useCallback(async (page: number = 1, limit: number = 100) => {
    console.log('getEvents called (all events)', { page, limit });
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || (await refreshToken());
      const response = await axiosInstance.get(`/events?page=${page}&limit=${limit}`, {
        headers: { 'x-auth-token': token, 'X-Skip-Redirect': 'true' },
      });
      const eventsData = Array.isArray(response.data.events) ? response.data.events : [];
      setEvents(eventsData);
      setError(null);
      console.log('Fetched all events:', response.data);
      return {
        events: eventsData,
        pagination: {
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalEvents: response.data.pagination.totalEvents,
          limit: response.data.pagination.limit,
        },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch events';
      setError(errorMessage);
      setEvents([]);
      return { events: [], pagination: { currentPage: 1, totalPages: 1, totalEvents: 0, limit } };
    } finally {
      setLoading(false);
    }
  }, [refreshToken]);

  // Fetch public events (no auth required)
  const getPublicEvents = useCallback(async ({ page = 1, limit = 3 }: GetPublicEventsParams = {}) => {
    console.log('getPublicEvents called', { page, limit });
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/events/public?page=${page}&limit=${limit}`, {
        headers: { 'X-Skip-Redirect': 'true' },
      });
      const eventsData = Array.isArray(response.data.events) ? response.data.events : [];
      setEvents(eventsData);
      setError(null);
      console.log('Fetched public events:', response.data);
      return {
        events: eventsData,
        pagination: {
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalEvents: response.data.pagination.totalEvents,
          limit: response.data.pagination.limit,
        },
      };
    } catch (err: any) {
      setError(`Failed to fetch public events: ${err.response?.data?.message || err.message}`);
      setEvents([]);
      return { events: [], pagination: { currentPage: 1, totalPages: 1, totalEvents: 0, limit } };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch host-specific events (for host dashboard)
  const getHostSpecificEvents = useCallback(async (page: number = 1, limit: number = 10000) => {
    console.log('getHostSpecificEvents called', { page, limit });
    if (!user || !isAuthenticated) {
      setError('User must be authenticated to fetch host-specific events');
      return { events: [], pagination: { currentPage: 1, totalPages: 1, totalEvents: 0, limit } };
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || (await refreshToken());
      const response = await axiosInstance.get(`/events/my-events?page=${page}&limit=${limit}`, {
        headers: { 'x-auth-token': token, 'X-Skip-Redirect': 'true' },
      });
      const eventsData = Array.isArray(response.data.events) ? response.data.events : [];
      setEvents(eventsData);
      setError(null);
      console.log('Fetched host-specific events:', response.data);
      return {
        events: eventsData,
        pagination: {
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalEvents: response.data.pagination.totalEvents,
          limit: response.data.pagination.limit,
        },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch host-specific events';
      setError(errorMessage);
      setEvents([]);
      return { events: [], pagination: { currentPage: 1, totalPages: 1, totalEvents: 0, limit } };
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, refreshToken]);

  // Fetch single event by ID
  const getEventById = useCallback(async (id: string): Promise<Event | null> => {
    console.log(`getEventById called for ID: ${id}`);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/events/${id}`, {
        headers: { 'X-Skip-Redirect': 'true' },
      });
      setError(null);
      console.log('Fetched event by ID:', response.data);
      return response.data;
    } catch (err: any) {
      setError(`Failed to fetch event: ${err.response?.data?.message || err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new event
  const createEvent = useCallback(
    async (formData: EventFormData) => {
      if (!user) {
        setError('User must be logged in to create an event');
        return;
      }
      setLoading(true);
      try {
        const data = new FormData();
        data.append('title', formData.name);
        data.append('description', formData.description);
        const eventDateTime = `${formData.date}T${formData.time}:00Z`;
        data.append('date', eventDateTime);
        data.append('time', formData.time);
        data.append('location', formData.location);
        data.append('guestCount', formData.maxGuests.toString());
        data.append('goalAmount', formData.fundingGoal.toString());
        data.append('recipientName', formData.recipientName);
        data.append('categoryOfNeed', formData.categoryOfNeed);
        data.append('recipientStory', formData.recipientStory);
        data.append('fundsUsage', formData.fundsUsage);
        data.append('createdBy', user._id);
        data.append('isPublic', formData.visibility === 'public' ? 'true' : 'false');
        if (formData.eventImage) data.append('eventImage', formData.eventImage);
        if (formData.recipientPhoto) data.append('recipientPhoto', formData.recipientPhoto);

        const token = localStorage.getItem('token') || (await refreshToken());
        const response = await axiosInstance.post('/events', data, {
          headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token, 'X-Skip-Redirect': 'true' },
        });

        setEvents((prev) => {
          const prevArray = Array.isArray(prev) ? prev : [];
          return [...prevArray, response.data];
        });
        setError(null);
        if (user.role === 'host') {
          await getHostSpecificEvents();
        } else {
          await getEvents();
        }
      } catch (err: any) {
        setError(`Failed to create event: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [user, getEvents, getHostSpecificEvents, refreshToken]
  );

  // Update an existing event
// Update an existing event
const updateEvent = useCallback(
  async (id: string, formData: FormData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || (await refreshToken());
      const response = await axiosInstance.put(`/events/${id}`, formData, {
        headers: {
          'x-auth-token': token,
          'X-Skip-Redirect': 'true',
          'Content-Type': 'multipart/form-data', // Explicitly set to ensure correct type
        },
      });

      // Update state and handle success
      setEvents((prev) => prev.map((evt) => (evt._id === id ? response.data : evt)));
      setError(null);
      if (user?.role === 'host') {
        await getHostSpecificEvents();
      } else {
        await getEvents();
      }
    } catch (err: any) {
      setError(`Failed to update event: ${err.response?.data?.message || err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [user, getEvents, getHostSpecificEvents, refreshToken]
);
  // Delete an event
  const deleteEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || (await refreshToken());
        await axiosInstance.delete(`/events/${id}`, { headers: { 'x-auth-token': token, 'X-Skip-Redirect': 'true' } });
        setEvents((prev) => prev.filter((evt) => evt._id !== id));
        setError(null);
        if (user?.role === 'host') {
          await getHostSpecificEvents();
        } else {
          await getEvents();
        }
      } catch (err: any) {
        setError(`Failed to delete event: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [user, getEvents, getHostSpecificEvents, refreshToken]
  );

  // Send an invitation
  const sendInvitation = useCallback(
    async (toEmail: string, eventId: string) => {
      setLoading(true);
      try {
        if (!user?.email) {
          throw new Error('User email is not available');
        }
        const token = localStorage.getItem('token') || (await refreshToken());
        await axiosInstance.post(
          '/events/invite-by-email',
          {
            from: user.email,
            to: toEmail,
            eventId: eventId,
          },
          { headers: { 'x-auth-token': token, 'X-Skip-Redirect': 'true' } }
        );
        setError(null);
      } catch (err: any) {
        setError(`Failed to send invitation: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [user, refreshToken]
  );

  // Initial fetch based on user role
  useEffect(() => {
    if (user) {
      if (user.role === 'host') {
        getHostSpecificEvents();
      } else {
        getEvents();
      }
    }
  }, [user, getEvents, getHostSpecificEvents]);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      events,
      loading,
      error,
      createEvent,
      getEvents,
      getPublicEvents,
      getHostSpecificEvents,
      updateEvent,
      deleteEvent,
      sendInvitation,
      getEventById,
    }),
    [
      events,
      loading,
      error,
      createEvent,
      getEvents,
      getPublicEvents,
      getHostSpecificEvents,
      updateEvent,
      deleteEvent,
      sendInvitation,
      getEventById,
    ]
  );

  return <EventContext.Provider value={contextValue}>{children}</EventContext.Provider>;
};

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvent must be used within an EventProvider');
  return context;
};