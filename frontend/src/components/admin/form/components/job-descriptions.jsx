import React from 'react'
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const JobDescription = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <Label htmlFor="description" className="text-lg font-semibold">Job Description</Label>
        </div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder="Describe the job role, responsibilities, and what makes this position exciting..."
          className="h-[300px]"
        />
      </CardContent>
    </Card>
  )
}

export default JobDescription