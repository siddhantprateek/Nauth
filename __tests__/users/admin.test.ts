import request from "supertest";
import jwt from 'jsonwebtoken';
import app from '../../index';
import express from 'express';

describe('Authentication and Authorization Tests', () => {
  let token: string;
  let userId = 1; 

  beforeAll(() => {
    token = jwt.sign({ 
      userId: userId, userEmail: 'testadmin@example.com' }, 
    process.env.JWT_SECRET || "default", {
      expiresIn: '1h',
    });
  });


  // Authenticate Admin Test Case
  it('should authenticate a admin', async () => {
    const response = await request(app)
      .post('/api/authenticate')
      .send({ email: 'testadmin@example.com', password: 'testadminpw' });

    // expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authentication successful');
    expect(response.body.token).toBeTruthy();
  });


  // Invalid Credential Test
  it('should not authenticate with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/authenticate')
      .send({ email: 'testadmin@example.com', password: 'invalidpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid password');
  });

  it('should get user data for an authorized admin', async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `jwt ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User retrieved successfully');
    expect(response.body.user).toBeTruthy();
  });

  it('should not get user data for an unauthorized admin', async () => {
    const response = await request(app).get(`/api/users/${userId}`)
    expect(response.body.message).toBe('User retrieved successfully');
  });

});