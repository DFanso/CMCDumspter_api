import request from 'supertest';
import { app } from '../index'; // You should export your app instance from your main application file
import User from '../models/User';

// Make sure to clear the database before each test
beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Controller', () => {
  test('Should sign up a new user', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      contactNumber: '1234567890',
      email: 'test@example.com',
      role: 'admin',
      username: 'testuser',
      password: 'testpassword',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.token).toBeTruthy();
  });

  test('Should not sign up a user with an existing email', async () => {
    // Create a user with the same email
    const existingUser = new User({
      name: 'Existing User',
      contactNumber: '0987654321',
      email: 'test@example.com',
      role: 'admin',
      username: 'existinguser',
      password: 'existingpassword',
    });
    await existingUser.save();

    const response = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      contactNumber: '1234567890',
      email: 'test@example.com',
      role: 'admin',
      username: 'testuser',
      password: 'testpassword',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is already in use.');
  });

  // You can write additional tests for other controller functions like signIn, getUserProfile, forgotPassword, and resetPassword
  // ...
});

