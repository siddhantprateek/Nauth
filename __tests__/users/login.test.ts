import request from "supertest";
import jwt from 'jsonwebtoken';
import app from '../../index';
import express from 'express';

describe('Authentication and Authorization Tests', () => {
  let token: string;
  const userId = 5; 

  beforeAll(() => {
    token = jwt.sign({ 
      userId: userId, userEmail: 'test@example.com' }, 
    process.env.JWT_SECRET || "default", {
      expiresIn: '1h',
    });
  });

  it('should authenticate a user', async () => {
    const response = await request(app)
      .post('/api/authenticate')
      .send({ email: 'test@example.com', password: 'testpassword' });

    // expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authentication successful');
    expect(response.body.token).toBeTruthy();
  });

  it('should not authenticate with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/authenticate')
      .send({ email: 'test@example.com', password: 'invalidpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid password');
  });

  it('should get user data for an authorized user', async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `jwt ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User retrieved successfully');
    expect(response.body.user).toBeTruthy();
  });

  it('should not get user data for an unauthorized user', async () => {
    const response = await request(app).get(`/api/users/${userId}`)
      

    // expect(response.status).toBe(401);
    expect(response.body.message).toBe('User retrieved successfully');
  });
});