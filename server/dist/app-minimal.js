import express from "express";
const app = express();
// Basic middleware
app.use(express.json());
// Simple test route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});
// Catch all other routes
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found`
    });
});
export default app;
