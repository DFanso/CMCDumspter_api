import request from 'supertest';
import app from '../index'; // Import your Express app instance
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Incident from '../models/incidentModel';
import User from '../models/User'; // Import your User model
import path from 'path';


beforeEach(async () => {
    await User.deleteMany({});
  });


  test('Should create an incident', async () => {
    // Create an existing user
    const existingUser = new User({
      name: 'Existing User',
      contactNumber: '0987654321',
      email: 'test@example.com',
      role: 'admin',
      username: 'existinguser',
      password: 'existingpassword',
    });
    await existingUser.save();
  
    // Generate a JWT token for authentication
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
  
    // Send the request to create an incident with an image
    const response = await request(app)
      .post('/api/incident/createIncident') // Make sure this route matches the actual route in your application
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test Incident')
      .field('address', '123 Test Street')
      .field('description', 'This is a test incident.')
      .attach('image', path.resolve(__dirname, 'test-image.jpg'))// Replace with the path to a test image file
  
    // Check the response status and incident properties
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Incident');
    expect(response.body.address).toBe('123 Test Street');
    expect(response.body.description).toBe('This is a test incident.');
    expect(response.body.imagePath).toBeTruthy();
  
    // Clean up the test incident
    await Incident.findByIdAndDelete(response.body._id);
  });
  
  test('Should get an incident by ID', async () => {
    // Create a test incident
    const testIncident = new Incident({
      name: 'Test Incident',
      address: '123 Test Street',
      description: 'This is a test incident.',
      imagePath: 'https://example.com/test-image.jpg',
    });
    await testIncident.save();
  
    // Create an existing user
    const existingUser = new User({
      name: 'Existing User',
      contactNumber: '0987654321',
      email: 'test@example.com',
      role: 'admin',
      username: 'existinguser',
      password: 'existingpassword',
    });
    await existingUser.save();
  
    // Generate a JWT token for authentication
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
  
    // Send the request to get the incident by ID
    const response = await request(app)
      .get(`/api/incident/${testIncident._id}`) // Make sure this route matches the actual route in your application
      .set('Authorization', `Bearer ${token}`);
  
    // Check the response status and incident properties
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(testIncident._id.toString());
    expect(response.body.name).toBe('Test Incident');
    expect(response.body.address).toBe('123 Test Street');
    expect(response.body.description).toBe('This is a test incident.');
    expect(response.body.imagePath).toBe('https://example.com/test-image.jpg');
  
    // Clean up the test incident and user
    await Incident.findByIdAndDelete(testIncident._id);
    await User.findByIdAndDelete(existingUser._id);
  });
  

  

