import { useEffect } from 'react';
import { Alert } from 'rsuite';
import { PromiseFunc } from '@/utils/func';

const useHeartbeat = <T extends PromiseFunc>(
  fetchFunc: T,
  interval: number,
  callback: (value: ReturnType<T>) => void,
  otherParams: Array<any>,
) => {
  useEffect(() => void fetchFunc(...otherParams), [fetchFunc, otherParams]);
  useEffect(() => {
    const heartbeatHandler = async () => {
      try {
        callback?.(await fetchFunc(...otherParams));
      } catch (e) {
        Alert.error('与服务器失去连接', interval);
      }
    };
    const timer = setInterval(heartbeatHandler, interval);
    return () => clearInterval(timer);
  }, [callback, fetchFunc, interval, otherParams]);
};
export default useHeartbeat;
