export const requireApiKey = (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.PARTNER_API_KEY) {
    return res.status(401).json({ message: "Invalid or missing API key" });
  }
  next();
};
