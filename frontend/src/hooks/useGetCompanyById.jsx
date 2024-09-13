import { setSingleCompany } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSingleCompany = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        } else {
          setError('Failed to fetch company data');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while fetching company data');
      } finally {
        setLoading(false);
      }
    };

    fetchSingleCompany();
  }, [companyId, dispatch]);

  return { loading, error };
};

export default useGetCompanyById;
