import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { FileText, Edit, Eye, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function ResumeCard({ resume, onDelete, isLoading }) {
  const navigate = useNavigate()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = () => setIsDeleteDialogOpen(true)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(resume._id)
      toast.success('Resume deleted successfully')
    } catch (error) {
      toast.error('Failed to delete resume. Please try again.')
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditClick = () => {
    if (resume?._id) navigate(`/resume/${resume._id}/edit`)
    else toast.error('Invalid resume ID. Please try again.')
  }

  const handleViewClick = () => {
    if (resume?._id) navigate(`/resume/${resume._id}/view`)
    else toast.error('Invalid resume ID. Please try again.')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <AnimatePresence>
      {!isDeleting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-full"
        >
          <Card className=" rounded-md bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg h-full flex flex-col">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
              <CardTitle className="flex items-center text-xl font-bold">
                <FileText className="h-6 w-6 mr-2" />
                {resume.title}
              </CardTitle>
              <CardDescription className="text-gray-100 text-sm mt-1">
                Last modified: {formatDate(resume.lastModified)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col justify-end">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-md p-1 text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                  onClick={handleEditClick}
                  disabled={isLoading || isDeleting}
                  title="Edit Resume"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  className="flex-1 rounded-md p-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                  onClick={handleViewClick}
                  disabled={isLoading || isDeleting}
                  title="View Resume"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteClick}
                  className="flex-1 rounded-md p-1 bg-red-500 text-white hover:bg-red-600"
                  disabled={isLoading || isDeleting}
                  title="Delete Resume"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="bg-white dark:bg-gray-900 rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Confirm Delete</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Are you sure you want to delete this resume? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}
                  className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 text-white">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  )
}