import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export function NewResumeCard({ onCreateNewResume, newResumeTitle, setNewResumeTitle, isLoading }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateNewResume = async (e) => {
    e.preventDefault()
    if (newResumeTitle.trim().length < 3) return
    await onCreateNewResume(newResumeTitle.trim())
    setNewResumeTitle('')
    setIsDialogOpen(false)
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Card 
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <Plus className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-2">Create New Resume</h2>
            <p className="text-center text-white text-opacity-80">Click to start a new resume</p>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-xl border-none">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Create New Resume</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateNewResume} className="space-y-4">
                <div>
                  <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700">
                    Resume Title
                  </label>
                  <Input
                    id="resumeTitle"
                    type="text"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    placeholder="Enter resume title"
                    disabled={isLoading}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || newResumeTitle.trim().length < 3}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isLoading ? 'Creating...' : 'Create Resume'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
