import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(() => {}, 1000);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callBack = jest.fn(() => {});
    doStuffByTimeout(callBack, 1000);
    expect(callBack).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callBack).toHaveBeenCalled();
    expect(callBack).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(() => {}, 1000);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const callBack = jest.fn(() => {});
    doStuffByInterval(callBack, 1000);
    expect(callBack).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callBack).toHaveBeenCalled();
    expect(callBack).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callBack).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(1000);
    expect(callBack).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const MOCK_PATH_TO_FILE = '/mocked/path/to/file.txt';
  const MOCK_FILE_CONTENT = 'MOCK_FILE_CONTENT';
  const mockNameFile = 'file.txt';

  test('should call join with pathToFile', async () => {
    (join as jest.Mock).mockReturnValue(MOCK_PATH_TO_FILE);
    await readFileAsynchronously(mockNameFile);
    expect(join).toHaveBeenCalledWith(__dirname, mockNameFile);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    (join as jest.Mock).mockReturnValue(MOCK_PATH_TO_FILE);
    const result = await readFileAsynchronously(mockNameFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (join as jest.Mock).mockReturnValue(MOCK_PATH_TO_FILE);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(MOCK_FILE_CONTENT));

    const result = await readFileAsynchronously(mockNameFile);
    expect(result).toBe(MOCK_FILE_CONTENT);
    expect(readFile).toHaveBeenCalledWith(MOCK_PATH_TO_FILE);
  });
});
