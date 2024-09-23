import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setSingleCompany } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSingleCompany = useCallback(async () => {
    setLoading(true);
    setError(null);
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
  }, [companyId, dispatch]);

  useEffect(() => {
    fetchSingleCompany();
  }, [fetchSingleCompany]);

  const refetch = useCallback(() => {
    fetchSingleCompany();
  }, [fetchSingleCompany]);

  return (
    <React.Fragment>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <div>
          {/* Company data is now available in the Redux store */}
        </div>
      )}
      {React.useImperativeHandle(
        React.useRef(null),
        () => ({
          refetch,
        }),
        [refetch]
      )}
    </React.Fragment>
  );
};

export default useGetCompanyById;