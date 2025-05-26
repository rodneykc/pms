// sss/src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

// Try to use the default port (3001), fallback to 3002 if needed
const API_PORT = process.env.REACT_APP_API_PORT || 3001;

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: `http://localhost:${API_PORT}`,
            changeOrigin: true,
            logLevel: 'debug',
            onError: (err, req, res) => {
                console.error('Proxy error:', err);
                res.status(500).json({
                    error: 'Cannot connect to the API server',
                    details: err.message
                });
            }
        })
    );
};