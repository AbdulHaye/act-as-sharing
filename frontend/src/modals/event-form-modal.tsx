"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Calendar, Clock, MapPin, Users, DollarSign, FileText, ImageIcon } from "lucide-react"

interface FormData {
  title: string
  date: string
  time: string
  location: string
  maxGuests: string
  fundingGoal: string
  description: string
  eventImage: File | null
  recipientName: string
  categoryOfNeed: string
  recipientStory: string
  recipientPhoto: File | null
  fundsUsage: string
}

type Errors = Record<string, string>

interface EventFormModalProps {
  isOpen: boolean
  onClose: () => void
}

const EventFormModal: React.FC<EventFormModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const totalSteps = 3
  const [formData, setFormData] = useState<FormData>({
    title: "",
    date: "",
    time: "",
    location: "",
    maxGuests: "",
    fundingGoal: "",
    description: "",
    eventImage: null,
    recipientName: "",
    categoryOfNeed: "",
    recipientStory: "",
    recipientPhoto: null,
    fundsUsage: "",
  })
  const [errors, setErrors] = useState<Errors>({})

  // Add effect to handle body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const categoryLabels: Record<string, string> = {
    medical: "Medical Expenses",
    housing: "Housing",
    education: "Education",
    business: "Small Business",
    disaster: "Disaster Relief",
    other: "Other",
  }

  const validateStep = (step: number): Errors => {
    const errors: Errors = {}
    if (step === 1) {
      if (!formData.title) errors.title = "Event title is required"
      if (!formData.date) errors.date = "Date is required"
      if (!formData.time) errors.time = "Time is required"
      if (!formData.location) errors.location = "Location is required"
      if (!formData.maxGuests) {
        errors.maxGuests = "Max guests is required"
      } else if (isNaN(Number(formData.maxGuests)) || Number(formData.maxGuests) < 2) {
        errors.maxGuests = "Max guests must be at least 2"
      }
      if (!formData.fundingGoal) {
        errors.fundingGoal = "Funding goal is required"
      } else if (isNaN(Number(formData.fundingGoal)) || Number(formData.fundingGoal) < 100) {
        errors.fundingGoal = "Funding goal must be at least 100"
      }
      if (!formData.description) errors.description = "Description is required"
    } else if (step === 2) {
      if (!formData.recipientName) errors.recipientName = "Recipient name is required"
      if (!formData.categoryOfNeed) errors.categoryOfNeed = "Category of need is required"
      if (!formData.recipientStory) errors.recipientStory = "Recipient story is required"
      if (!formData.fundsUsage) errors.fundsUsage = "Funds usage is required"
    }
    return errors
  }

  const nextStep = () => {
    const stepErrors: Errors = validateStep(currentStep)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
    } else {
      setErrors({})
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    const step1Errors = validateStep(1)
    const step2Errors = validateStep(2)
    const allErrors: Errors = { ...step1Errors, ...step2Errors }
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      return
    }

    const termsCheck = document.getElementById("termsCheck") as HTMLInputElement
    if (!termsCheck.checked) {
      alert("Please agree to the terms")
      return
    }

    const data = new FormData()
    data.append("title", formData.title)
    data.append("description", formData.description)
    const eventDateTime = `${formData.date}T${formData.time}:00`
    data.append("date", eventDateTime)
    data.append("location", formData.location)
    data.append("guestCount", formData.maxGuests)
    data.append("goalAmount", formData.fundingGoal)
    data.append("recipientName", formData.recipientName)
    data.append("categoryOfNeed", formData.categoryOfNeed)
    data.append("recipientStory", formData.recipientStory)
    data.append("fundsUsage", formData.fundsUsage)
    if (formData.eventImage) data.append("eventImage", formData.eventImage)
    if (formData.recipientPhoto) data.append("recipientPhoto", formData.recipientPhoto)

    try {
      // Replace with your actual API call
      // const response = await axiosInstance.post('/events', data, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      console.log("Event created successfully:", data)
      alert("Event created successfully!")
      onClose()
      // Reset form
      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        maxGuests: "",
        fundingGoal: "",
        description: "",
        eventImage: null,
        recipientName: "",
        categoryOfNeed: "",
        recipientStory: "",
        recipientPhoto: null,
        fundsUsage: "",
      })
      setCurrentStep(1)
    } catch (error: any) {
      console.error("Error creating event:", error)
      alert(`Failed to create event: ${error.message}`)
    }
  }

  // If modal is not open, don't render anything
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {currentStep === 1 ? "Create New Event" : currentStep === 2 ? "Recipient Information" : "Review Event"}
          </h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={submitForm}>
            <div className="event-form-container">
              <div className="form-progress mb-4">
                {[...Array(totalSteps)].map((_, index) => (
                  <div
                    key={index}
                    className={`progress-step ${currentStep > index + 1 ? "completed" : ""} ${currentStep === index + 1 ? "active" : ""}`}
                  >
                    <div className="progress-circle">{index + 1}</div>
                    <div className="progress-label">
                      {index === 0 ? "Event Details" : index === 1 ? "Recipient Info" : "Review"}
                    </div>
                    {index < totalSteps - 1 && <div className="progress-line"></div>}
                  </div>
                ))}
              </div>

              {currentStep === 1 && (
                <div className="form-step">
                  <p className="form-step-description">
                    Let's set up your meal gathering. Provide details about when and where you'll host.
                  </p>

                  <div className="form-group">
                    <label htmlFor="eventTitle">Event Title *</label>
                    <div className="input-icon-wrapper">
                      <span className="input-icon">
                        <FileText size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="eventTitle"
                        value={formData.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Give your event a meaningful name"
                        required
                      />
                    </div>
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="eventDate">Date *</label>
                        <div className="input-icon-wrapper">
                          <span className="input-icon">
                            <Calendar size={18} />
                          </span>
                          <input
                            type="date"
                            className="form-control"
                            id="eventDate"
                            value={formData.date}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                            required
                          />
                        </div>
                        {errors.date && <div className="text-danger">{errors.date}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="eventTime">Time *</label>
                        <div className="input-icon-wrapper">
                          <span className="input-icon">
                            <Clock size={18} />
                          </span>
                          <input
                            type="time"
                            className="form-control"
                            id="eventTime"
                            value={formData.time}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setFormData({ ...formData, time: e.target.value })
                            }
                            required
                          />
                        </div>
                        {errors.time && <div className="text-danger">{errors.time}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="eventLocation">Location *</label>
                    <div className="input-icon-wrapper">
                      <span className="input-icon">
                        <MapPin size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="eventLocation"
                        value={formData.location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="Address or virtual link"
                        required
                      />
                    </div>
                    {errors.location && <div className="text-danger">{errors.location}</div>}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="maxGuests">Max Guests *</label>
                        <div className="input-icon-wrapper">
                          <span className="input-icon">
                            <Users size={18} />
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            id="maxGuests"
                            value={formData.maxGuests}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setFormData({ ...formData, maxGuests: e.target.value })
                            }
                            placeholder="e.g., 12"
                            min="2"
                            required
                          />
                        </div>
                        {errors.maxGuests && <div className="text-danger">{errors.maxGuests}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="fundingGoal">Funding Goal *</label>
                        <div className="input-icon-wrapper">
                          <span className="input-icon">
                            <DollarSign size={18} />
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            id="fundingGoal"
                            value={formData.fundingGoal}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setFormData({ ...formData, fundingGoal: e.target.value })
                            }
                            placeholder="e.g., 500"
                            min="100"
                            required
                          />
                        </div>
                        {errors.fundingGoal && <div className="text-danger">{errors.fundingGoal}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="eventDescription">Event Description *</label>
                    <textarea
                      className="form-control"
                      id="eventDescription"
                      rows={4}
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Tell your guests what to expect at your gathering"
                      required
                    ></textarea>
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="eventImage">Event Image</label>
                    <div className="input-icon-wrapper file-input-wrapper">
                      <span className="input-icon">
                        <ImageIcon size={18} />
                      </span>
                      <input
                        type="file"
                        className="form-control"
                        id="eventImage"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, eventImage: e.target.files ? e.target.files[0] : null })
                        }
                        accept="image/*"
                      />
                    </div>
                    <small className="text-muted">
                      Upload an image that represents your meal gathering. Recommended size: 1200x800px.
                    </small>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-step">
                  <p className="form-step-description">
                    Share the story of who will benefit from your meal gathering and why they need support.
                  </p>

                  <div className="form-group">
                    <label htmlFor="recipientName">Recipient Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipientName"
                      value={formData.recipientName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, recipientName: e.target.value })
                      }
                      placeholder="Individual or family name"
                      required
                    />
                    {errors.recipientName && <div className="text-danger">{errors.recipientName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="needCategory">Category of Need *</label>
                    <select
                      className="form-control"
                      id="needCategory"
                      value={formData.categoryOfNeed}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setFormData({ ...formData, categoryOfNeed: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="medical">Medical Expenses</option>
                      <option value="housing">Housing</option>
                      <option value="education">Education</option>
                      <option value="business">Small Business</option>
                      <option value="disaster">Disaster Relief</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.categoryOfNeed && <div className="text-danger">{errors.categoryOfNeed}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="recipientStory">Their Story *</label>
                    <textarea
                      className="form-control"
                      id="recipientStory"
                      rows={6}
                      value={formData.recipientStory}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({ ...formData, recipientStory: e.target.value })
                      }
                      placeholder="Share why this person or family needs support and how the funds will help"
                      required
                    ></textarea>
                    {errors.recipientStory && <div className="text-danger">{errors.recipientStory}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="recipientImage">Recipient Photo</label>
                    <div className="input-icon-wrapper file-input-wrapper">
                      <span className="input-icon">
                        <ImageIcon size={18} />
                      </span>
                      <input
                        type="file"
                        className="form-control"
                        id="recipientImage"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, recipientPhoto: e.target.files ? e.target.files[0] : null })
                        }
                        accept="image/*"
                      />
                    </div>
                    <small className="text-muted">
                      With permission, upload a photo of the recipient or something representing their situation.
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fundsUsage">How Funds Will Be Used *</label>
                    <textarea
                      className="form-control"
                      id="fundsUsage"
                      rows={4}
                      value={formData.fundsUsage}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({ ...formData, fundsUsage: e.target.value })
                      }
                      placeholder="Explain exactly how the money raised will help the recipient"
                      required
                    ></textarea>
                    {errors.fundsUsage && <div className="text-danger">{errors.fundsUsage}</div>}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="form-step">
                  <p className="form-step-description">Please review all details before creating your event.</p>

                  <div className="review-section">
                    <h3 className="review-section-title">Event Details</h3>
                    <div className="review-item">
                      <span className="review-label">Title:</span>
                      <span className="review-value">{formData.title}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Date & Time:</span>
                      <span className="review-value">
                        {formData.date} • {formData.time}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Location:</span>
                      <span className="review-value">{formData.location}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Max Guests:</span>
                      <span className="review-value">{formData.maxGuests}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Funding Goal:</span>
                      <span className="review-value">${formData.fundingGoal}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Description:</span>
                      <span className="review-value">{formData.description}</span>
                    </div>
                    {formData.eventImage && (
                      <div className="review-item">
                        <span className="review-label">Event Image:</span>
                        <span className="review-value">{formData.eventImage.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="review-section">
                    <h3 className="review-section-title">Recipient Information</h3>
                    <div className="review-item">
                      <span className="review-label">Name:</span>
                      <span className="review-value">{formData.recipientName}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Category:</span>
                      <span className="review-value">
                        {categoryLabels[formData.categoryOfNeed] || formData.categoryOfNeed}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Story:</span>
                      <span className="review-value">{formData.recipientStory}</span>
                    </div>
                    {formData.recipientPhoto && (
                      <div className="review-item">
                        <span className="review-label">Recipient Photo:</span>
                        <span className="review-value">{formData.recipientPhoto.name}</span>
                      </div>
                    )}
                    <div className="review-item">
                      <span className="review-label">Funds Usage:</span>
                      <span className="review-value">{formData.fundsUsage}</span>
                    </div>
                  </div>

                  <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="termsCheck" required />
                    <label className="form-check-label" htmlFor="termsCheck">
                      I confirm that all information is accurate and I have permission to share the recipient's story.
                    </label>
                  </div>
                </div>
              )}

              <div className="form-navigation">
                {currentStep > 1 && (
                  <button type="button" className="btn btn-outline-primary" onClick={prevStep}>
                    Back
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Continue
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Create Event
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EventFormModal
