import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Loader2, PlusCircle, FileText, ThumbsUp, MessageSquare, TrendingUp, Eye, Calendar, Trophy, Crown, Medal, User, ExternalLink, MoreHorizontal, Edit, Trash2, Award, Clock, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useBlog from '../hook/useBlog';
import { format, subDays, isWithinInterval, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DateFilter = ({ onFilterChange }) => {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    onFilterChange(value, selectedYear);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    onFilterChange(selectedMonth, value);
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
      <Select value={selectedMonth} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedYear} onValueChange={handleYearChange}>
        <SelectTrigger className="w-full sm:w-[120px]">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default function BlogDashboard() {
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const { blogs, loading, error } = useBlog();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7');

  const processedBlogs = useMemo(() => {
    if (!blogs?.data) return [];
    return blogs.data.map(blog => ({
      ...blog,
      createdAt: new Date(blog.createdAt),
    }));
  }, [blogs]);

  useEffect(() => {
    if (processedBlogs.length > 0) {
      const endDate = new Date();
      const startDate = subDays(endDate, parseInt(dateRange));

      const filteredBlogs = processedBlogs.filter(blog => 
        isWithinInterval(blog.createdAt, { start: startDate, end: endDate })
      );

      const blogStats = filteredBlogs.reduce((acc, blog) => ({
        totalLikes: acc.totalLikes + blog.likes.length,
        totalComments: acc.totalComments + blog.comments.length,
        totalViews: acc.totalViews + (blog.views || 0),
      }), { totalLikes: 0, totalComments: 0, totalViews: 0 });

      setStats({
        totalPosts: filteredBlogs.length,
        ...blogStats,
      });

      const trendDays = Array.from({ length: parseInt(dateRange) }, (_, i) => ({
        date: format(subDays(endDate, i), 'MMM dd'),
        posts: 0,
        likes: 0,
        comments: 0,
        views: 0,
      })).reverse();

      filteredBlogs.forEach(blog => {
        const blogDate = format(blog.createdAt, 'MMM dd');
        const trendDay = trendDays.find(day => day.date === blogDate);
        if (trendDay) {
          trendDay.posts++;
          trendDay.likes += blog.likes.length;
          trendDay.comments += blog.comments.length;
          trendDay.views += blog.views || 0;
        }
      });

      setTrendData(trendDays);
    }
  }, [processedBlogs, dateRange]);

  const getGrowthRate = (metric) => {
    if (trendData.length < 2) return 0;
    const today = trendData[trendData.length - 1][metric];
    const yesterday = trendData[trendData.length - 2][metric];
    return yesterday !== 0 ? ((today - yesterday) / yesterday) * 100 : 0;
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  const statCards = [
    { title: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'bg-blue-500' },
    { title: 'Total Likes', value: stats?.totalLikes || 0, icon: ThumbsUp, color: 'bg-green-500' },
    { title: 'Total Comments', value: stats?.totalComments || 0, icon: MessageSquare, color: 'bg-yellow-500' },
    { title: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 mt-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Blog Dashboard</h1>
        <div className="flex flex-wrap justify-start sm:justify-end items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button variant="outline" onClick={() => navigate('/admin/bloglist')} className="w-full sm:w-auto">
            <Calendar className="mr-2 h-4 w-4" /> Posts
          </Button>
          <Button onClick={() => navigate('/admin/blog/create')} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Post
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((item, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base sm:text-lg font-semibold">{item.title}</CardTitle>
                <div className={`${item.color} rounded-full p-2 sm:p-3`}>
                  <item.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">
                  {getGrowthRate(item.title.toLowerCase().split(' ')[1]).toFixed(2)}% from previous period
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <div className="flex justify-end">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardTitle>Trend Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="posts" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="likes" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="comments" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#ff7300" fill="#ff7300" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
                <CardDescription>Average likes and comments per post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Likes', 'Comments'].map(metric => (
                    <div key={metric}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium flex-1">{metric}</span>
                        <span className="text-sm text-muted-foreground">
                          {(stats?.[`total${metric}`] / stats?.totalPosts || 0).toFixed(2)}
                        </span>
                      </div>
                      <Progress 
                        value={(stats?.[`total${metric}`] / stats?.totalPosts || 0) * 10} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Authors</CardTitle>
                <CardDescription>Most prolific and engaging writers</CardDescription>
              </CardHeader>
              <CardContent>
                <TopAuthors blogs={processedBlogs} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Highest engagement across metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="views">
                <TabsList className="mb-4 flex flex-wrap">
                  <TabsTrigger value="views" className="flex-1">Views</TabsTrigger>
                  <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
                  <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
                </TabsList>
                <TabsContent value="views">
                  <TopPerformingPosts blogs={processedBlogs} metric="views" />
                </TabsContent>
                <TabsContent value="likes">
                  <TopPerformingPosts blogs={processedBlogs} metric="likes" />
                </TabsContent>
                <TabsContent value="comments">
                  <TopPerformingPosts blogs={processedBlogs} metric="comments" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />
    </div>
  );
}

const TopPerformingPosts = ({ blogs, metric }) => {
  const navigate = useNavigate();
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  const handleFilterChange = (month, year) => {
    const filtered = blogs.filter((blog) => {
      const blogDate = new Date(blog.createdAt);
      if (month === 'all') {
        return blogDate.getFullYear().toString() === year;
      } else {
        const startDate = startOfMonth(new Date(year, parseInt(month)));
        const endDate = endOfMonth(new Date(year, parseInt(month)));
        return isWithinInterval(blogDate, { start: startDate, end: endDate });
      }
    });
    setFilteredBlogs(filtered);
  };

  const sortedBlogs = useMemo(() => {
    return [...filteredBlogs]
      .sort((a, b) => {
        if (metric === 'views') return (b.views || 0) - (a.views || 0);
        if (metric === 'likes') return b.likes.length - a.likes.length;
        if (metric === 'comments') return b.comments.length - a.comments.length;
      })
      .slice(0, 5);
  }, [filteredBlogs, metric]);

  const getMetricValue = (blog) => {
    if (metric === 'views') return blog.views || 0;
    if (metric === 'likes') return blog.likes.length;
    return blog.comments.length;
  };

  const maxValue = Math.max(...sortedBlogs.map(getMetricValue));

  const handleViewPost = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleEditPost = (postId) => {
    navigate(`/admin/blog/update/${postId}`);
  };

  const handleDeletePost = (postId) => {
    console.log(`Delete post ${postId}`);
    // Implement delete logic here
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return <Award className="h-6 w-6 text-blue-500" />;
    }
  };

  const getMetricIcon = (metricType) => {
    switch(metricType) {
      case 'views': return <Eye className="h-5 w-5 text-blue-500" />;
      case 'likes': return <ThumbsUp className="h-5 w-5 text-red-500" />;
      case 'comments': return <MessageSquare className="h-5 w-5 text-green-500" />;
      default: return <BarChart2 className="h-5 w-5 text-purple-500" />;
    }
  };

  const getEngagementRate = (blog) => {
    const totalEngagement = blog.likes.length + blog.comments.length;
    return totalEngagement / (blog.views || 1);
  };

  const getRankColor = (index) => {
    switch(index) {
      case 0: return 'from-yellow-400 to-yellow-600';
      case 1: return 'from-gray-400 to-gray-600';
      case 2: return 'from-orange-400 to-orange-600';
      case 3: return 'from-blue-400 to-blue-600';
      case 4: return 'from-purple-400 to-purple-600';
      default: return 'from-green-400 to-green-600';
    }
  };

  return (
    <>
      <DateFilter onFilterChange={handleFilterChange} />
      <div className="space-y-4 sm:space-y-6">
        {sortedBlogs.map((blog, index) => (
          <motion.div 
            key={blog._id}
            className="bg-card text-card-foreground rounded-lg shadow-md p-4 sm:p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${getRankColor(index)}`} />
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start space-x-4 w-full sm:w-auto">
                <div className="flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary">
                  <span className="text-xl sm:text-2xl">{getRankIcon(index)}</span>
                  <span className="text-xs font-bold mt-1">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{blog.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {blog.author?.fullname || 'Unknown'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {format(new Date(blog.createdAt), 'HH:mm')}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Badge variant="secondary" className="flex items-center text-xs">
                      <Eye className="mr-1 h-3 w-3" /> {blog.views || 0}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center text-xs">
                      <ThumbsUp className="mr-1 h-3 w-3" /> {blog.likes.length}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center text-xs">
                      <MessageSquare className="mr-1 h-3 w-3" /> {blog.comments.length}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center text-xs">
                      <TrendingUp className="mr-1 h-3 w-3" /> {getEngagementRate(blog).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewPost(blog._id)}>
                      <ExternalLink className="mr-2 h-4 w-4" /> View Post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditPost(blog._id)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeletePost(blog._id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center space-x-2 bg-secondary rounded-full px-3 py-1">
                  {getMetricIcon(metric)}
                  <span className="font-semibold text-base sm:text-lg">{getMetricValue(blog)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-secondary rounded-full h-2">
                <motion.div 
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(getMetricValue(blog) / maxValue) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleViewPost(blog._id)} className="w-full sm:w-auto">
                Read More <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

const TopAuthors = ({ blogs }) => {
  const navigate = useNavigate();
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const handleFilterChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    const filtered = blogs.filter((blog) => {
      const blogDate = new Date(blog.createdAt);
      if (month === 'all') {
        return blogDate.getFullYear().toString() === year;
      } else {
        const startDate = startOfMonth(new Date(year, parseInt(month)));
        const endDate = endOfMonth(new Date(year, parseInt(month)));
        return isWithinInterval(blogDate, { start: startDate, end: endDate });
      }
    });
    setFilteredBlogs(filtered);
  };

  const authorStats = useMemo(() => {
    return filteredBlogs.reduce((acc, blog) => {
      if (!blog.author) return acc;

      const authorId = blog.author._id;
      const authorName = blog.author.fullname || 'Unknown Author';
      const profilePhoto = blog.author.profile?.profilePhoto || '';

      if (!acc[authorId]) {
        acc[authorId] = { 
          name: authorName,
          posts: 0, 
          likes: 0, 
          comments: 0, 
          views: 0, 
          profilePhoto: profilePhoto
        };
      }
      acc[authorId].posts += 1;
      acc[authorId].likes += blog.likes?.length || 0;
      acc[authorId].comments += blog.comments?.length || 0;
      acc[authorId].views += blog.views || 0;
      return acc;
    }, {});
  }, [filteredBlogs]);

  const sortedAuthors = Object.entries(authorStats)
    .sort((a, b) => b[1].posts - a[1].posts)
    .slice(0, 5);

  const handleViewAuthorPosts = (authorId) => {
    navigate(`/admin/bloglist?author=${authorId}`);
  };

  return (
    <div>
      <DateFilter onFilterChange={handleFilterChange} />
      {sortedAuthors.length === 0 ? (
        <div className="text-center text-muted-foreground py-4">
          No author data available for the selected period.
          {selectedMonth !== 'all' && (
            <div className="mt-2">
              <Button variant="outline" onClick={() => handleFilterChange('all', selectedYear)} className="w-full sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" /> View All Months in {selectedYear}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAuthors.map(([authorId, stats], index) => (
            <motion.div 
              key={authorId}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`text-sm font-medium w-full sm:w-6 text-left sm:text-center ${
                index === 0 ? 'text-yellow-500' : 
                index === 1 ? 'text-gray-400' : 
                index === 2 ? 'text-orange-400' : 
                'text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <div className="flex-shrink-0">
                  {stats.profilePhoto ? (
                    <img 
                      src={stats.profilePhoto} 
                      alt={`${stats.name}'s avatar`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{stats.name}</p>
                  <p className="text-xs text-muted-foreground">{stats.posts} posts</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{stats.views}</span>
                </div>
                <div className="w-16 sm:w-24">
                  <div className="h-1 bg-muted rounded-full">
                    <motion.div 
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.posts / sortedAuthors[0][1].posts) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewAuthorPosts(authorId)}>
                      View all posts
                    </DropdownMenuItem>
                    {/* Add more dropdown items here if needed */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};