#!/bin/bash

# Start Auth Service
echo "Starting Auth Service..."
cd services/auth-service
npm install
npm run dev &

# Wait a moment for the service to start
sleep 3

echo "Auth Service started on port 3001"
echo ""
echo "Test Credentials:"
echo "Admin: admin@lms.com / password"
echo "Instructor: instructor@lms.com / password"
echo "Student: student@lms.com / password"
echo "Deepanshu: deepanshu@gmail.com / password"
echo ""
echo "You can now test the login functionality!"
