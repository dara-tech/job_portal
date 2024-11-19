import React, { useState, useCallback, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreHorizontal, Search, Plus, Upload, Eye } from "lucide-react";
import useBlog from '../hook/useBlog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ImportPost from './importpost'

export default function BlogTable() {
  const { blogs, loading, error, deleteBlog } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImportPostOpen, setIsImportPostOpen] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 9;

  const showNotification = useCallback((message, type = 'info') => {
    toast[type](message);
  }, []);

  const handleDeleteClick = useCallback((blog) => {
    setBlogToDelete(blog);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (blogToDelete) {
      setIsDeleting(true);
      toast.promise(
        deleteBlog(blogToDelete._id),
        {
          loading: 'Deleting blog post...',
          success: () => {
            setBlogToDelete(null);
            showNotification('Blog post deleted successfully.', 'success');
            return 'Blog post deleted successfully.';
          },
          error: (err) => {
            setIsDeleting(false);
            return `Failed to delete blog: ${err.message}`;
          },
        }
      );
      setIsDeleting(false);
    }
  }, [blogToDelete, deleteBlog, showNotification]);

  useEffect(() => {
    if (error) {
      showNotification(`Error: ${error}`, 'error');
    }
  }, [error, showNotification]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  if (!blogs || !blogs.data || !Array.isArray(blogs.data) || blogs.data.length === 0) {
    return <div className="text-center text-gray-500">No blogs available</div>;
  }

  const filteredBlogs = blogs.data.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.author.fullname && blog.author.fullname.toLowerCase().includes(searchTerm.toLowerCase())) 
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-4 mt-4">
      <Toaster />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/admin/blog/create')}>
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
          {/* <Button onClick={() => setIsImportPostOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Import Posts
          </Button> */}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-8"
          />
        </div>
      </div>
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>{blog.author.fullname || 'Unknown'}</TableCell>
                  <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(`/blog/${blog._id}`, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/blog/update/${blog._id}`)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(blog)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No blogs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBlogs.length)} of {filteredBlogs.length} entries
        </div>
        <div className="space-x-2">
          {Array.from({ length: Math.ceil(filteredBlogs.length / itemsPerPage) }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
      <AlertDialog open={!!blogToDelete} onOpenChange={() => !isDeleting && setBlogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this blog post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isImportPostOpen} onOpenChange={setIsImportPostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Blog Posts</DialogTitle>
          </DialogHeader>
          <ImportPost onClose={() => setIsImportPostOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}