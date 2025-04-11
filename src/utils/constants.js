export const base = import.meta.env.MODE === 'production'
    ? 'https://static.startribune.com/news/projects/all/20250414-wetlands-landing-page/'
    : '';  // Development environment - empty string for local paths 