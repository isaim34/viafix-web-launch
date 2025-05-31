
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(performance.now());
  const mountStartTime = useRef<number>(performance.now());
  
  useEffect(() => {
    const mountTime = performance.now() - mountStartTime.current;
    
    // Log slow components (>100ms to mount)
    if (mountTime > 100) {
      console.warn(`🐌 Slow component mount: ${componentName} took ${mountTime.toFixed(2)}ms`);
    }
    
    // Track in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
    }
  }, [componentName]);
  
  useEffect(() => {
    renderStartTime.current = performance.now();
  });
  
  const measureOperation = (operationName: string) => {
    return {
      start: () => performance.now(),
      end: (startTime: number) => {
        const duration = performance.now() - startTime;
        if (duration > 50) {
          console.warn(`⏱️ Slow operation in ${componentName}.${operationName}: ${duration.toFixed(2)}ms`);
        }
        return duration;
      }
    };
  };
  
  return { measureOperation };
};

// Hook for measuring async operations
export const useAsyncPerformance = () => {
  const measureAsync = async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      if (duration > 1000) {
        console.warn(`🐌 Slow async operation: ${operationName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`❌ Failed async operation: ${operationName} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  };
  
  return { measureAsync };
};
