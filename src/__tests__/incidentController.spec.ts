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
    .post('/api/incident/createIncident')
    .set('Authorization', `Bearer ${token}`)
    .field('name', 'Test Incident')
    .field('address', '123 Test Street')
    .field('description', 'This is a test incident.')
    .field('lat',40.25345)
    .field('long',45.345345)
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
    lat: 40.25345,
    long: 45.345345,
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
    .get(`/api/incident/${testIncident._id}`)
    .set('Authorization', `Bearer ${token}`);

  // Check the response status and incident properties
  expect(response.status).toBe(200);
  expect(response.body._id).toBe(testIncident._id.toString());
  expect(response.body.name).toBe('Test Incident');
  expect(response.body.address).toBe('123 Test Street');
  expect(response.body.description).toBe('This is a test incident.');
  expect(response.body.imagePath).toBe('https://example.com/test-image.jpg');
  expect(response.body.lat).toBe(40.25345);
  expect(response.body.long).toBe(45.345345);


  // Clean up the test incident and user
  await Incident.findByIdAndDelete(testIncident._id);
  await User.findByIdAndDelete(existingUser._id);
});

test('Should get all incidents based on user role', async () => {
  // Create test incidents
  const testIncident1 = new Incident({
    name: 'Test Incident 1',
    address: '123 Test Street',
    description: 'This is a test incident 1.',
    imagePath: 'https://example.com/test-image1.jpg',
    lat: 40.25345,
    long: 45.345345,
    status: true
  });
  await testIncident1.save();

  const testIncident2 = new Incident({
    name: 'Test Incident 2',
    address: '456 Test Street',
    description: 'This is a test incident 2.',
    imagePath: 'https://example.com/test-image2.jpg',
    lat: 41.25345,
    long: 46.345345,
    status: false
  });
  await testIncident2.save();

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

  // Send the request to get all incidents based on user role
  const response = await request(app)
    .get('/api/incident/getAllIncidents')
    .set('Authorization', `Bearer ${token}`)
    .send({ user: existingUser.role });

  // Check the response status and incidents array
  expect(response.status).toBe(200);
  expect(response.body.incidents).toHaveLength(2);
  expect(response.body.incidents[0]._id).toBe(testIncident1._id.toString());
  expect(response.body.incidents[0].name).toBe('Test Incident 1');
  expect(response.body.incidents[1]._id).toBe(testIncident2._id.toString());
  expect(response.body.incidents[1].name).toBe('Test Incident 2');

  // Clean up the test incidents and user
  await Incident.findByIdAndDelete(testIncident1._id);
  await Incident.findByIdAndDelete(testIncident2._id);
  await User.findByIdAndDelete(existingUser._id);
});

test('Should delete an incident by its ID', async () => {
  // Create a test incident
  const testIncident = new Incident({
    name: 'Test Incident',
    address: '123 Test Street',
    description: 'This is a test incident.',
    imagePath: 'https://example.com/test-image.jpg',
    lat: 40.25345,
    long: 45.345345,
    status: true
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

  // Send the request to delete the incident by ID
  const response = await request(app)
    .delete('/api/incident/deleteIncidentByID')
    .set('Authorization', `Bearer ${token}`)
    .send({ incidentID: testIncident._id });

  // Check the response status and message
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Incident deleted successfully.');

  // Verify the incident has been deleted
  const deletedIncident = await Incident.findById(testIncident._id);
  expect(deletedIncident).toBeNull();

  // Clean up the existing user
  await User.findByIdAndDelete(existingUser._id);
});

test('Should update incident status', async () => {
  // Create a test incident
  const testIncident = new Incident({
    // ...incident properties
    name: 'Test Incident',
    address: '123 Test Street',
    description: 'This is a test incident.',
    imagePath: 'https://example.com/test-image.jpg',
    lat: 40.25345,
    long: 45.345345,
    status: true
  });
  await testIncident.save();

  // Create an existing user
  const existingUser = new User({
    // ...user properties
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

  // Send the request to update the incident status
  const response = await request(app)
    .patch('/api/incident/updateIncidentStatus')
    .set('Authorization', `Bearer ${token}`)
    .send({ incidentID: testIncident._id });

  // Check the response status and message
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Incident status updated successfully');

  // Verify the incident status has been updated
  // const updatedIncident = await Incident.findById(testIncident._id);
  // expect(updatedIncident.status).toBe(true);

  // Clean up the test incident and existing user
  await Incident.findByIdAndDelete(testIncident._id);
  await User.findByIdAndDelete(existingUser._id);
});

test('Should update incident flag', async () => {
  // Create a test incident
  const testIncident = new Incident({
    // ...incident properties
    name: 'Test Incident',
    address: '123 Test Street',
    description: 'This is a test incident.',
    imagePath: 'https://example.com/test-image.jpg',
    lat: 40.25345,
    long: 45.345345,
    status: true
  });
  await testIncident.save();

  // Create an existing user
  const existingUser = new User({
    // ...user properties
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

  // Send the request to update the incident flag
  const response = await request(app)
    .patch('/api/incident/updateIncidentFlag')
    .set('Authorization', `Bearer ${token}`)
    .send({ incidentID: testIncident._id, flag: 'green' });

  // Check the response status and message
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Incident updated successfully');

  // Verify the incident flag has been updated
  // const updatedIncident = await Incident.findById(testIncident._id);
  // expect(updatedIncident.flag).toBe('green');

  // Clean up the test incident and existing user
  await Incident.findByIdAndDelete(testIncident._id);
  await User.findByIdAndDelete(existingUser._id);
});
