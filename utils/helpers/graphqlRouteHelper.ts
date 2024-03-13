import axios from 'axios';
import { PerformanceData } from '../types/genericTypes';
import { performance } from 'perf_hooks';
import logger from './logger';

export const evaluateApiPerformance = async (virtualUsers: number, graphqlQuery: string): Promise<PerformanceData> => {
  try {
    logger.info(`evaluateApiPerformance started`);
    const responseTimes: number[] = [];

    const globalStart: number = performance.now();
    for (let i = 0; i < virtualUsers; i++) {
      const start: number = performance.now();
      await axios.post(process.env.GRAPHQL_ENDPOINT, { query: graphqlQuery });

      const end: number = performance.now();
      // const responseTime = (end - start) / 1000; // Convert to seconds
      const responseTime: number = end - start;
      responseTimes.push(responseTime);
    }
    const globalEnd: number = performance.now();
    const globalTotalTimeTaken: number = globalEnd - globalStart;
    const sortedResponseTimes: number[] = responseTimes.sort((a, b) => a - b);

    // Calculate Average, Min & Max time.
    const averageTime: number = responseTimes.reduce((sum, time) => sum + time, 0) / virtualUsers;
    const minTime: number = Math.min(...responseTimes);
    const maxTime: number = Math.max(...responseTimes);

    // Calculate requests per second
    const totalTimeInSeconds: number = responseTimes.reduce((sum, time) => sum + time, 0) / 1000;
    const requestPerSecond: number = virtualUsers / totalTimeInSeconds;

    // Calculate the 90th percentile
    const percentileIndex: number = Math.floor(0.9 * virtualUsers);
    const ninetyPercentile: number = sortedResponseTimes[percentileIndex];

    // Calculate the 95th percentile
    const percentileIndex95: number = Math.floor(0.95 * virtualUsers);
    const ninetyFifthPercentile: number = sortedResponseTimes[percentileIndex95];

    logger.info(`evaluateApiPerformance success`);
    return {
      averageTime: Number(averageTime.toFixed(2)),
      minTime: Number(minTime.toFixed(2)),
      maxTime: Number(maxTime.toFixed(2)),
      requestPerSecond: Number(requestPerSecond.toFixed(2)),
      totalVirtualUsers: virtualUsers,
      ninetyPercentile: Number(ninetyPercentile.toFixed(2)),
      ninetyFifthPercentile: Number(ninetyFifthPercentile.toFixed(2)),
      totalTimeTaken: Number(globalTotalTimeTaken.toFixed(2)),
    };
  } catch (error) {
    logger.error(`evaluateApiPerformance error ${JSON.stringify(error)}`);
    throw new Error(error);
  }
};
