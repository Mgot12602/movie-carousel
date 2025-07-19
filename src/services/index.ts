// Export all services from a central location
export { BaseApi, type BaseApiOptions, type RequestOptions } from './BaseApi.js';

// Server-side only exports
export { default as movieApi } from './MovieApi.js';

// Re-export types from the shared types file
export type { Genre, GenreName, Movie } from '../types/movie.js';
