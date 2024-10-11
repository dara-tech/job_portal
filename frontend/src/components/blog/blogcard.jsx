import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ThumbsUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BLOG_API_ENDPOINT } from '../../utils/constant';

export default function BlogCard({ blog }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  useEffect(() => {
    const fetchLikesAndComments = async () => {
      try {
        const response = await fetch(`${BLOG_API_ENDPOINT}/${blog._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog details");
        }
        const data = await response.json();
        setLikes(data.data.likes?.length || 0);
        setComments(data.data.comments?.length || 0);
      } catch (err) {
        console.error("Error fetching likes and comments:", err);
      }
    };

    fetchLikesAndComments();
  }, [blog._id]);

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <img
        src={blog.picture}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={blog.author?.profile?.profilePhoto} alt={blog.author?.fullname} />
            <AvatarFallback>{blog.author?.fullname ? blog.author.fullname.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{blog.author?.fullname || 'Unknown Author'}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <CalendarIcon className="h-4 w-4" />
          <time dateTime={blog.createdAt}>
            {new Date(blog.createdAt).toLocaleDateString()}
          </time>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {blog.tags.length > 3 && (
            <Badge variant="secondary">+{blog.tags.length - 3}</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {blog.content.replace(/<[^>]*>/g, '')}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm">{likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{comments}</span>
          </div>
        </div>
        <Button asChild>
          <Link to={`/blog/${blog._id}`}>
            Read more
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}