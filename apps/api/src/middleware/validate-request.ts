import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from './error-handler';

/**
 * Middleware to validate requests using express-validator
 * @param validations Array of express-validator validation chains
 */
export function validateRequest(validations: ValidationChain[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Check if there are any errors
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    // Format errors for response
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));
    
    // Create API error with validation details
    const apiError = new ApiError('Validation failed', 400);
    (apiError as any).details = formattedErrors;
    
    return next(apiError);
  };
}