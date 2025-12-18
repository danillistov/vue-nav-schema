/**
 * Converts a path pattern with dynamic segments to a regex pattern.
 * @example '/about/:id' -> '/about/[^/]+'
 */
export function pathPatternToRegex(pathPattern: string): string {
  return pathPattern
    .replace(/:[^/]+/g, '[^/]+')
    .replace(/\//g, '\\/');
}

/**
 * Checks if a path exactly matches a dynamic pattern (with :param segments).
 */
export function matchesPathExactly(pathPattern: string, currentPath: string): boolean {
  if (pathPattern === currentPath) {
    return true;
  }

  if (pathPattern.includes(':')) {
    const pattern = pathPatternToRegex(pathPattern);
    const exactRegex = new RegExp(`^${pattern}$`);
    return exactRegex.test(currentPath);
  }

  return false;
}

/**
 * Checks if a path matches a dynamic pattern (with :param segments).
 * Supports both exact matches and child paths.
 */
export function matchesDynamicPattern(pathPattern: string, currentPath: string): boolean {
  const pattern = pathPatternToRegex(pathPattern);
  const exactRegex = new RegExp(`^${pattern}$`);
  const childRegex = new RegExp(`^${pattern}\\/`);

  return exactRegex.test(currentPath) || childRegex.test(currentPath);
}
