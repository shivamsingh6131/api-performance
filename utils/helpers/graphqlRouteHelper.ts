import axios from "axios";
import { PerformaceData } from "../types/genericTypes";
import { performance } from "perf_hooks";

export const evaluateApiPerformance = async (
  virtualUsers: number,
  graphqlQuery: string
): Promise<PerformaceData> => {
  try {
    const responseTimes : number[] = [];

    let globalStart : number = performance.now();
    for (let i = 0; i < virtualUsers; i++) {
      const start : number = performance.now();
      await axios.post(process.env.GRAPHQL_ENDPOINT, { query: graphqlQuery });

      const end : number = performance.now();
      // const responseTime = (end - start) / 1000; // Convert to seconds
      const responseTime : number = end - start;
      responseTimes.push(responseTime);
    }
    let globalEnd : number = performance.now();
    let globalTotalTimeTaken : number = globalEnd - globalStart;
    const sortedResponseTimes : number[] = responseTimes.sort((a, b) => a - b);

    // Calculate Average, Min & Max time.
    const averageTime : number =
      responseTimes.reduce((sum, time) => sum + time, 0) / virtualUsers;
    const minTime : number = Math.min(...responseTimes);
    const maxTime : number = Math.max(...responseTimes);

    // Calculate requests per second
    const totalTimeInSeconds : number =
      responseTimes.reduce((sum, time) => sum + time, 0) / 1000;
    const requestPerSecond : number = virtualUsers / totalTimeInSeconds;

    // Calculate the 90th percentile
    const percentileIndex : number = Math.floor(0.9 * virtualUsers);
    const ninetyPercentile : number = sortedResponseTimes[percentileIndex];

    // Calculate the 95th percentile
    const percentileIndex95 : number = Math.floor(0.95 * virtualUsers);
    const ninetyFifthPercentile : number = sortedResponseTimes[percentileIndex95];

    return {
      averageTime: Number(averageTime.toFixed(2)),
      minTime: Number(minTime.toFixed(2)),
      maxTime: Number(maxTime.toFixed(2)),
      requestPerSecond: Number(requestPerSecond.toFixed(2)),
      totoalVirtualUsers: virtualUsers,
      ninetyPercentile: Number(ninetyPercentile.toFixed(2)),
      ninetyFifthPercentile: Number(ninetyFifthPercentile.toFixed(2)),
      totalTimeTaken: Number(globalTotalTimeTaken.toFixed(2)),
    };
  } catch (error) {
    console.log("ERROR ", error);
    throw new Error(error);
  }
};
