import { describe, expect, it } from 'vitest';
import router from './index';

describe('router', () => {
  it('should be defined', () => {
    expect(router).toBeDefined();
  });

  it('should have a routes array', () => {
    expect(Array.isArray(router.routes)).toBe(true);
    expect(router.routes.length).toBeGreaterThan(0);
  });

  it('should have root path "/"', () => {
    const rootRoute = router.routes.find((r: any) => r.path === '/');
    expect(rootRoute).toBeDefined();
  });

  it('should have /book-meeting route', () => {
    const rootRoute = router.routes.find((r: any) => r.path === '/');
    const bookMeetingRoute = rootRoute?.children?.find((c: any) => c.path === '/book-meeting');
    expect(bookMeetingRoute).toBeDefined();
  });
});
