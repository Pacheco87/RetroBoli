export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.name === 'ZodError') {
    res.status(400).json({
      error: 'Validation error',
      issues: error.issues,
    });
    return;
  }

  if (error.name === 'MulterError' || error.message === 'Only image files are allowed') {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
  });
}
