/**
 * Creates a function that memoizes (caches) the result of func.
 * If called again with the same arguments, the cached result is returned.
 * 
 * @param func The function to memoize
 * @returns A memoized version of the function
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(...args: Parameters<T>): ReturnType<T> {
    // Create a cache key from the arguments
    const key = JSON.stringify(args);
    
    // Return cached result if available
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    // Calculate, cache and return result
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}
