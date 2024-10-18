import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  let axiosInstance: jest.Mock;
  let axiosCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    axiosInstance = jest.fn();
    axiosCreate = jest.fn(() => ({
      get: axiosInstance,
    }));
    (axios.create as jest.Mock) = axiosCreate;
  });

  test('should create instance with provided base url', async () => {
    axiosInstance.mockResolvedValue({ data: {} });
    await throttledGetDataFromApi('/url');
    expect(axiosCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    axiosInstance.mockResolvedValue({ data: {} });
    await throttledGetDataFromApi('/url');
    expect(axiosInstance).toHaveBeenCalledWith('/url');
  });

  test('should return response data', async () => {
    const mockedData = { id: 1, title: 'title', text: 'text' };
    axiosInstance.mockResolvedValue({ data: mockedData });
    const result = await throttledGetDataFromApi('/url');
    expect(result).toEqual(mockedData);
  });
});
