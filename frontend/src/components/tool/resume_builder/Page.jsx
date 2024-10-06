import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { NewResumeCard } from './NewResumeCard'
import { ResumeCard } from './ResumeCard'
import { useResumes } from './hook/useResume'
import { Plus, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ResumePage() {
  const [newResumeTitle, setNewResumeTitle] = useState('')
  const navigate = useNavigate()
  const { resumes, isLoading, createResume, deleteResume } = useResumes()

  const handleCreateNewResume = async () => {
    if (newResumeTitle.trim().length < 3) {
      toast.error('Resume title must be at least 3 characters long.')
      return
    }

    const newResume = await createResume(newResumeTitle.trim())
    if (newResume) {
      setNewResumeTitle('')
      toast.success('New resume created successfully!')
    }
  }

  const handleDelete = async (id) => {
    await deleteResume(id)
  }

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <h1 className="text-6xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          My Resumes
        </h1>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          Create, manage, and customize your professional resumes
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <NewResumeCard
              onCreateNewResume={handleCreateNewResume}
              newResumeTitle={newResumeTitle}
              setNewResumeTitle={setNewResumeTitle}
              isLoading={isLoading}
            />
          </motion.div>
          {resumes.map((resume) => (
            <motion.div
              key={resume._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ResumeCard 
                resume={resume} 
                onDelete={handleDelete} 
                isLoading={isLoading}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
