const authMiddleware = require('../src/middlewares/auth.middleware');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('should return 401 if no token provided', () => {
    req.headers.authorization = '';
    authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', () => {
    req.headers.authorization = 'Bearer validtoken';
    jwt.verify.mockReturnValue({ id: 'user1', role: 'candidate' });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });
});