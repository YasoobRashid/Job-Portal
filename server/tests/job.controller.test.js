const jobController = require('../src/controllers/job.controller');
const Job = require('../src/models/Job');
const redisService = require('../src/services/redis.service');
const httpMocks = require('node-mocks-http');

// 1. Mock the Redis Config to prevent real connection
jest.mock('../src/config/redis', () => ({
  on: jest.fn(),
  publish: jest.fn(),
  setex: jest.fn(),
  get: jest.fn()
}));

// 2. Mock the Job Model
jest.mock('../src/models/Job');

// 3. Mock the Redis Service
jest.mock('../src/services/redis.service');

describe('Job Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a job and publish an event', async () => {
      req.user = { id: 'recruiter123' };
      req.body = { title: 'Dev', description: 'Code', sector: 'IT' };

      const mockJob = { _id: 'job1', ...req.body, recruiterId: 'recruiter123' };
      Job.create.mockResolvedValue(mockJob);

      await jobController.createJob(req, res);

      expect(Job.create).toHaveBeenCalled();
      // Verify service was called (which is mocked)
      expect(redisService.publishJobEvent).toHaveBeenCalledWith('IT', {
        jobId: 'job1',
        title: 'Dev'
      });
      expect(res.statusCode).toBe(201);
    });
  });

  describe('getJobs', () => {
    it('should return cached jobs if available', async () => {
      req.query = { sector: 'IT' };
      const cachedJobs = [{ title: 'Cached Job' }];
      
      redisService.getCachedJobs.mockResolvedValue(cachedJobs);

      await jobController.getJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(cachedJobs);
      expect(Job.find).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache if not in redis', async () => {
      req.query = { sector: 'IT' };
      const dbJobs = [{ title: 'DB Job' }];

      redisService.getCachedJobs.mockResolvedValue(null);
      
      const mockSort = jest.fn().mockResolvedValue(dbJobs);
      Job.find.mockReturnValue({ sort: mockSort });

      await jobController.getJobs(req, res);

      expect(Job.find).toHaveBeenCalledWith({ sector: 'IT' });
      expect(redisService.cacheJobs).toHaveBeenCalledWith('IT', dbJobs);
      expect(JSON.parse(res._getData())).toEqual(dbJobs);
    });
  });
});