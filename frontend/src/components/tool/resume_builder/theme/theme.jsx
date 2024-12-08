import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone, GraduationCap, Briefcase, Award, Globe, Star, Code, Book, Zap, Target, Coffee, Layers, Feather } from 'lucide-react';


// Classic Layout
const ClassicLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-white overflow-hidden rounded-none border-none">
    <CardHeader>
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p dangerouslySetInnerHTML={{ __html: resume.summary }}></p>
      </section>
      <section className="mb-4">
  <h2 className="text-xl font-semibold mb-2">Experience</h2>
  {resume.experience.map((exp, index) => (
    <div key={index} className="mb-2">
      <h3
        className="font-semibold"
        dangerouslySetInnerHTML={{ __html: exp.company || "No company provided" }}
      ></h3>
      <p
        dangerouslySetInnerHTML={{
          __html: `${exp.position || "No position provided"} | ${
            exp.startDate ? new Date(exp.startDate).getFullYear() : "N/A"
          } - ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`,
        }}
      ></p>
      <ul>
        {Array.isArray(exp.responsibilities) &&
          exp.responsibilities.map((resp, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: resp }}></li>
          ))}
      </ul>
    </div>
  ))}
</section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <h3 className="font-semibold">{edu.institution}</h3>
            <p>{edu.degree} in {edu.fieldOfStudy}, {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
          </div>
        ))}
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <ul className="list-disc list-inside">
          {resume.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Projects</h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-2">
            <h3 className="font-semibold">{project.name}</h3>
            <p dangerouslySetInnerHTML={{ __html: project.description }}></p>
            <p>Technologies: {project.technologies.join(', ')}</p>
          </div>
        ))}
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Certifications</h2>
        {resume.certifications.map((cert, index) => (
          <div key={index} className="mb-2">
            <h3 className="font-semibold">{cert.name}</h3>
            <p>Issuer: {cert.issuer}, Date: {new Date(cert.date).toLocaleDateString()}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Languages</h2>
        {resume.languages.map((lang, index) => (
          <div key={index} className="mb-2">
            <p>{lang.language}: {lang.proficiency}</p>
          </div>
        ))}
      </section>
    </CardContent>
  </Card>
);

// Modern Layout
const ModernLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-white shadow-lg rounded-none overflow-hidden border-none">
    <CardHeader className="bg-blue-600 text-white">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="grid grid-cols-3 gap-4 mt-4">
      <div className="col-span-2">
      <section className="mb-4">
  <h2 className="text-xl font-semibold mb-2 text-blue-600">Experience</h2>
  {resume.experience.map((exp, index) => (
    <div key={index} className="mb-2">
      <h3
        className="font-semibold"
        dangerouslySetInnerHTML={{ __html: exp.company || "No company provided" }}
      ></h3>
      <p
        dangerouslySetInnerHTML={{
          __html: `${exp.position || "No position provided"} | ${
            exp.startDate ? new Date(exp.startDate).getFullYear() : "N/A"
          } - ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`,
        }}
      ></p>
      <ul>
        {Array.isArray(exp.responsibilities) &&
          exp.responsibilities.map((resp, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: resp }}></li>
          ))}
      </ul>
    </div>
  ))}
</section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">Projects</h2>
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold">{project.name}</h3>
              <p dangerouslySetInnerHTML={{ __html: project.description }}></p>
              <p className="text-sm text-gray-600">Technologies: {project.technologies.join(', ')}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-600">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold">{edu.institution}</h3>
              <p className="text-sm text-gray-600">{edu.degree} in {edu.fieldOfStudy}, {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
      </div>
      <div>
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">Summary</h2>
          <p dangerouslySetInnerHTML={{ __html: resume.summary }}></p>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">Skills</h2>
          <ul className="list-disc list-inside">
            {resume.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">Certifications</h2>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold">{cert.name}</h3>
              <p className="text-sm text-gray-600">Issuer: {cert.issuer}, Date: {new Date(cert.date).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-600">Languages</h2>
          {resume.languages.map((lang, index) => (
            <div key={index} className="mb-2">
              <p>{lang.language}: {lang.proficiency}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// Minimalist Layout
const MinimalistLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto border-none bg-white shadow-lg rounded-none overflow-hidden">
    <CardContent className="py-8">
      <h1 className="text-3xl font-light mb-2">{resume.personalInfo.name}</h1>
      <p className="text-sm text-gray-600 mb-4">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
      <section className="mb-6">
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: resume.summary }}></p>
      </section>
      <section className="mb-4">
  <h2 className="text-xl font-semibold mb-2">Experience</h2>
  {resume.experience.map((exp, index) => (
    <div key={index} className="mb-2">
      <h3
        className="font-semibold"
        dangerouslySetInnerHTML={{ __html: exp.company || "No company provided" }}
      ></h3>
      <p
        dangerouslySetInnerHTML={{
          __html: `${exp.position || "No position provided"} | ${
            exp.startDate ? new Date(exp.startDate).getFullYear() : "N/A"
          } - ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`,
        }}
      ></p>
      <ul>
        {Array.isArray(exp.responsibilities) &&
          exp.responsibilities.map((resp, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: resp }}></li>
          ))}
      </ul>
    </div>
  ))}
</section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <h3 className="font-medium">{edu.institution}</h3>
            <p className="text-sm text-gray-600">{edu.degree} in {edu.fieldOfStudy}, {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
          </div>
        ))}
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Skills</h2>
        <p className="text-sm">{resume.skills.join(', ')}</p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Projects</h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-2">
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-sm" dangerouslySetInnerHTML={{ __html: project.description }}></p>
            <p className="text-sm text-gray-600">Technologies: {project.technologies.join(', ')}</p>
          </div>
        ))}
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Certifications</h2>
        {resume.certifications.map((cert, index) => (
          <div key={index} className="mb-2">
            <h3 className="font-medium">{cert.name}</h3>
            <p className="text-sm text-gray-600">Issuer: {cert.issuer}, Date: {new Date(cert.date).toLocaleDateString()}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Languages</h2>
        {resume.languages.map((lang, index) => (
          <p key={index} className="text-sm">{lang.language}: {lang.proficiency}</p>
        ))}
      </section>
    </CardContent>
  </Card>
);

// Creative Layout
const CreativeLayout = ({ resume }) => (
  <Card className=" max-w-4xl mx-auto border-none bg-white shadow-lg rounded-none overflow-hidden">
    <CardHeader className="text-center py-8">
      <CardTitle className="text-5xl font-extrabold mb-2">{resume.personalInfo.name}</CardTitle>
      <p className="text-lg mt-2 opacity-80">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 p-8">
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-white pb-2">Summary</h2>
          <p className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: resume.summary }}></p>
        </section>
        <section>
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-white pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span key={index} className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">{skill}</span>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-white pb-2">Languages</h2>
          <div className="grid grid-cols-2 gap-2">
            {resume.languages.map((lang, index) => (
              <p key={index} className="text-base">{lang.language}: <span className="font-semibold">{lang.proficiency}</span></p>
            ))}
          </div>
        </section>
      </div>
      <div className="space-y-8">
      <section className="mb-4">
  <h2 className="text-xl font-semibold mb-2">Experience</h2>
  {resume.experience.map((exp, index) => (
    <div key={index} className="mb-2">
      <h3
        className="font-semibold"
        dangerouslySetInnerHTML={{ __html: exp.company || "No company provided" }}
      ></h3>
      <p
        dangerouslySetInnerHTML={{
          __html: `${exp.position || "No position provided"} | ${
            exp.startDate ? new Date(exp.startDate).getFullYear() : "N/A"
          } - ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`,
        }}
      ></p>
      <ul>
        {Array.isArray(exp.responsibilities) &&
          exp.responsibilities.map((resp, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: resp }}></li>
          ))}
      </ul>
    </div>
  ))}
</section>
        <section>
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-white pb-2">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-bold">{edu.institution}</h3>
              <p className="text-lg">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-sm">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-white pb-2">Projects</h2>
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-bold">{project.name}</h3>
              <p className="text-base mb-2" dangerouslySetInnerHTML={{ __html: project.description }}></p>
              <p className="text-sm font-semibold">Technologies: {project.technologies.join(', ')}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-white pb-2">Certifications</h2>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-lg font-bold">{cert.name}</h3>
              <p className="text-sm">Issuer: {cert.issuer}</p>
              <p className="text-sm">Date: {new Date(cert.date).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// Professional Layout
const ProfessionalLayout = ({ resume }) => (
  <Card className=" max-w-4xl mx-auto border-none bg-white shadow-lg rounded-none overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
      <CardTitle className="text-4xl font-bold text-blue-700">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm text-gray-600 mt-2 flex items-center space-x-2">
        <Mail className="w-4 h-4" /> <span>{resume.personalInfo.email}</span>
        <Phone className="w-4 h-4 ml-2" /> <span>{resume.personalInfo.phone}</span>
        <MapPin className="w-4 h-4 ml-2" /> <span>{resume.personalInfo.address}</span>
      </p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-blue-700 border-b-2 border-blue-200 pb-2">Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: resume.summary }}></p>
      </section>
      <section className="mb-4">
  <h2 className="text-xl font-semibold mb-2">Experience</h2>
  {resume.experience.map((exp, index) => (
    <div key={index} className="mb-2">
      <h3
        className="font-semibold"
        dangerouslySetInnerHTML={{ __html: exp.company || "No company provided" }}
      ></h3>
      <p
        dangerouslySetInnerHTML={{
          __html: `${exp.position || "No position provided"} | ${
            exp.startDate ? new Date(exp.startDate).getFullYear() : "N/A"
          } - ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`,
        }}
      ></p>
      <ul>
        {Array.isArray(exp.responsibilities) &&
          exp.responsibilities.map((resp, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: resp }}></li>
          ))}
      </ul>
    </div>
  ))}
</section>
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700 border-b-2 border-blue-200 pb-2">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{edu.degree} in {edu.fieldOfStudy}</h3>
              <p className="text-sm text-blue-600">{edu.institution}, {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700 border-b-2 border-blue-200 pb-2">Key Skills</h2>
          <ul className="list-none grid grid-cols-2 gap-2">
            {resume.skills.map((skill, index) => (
              <li key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{skill}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3 text-blue-700 border-b-2 border-blue-200 pb-2">Projects</h2>
        <div className="grid grid-cols-2 gap-6">
          {resume.projects.map((project, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: project.description }}></p>
              <p className="text-sm text-blue-600">Technologies: {project.technologies.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-2 gap-8 mt-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700 border-b-2 border-blue-200 pb-2">Certifications</h2>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-semibold text-gray-800">{cert.name}</h3>
              <p className="text-sm text-blue-600">Issuer: {cert.issuer}</p>
              <p className="text-sm text-gray-600">Date: {new Date(cert.date).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700 border-b-2 border-blue-200 pb-2">Languages</h2>
          {resume.languages.map((lang, index) => (
            <p key={index} className="mb-2">
              <span className="font-semibold text-gray-800">{lang.language}:</span> 
              <span className="text-blue-600 ml-2">{lang.proficiency}</span>
            </p>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// Compact Layout
const CompactLayout = ({ resume }) => (
  <Card className=" max-w-4xl mx-auto border-none bg-white shadow-lg rounded-none overflow-hidden">
    <CardHeader className="py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="mt-2 flex items-center space-x-2">
        <span>{resume.personalInfo.email}</span>
        <span>•</span>
        <span>{resume.personalInfo.phone}</span>
        <span>•</span>
        <span>{resume.personalInfo.address}</span>
      </p>
    </CardHeader>
    <CardContent className="space-y-4 p-6">
      <section>
        <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-2">Summary</h2>
        <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: resume.summary }}></p>
      </section>
      <section className="mb-4">
  <h2 className="text-xl font-semibold mb-2">Experience</h2>
  {resume.experience.map((exp, index) => (
    <div key={index} className="mb-2">
      <h3
        className="font-semibold"
        dangerouslySetInnerHTML={{ __html: exp.company || "No company provided" }}
      ></h3>
      <p
        dangerouslySetInnerHTML={{
          __html: `${exp.position || "No position provided"} | ${
            exp.startDate ? new Date(exp.startDate).getFullYear() : "N/A"
          } - ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`,
        }}
      ></p>
      <ul>
        {Array.isArray(exp.responsibilities) &&
          exp.responsibilities.map((resp, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: resp }}></li>
          ))}
      </ul>
    </div>
  ))}
</section>
      <section>
        <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-2">Education</h2>
        {resume.education.map((edu, index) => (
          <p key={index} className="mb-1">
            <span className="font-medium text-gray-800">{edu.institution}</span> - {edu.degree} in {edu.fieldOfStudy}
            <span className="text-sm text-gray-600 ml-2">({new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()})</span>
          </p>
        ))}
      </section>
      <section>
        <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{skill}</span>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-2">Projects</h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-2">
            <p className="font-medium text-gray-800">{project.name}</p>
            <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.description }}></p>
            <p className="text-xs text-blue-600 mt-1">Technologies: {project.technologies.join(', ')}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-2">Certifications</h2>
        {resume.certifications.map((cert, index) => (
          <p key={index} className="mb-1">
            <span className="font-medium text-gray-800">{cert.name}</span> - {cert.issuer}
            <span className="text-sm text-gray-600 ml-2">({new Date(cert.date).toLocaleDateString()})</span>
          </p>
        ))}
      </section>
      <section>
        <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-2">Languages</h2>
        <div className="flex flex-wrap gap-4">
          {resume.languages.map((lang, index) => (
            <p key={index} className="text-sm">
              <span className="font-medium text-gray-800">{lang.language}:</span>
              <span className="text-blue-600 ml-1">{lang.proficiency}</span>
            </p>
          ))}
        </div>
      </section>
    </CardContent>
  </Card>
);

// Timeline Layout
const TimelineLayout = ({ resume }) => (
  <Card className=" max-w-4xl mx-auto border-none bg-white shadow-lg rounded-none overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2 flex items-center space-x-4">
        <span><Mail className="inline-block w-4 h-4 mr-1" />{resume.personalInfo.email}</span>
        <span><Phone className="inline-block w-4 h-4 mr-1" />{resume.personalInfo.phone}</span>
        <span><MapPin className="inline-block w-4 h-4 mr-1" />{resume.personalInfo.address}</span>
      </p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Professional Summary</h2>
        <p className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: resume.summary }}></p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Experience & Education Timeline</h2>
        <div className="relative border-l-2 border-blue-300 pl-7 space-y-8">
          {[...resume.experience, ...resume.education, ...resume.certifications]
            .sort((a, b) => new Date(b.endDate || b.date) - new Date(a.startDate || a.date))
            .map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-10 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  {'company' in item ? <Briefcase className="w-3 h-3 text-white" /> :
                   'institution' in item ? <GraduationCap className="w-3 h-3 text-white" /> :
                   <Award className="w-3 h-3 text-white" />}
                </div>
                {'company' in item ? (
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg text-gray-800">{item.company}</h3>
                    <p className="text-sm text-blue-600 mb-2">{item.position} | {new Date(item.startDate).getFullYear()} - {new Date(item.endDate).getFullYear()}</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {item.responsibilities.map((resp, idx) => (
                        <li key={idx} className="mb-1">{resp}</li>
                      ))}
                    </ul>
                  </div>
                ) : 'institution' in item ? (
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg text-gray-800">{item.institution}</h3>
                    <p className="text-sm text-blue-600">{item.degree} in {item.fieldOfStudy}</p>
                    <p className="text-sm text-gray-600">{new Date(item.startDate).getFullYear()} - {new Date(item.endDate).getFullYear()}</p>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-sm text-blue-600">Certification from {item.issuer}</p>
                    <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resume.projects.map((project, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <p className="text-sm text-blue-600">Technologies: {project.technologies.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{skill}</span>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Languages</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {resume.languages.map((lang, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-md">
              <p className="font-medium text-gray-800">{lang.language}</p>
              <p className="text-sm text-blue-600">{lang.proficiency}</p>
            </div>
          ))}
        </div>
      </section>
    </CardContent>
  </Card>
);

// Two-Column Layout
const TwoColumnLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto border-none shadow-lg rounded-none">
    <CardContent className="grid grid-cols-3 gap-6 p-8">
      <div className="col-span-1 bg-gray-50 p-6 rounded-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{resume.personalInfo.name}</h1>
          <p className="text-sm text-gray-600">{resume.personalInfo.email}</p>
          <p className="text-sm text-gray-600">{resume.personalInfo.phone}</p>
          <p className="text-sm text-gray-600">{resume.personalInfo.address}</p>
        </div>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Skills</h2>
          <ul className="list-none">
            {resume.skills.map((skill, index) => (
              <li key={index} className="text-blue-800 px-3 py-1 text-sm">{skill}</li>
            ))}
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <p className="font-medium text-gray-800">{edu.institution}</p>
              <p className="text-sm text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-sm text-gray-500">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Certifications</h2>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-3">
              <p className="font-medium text-gray-800">{cert.name}</p>
              <p className="text-sm text-gray-600">{cert.issuer}</p>
              <p className="text-sm text-gray-500">{new Date(cert.date).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Languages</h2>
          {resume.languages.map((lang, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span className="text-gray-800">{lang.language}</span>
              <span className="text-gray-600">{lang.proficiency}</span>
            </div>
          ))}
        </section>
      </div>
      <div className="col-span-2 p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Work Experience</h2>
          {resume.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
              <p className="text-gray-600 mb-2">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
              <ul className="list-disc list-inside text-gray-700">
                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                  exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp}</li>
                  ))
                ) : (
                  <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                )}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resume.projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg ">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                <p className="text-gray-700 mb-2">{project.description}</p>
                <p className="text-sm text-blue-600">Technologies: {project.technologies.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CardContent>
  </Card>
);
const ExecutiveLayout = ({ resume }) => (
  <Card className=" max-w-4xl mx-auto border-none bg-white shadow-lg rounded-none overflow-hidden">
    <CardHeader className="bg-gray-800 text-white">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Executive Summary</h2>
        <p className="text-gray-700">{resume.summary}</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Professional Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-gray-800">{exp.position}</h3>
            <p className="text-sm text-gray-600">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
            <ul className="text-gray-700">
            {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                  exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp}</li>
                  ))
                ) : (
                  <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                )}
            </ul>
          </div>
        ))}
      </section>
      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
              <p className="text-sm text-gray-600">{edu.degree} in {edu.fieldOfStudy}, {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Core Competencies</h2>
          <ul className="list-disc list-inside text-gray-700">
            {resume.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resume.projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg ">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                <p className="text-gray-700 mb-2">{project.description}</p>
                <p className="text-sm text-blue-600">Technologies: {project.technologies.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Certifications</h2>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold">{cert.name}</h3>
              <p className="text-sm text-gray-600">Issuer: {cert.issuer}, Date: {new Date(cert.date).toLocaleDateString()}</p>
            </div>
          ))}<h2 className="text-2xl font-semibold mb-4 text-gray-800">Languages</h2>
          {resume.languages.map((lang, index) => (
            <div key={index} className="mb-2">
              <p>{lang.language}: {lang.proficiency}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// ... (Previous layouts remain unchanged)

// New Layout: Infographic
const InfographicLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden rounded-none border-none p-8">
    <CardHeader className="text-center">
      <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">{resume.personalInfo.name}</CardTitle>
      <p className="text-lg mt-2 text-gray-600">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="grid grid-cols-3 gap-8 mt-8">
      <div className="col-span-1 space-y-6">
        <section className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 flex items-center"><Star className="w-5 h-5 mr-2" /> Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-purple-600 flex items-center"><GraduationCap className="w-5 h-5 mr-2" /> Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-medium text-gray-800">{edu.institution}</h3>
              <p className="text-sm text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-xs text-gray-500">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
      </div>
      <div className="col-span-2 space-y-6">
        <section className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-green-600 flex items-center"><Briefcase className="w-5 h-5 mr-2" /> Experience</h2>
          {resume.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium text-gray-800">{exp.position}</h3>
              <p className="text-sm text-gray-600">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
              {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                  exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp}</li>
                  ))
                ) : (
                  <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                )}
              </ul>
            </div>
          ))}
        </section>
        <section className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-orange-600 flex items-center"><Code className="w-5 h-5 mr-2" /> Projects</h2>
          <div className="grid grid-cols-2 gap-4">
            {resume.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded p-3">
                <h3 className="font-medium text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <p className="text-xs text-blue-600 mt-2">Tech: {project.technologies.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CardContent>
  </Card>
);

// New Layout: Skill-Focused
const SkillFocusedLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-white shadow-lg rounded-none overflow-hidden border-none">
    <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Profile</h2>
        <p className="text-gray-700">{resume.summary}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Core Competencies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {resume.skills.map((skill, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-3 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-gray-800">{skill}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
            <p className="text-gray-600 mb-2">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
            <ul className="list-disc list-inside text-gray-700">
            {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                  exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp}</li>
                  ))
                ) : (
                  <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                )}
            </ul>
          </div>
        ))}
      </section>
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
              <p className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-sm text-gray-500">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Certifications</h2>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              <p className="text-sm text-gray-500">{new Date(cert.date).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// New Layout: Project-Centric
const ProjectCentricLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-gray-100 shadow-lg rounded-none overflow-hidden border-none">
    <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Summary</h2>
        <p className="text-gray-700">{resume.summary}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resume.projects.map((project, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold text-purple-600 mb-2">{project.name}</h3>
              <p className="text-gray-700 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-6 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
            <p className="text-gray-600 mb-2">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
            <ul className="list-disc list-inside text-gray-700">
            {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                  exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp}</li>
                  ))
                ) : (
                  <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                )}
            </ul>
          </div>
        ))}
      </section>
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
              <p className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-sm text-gray-500">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// New Layout: Achievements-Focused
const AchievementsFocusedLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-white shadow-lg rounded-none overflow-hidden border-none">
    <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Career Highlights</h2>
        <ul className="list-none space-y-4">
          {resume.experience.flatMap(exp => exp.responsibilities).slice(0, 5).map((achievement, index) => (
            <li key={index} className="flex items-start">
              <Award className="w-6 h-6 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
              <span className="text-gray-700">{achievement}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
            <p className="text-gray-600 mb-2">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
            <ul className="list-disc list-inside text-gray-700">
            {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                  exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp}</li>
                  ))
                ) : (
                  <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                )}
            </ul>
          </div>
        ))}
      </section>
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills & Expertise</h2>
          <div className="grid grid-cols-2 gap-2">
            {resume.skills.map((skill, index) => (
              <div key={index} className="flex items-center bg-yellow-100 rounded-lg p-2">
                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Education & Certifications</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
              <p className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-sm text-gray-500">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold text-gray-800">{cert.name}</h3>
              <p className="text-sm text-gray-600">{cert.issuer} | {new Date(cert.date).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// New Layout: Tech Stack
const TechStackLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-gray-100 shadow-lg rounded-none overflow-hidden border-none">
    <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {resume.skills.map((skill, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 flex items-center">
              <Code className="w-6 h-6 text-cyan-500 mr-2" />
              <span className="text-gray-800">{skill}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Project Showcase</h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-6 bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold text-cyan-600">{project.name}</h3>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-sm">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Work Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
            <p className="text-gray-600 mb-2">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
            <ul className="list-disc list-inside text-gray-700">
            {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                  exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp}</li>
                  ))
                ) : (
                  <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                )}
            </ul>
          </div>
        ))}
      </section>
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
              <p className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-sm text-gray-500">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Certifications</h2>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              <p className="text-sm text-gray-500">{new Date(cert.date).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// New Layout: Minimalist Plus
const MinimalistPlusLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-white shadow-sm rounded-none overflow-hidden border-none">
    <CardContent className="p-8">
      <h1 className="text-4xl font-light mb-2 text-gray-800">{resume.personalInfo.name}</h1>
      <p className="text-sm text-gray-600 mb-6">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4 text-gray-800 border-b border-gray-200 pb-2">Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-medium text-gray-800">{exp.position}</h3>
            <p className="text-gray-600 mb-2">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
            <ul className="list-disc list-inside text-gray-700">
            {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                  exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp}</li>
                  ))
                ) : (
                  <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                )}
            </ul>
          </div>
        ))}
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4 text-gray-800 border-b border-gray-200 pb-2">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-medium text-gray-800">{edu.institution}</h3>
            <p className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
            <p className="text-sm text-gray-500">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
          </div>
        ))}
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4 text-gray-800 border-b border-gray-200 pb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{skill}</span>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-light mb-4 text-gray-800 border-b border-gray-200 pb-2">Projects</h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <p className="text-sm text-gray-600">Technologies: {project.technologies.join(', ')}</p>
          </div>
        ))}
      </section>
    </CardContent>
  </Card>
);

// New Layout: Modern Timeline
const ModernTimelineLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-gray-50 shadow-lg rounded-none overflow-hidden border-none">
    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Summary</h2>
        <p className="text-gray-700">{resume.summary}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Career Timeline</h2>
        <div className="relative border-l-2 border-purple-300 pl-7 ml-4">
          {[...resume.experience, ...resume.education, ...resume.certifications]
            .sort((a, b) => new Date(b.endDate || b.date) - new Date(a.startDate || a.date))
            .map((item, index) => (
              <div key={index} className="mb-8 relative">
                <div className="absolute -left-10 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  {'company' in item ? <Briefcase className="w-3 h-3 text-white" /> :
                   'institution' in item ? <GraduationCap className="w-3 h-3 text-white" /> :
                   <Award className="w-3 h-3 text-white" />}
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  {'company' in item ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800">{item.position}</h3>
                      <p className="text-purple-600">{item.company}</p>
                      <p className="text-sm text-gray-600">{new Date(item.startDate).getFullYear()} - {new Date(item.endDate).getFullYear()}</p>
                      <ul className="list-disc list-inside text-gray-700 mt-2">
                        {Array.isArray(item.responsibilities) && item.responsibilities.length > 0 ? (
                          item.responsibilities.map((resp, idx) => (
                            <li key={idx} className="mb-1">{resp}</li>
                          ))
                        ) : (
                          <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                        )}
                      </ul>
                    </>
                  ) : 'institution' in item ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800">{item.degree} in {item.fieldOfStudy}</h3>
                      <p className="text-purple-600">{item.institution}</p>
                      <p className="text-sm text-gray-600">{new Date(item.startDate).getFullYear()} - {new Date(item.endDate).getFullYear()}</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-purple-600">{item.issuer}</p>
                      <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills & Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{skill}</span>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resume.projects.map((project, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <p className="text-sm text-purple-600">Technologies: {project.technologies.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>
    </CardContent>
  </Card>
);

// New Layout: Skills Matrix
const SkillsMatrixLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-white shadow-lg rounded-none overflow-hidden border-none">
    <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Summary</h2>
        <p className="text-gray-700">{resume.summary}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills Matrix</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {resume.skills.map((skill, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800">{skill}</h3>
              <div className="mt-2 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Work Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
            <p className="text-gray-600 mb-2">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
            <ul className="list-disc list-inside text-gray-700">
              {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="mb-1">{resp}</li>
                ))
              ) : (
                <li className="mb-1 text-gray-500">No responsibilities listed.</li>
              )}
            </ul>
          </div>
        ))}
      </section>
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
              <p className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-sm text-gray-500">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Projects</h2>
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{project.name}</h3>
              <p className="text-gray-700 mb-1">{project.description}</p>
              <p className="text-sm text-green-600">Tech: {project.technologies.join(', ')}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// New Layout: Interactive Card
const InteractiveCardLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-white shadow-lg rounded-none overflow-hidden border-none">
    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Summary</h2>
        <p className="text-gray-700">{resume.summary}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Experience & Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resume.experience.map((exp, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
              <p className="text-gray-600 mb-2">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
              <ul className="list-disc list-inside text-gray-700">
                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                  exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp}</li>
                  ))
                ) : (
                  <li className="mb-1 text-gray-500">No responsibilities listed.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors duration-300 cursor-pointer">{skill}</span>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resume.projects.map((project, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <p className="text-sm text-blue-600">Technologies: {project.technologies.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4 hover:bg-gray-100 p-2 rounded transition-colors duration-300">
              <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
              <p className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-sm text-gray-500">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Certifications</h2>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-4 hover:bg-gray-100 p-2 rounded transition-colors duration-300">
              <h3 className="font-semibold text-gray-800">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              <p className="text-sm text-gray-500">{new Date(cert.date).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

// New Layout: Dark Mode
const DarkModeLayout = ({ resume }) => (
  <Card className="max-w-4xl mx-auto bg-gray-900 text-white shadow-lg rounded-none overflow-hidden border-none">
    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
      <CardTitle className="text-3xl font-bold">{resume.personalInfo.name}</CardTitle>
      <p className="text-sm mt-2 text-gray-300">{resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.address}</p>
    </CardHeader>
    <CardContent className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">Professional Summary</h2>
        <p className="text-gray-300">{resume.summary}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-400">{exp.position}</h3>
            <p className="text-gray-400 mb-2">{exp.company} | {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}</p>
            <ul className="list-disc list-inside text-gray-300">
              {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? (
                exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="mb-1">{resp}</li>
                ))
              ) : (
                <li className="mb-1 text-gray-500">No responsibilities listed.</li>
              )}
            </ul>
          </div>
        ))}
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-gray-800 text-blue-300 rounded-full text-sm">{skill}</span>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-blue-400">{edu.institution}</h3>
              <p className="text-gray-300">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-sm text-gray-400">{new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Projects</h2>
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-blue-400">{project.name}</h3>
              <p className="text-gray-300 mb-1">{project.description}</p>
              <p className="text-sm text-gray-400">Tech: {project.technologies.join(', ')}</p>
            </div>
          ))}
        </section>
      </div>
    </CardContent>
  </Card>
);

export const layouts = [
  { name: "Classic", component: ClassicLayout },
  { name: "Modern", component: ModernLayout },
  { name: "Minimalist", component: MinimalistLayout },
  { name: "Creative", component: CreativeLayout },
  { name: "Professional", component: ProfessionalLayout },
  { name: "Compact", component: CompactLayout },
  { name: "Timeline", component: TimelineLayout },
  { name: "Two-Column", component: TwoColumnLayout },
  { name: "Executive", component: ExecutiveLayout },
  { name: "Infographic", component: InfographicLayout },
  { name: "Skill-Focused", component: SkillFocusedLayout },
  { name: "Project-Centric", component: ProjectCentricLayout },
  { name: "Achievements-Focused", component: AchievementsFocusedLayout },
  { name: "Tech Stack", component: TechStackLayout },
  { name: "Minimalist Plus", component: MinimalistPlusLayout },
  { name: "Modern Timeline", component: ModernTimelineLayout },
  { name: "Skills Matrix", component: SkillsMatrixLayout },
  { name: "Interactive Card", component: InteractiveCardLayout },
  { name: "Dark Mode", component: DarkModeLayout },
];