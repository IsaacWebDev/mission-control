export function logError(error: unknown, context?: Record<string, unknown>) {
  // Console log for development
  console.error('Error:', error, context);

  // TODO: Send to error tracking service
  // if (process.env.NODE_ENV === 'production') {
  //   sendToSentry(error, context);
  // }
}
