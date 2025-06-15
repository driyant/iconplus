import { describe, it, expect } from 'vitest';

describe('main entrypoint', () => {
  it('should import without throwing', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    let error;
    try {
      await import('./main');
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });
});
