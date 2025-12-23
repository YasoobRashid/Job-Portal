const authController = require('../src/controllers/auth.controller');
const User = require('../src/models/User');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'candidate'
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);
      // Mock bcrypt hash
      bcrypt.hash.mockResolvedValue('hashedPassword');
      // Mock User.create
      User.create.mockResolvedValue({ ...req.body, _id: 'user123' });

      await authController.register(req, res);

      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({ message: 'Registration successful' });
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        password: 'hashedPassword'
      }));
    });

    it('should return 400 if user already exists', async () => {
      req.body = { email: 'existing@example.com' };
      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await authController.register(req, res);

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({ message: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should login successfully and return a token', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      const mockUser = { 
        _id: 'user123', 
        email: 'test@example.com', 
        password: 'hashedPassword',
        role: 'candidate'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-token');

      await authController.login(req, res);

      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.token).toBe('fake-token');
      expect(data.role).toBe('candidate');
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      
      User.findOne.mockResolvedValue({ password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false); // Password mismatch

      await authController.login(req, res);

      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({ message: 'Invalid credentials' });
    });
  });
});