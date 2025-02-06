import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useState, useEffect } from "react";

export const useGetCalls = () => {
    // type Call array being imported from stream
    const [calls, setCalls] = useState<Call[]>([]);
    // allows us to track loading state
    const [isLoading, setIsLoading] = useState(false);
    //Getting calls by the client
    const client = useStreamVideoClient();
    //get the user
    const { user } = useUser();

    useEffect(() => {
        //create async function
        const loadCalls = async () => {
            //if there is not client, exit
            if(!client || !user?.id) return;

            setIsLoading(true)

            try {
                const { calls } = await client.queryCalls( {
                    // sorting by when they start
                    sort: [{ field : 'starts_at', direction: -1 }],
                    filter_conditions: {
                        //filter by start add property 
                        starts_at: { $exists: true},
                        $or: [
                            // show this call if the user is the one who created the call
                            { created_by_user_id: user.id },
                            // or if the user is a member
                            {memeber: { $in : [user.id]}}
                        ]
                    }
                })
                setCalls(calls);
            } catch (error) {
                console.log(error)
            //finally calsue to stop the loading    
            } finally {
                setIsLoading(false)
            }

        }

        loadCalls();
        // both because you want to be able to properly fetch the meetings for that usse
    }, [client, user?.id])

    //Get access to the current time:
    const now =  new Date();

    //instead of returning; create multiple variable to filter
    const endedCalls = calls.filter(({ state: { startsAt, endedAt }}: Call) => {
        //if start date is < now AND has ended
        return (startsAt && new Date(startsAt) < now || !endedAt)
    })


    const upcomingCalls = calls.filter(({ state: { startsAt, }}: Call) => {
        return startsAt && new Date(startsAt) > now 
    });
    
    


    return {
        endedCalls,
        upcomingCalls,
        callRecordings: calls,
        isLoading,
    }
    
}