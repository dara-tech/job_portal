import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function ImportPost({ onClose }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  }, []);

  const handleImport = useCallback(async () => {
    if (file) {
      setImporting(true);
      try {
        const fileContent = await file.text();
        const posts = JSON.parse(fileContent);
        
        // Assuming you have an API endpoint to handle multiple post imports
        const response = await fetch('/api/import-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ posts }),
        });

        if (response.ok) {
          // Handle successful import
          console.log('Posts imported successfully');
          onClose();
          navigate('/admin/blog'); // Redirect to blog list after import
        } else {
          throw new Error('Failed to import posts');
        }
      } catch (error) {
        console.error('Error importing posts:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setImporting(false);
      }
    }
  }, [file, onClose, navigate]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Import Blog Posts</h2>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
      <div>
        <input type="file" accept=".json" onChange={handleFileChange} />
      </div>
      <div>
        <Button onClick={handleImport} disabled={!file || importing}>
          <Upload className="mr-2 h-4 w-4" />
          {importing ? 'Importing...' : 'Import'}
        </Button>
      </div>
    </div>
  );
}
