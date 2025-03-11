//Custom Hook to get call id

import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true); //Check if call is loading

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    //find the call and set it
    const loadCall = async () => {
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id,
        },
      });

      if (calls.length > 0) setCall(calls[0]);
      setIsCallLoading(false);
    };
    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
};
