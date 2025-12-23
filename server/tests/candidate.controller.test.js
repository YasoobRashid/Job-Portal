const candidateController = require('../src/controllers/candidate.controller');
const User = require('../src/models/User');
const Application = require('../src/models/Application');
const resumeQueue = require('../src/queues/resume.queue');
const httpMocks = require('node-mocks-http');

jest.mock('../src/models/User');
jest.mock('../src/models/Application');
jest.mock('../src/queues/resume.queue');

describe('Candidate Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  describe('uploadResume', () => {
    it('should save resume path and add to queue', async () => {
      req.user = { id: 'cand1' };
      req.file = { path: 'uploads/resume.pdf' };

      const mockUser = { 
        _id: 'cand1', 
        role: 'candidate', 
        email: 'test@test.com',
        save: jest.fn() 
      };
      User.findById.mockResolvedValue(mockUser);

      await candidateController.uploadResume(req, res);

      expect(mockUser.resumePath).toBe('uploads/resume.pdf');
      expect(mockUser.save).toHaveBeenCalled();
      expect(resumeQueue.add).toHaveBeenCalledWith({
        userId: 'cand1',
        email: 'test@test.com',
        resumePath: 'uploads/resume.pdf'
      });
      expect(res.statusCode).toBe(200);
    });

    it('should return 400 if no file provided', async () => {
      await candidateController.uploadResume(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('applyForJob', () => {
    it('should create an application if eligible', async () => {
      req.user = { id: 'cand1' };
      req.body = { jobId: 'job1' };

      const mockUser = { 
        _id: 'cand1', 
        role: 'candidate', 
        resumePath: 'path/to/resume.pdf' 
      };

      User.findById.mockResolvedValue(mockUser);
      Application.findOne.mockResolvedValue(null); // Not applied yet
      Application.create.mockResolvedValue({ status: 'applied' });

      await candidateController.applyForJob(req, res);

      expect(Application.create).toHaveBeenCalledWith({
        jobId: 'job1',
        candidateId: 'cand1',
        resumePath: 'path/to/resume.pdf'
      });
      expect(res.statusCode).toBe(201);
    });

    it('should fail if resume not uploaded', async () => {
      req.user = { id: 'cand1' };
      req.body = { jobId: 'job1' };
      
      User.findById.mockResolvedValue({ 
        role: 'candidate', 
        resumePath: null 
      });

      await candidateController.applyForJob(req, res);
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res._getData()).message).toMatch(/Upload resume/);
    });
  });
});