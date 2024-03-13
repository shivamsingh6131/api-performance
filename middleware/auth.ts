import { NextFunction, Request, Response } from 'express';
import logger from '../utils/helpers/logger';
import serverResponses from '../utils/helpers/responses';
import messages from '../config/messages';

export const checkAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authheader;

  // Check if the required header exists
  if (!authHeader || authHeader !== 'TEST_AUTH') {
    logger.error(`checkAuthMiddleware - Unauthorized [headers: ${JSON.stringify(req.headers, null, 2)}]`);
    return serverResponses.sendError(res, messages.AUTHENTICATION_FAILED);
  }

  next();
};
