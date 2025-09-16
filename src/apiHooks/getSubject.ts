import { useEffect, useState } from "react"
import { useGetSubjectsQuery } from "../service/parentDashboard"
import { Subject } from "../types/General"


const useGetSubject=()=>{

    const [subject,setSubject]=useState<Subject[]>([])
    const {data,isError,isLoading,isSuccess}=useGetSubjectsQuery()

        
    useEffect(() => {
        if (isSuccess && data) {
          setSubject(data.data || []);
        }
      }, [data, isSuccess]);

    
      return { subject, isError, isLoading, isSuccess };

}

export default useGetSubject