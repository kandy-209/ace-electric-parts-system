/**
 * API Versioning
 * Enterprise-grade API version management
 */

export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2',
  LATEST = 'v1', // Current latest version
}

/**
 * Extract API version from request
 */
export function getApiVersion(request: Request): ApiVersion {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  
  // Check for version in path: /api/v1/endpoint
  const versionIndex = pathParts.indexOf('api') + 1;
  if (versionIndex > 0 && versionIndex < pathParts.length) {
    const versionStr = pathParts[versionIndex];
    if (versionStr.startsWith('v') && Object.values(ApiVersion).includes(versionStr as ApiVersion)) {
      return versionStr as ApiVersion;
    }
  }
  
  // Check for version in header
  const headerVersion = request.headers.get('x-api-version');
  if (headerVersion && Object.values(ApiVersion).includes(headerVersion as ApiVersion)) {
    return headerVersion as ApiVersion;
  }
  
  // Default to latest
  return ApiVersion.LATEST;
}

/**
 * API version middleware
 */
export function withApiVersion(handler: (version: ApiVersion) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    const version = getApiVersion(request);
    
    // Add version to response headers
    const response = await handler(version);
    response.headers.set('X-API-Version', version);
    response.headers.set('X-API-Latest', ApiVersion.LATEST);
    
    return response;
  };
}

/**
 * Check if version is deprecated
 */
export function isVersionDeprecated(version: ApiVersion): boolean {
  // Define deprecated versions
  const deprecated: ApiVersion[] = [];
  return deprecated.includes(version);
}

/**
 * Get deprecation warning
 */
export function getDeprecationWarning(version: ApiVersion): string | null {
  if (!isVersionDeprecated(version)) return null;
  
  return `API version ${version} is deprecated. Please migrate to ${ApiVersion.LATEST}.`;
}

