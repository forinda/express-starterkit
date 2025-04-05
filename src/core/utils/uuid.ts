/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { v4 as uuidv4 } from 'uuid';

export class UUID {
  generateUUID(): string {
    return uuidv4();
  }
}
