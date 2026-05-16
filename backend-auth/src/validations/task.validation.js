// Placeholder for task input validation (use Joi or express-validator)
export const validateCreateTask = (req, res, next) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ message: "Title is required" });
  next();
};
