import { describe, it, expect } from 'vitest';

describe('Health Check Tests', () => {
  it('should check if dev server is responsive', async () => {
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:5173');
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      // Server should respond
      expect(response.ok).toBe(true);
      
      // Latency should be reasonable (under 1000ms)
      expect(latency).toBeLessThan(1000);
      
      console.log(`✓ Server responded in ${latency}ms`);
    } catch (error) {
      throw new Error('Server is not running. Start it with: npm run dev');
    }
  });
});
