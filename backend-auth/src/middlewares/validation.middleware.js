import { ValidationError } from "../utils/errors.js";

export const validationMiddleware = (schema) => {
  return async (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
        throw new ValidationError("Validation failed", errors);
      }

      req.validatedData = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
        throw new ValidationError("Query validation failed", errors);
      }

      req.validatedQuery = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default {
  validationMiddleware,
  validateQuery,
};
