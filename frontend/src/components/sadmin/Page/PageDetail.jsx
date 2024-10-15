import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PAGE_API_ENDPOINT } from '../../../utils/constant';
import { toast } from 'sonner';

const PageDetail = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`${PAGE_API_ENDPOINT}/pages/${slug}`, { withCredentials: true });
        console.log(response.data.page);
        setPage(response.data.page);
      } catch (error) {
        console.error('Error fetching page:', error);
        toast.error('Failed to fetch page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!page) {
    return <div className="text-center py-10">Page not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4" style={{ background: page.color, fontSize: `${page.fontSize}px`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {page.title}
      </h1>
      {page.featuredImage && (
        <img src={page.featuredImage} alt={page.title} className="w-full h-64 object-cover mb-6 rounded-lg shadow-md" />
      )}
      <div  dangerouslySetInnerHTML={{ __html: page.content }} />
      <div className="mt-6 text-sm text-gray-500">
        Last modified: {new Date(page.lastModified).toLocaleString()}
      </div>
    </div>
  );
};

export default PageDetail;
