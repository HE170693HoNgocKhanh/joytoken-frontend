import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('should render App component', () => {
    // App already has Router inside, don't wrap with another Router
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});

