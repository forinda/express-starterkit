/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { ApiRequestContext } from '../interfaces/controller';

export function userAudit(action: string) {
  return (context: ApiRequestContext) => {
    if (context.user) {
      context.body.audit = {
        action,
        userId: context.user.id,
        timestamp: new Date().toISOString(),
        ip: context.req.ip,
      };
    }
    return context;
  };
}
