const Template = require("../models/Template");

const createTemplate = async (req, res) => {
  const { title, defaultGoal, description } = req.body;
  const hostId = req.user.id;
  try {
    const template = new Template({ hostId, title, defaultGoal, description });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error("Create template error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getTemplatesByHost = async (req, res) => {
  const hostId = req.user.id;
  try {
    const templates = await Template.find({ hostId });
    res.status(200).json(templates);
  } catch (error) {
    console.error("Get templates error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createTemplate, getTemplatesByHost };
