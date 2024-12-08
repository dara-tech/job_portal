import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ThumbsUp, MessageSquare, Trash2, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BLOG_API_ENDPOINT } from '../../utils/constant';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${BLOG_API_ENDPOINT}/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        const data = await response.json();
        setBlog(data.data);
        
        // Send a view request to the backend
        await fetch(`${BLOG_API_ENDPOINT}/${id}/view`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${BLOG_API_ENDPOINT}/${id}/comments`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (id) {
      fetchBlog();
      fetchComments();
    }
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await fetch(`${BLOG_API_ENDPOINT}/${id}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to like blog");
      }
      const data = await response.json();
      setBlog(data.data);
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BLOG_API_ENDPOINT}/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: comment }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const data = await response.json();
      setComments([...comments, data.data]);
      setComment('');
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`${BLOG_API_ENDPOINT}/${id}/comment/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-4 w-1/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog not found</h1>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <img
        src={blog.picture}
        alt={blog.title}
        className="w-full h-64 object-cover mb-6 rounded-lg"
      />
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={blog.author?.profile?.profilePhoto} alt={blog.author?.fullname} />
            <AvatarFallback>{blog.author?.fullname ? blog.author.fullname.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{blog.author?.fullname || 'Unknown Author'}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <time dateTime={blog.createdAt}>
            {new Date(blog.createdAt).toLocaleDateString()}
          </time>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {blog.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <div
        className="prose max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <div className="flex items-center space-x-4 mb-6">
        <Button onClick={handleLike} variant="outline" className="flex items-center space-x-2">
          <ThumbsUp className="h-4 w-4" />
          <span>{blog.likes?.length || 0} Likes</span>
        </Button>
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span>{comments.length} Comments</span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>{blog.views || 0} Views</span>
        </div>
      </div>
      <form onSubmit={handleComment} className="mb-6">
        <Input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-2"
        />
        <Button type="submit">Post Comment</Button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user?.profile?.profilePhoto} alt={comment.user?.fullname} />
                  <AvatarFallback>{comment.user?.fullname ? comment.user.fullname.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{comment.user?.fullname || 'Unknown User'}</span>
              </div>
              <Button
                onClick={() => handleDeleteComment(comment._id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p>{comment.text}</p>
            <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={comment.createdAt}>
                {new Date(comment.createdAt).toLocaleString()}
              </time>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}