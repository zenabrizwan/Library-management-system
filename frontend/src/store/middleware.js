// Custom Redux Middleware
export const customMiddleware = store => next => action => {
  // Middleware logic here
  return next(action);
};
