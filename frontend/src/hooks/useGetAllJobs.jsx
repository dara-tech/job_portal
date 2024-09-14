import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);
  useEffect(() => {
    const fetchAllJobs = async () => {
        try {
          const keyword = encodeURIComponent(searchedQuery);
          const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${keyword}`, { withCredentials: true });
          if (res.data.success) {
            dispatch(setAllJobs(res.data.jobs));
          }
        } catch (error) {
          console.error("Error fetching jobs:", error);
        }
      };
      

    fetchAllJobs();
  }, []);
};

export default useGetAllJobs;
