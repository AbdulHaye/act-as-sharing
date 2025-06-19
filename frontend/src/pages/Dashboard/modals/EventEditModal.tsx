import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, DollarSign, FileText, Image } from 'lucide-react';
import { useEvent } from '../../../context/EventContext';
import { toast } from 'react-toastify';
import '../../../styles/my-events.css';

interface EventFormData {
  name: string;
  date: string;
  time: string;
  location: string;
  maxGuests: string;
  fundingGoal: string;
  description: string;
  eventImage: File | null;
  recipient: {
    name: string;
    categoryOfNeed: string;
    story: string;
    photo: File | null;
    fundsUsage: string;
  };
  visibility: "" | "public" | "private";
}

interface EventEditModalProps {
  show: boolean;
  onHide: () => void;
  event: {
    _id: string;
    title: string;
    date: string;
    location: string;
    guestCount: number;
    goalAmount: number;
    description: string;
    imageUrl?: string | null;
    recipient: {
      name: string;
      categoryOfNeed: string;
      story: string;
      photoUrl?: string | null;
      fundsUsage: string;
    };
    isPublic: boolean;
  } | null;
}

const EventEditModal: React.FC<EventEditModalProps> = ({ show, onHide, event }) => {
  const { updateEvent, loading } = useEvent();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const totalSteps = 3;
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    date: '',
    time: '',
    location: '',
    maxGuests: '',
    fundingGoal: '',
    description: '',
    eventImage: null,
    recipient: {
      name: '',
      categoryOfNeed: '',
      story: '',
      photo: null,
      fundsUsage: '',
    },
    visibility: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryLabels: Record<string, string> = {
    medical: 'Medical Expenses',
    housing: 'Housing',
    education: 'Education',
    business: 'Small Business',
    disaster: 'Disaster Relief',
    other: 'Other',
  };

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setFormData({
        name: event.title || '',
        description: event.description || '',
        date: eventDate.toISOString().split('T')[0] || '',
        time: eventDate.toTimeString().slice(0, 5) || '',
        location: event.location || '',
        maxGuests: event.guestCount?.toString() || '',
        fundingGoal: event.goalAmount?.toString() || '',
        eventImage: null,
        recipient: {
          name: event.recipient?.name || '',
          categoryOfNeed: event.recipient?.categoryOfNeed || '',
          story: event.recipient?.story || '',
          photo: null,
          fundsUsage: event.recipient?.fundsUsage || '',
        },
        visibility: event.isPublic ? 'public' : 'private',
      });
    } else {
      setFormData({
        name: '',
        date: '',
        time: '',
        location: '',
        maxGuests: '',
        fundingGoal: '',
        description: '',
        eventImage: null,
        recipient: {
          name: '',
          categoryOfNeed: '',
          story: '',
          photo: null,
          fundsUsage: '',
        },
        visibility: '',
      });
    }
  }, [event]);

  const validateStep = (step: number): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name) errors.name = 'Event title is required';
      if (!formData.date) errors.date = 'Date is required';
      if (!formData.time) errors.time = 'Time is required';
      if (!formData.location) errors.location = 'Location is required';
      if (!formData.maxGuests) {
        errors.maxGuests = 'Max guests is required';
      } else if (isNaN(Number(formData.maxGuests)) || Number(formData.maxGuests) < 2) {
        errors.maxGuests = 'Max guests must be at least 2';
      }
      if (!formData.fundingGoal) {
        errors.fundingGoal = 'Funding goal is required';
      } else if (isNaN(Number(formData.fundingGoal)) || Number(formData.fundingGoal) < 25) {
        errors.fundingGoal = 'Funding goal must be at least 25';
      }
      if (!formData.description) errors.description = 'Description is required';
      if (!formData.visibility) errors.visibility = 'Event visibility is required';
    } else if (step === 2) {
      if (!formData.recipient.name) errors.recipientName = 'Recipient name is required';
      if (!formData.recipient.categoryOfNeed) errors.categoryOfNeed = 'Category of need is required';
      if (!formData.recipient.story) errors.recipientStory = 'Recipient story is required';
      if (!formData.recipient.fundsUsage) errors.fundsUsage = 'Funds usage is required';
    }
    return errors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      setErrors({});
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRecipientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        [name]: value,
      },
    }));
    setErrors((prev) => ({ ...prev, [`recipient${name.charAt(0).toUpperCase() + name.slice(1)}`]: '' }));
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name } = e.target;
  const file = e.target.files ? e.target.files[0] : null;
  console.log(`Selected ${name}:`, file);
  if (name === 'eventImage') {
    setFormData((prev) => ({ ...prev, eventImage: file }));
  } else if (name === 'recipientPhoto') {
    setFormData((prev) => ({
      ...prev,
      recipient: { ...prev.recipient, photo: file },
    }));
  }
};

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTermsChecked(e.target.checked);
    if (e.target.checked) {
      setErrors((prev) => ({ ...prev, termsCheck: '' }));
    } else {
      setErrors((prev) => ({ ...prev, termsCheck: 'Please check the box' }));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!event) {
    toast.error('No event selected');
    return;
  }

  const step1Errors = validateStep(1);
  const step2Errors = validateStep(2);
  const allErrors = { ...step1Errors, ...step2Errors };
  if (Object.keys(allErrors).length > 0) {
    setErrors(allErrors);
    return;
  }
  if (!isTermsChecked) {
    setErrors((prev) => ({ ...prev, termsCheck: 'Please check the box' }));
    return;
  }

  try {
    // Create FormData object
    const formDataToSend = new FormData();

    // Append top-level fields
    formDataToSend.append('title', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('guestCount', formData.maxGuests);
    formDataToSend.append('goalAmount', formData.fundingGoal);
    formDataToSend.append('isPublic', String(formData.visibility === 'public'));
    formDataToSend.append('visibility', formData.visibility);

    // Append recipient fields as flat fields (consistent with EventCreationForm)
    formDataToSend.append('recipientName', formData.recipient.name);
    formDataToSend.append('categoryOfNeed', formData.recipient.categoryOfNeed);
    formDataToSend.append('recipientStory', formData.recipient.story);
    formDataToSend.append('fundsUsage', formData.recipient.fundsUsage);

    // Append files if they exist
    if (formData.eventImage) {
      console.log('Appending eventImage:', formData.eventImage);
      formDataToSend.append('eventImage', formData.eventImage);
    }
    if (formData.recipient.photo) {
      console.log('Appending recipientPhoto:', formData.recipient.photo);
      formDataToSend.append('recipientPhoto', formData.recipient.photo);
    }

    console.log('FormData to send:', formDataToSend);
    for (const [key, value] of formDataToSend.entries()) {
      console.log(`FormData entry: ${key} =`, value);
    }

    await updateEvent(event._id, formDataToSend);
    toast.success('Event updated successfully');
    onHide();
  } catch (err: any) {
    console.error('Error updating event:', err);
    toast.error('Failed to update event');
  }
};
  if (!show) return null;

  return (
    <div
      className="modal"
      tabIndex={-1}
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}
    >
      <div className="modal-dialog  modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Event</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-progress mb-4 d-flex justify-content-between align-items-center">
                {[...Array(totalSteps)].map((_, index) => (
                  <div
                    key={index}
                    className={`progress-step text-center ${
                      currentStep > index + 1 ? 'completed' : ''
                    } ${currentStep === index + 1 ? 'active' : ''}`}
                    style={{ flex: 1 }}
                  >
                    <div
                      className="progress-circle mx-auto"
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: currentStep > index + 1 ? '#5144A1' : currentStep === index + 1 ? '#5144A1' : '#dee2e6',
                        color: currentStep >= index + 1 ? 'white' : '#6c757d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="progress-label mt-2" style={{ fontSize: '12px' }}>
                      {index === 0 ? 'Event Details' : index === 1 ? 'Recipient Info' : 'Review'}
                    </div>
                    {index < totalSteps - 1 && (
                      <div
                        className="progress-line"
                        style={{
                          position: 'absolute',
                          top: '15px',
                          left: '50%',
                          width: '50%',
                          height: '2px',
                          backgroundColor: currentStep > index + 1 ? '#5144A1' : '#dee2e6',
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-card">
                {currentStep === 1 && (
                  <div className="form-step">
                    <h2 className="h4 mb-2">Event Details</h2>
                    <p className="text-muted mb-4">
                      Let's set up your meal gathering. Provide details about when and where you'll host.
                    </p>

                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Event Title *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FileText size={18} />
                        </span>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Give your event a meaningful name"
                          required
                          disabled={loading}
                        />
                      </div>
                      {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="date" className="form-label">Date *</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <Calendar size={18} />
                          </span>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                            disabled={loading}
                          />
                        </div>
                        {errors.date && <div className="text-danger mt-1">{errors.date}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="time" className="form-label">Time *</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <Clock size={18} />
                          </span>
                          <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                            disabled={loading}
                          />
                        </div>
                        {errors.time && <div className="text-danger mt-1">{errors.time}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">Location *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <MapPin size={18} />
                        </span>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Address or virtual link"
                          required
                          disabled={loading}
                        />
                      </div>
                      {errors.location && <div className="text-danger mt-1">{errors.location}</div>}
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="maxGuests" className="form-label">Max Guests *</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <Users size={18} />
                          </span>
                          <input
                            type="number"
                            id="maxGuests"
                            name="maxGuests"
                            value={formData.maxGuests}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., 12"
                            min="2"
                            required
                            disabled={loading}
                          />
                        </div>
                        {errors.maxGuests && <div className="text-danger mt-1">{errors.maxGuests}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="fundingGoal" className="form-label">Funding Goal *</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <DollarSign size={18} />
                          </span>
                          <input
                            type="number"
                            id="fundingGoal"
                            name="fundingGoal"
                            value={formData.fundingGoal}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., 500"
                            min="25"
                            required
                            disabled={loading}
                          />
                        </div>
                        {errors.fundingGoal && <div className="text-danger mt-1">{errors.fundingGoal}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="visibility" className="form-label">Visibility *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <Users size={18} />
                        </span>
                        <select
                          id="visibility"
                          name="visibility"
                          value={formData.visibility}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                          disabled={loading}
                        >
                          <option value="" disabled>Select visibility</option>
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      {errors.visibility && <div className="text-danger mt-1">{errors.visibility}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Event Description *</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-control"
                        rows={4}
                        placeholder="Tell your guests what to expect at your gathering"
                        required
                        disabled={loading}
                      ></textarea>
                      {errors.description && <div className="text-danger mt-1">{errors.description}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="eventImage" className="form-label">Event Image</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <Image size={18} />
                        </span>
                        <input
                          type="file"
                          id="eventImage"
                          name="eventImage"
                          onChange={handleFileChange}
                          className="form-control"
                          accept="image/*"
                          disabled={loading}
                        />
                      </div>
                      <small className="text-muted d-block mt-1">
                        Upload an image that represents your meal gathering. Recommended size: 1200x800px.
                        {event?.imageUrl && ' Current image will be replaced if a new one is uploaded.'}
                      </small>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="form-step">
                    <h2 className="h4 mb-2">Recipient Information</h2>
                    <p className="text-muted mb-4">
                      Share the story of who will benefit from your meal gathering and why they need support.
                    </p>

                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Recipient Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.recipient.name}
                        onChange={handleRecipientInputChange}
                        className="form-control"
                        placeholder="Individual or family name"
                        required
                        disabled={loading}
                      />
                      {errors.recipientName && <div className="text-danger mt-1">{errors.recipientName}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="categoryOfNeed" className="form-label">Category of Need *</label>
                      <select
                        id="categoryOfNeed"
                        name="categoryOfNeed"
                        value={formData.recipient.categoryOfNeed}
                        onChange={handleRecipientInputChange}
                        className="form-control"
                        required
                        disabled={loading}
                      >
                        <option value="">Select a category</option>
                        <option value="medical">Medical Expenses</option>
                        <option value="housing">Housing</option>
                        <option value="education">Education</option>
                        <option value="business">Small Business</option>
                        <option value="disaster">Disaster Relief</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.categoryOfNeed && <div className="text-danger mt-1">{errors.categoryOfNeed}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="story" className="form-label">Their Story *</label>
                      <textarea
                        id="story"
                        name="story"
                        value={formData.recipient.story}
                        onChange={handleRecipientInputChange}
                        className="form-control"
                        rows={6}
                        placeholder="Share why this person or family needs support and how the funds will help"
                        required
                        disabled={loading}
                      ></textarea>
                      {errors.recipientStory && <div className="text-danger mt-1">{errors.recipientStory}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="recipientPhoto" className="form-label">Recipient Photo</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <Image size={18} />
                        </span>
                        <input
                          type="file"
                          id="recipientPhoto"
                          name="recipientPhoto"
                          onChange={handleFileChange}
                          className="form-control"
                          accept="image/*"
                          disabled={loading}
                        />
                      </div>
                      <small className="text-muted d-block mt-1">
                        With permission, upload a photo of the recipient or something representing their situation.
                        {event?.recipient.photoUrl && ' Current photo will be replaced if a new one is uploaded.'}
                      </small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="fundsUsage" className="form-label">How Funds Will Be Used *</label>
                      <textarea
                        id="fundsUsage"
                        name="fundsUsage"
                        value={formData.recipient.fundsUsage}
                        onChange={handleRecipientInputChange}
                        className="form-control"
                        rows={4}
                        placeholder="Explain exactly how the money raised will help the recipient"
                        required
                        disabled={loading}
                      ></textarea>
                      {errors.fundsUsage && <div className="text-danger mt-1">{errors.fundsUsage}</div>}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="form-step">
                    <h2 className="h4 mb-2">Review Your Event</h2>
                    <p className="text-muted mb-4">
                      Please review all details before creating your event.
                    </p>

                    <div className="review-section mb-4">
                      <h3 className="h5 mb-3">Event Details</h3>
                      <div className="mb-2">
                        <span className="fw-bold">Title:</span>
                        <span className="ms-2">{formData.name}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-bold">Date & Time:</span>
                        <span className="ms-2">{formData.date} • {formData.time}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-bold">Location:</span>
                        <span className="ms-2">{formData.location}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-bold">Max Guests:</span>
                        <span className="ms-2">{formData.maxGuests}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-bold">Funding Goal:</span>
                        <span className="ms-2">${formData.fundingGoal}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-bold">Visibility:</span>
                        <span className="ms-2">{formData.visibility.charAt(0).toUpperCase() + formData.visibility.slice(1)}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-bold">Description:</span>
                        <span className="ms-2">{formData.description}</span>
                      </div>
                      {formData.eventImage && (
                        <div className="mb-2">
                          <span className="fw-bold">Event Image:</span>
                          <span className="ms-2">{formData.eventImage.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="review-section mb-4">
                      <h3 className="h5 mb-3">Recipient Information</h3>
                      <div className="mb-2">
                        <span className="fw-bold">Name:</span>
                        <span className="ms-2">{formData.recipient.name}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-bold">Category:</span>
                        <span className="ms-2">{categoryLabels[formData.recipient.categoryOfNeed] || formData.recipient.categoryOfNeed}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-bold">Story:</span>
                        <span className="ms-2">{formData.recipient.story}</span>
                      </div>
                      {formData.recipient.photo && (
                        <div className="mb-2">
                          <span className="fw-bold">Recipient Photo:</span>
                          <span className="ms-2">{formData.recipient.photo.name}</span>
                        </div>
                      )}
                      <div className="mb-2">
                        <span className="fw-bold">Funds Usage:</span>
                        <span className="ms-2">{formData.recipient.fundsUsage}</span>
                      </div>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="termsCheck"
                        checked={isTermsChecked}
                        onChange={handleCheckboxChange}
                        required
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="termsCheck">
                        I confirm that all information is accurate and I have permission to share the recipient's story.
                      </label>
                      {errors.termsCheck && <div className="text-danger mt-2">{errors.termsCheck}</div>}
                    </div>
                    {errors.submit && <div className="text-danger mt-2">{errors.submit}</div>}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={prevStep}
                  disabled={loading}
                >
                  Back
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={loading}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !isTermsChecked}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .text-primary {
          color: #5144a1 !important;
        }
        .bg-primary {
          background-color: #5144a1 !important;
        }
        .text-danger {
          color: #dc3545 !important;
        }
        .text-muted {
          color: #6c757d !important;
        }
        .form-progress {
          position: relative;
        }
        .progress-step {
          position: relative;
        }
        .progress-circle {
          transition: background-color 0.3s;
        }
        .progress-line {
          z-index: 0;
        }
        .progress-label {
          color: #6c757d;
        }
        .progress-step.active .progress-label,
        .progress-step.completed .progress-label {
          color: #5144a1;
        }
        .review-section-title {
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 0.5rem;
        }
        .review-label {
          font-weight: 500;
          color: #495057;
        }
        .review-value {
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default EventEditModal;