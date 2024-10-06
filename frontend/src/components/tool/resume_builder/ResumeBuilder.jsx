import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Briefcase, Award, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const ResumeBuilder = () => {
  const navigate = useNavigate();

  const handleStartBuilding = () => {
    navigate('/resume/new');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-400 text-transparent bg-clip-text">Craft Your Perfect Resume</h1>
        <p className="text-xl mb-10 text-gray-600 dark:text-gray-300">Create a standout resume in minutes with our intuitive builder</p>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-teal-400 hover:from-blue-700 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          onClick={handleStartBuilding}
        >
          Start Building <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        <FeatureCard
          icon={<FileText className="h-14 w-14 mb-6 text-blue-500" />}
          title="Effortless Creation"
          description="Streamlined interface for quick and easy resume building"
        />
        <FeatureCard
          icon={<Briefcase className="h-14 w-14 mb-6 text-teal-500" />}
          title="Tailored Templates"
          description="Diverse designs to match your industry and style"
        />
        <FeatureCard
          icon={<Award className="h-14 w-14 mb-6 text-purple-500" />}
          title="ATS-Optimized"
          description="Engineered to pass Applicant Tracking Systems"
        />
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-10">
        <h2 className="text-4xl font-bold mb-6">Ready to Elevate Your Career?</h2>
        <p className="text-xl mb-10 text-gray-600 dark:text-gray-300">Transform your professional story into a compelling resume</p>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-teal-400 hover:from-blue-700 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          onClick={handleStartBuilding}
        >
          Create My Resume <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="text-center">
        <CardTitle className="flex flex-col items-center">
          {icon}
          <span className="mt-4 text-xl font-semibold">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 dark:text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}

export default ResumeBuilder