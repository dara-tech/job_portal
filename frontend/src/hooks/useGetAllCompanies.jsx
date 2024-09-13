import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });

        if (res.data.success) {
          // Validate response data structure if necessary
          if (Array.isArray(res.data.companies)) {
            dispatch(setCompanies(res.data.companies));
          } else {
            setError('Invalid company data format');
          }
        } else {
          setError('Failed to fetch company data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching company data');
        console.error('Error fetching companies:', err); // For debugging
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { loading, error };
};

export default useGetAllCompanies;
