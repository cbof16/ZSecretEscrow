require('dotenv').config();
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Create the main app
const app = express();
const PORT = process.env.PORT || 8080;
const API_PORT = process.env.API_PORT || 3000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3001;

// Store child processes
let apiProcess = null;
let nextProcess = null;

// Ensure the frontend is built
function buildFrontend() {
  return new Promise((resolve, reject) => {
    console.log('Building frontend...');
    
    // Check if the frontend build exists
    const buildPath = path.join(__dirname, '../web/src/client/.next');
    if (fs.existsSync(buildPath)) {
      console.log('Frontend build already exists. Skipping build step.');
      resolve();
      return;
    }
    
    // Build the frontend using npm run build
    const build = spawn('npm', ['run', 'build'], {
      cwd: path.join(__dirname, '../web/src/client'),
      stdio: 'inherit',
      shell: true
    });
    
    build.on('close', (code) => {
      if (code === 0) {
        console.log('Frontend built successfully.');
        resolve();
      } else {
        console.error(`Frontend build failed with code ${code}`);
        reject(new Error(`Frontend build failed with code ${code}`));
      }
    });
    
    build.on('error', (err) => {
      console.error('Failed to start frontend build:', err);
      reject(err);
    });
  });
}

// Start the API server
function startApiServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting API server...');
    
    // Set API_PORT in the environment
    const env = { ...process.env, API_PORT };
    
    apiProcess = spawn('node', ['src/api/server.js'], {
      env,
      stdio: 'pipe'
    });
    
    let apiOutput = '';
    
    apiProcess.stdout.on('data', (data) => {
      const output = data.toString();
      apiOutput += output;
      console.log(`[API] ${output.trim()}`);
      
      // Resolve when API server is running
      if (output.includes('API server running')) {
        resolve();
      }
    });
    
    apiProcess.stderr.on('data', (data) => {
      console.error(`[API ERROR] ${data.toString().trim()}`);
    });
    
    apiProcess.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`API server process exited with code ${code}`);
        reject(new Error(`API server process exited with code ${code}`));
      }
    });
    
    // Give the API server some time to start
    setTimeout(() => {
      if (!apiOutput.includes('API server running')) {
        resolve(); // Resolve anyway after timeout
      }
    }, 5000);
  });
}

// Start the Next.js dev server in development mode
function startNextDevelopmentServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting frontend development server...');
    
    // Set custom port in environment
    const env = { ...process.env, PORT: FRONTEND_PORT };
    
    nextProcess = spawn('npm', ['run', 'dev', '--', '-p', FRONTEND_PORT], {
      cwd: path.join(__dirname, '../web/src/client'),
      stdio: 'pipe',
      shell: true,
      env
    });
    
    let nextOutput = '';
    
    nextProcess.stdout.on('data', (data) => {
      const output = data.toString();
      nextOutput += output;
      console.log(`[Frontend] ${output.trim()}`);
      
      // Resolve when Next.js server is ready
      if (output.includes('started server') || output.includes('ready on')) {
        resolve();
      }
    });
    
    nextProcess.stderr.on('data', (data) => {
      console.error(`[Frontend ERROR] ${data.toString().trim()}`);
    });
    
    nextProcess.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`Frontend server process exited with code ${code}`);
        reject(new Error(`Frontend server process exited with code ${code}`));
      }
    });
    
    // Give the frontend server some time to start
    setTimeout(() => {
      if (!nextOutput.includes('started server') && !nextOutput.includes('ready on')) {
        resolve(); // Resolve anyway after timeout
      }
    }, 10000);
  });
}

// Create API proxy middleware
function createApiProxy() {
  const { createProxyMiddleware } = require('http-proxy-middleware');
  
  return createProxyMiddleware({
    target: `http://localhost:${API_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api'
    },
    logLevel: 'warn'
  });
}

// Create frontend proxy middleware
function createFrontendProxy() {
  const { createProxyMiddleware } = require('http-proxy-middleware');
  
  return createProxyMiddleware({
    target: `http://localhost:${FRONTEND_PORT}`,
    changeOrigin: true,
    ws: true,
    logLevel: 'warn'
  });
}

// Main application server
async function startServer() {
  try {
    // Build the frontend
    await buildFrontend();
    
    // Start the API server
    await startApiServer();
    
    // Start the frontend server
    await startNextDevelopmentServer();
    
    // Set up proxies
    app.use('/api', createApiProxy());
    app.use('/', createFrontendProxy());
    
    // Start the main server
    app.listen(PORT, () => {
      console.log(`🚀 ZSecretEscrow running at http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Frontend available at http://localhost:${PORT}`);
      console.log(`\nDirect access:`);
      console.log(`API server: http://localhost:${API_PORT}`);
      console.log(`Frontend server: http://localhost:${FRONTEND_PORT}`);
    });
    
    // Handle shutdown
    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
    
  } catch (error) {
    console.error('Failed to start ZSecretEscrow:', error);
    handleShutdown();
  }
}

// Clean shutdown of all processes
function handleShutdown() {
  console.log('\nShutting down ZSecretEscrow...');
  
  if (apiProcess) {
    console.log('Stopping API server...');
    apiProcess.kill();
  }
  
  if (nextProcess) {
    console.log('Stopping frontend server...');
    nextProcess.kill();
  }
  
  console.log('Goodbye!');
  process.exit(0);
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start ZSecretEscrow:', error);
  process.exit(1);
}); 