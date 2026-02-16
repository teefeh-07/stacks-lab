export class PerformanceMonitor {

  start(id: string) {
    performance.mark(`${id}-start`);
  }

  end(id: string) {
    performance.mark(`${id}-end`);
    performance.measure(id, `${id}-start`, `${id}-end`);
  }

  getMetrics() {
    return performance.getEntriesByType("measure");
  }

