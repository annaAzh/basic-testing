import { getBankAccount } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(100).getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => getBankAccount(100).withdraw(200)).toThrow(
      'Insufficient funds: cannot withdraw more than 100',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount = getBankAccount(100);
    const anotherAccount = getBankAccount(200);
    expect(() => bankAccount.transfer(200, anotherAccount)).toThrow(
      'Insufficient funds: cannot withdraw more than 100',
    );
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(100);
    expect(() => bankAccount.transfer(200, bankAccount)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    expect(getBankAccount(100).deposit(100).getBalance()).toBe(200);
  });

  test('should withdraw money', () => {
    expect(getBankAccount(100).withdraw(100).getBalance()).toBe(0);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(100);
    const anotherAccount = getBankAccount(200);
    expect(bankAccount.transfer(100, anotherAccount).getBalance()).toBe(0);
    expect(anotherAccount.getBalance()).toBe(300);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const result = await getBankAccount(100).fetchBalance();
    typeof result === 'number' && expect(typeof result).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(100);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(0);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(0);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(100);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(null);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
