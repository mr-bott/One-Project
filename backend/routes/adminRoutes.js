const express = require("express");

const Document=require("../models/Document")
const router = express.Router();

router.get("/admin/stats/documents", async (req, res) => {
  try {
    const totalCount = await Document.countDocuments();

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last24hCount = await Document.countDocuments({
      createdAt: { $gte: last24Hours },
    });

    res.status(200).json({
      totalDocuments: totalCount,
      last24HoursDocuments: last24hCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching document stats", error: error.message });
  }
});

router.delete("/admin/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Document.findByIdAndDelete(id);
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting document" });
  }
});


module.exports = router;