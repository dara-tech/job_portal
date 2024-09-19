import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { setAllApplicants } from '@/redux/applicationSlice'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Applicants = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const { applicants } = useSelector((store) => store.application)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAllApplicants = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true })
                dispatch(setAllApplicants(res.data.job))
            } catch (error) {
                console.error('Error fetching applicants:', error)
                toast.error('Failed to fetch applicants. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }
        fetchAllApplicants()
    }, [dispatch, params.id])

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isLoading ? (
                                <Skeleton className="h-8 w-64" />
                            ) : (
                                <>Applicants ({applicants?.applications?.length || 0})</>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-64 w-full" />
                            </div>
                        ) : (
                            <ApplicantsTable />
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default Applicants