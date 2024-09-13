import { useDispatch } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';

const useGetSingleJob = (jobId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!jobId) {
      console.error('No jobId provided');
      return;
    }

    const fetchSingleJob = async () => {
      try {
        console.log(`Fetching job with ID: ${jobId}`);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        console.log('API Response:', res.data);

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        } else {
          console.error('Failed to fetch job:', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);
};

export default useGetSingleJob;
