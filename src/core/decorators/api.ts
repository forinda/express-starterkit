import { autoBind } from './bind';

/**
 * API version metadata key
 */
export const API_VERSION_METADATA_KEY = 'api:version';

/**
 * Decorator to specify API version for controllers and API modules
 * @param version API version string (e.g., 'v1', 'v2')
 */
export function ApiVersion(version: 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'v8' | 'v9') {
  return function (target: any) {
    // injectable()(target);
    autoBind()(target);
    Reflect.defineMetadata(API_VERSION_METADATA_KEY, version, target);
    return target;
  };
}
