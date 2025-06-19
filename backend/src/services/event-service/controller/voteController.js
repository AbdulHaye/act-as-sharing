const Vote = require("../models/voteModel");
const Event = require("../models/Event");
const EventStory = require("../models/eventStoryModel");
const User = require("../../user-service/models/User");

const submitVote = async (req, res) => {
  const { eventId, storyId, voterEmail } = req.body;

  if (!voterEmail || !voterEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ message: "Valid voter email is required" });
  }

  try {
    const event = await Event.findById(eventId).populate("guests");
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if voterEmail is among invited guests or host
    const guestEmails = event.guests.map((guest) => guest.email.toLowerCase());
    const host = await User.findById(event.hostId);
    const hostEmail = host ? host.email.toLowerCase() : null;
    if (
      !guestEmails.includes(voterEmail.toLowerCase()) &&
      voterEmail.toLowerCase() !== hostEmail
    ) {
      return res
        .status(403)
        .json({ message: "Only invited participants can vote" });
    }

    const existingVote = await Vote.findOne({
      eventId,
      voterEmail: voterEmail.toLowerCase(),
    });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const story = await EventStory.findById(storyId);
    if (!story || story.eventId.toString() !== eventId) {
      return res.status(400).json({ message: "Invalid story for this event" });
    }

    const vote = new Vote({
      eventId,
      storyId,
      voterEmail: voterEmail.toLowerCase(),
      voteValue: 1,
    });

    await vote.save();

    res.status(201).json({ message: "Vote submitted successfully" });
  } catch (error) {
    console.error("Submit vote error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getResults = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId).populate("guests");
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (
      event.hostId.toString() !== req.user.id &&
      !event.guests.includes(req.user.id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view results" });
    }

    const votes = await Vote.find({ eventId });
    const totalVotesCast = votes.length;
    const storyVotes = {};

    votes.forEach((vote) => {
      storyVotes[vote.storyId] =
        (storyVotes[vote.storyId] || 0) + vote.voteValue;
    });

    const stories = await EventStory.find({ eventId });
    const totalFunds = event.currentAmount || 0;

    // Calculate Total Participants (invitedEmails + host)
    const host = await User.findById(event.hostId);
    const hostEmail = host ? host.email.toLowerCase() : null;
    const totalParticipants = new Set([
      ...event.invitedEmails,
      ...(event.guests.map((guest) => guest.email.toLowerCase()) || []),
      hostEmail,
    ]).size;

    // Calculate Completion Rate
    const completionRate =
      totalParticipants > 0
        ? ((totalVotesCast / totalParticipants) * 100).toFixed(2)
        : "0.00";

    // Calculate Top Category
    const categoryVotes = {};
    stories.forEach((story) => {
      const category = story.recipient.categoryOfNeed;
      categoryVotes[category] =
        (categoryVotes[category] || 0) + (storyVotes[story._id] || 0);
    });
    const topCategory = Object.keys(categoryVotes).reduce(
      (a, b) => (categoryVotes[a] > categoryVotes[b] ? a : b),
      Object.keys(categoryVotes)[0]
    );

    // Prepare results with votes, percentages, and rankings
    const results = stories.map((story) => {
      const votesForStory = storyVotes[story._id] || 0;
      const percentage =
        totalVotesCast > 0 ? (votesForStory / totalVotesCast) * 100 : 0;
      return {
        storyId: story._id,
        title: story.title,
        recipient: story.recipient.name,
        category: story.recipient.categoryOfNeed,
        votes: votesForStory,
        percentage: percentage.toFixed(2),
        fundsDistributed:
          totalVotesCast > 0
            ? (votesForStory / totalVotesCast) * totalFunds
            : 0,
      };
    });

    // Sort results by votes in descending order
    results.sort((a, b) => b.votes - a.votes);

    // Assign winner and runner-up
    results[0] = { ...results[0], status: "Winner" };
    if (results.length > 1) {
      results[1] = { ...results[1], status: "Runner-up" };
    }

    res.status(200).json({
      totalParticipants,
      totalVotesCast,
      completionRate,
      topCategory,
      results,
      totalFunds,
    });
  } catch (error) {
    console.error("Get results error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitVote,
  getResults,
};
