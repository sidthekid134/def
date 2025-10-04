/**
 * Request validation middleware using express-validator
 */

const { body } = require('express-validator');

/**
 * Validation rules for task creation and update
 */
const taskValidationRules = [
  // Title validation
  body('title')
    .if(body('title').exists())
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
    .trim(),
    
  // Description validation
  body('description')
    .if(body('description').exists())
    .isString().withMessage('Description must be a string')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
    .optional()
    .trim(),
    
  // Status validation
  body('status')
    .if(body('status').exists())
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be either pending, in-progress, or completed')
    .optional(),
    
  // Due date validation
  body('dueDate')
    .if(body('dueDate').exists())
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date')
    .custom(value => {
      if (value && new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    })
];

module.exports = {
  taskValidationRules
};