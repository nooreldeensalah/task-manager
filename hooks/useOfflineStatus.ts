import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

interface OfflineStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  isOffline: boolean;
  netInfo: NetInfoState | null;
}

export const useOfflineStatus = (): OfflineStatus => {
  const [netInfo, setNetInfo] = useState<NetInfoState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const subscription = NetInfo.addEventListener((state) => {
      if (isMounted) {
        setNetInfo(state);
      }
    });

    NetInfo.fetch().then((state) => {
      if (isMounted) {
        setNetInfo(state);
      }
    });

    return () => {
      isMounted = false;
      subscription();
    };
  }, []);

  const isConnected = netInfo?.isConnected ?? true;
  const isInternetReachable = netInfo?.isInternetReachable ?? true;

  return {
    isConnected,
    isInternetReachable,
    isOffline: !(isConnected && isInternetReachable),
    netInfo,
  };
};
