import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { CORS_CONFIG } from '../constants';

// Sets up common Express middleware for all microservices
export const setupExpressMiddleware = (app: Application): void => {
  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors(CORS_CONFIG));
  
  // Logging middleware
  app.use(morgan('combined'));
  
  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};

// Creates a standard health check endpoint
export const setupHealthCheck = (app: Application, serviceName: string): void => {
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      service: serviceName,
      timestamp: new Date().toISOString()
    });
  });
};

// Creates a standard test endpoint
export const setupTestEndpoint = (app: Application, serviceName: string): void => {
  app.get('/api/test', (req, res) => {
    res.json({ 
      message: `${serviceName} is running`,
      timestamp: new Date().toISOString()
    });
  });
};
