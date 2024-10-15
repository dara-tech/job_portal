import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ArrowRight } from "lucide-react"

export default function BlogCard({ blog }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-shadow hover:shadow-lg">
      <img
        src={blog.picture}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <CardContent className="flex-grow p-6">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={blog.author?.profile?.profilePhoto} alt={blog.author?.fullname} />
            <AvatarFallback>{blog.author?.fullname ? blog.author.fullname.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-sm font-medium block">{blog.author?.fullname || 'Unknown Author'}</span>
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3 mr-1" />
              <time dateTime={blog.createdAt}>
                {new Date(blog.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {blog.content.replace(/<[^>]*>/g, '')}
        </p>
        <div className="flex flex-wrap gap-2">
          {blog.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {blog.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">+{blog.tags.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-6">
        <Link to={`/blog/${blog._id}`} className="text-sm font-medium flex items-center hover:underline">
          Read more <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}