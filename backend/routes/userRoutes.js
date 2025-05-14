const express = require("express");

const Document = require("../models/Document");
const router = express.Router();

router.post("/api/documents", async (req, res) => {
  try {
    const { title, content, expiryDate } = req.body;

    // Validate input
    if (!title || !content || !expiryDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create and save the document
    const document = new Document({
      title,
      content,
      expiryDate,
    });

    await document.save();

    res.status(201).json({
      message: "Document created successfully",
      document,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/documents", async (req, res) => {
  try {
    const dentists = await Document.find();
    res.json(dentists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/documents/:id", async (req, res) => {
  try {
    const document = await Document.find({ _id: req.params.id })
      .sort({ createdAt: -1 });
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
