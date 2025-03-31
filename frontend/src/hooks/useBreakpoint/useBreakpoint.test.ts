import { renderHook, act } from '@testing-library/react';
import { useBreakpoint, Breakpoint } from './useBreakpoint';

describe('useBreakpoint', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024 // Default test value
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    window.innerWidth = originalInnerWidth;
  });

  const fireResize = (width: number) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
  };

  it('should initialize with correct breakpoint values based on window width', () => {
    window.innerWidth = 800;

    const { result } = renderHook(() => useBreakpoint());

    // At 800px, sm and md should be true, others false
    expect(result.current).toEqual({
      [Breakpoint.SM]: true, // 640px
      [Breakpoint.MD]: true, // 768px
      [Breakpoint.LG]: false, // 1024px
      [Breakpoint.XL]: false, // 1280px
      [Breakpoint.XXL]: false // 1536px
    });
  });

  it('should update breakpoints when window resizes', () => {
    window.innerWidth = 500;

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toEqual({
      [Breakpoint.SM]: false,
      [Breakpoint.MD]: false,
      [Breakpoint.LG]: false,
      [Breakpoint.XL]: false,
      [Breakpoint.XXL]: false
    });

    act(() => {
      fireResize(800);
    });

    expect(result.current).toEqual({
      [Breakpoint.SM]: true,
      [Breakpoint.MD]: true,
      [Breakpoint.LG]: false,
      [Breakpoint.XL]: false,
      [Breakpoint.XXL]: false
    });

    act(() => {
      fireResize(1300);
    });

    expect(result.current).toEqual({
      [Breakpoint.SM]: true,
      [Breakpoint.MD]: true,
      [Breakpoint.LG]: true,
      [Breakpoint.XL]: true,
      [Breakpoint.XXL]: false
    });

    act(() => {
      fireResize(1600);
    });

    expect(result.current).toEqual({
      [Breakpoint.SM]: true,
      [Breakpoint.MD]: true,
      [Breakpoint.LG]: true,
      [Breakpoint.XL]: true,
      [Breakpoint.XXL]: true
    });
  });

  it('should handle edge cases at exact breakpoint values', () => {
    window.innerWidth = 640;

    const { result, unmount } = renderHook(() => useBreakpoint());

    expect(result.current[Breakpoint.SM]).toBe(true);
    expect(result.current[Breakpoint.MD]).toBe(false);

    unmount();

    window.innerWidth = 768;

    const { result: result2 } = renderHook(() => useBreakpoint());

    expect(result2.current[Breakpoint.SM]).toBe(true);
    expect(result2.current[Breakpoint.MD]).toBe(true);
    expect(result2.current[Breakpoint.LG]).toBe(false);
  });

  it('should clean up event listener on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useBreakpoint());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });
});
