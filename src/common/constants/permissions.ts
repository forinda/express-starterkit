export const permissionSchemes = {
  posts: ['read', 'write'],
  comments: ['read', 'write'],
} as const;

type PermissionScheme = typeof permissionSchemes;

// Create a union type of all possible permission strings (e.g., "posts:read", "posts:write", etc.)
type AuthorityKey = {
  [K in keyof PermissionScheme]: `${K}:${PermissionScheme[K][number]}`;
}[keyof PermissionScheme];

export type LoginAuthorityType = AuthorityKey | AuthorityKey[] | boolean;
