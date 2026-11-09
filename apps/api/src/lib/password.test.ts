import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('Password Utils', () => {
  it('should hash a password and verify it correctly', async () => {
    const raw = 'my-secret-password';
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);

    const isValid = await verifyPassword(raw, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('wrong-password', hash);
    expect(isInvalid).toBe(false);
  });
});
