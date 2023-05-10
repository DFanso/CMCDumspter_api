import request from 'supertest';
import { app } from '../index'; // You should export your app instance from your main application file
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/mailer';


jest.mock('../utils/mailer', () => ({
  sendEmail: jest.fn(),
}));

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

  //tests for sign in 
  test('Should sign in an existing user', async () => {
    // Create a user
    const existingUser = new User({
      name: 'Existing User',
      contactNumber: '0987654321',
      email: 'test@example.com',
      role: 'admin',
      username: 'existinguser',
      password: 'existingpassword',
    });
    await existingUser.save();

    const response = await request(app).post('/api/auth/signin').send({
      username: 'existinguser',
      password: 'existingpassword',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged in successfully');
    expect(response.body.token).toBeTruthy();
  });

  test('Should not sign in a user with an invalid username', async () => {
    const response = await request(app).post('/api/auth/signin').send({
      username: 'nonexistentuser',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid username or password.');
  });

  test('Should not sign in a user with an invalid password', async () => {
    // Create a user
    const existingUser = new User({
      name: 'Existing User',
      contactNumber: '0987654321',
      email: 'test@example.com',
      role: 'admin',
      username: 'existinguser',
      password: 'existingpassword',
    });
    await existingUser.save();

    const response = await request(app).post('/api/auth/signin').send({
      username: 'existinguser',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid username or password.');
  });

  //getuserProfile
  test('Should get user profile for an existing user', async () => {
    // Create a user
    const existingUser = new User({
      name: 'Existing User',
      contactNumber: '0987654321',
      email: 'test@example.com',
      role: 'admin',
      username: 'existinguser',
      password: 'existingpassword',
    });
    await existingUser.save();

    // Generate a token for the user
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(existingUser.name);
    expect(response.body.email).toBe(existingUser.email);
    expect(response.body.username).toBe(existingUser.username);
  });

  test('Should not get user profile for a non-existing user', async () => {
    // Generate a token with a non-existing user ID
    const nonExistingUserId = '60c7f3efb47d2d2f4ca4f3a9';
    const token = jwt.sign({ id: nonExistingUserId, email: 'nonexistent@example.com' }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found.');
  });

  //forgot password test

  test('Should send a password reset email for an existing user', async () => {
    // Create a user
    const existingUser = new User({
      name: 'Existing User',
      contactNumber: '0987654321',
      email: 'test@example.com',
      role: 'admin',
      username: 'existinguser',
      password: 'existingpassword',
    });
    await existingUser.save();

    const response = await request(app).post('/api/auth/forgot-password').send({
      email: 'test@example.com',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset email sent.');

    // Check if sendEmail was called
    expect(sendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Password Reset',
      expect.stringContaining('<h1>Password Reset</h1>'),
    );
  });

  test('Should not send a password reset email for a non-existing user', async () => {
    const response = await request(app).post('/api/auth/forgot-password').send({
      email: 'nonexistent@example.com',
    });
  
    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe('User not found.');
  });

  // You can write additional tests for other controller functions like signIn, getUserProfile, forgotPassword, and resetPassword
  // ...
});

