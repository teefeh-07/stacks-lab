export class PerformanceMonitor {

  start(id: string) {
    performance.mark(`${id}-start`);
  }

