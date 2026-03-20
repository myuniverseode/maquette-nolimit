// agents/queryOptimizer.ts

// ===== TYPES =====
export interface FetchMetrics {
  url: string;
  method: string;
  duration: number;
  status: number;
  ok: boolean;
  size?: number;
}

export interface FetchResult<T> {
  data: T | null;
  error: string | null;
  metrics: FetchMetrics;
}

// ===== METRICS COLLECTOR =====
class MetricsCollector {
  private logs: FetchMetrics[] = [];

  log(metrics: FetchMetrics) {
    this.logs.push(metrics);

    // Debug en dev
    if (process.env.NODE_ENV === 'development') {
      console.log('[QueryOptimizer]', metrics);
    }
  }

  getAll() {
    return this.logs;
  }

  getRecent(limit = 10) {
    return this.logs.slice(-limit).reverse();
  }

  getSlowQueries(threshold = 1000) {
    return this.logs.filter(m => m.duration > threshold);
  }

  clear() {
    this.logs = [];
  }
}

export const metricsCollector = new MetricsCollector();

// ===== FETCH AVEC METRICS =====
export async function fetchWithMetrics<T>(
  url: string,
  options: RequestInit = {}
): Promise<FetchResult<T>> {
  const start = performance.now();

  try {
    const response = await fetch(url, {
      ...options,
    });

    const duration = performance.now() - start;

    let data: T | null = null;
    let error: string | null = null;

    try {
      data = await response.json();
    } catch {
      error = 'Invalid JSON response';
    }

    const metrics: FetchMetrics = {
      url,
      method: options.method || 'GET',
      duration,
      status: response.status,
      ok: response.ok,
      size: data ? JSON.stringify(data).length : 0,
    };

    metricsCollector.log(metrics);

    if (!response.ok) {
      return {
        data: null,
        error: `HTTP ${response.status}`,
        metrics,
      };
    }

    return { data, error, metrics };
  } catch (err: any) {
    const duration = performance.now() - start;

    const metrics: FetchMetrics = {
      url,
      method: options.method || 'GET',
      duration,
      status: 0,
      ok: false,
    };

    metricsCollector.log(metrics);

    return {
      data: null,
      error: err?.message || 'Network error',
      metrics,
    };
  }
}

// ===== ANALYSE SIMPLE (pour DevPanel) =====
export function analyzeQueryPerformance(metrics: FetchMetrics) {
  const issues: string[] = [];

  if (metrics.duration > 1000) {
    issues.push('Requête lente');
  }

  if (metrics.status >= 400) {
    issues.push(`Erreur HTTP (${metrics.status})`);
  }

  if (metrics.size && metrics.size > 100000) {
    issues.push('Payload trop volumineux');
  }

  let score = 100;

  if (metrics.duration > 1000) score -= 30;
  if (metrics.duration > 2000) score -= 20;
  if (metrics.status >= 400) score -= 40;
  if (metrics.size && metrics.size > 100000) score -= 10;

  score = Math.max(0, score);

  return {
    score,
    issues,
    isSlow: metrics.duration > 1000,
  };
}