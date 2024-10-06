import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { RESUME_API_ENDPOINT } from '@/utils/constant'

export function useResumes() {
  const [resumes, setResumes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchResumes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(RESUME_API_ENDPOINT, {
        withCredentials: true,
      })
      if (response.data && Array.isArray(response.data.resumes)) {
        setResumes(response.data.resumes)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
      setError(error.response?.data?.message || 'Failed to fetch resumes')
      toast.error('Failed to fetch resumes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  const createResume = useCallback(async (title) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        RESUME_API_ENDPOINT,
        { title },
        { withCredentials: true }
      )
      if (response.data && response.data.resume) {
        setResumes(prevResumes => [...prevResumes, response.data.resume])
        toast.success('Resume created successfully')
        return response.data.resume
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error creating resume:', error)
      setError(error.response?.data?.message || 'Failed to create resume')
      toast.error('Failed to create resume. Please try again.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteResume = useCallback(async (id) => {
    setIsLoading(true)
    setError(null)
    try {
      await axios.delete(`${RESUME_API_ENDPOINT}/${id}`, { withCredentials: true })
      setResumes(prevResumes => prevResumes.filter(resume => resume._id !== id))
      toast.success('Resume deleted successfully')
    } catch (error) {
      console.error('Error deleting resume:', error)
      setError(error.response?.data?.message || 'Failed to delete resume')
      toast.error('Failed to delete resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateResume = useCallback(async (id, updatedData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.put(`${RESUME_API_ENDPOINT}/${id}`, updatedData, { withCredentials: true })
      if (response.data && response.data.resume) {
        setResumes(prevResumes => prevResumes.map(resume => resume._id === id ? response.data.resume : resume))
        toast.success('Resume updated successfully')
        return response.data.resume
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error updating resume:', error)
      setError(error.response?.data?.message || 'Failed to update resume')
      toast.error('Failed to update resume. Please try again.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { 
    resumes, 
    isLoading, 
    error,
    fetchResumes,
    createResume,
    deleteResume,
    updateResume
  }
}
