import { useState, useEffect } from "react"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";


// take in string or array of strings
const useGetCallById = (id : string | string[]) => {

    const [call, setCall] = useState<Call>() // call coming reactvideosdk
    const [isCallLoading, setisCallLoading] = useState(true) 

    //access to stream video client
    const client = useStreamVideoClient()

    //start fetching our current call that is active
    useEffect(() => {
        if(!client) return; //if client exists, if not exit
    //if it does we want to create an async function
    const loadCall  = async () => { 
        // destructure calls
        const {calls} = await client.queryCalls({
            filter_conditions: {
                id
            }
        })
        //if we fetched calls?
        if(calls.length > 0) setCall(calls[0]);

        setisCallLoading(false)
    }
    loadCall();
    }, [client, id])

    return {call, isCallLoading};
}


export default useGetCallById;