
import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from 'prisma/__generated__';
import { GlobalExceptionFilter } from './all.exceptions.filter';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: any;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockRequest = { url: '/test', method: 'GET' };
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden' });
  });

  it('should handle PrismaClientKnownRequestError', () => {
    const exception = new Prisma.PrismaClientKnownRequestError('Error', { code: 'P2002', clientVersion: '' });
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
  });

  it('should handle unknown error', () => {
    const exception = new Error('Unknown');
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
