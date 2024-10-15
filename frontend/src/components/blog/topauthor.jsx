import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BLOG_API_ENDPOINT } from '../../utils/constant';

const TopAuthor = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${BLOG_API_ENDPOINT}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        const authorStats = calculateTopAuthors(data.data);
        setAuthors(authorStats.slice(0, 5)); // Get top 5 authors
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const calculateTopAuthors = (blogs) => {
    const authorMap = new Map();

    blogs.forEach(blog => {
      if (!authorMap.has(blog.author._id)) {
        authorMap.set(blog.author._id, {
          id: blog.author._id,
          name: blog.author.fullname,
          avatar: blog.author.profile.profilePhoto,
          postCount: 1,
          totalViews: blog.views || 0
        });
      } else {
        const author = authorMap.get(blog.author._id);
        author.postCount += 1;
        author.totalViews += blog.views || 0;
      }
    });

    return Array.from(authorMap.values())
      .sort((a, b) => b.totalViews - a.totalViews);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {authors.map((author, index) => (
        <motion.div
          key={author.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="flex items-center p-4">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-semibold">{author.name}</h3>
                <p className="text-sm text-muted-foreground">{author.postCount} posts</p>
              </div>
              <Badge variant="secondary">{author.totalViews} views</Badge>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TopAuthor;
