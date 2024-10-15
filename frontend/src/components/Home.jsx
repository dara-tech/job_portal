import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "./HeroSection";
import LastestJobs from "./LastestJobs";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PAGE_API_ENDPOINT } from "@/utils/constant";

const Home = () => {
  useGetAllJobs();
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        const response = await axios.get(`${PAGE_API_ENDPOINT}/pages/home`, { withCredentials: true });
        setPageContent(response.data.page);
      } catch (error) {
        console.error('Error fetching home page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePage();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      {pageContent && (
        <div className="container mx-auto py-10 text-center">
          <h1 className="font-bold mb-4 text-center" style={{ background: pageContent.color, fontSize: `${pageContent.fontSize}px`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {pageContent.title}
          </h1>
          {pageContent.featuredImage && (
            <img src={pageContent.featuredImage} alt={pageContent.title} className="w-full h-64 object-cover mb-6" />
          )}
          <div className="font-light text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageContent.content }} />
        </div>
      )}
      <HeroSection />
      <LastestJobs />
    </div>
  );
};

export default Home;
