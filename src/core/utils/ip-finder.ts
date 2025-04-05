/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { Request } from 'express';

export class IpFinder {
  getClientIp(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0].trim();
    }
    return req.ip || req.connection.remoteAddress || '';
  }
}
