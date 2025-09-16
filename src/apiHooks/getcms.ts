import { useEffect, useState } from "react";
import { cmsApi } from "../service/cms";
import { CMSData } from "../types/General";

const useGetCms = () => {
  const [data, setData] = useState<CMSData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [getCms] = cmsApi.useLazyFetchCmsQuery();
  let timeout: NodeJS.Timeout;

  const fetchCms = async () => {
    try {
      const res = await getCms({}).unwrap();

      if (res?.statusCode === 200) {
        setData(res?.data);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    timeout = setTimeout(() => {
      fetchCms();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return { data, loading };
};

export default useGetCms;
