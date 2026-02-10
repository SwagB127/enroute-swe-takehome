/**
 * Check Controller
 *
 * Handles HTTP requests and responses for vehicle inspection check endpoints.
 * This controller manages the creation and retrieval of inspection checks,
 * including validation and error handling.
 */

import { Request, Response } from "express";
import * as checkService from "../services/checkService";
import { validateCheckRequest } from "../validation";
import { ErrorResponse } from "../types";

/**
 * POST /checks
 *
 * Creates a new vehicle inspection check.
 *
 * This endpoint:
 * - Validates the request body
 * - Creates a new check with computed fields (hasIssue, createdAt)
 * - Returns the created check with a 201 status code
 *
 * @param req - Express request object containing check data in body
 * @param res - Express response object
 *
 * @returns JSON response with created check or validation errors
 *
 * @example
 * Request Body:
 * {
 *   "vehicleId": "VH001",
 *   "odometerKm": 15000,
 *   "items": [
 *     { "key": "TYRES", "status": "OK" },
 *     { "key": "BRAKES", "status": "FAIL" },
 *     { "key": "LIGHTS", "status": "OK" },
 *     { "key": "OIL", "status": "OK" },
 *     { "key": "COOLANT", "status": "OK" }
 *   ],
 *   "note": "Brakes need attention"
 * }
 *
 * @example
 * Success Response (201 Created):
 * {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",
 *   "vehicleId": "VH001",
 *   "odometerKm": 15000,
 *   "items": [...],
 *   "note": "Brakes need attention",
 *   "hasIssue": true,
 *   "createdAt": "2026-01-27T10:30:00.000Z"
 * }
 *
 * @example
 * Error Response (400 Bad Request):
 * {
 *   "error": {
 *     "code": "VALIDATION_ERROR",
 *     "message": "Invalid request",
 *     "details": [
 *       { "field": "odometerKm", "reason": "must be > 0" }
 *     ]
 *   }
 * }
 */
// export const createCheck = (req: Request, res: Response): void => {
//   // TODO: Implement the createCheck controller
//   //
//   // Instructions:
//   // 1. Validate the request body using validateCheckRequest(req.body)
//   // 2. If there are validation errors, return a 400 status with ErrorResponse format
//   // 3. If validation passes, call checkService.createCheck() with the appropriate data
//   // 4. Return a 201 status with the created check
//   //
//   // Hint: Look at the getChecks controller below for reference on error handling
//   // Hint: The checkService.createCheck expects CreateCheckData interface

//   res.status(501).json({ error: { message: "Not implemented" } });
// };

export const createCheck = (req: Request, res: Response): void => {
  const errors = validateCheckRequest(req.body);

  if (errors.length > 0) {
    const errorResponse: ErrorResponse = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: errors,
      },
    };
    res.status(400).json(errorResponse);
    return;
  }

  const createdCheck = checkService.createCheck(req.body);
  res.status(201).json(createdCheck);
};

/**
 * GET /checks
 *
 * Retrieves vehicle inspection checks with filtering options.
 *
 * This endpoint:
 * - Requires vehicleId as a query parameter
 * - Optionally filters by hasIssue flag
 * - Returns checks sorted by creation date (newest first)
 *
 * @param req - Express request object with query parameters
 * @param res - Express response object
 *
 * @returns JSON response with array of checks matching the filters
 *
 * @example
 * GET /checks?vehicleId=VH001
 * Returns all checks for vehicle VH001
 *
 * @example
 * GET /checks?vehicleId=VH001&hasIssue=true
 * Returns only checks with issues for vehicle VH001
 *
 * @example
 * Success Response (200 OK):
 * [
 *   {
 *     "id": "CHK001",
 *     "vehicleId": "VH001",
 *     "odometerKm": 15420,
 *     "items": [...],
 *     "hasIssue": false,
 *     "createdAt": "2026-01-20T08:30:00.000Z"
 *   },
 *   ...
 * ]
 *
 * @example
 * Error Response (400 Bad Request):
 * {
 *   "error": {
 *     "code": "VALIDATION_ERROR",
 *     "message": "Invalid request",
 *     "details": [
 *       { "field": "vehicleId", "reason": "is required" }
 *     ]
 *   }
 * }
 */
export const getChecks = (req: Request, res: Response): void => {
  const { vehicleId, hasIssue } = req.query;

  // Validate vehicleId is provided and is a string
  if (!vehicleId || typeof vehicleId !== "string") {
    const errorResponse: ErrorResponse = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: [{ field: "vehicleId", reason: "is required" }],
      },
    };
    res.status(400).json(errorResponse);
    return;
  }

  // Parse hasIssue parameter and build filters
  const filters: checkService.CheckFilters =
    hasIssue !== undefined
      ? { vehicleId, hasIssue: hasIssue === "true" }
      : { vehicleId };

  // Retrieve checks from service layer
  const checks = checkService.getChecks(filters);

  res.json(checks);
};

/**
 * DELETE /checks/:id
 *
 * Deletes a specific inspection check by its ID.
 *
 * @param req - Express request object with check ID in params
 * @param res - Express response object
 *
 * @returns 204 No Content on success, 404 if check not found
 *
 * @example
 * DELETE /checks/CHK001
 * Response: 204 No Content
 *
 * @example
 * DELETE /checks/INVALID_ID
 * Response: 404 Not Found
 * {
 *   "error": {
 *     "code": "NOT_FOUND",
 *     "message": "Check not found",
 *     "details": []
 *   }
 * }
 */
export const deleteCheck = (req: Request, res: Response): void => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    const errorResponse: ErrorResponse = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: [{ field: "id", reason: "is required" }],
      },
    };
    res.status(400).json(errorResponse);
    return;
  }

  const deleted = checkService.deleteCheck(id);

  if (!deleted) {
    const errorResponse: ErrorResponse = {
      error: {
        code: "NOT_FOUND",
        message: "Check not found",
        details: [],
      },
    };
    res.status(404).json(errorResponse);
    return;
  }

  res.status(204).send();
};
