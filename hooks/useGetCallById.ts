import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call | undefined>();
  const [isCallLoading, setIsCallLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      try {
        setIsCallLoading(true);

        // First query to check if call exists
        const { calls } = await client.queryCalls({
          filter_conditions: {
            id,
          },
        });

        let callObject: Call;

        if (calls.length > 0) {
          // Use existing call
          callObject = calls[0];
        } else {
          // Create a new call if it doesn't exist
          callObject = client.call("default", id as string);
        }

        // Important: Join the call - this is what was missing!
        await callObject.join({ create: true });

        setCall(callObject);
      } catch (err) {
        console.error("Error loading call:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsCallLoading(false);
      }
    };

    loadCall();

    // Cleanup - leave call when component unmounts
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
    };
  }, [client, id]);

  return { call, isCallLoading, error };
};
