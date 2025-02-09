import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useParams() {
    return {
      boardId: 'test-board-id'
    };
  },
  usePathname() {
    return '/test/path';
  }
}));

// Mock next/font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-font-class',
  }),
}));
