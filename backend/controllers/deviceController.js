// backend/controllers/deviceController.js
exports.registerDevice = (req, res) => {
  // In a real app, you'd save device info to the DB
  // For now, just respond with success
  res.status(200).json({ message: "Device registered!" });
};
