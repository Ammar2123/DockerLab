import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Github, Linkedin, Instagram, Mail, Globe, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Import your auth context hook

const About = () => {
  const { darkMode } = useTheme();
  const { isAdmin } = useAuth(); // Get the admin status from auth context

  const developers = [
    {
      name: "Sanskruti Mhatre",
      role: "Docker Image Architect & App Developer",
      image: "https://github.com/SanskrutiMhatre.png", // Uses GitHub profile picture
      socials: [
        { type: "portfolio", url: "https://sanskrutimhatre.tech", icon: <Globe size={18} /> },
        { type: "github", url: "https://github.com/SanskrutiMhatre", icon: <Github size={18} /> },
        { type: "linkedin", url: "https://linkedin.com/in/SanskrutiMhatre", icon: <Linkedin size={18} /> },
        { type: "instagram", url: "https://www.instagram.com/sanskrutimhatre_", icon: <Instagram size={18} /> },
        { type: "email", url: "mailto:mhatresanskruti42@gmail.com", icon: <Mail size={18} /> },
      ],
    },
    {
      name: "Ammar Nagarji",
      role: "Docker Image Architect & App Developer",
      image: "https://github.com/ammar2123.png", // Uses GitHub profile picture
      socials: [
        { type: "portfolio", url: "https://www.nagarji.in/", icon: <Globe size={18} /> },
        { type: "github", url: "https://github.com/ammar2123", icon: <Github size={18} /> },
        { type: "linkedin", url: "https://linkedin.com/in/ammar-nagarji", icon: <Linkedin size={18} /> },
        { type: "instagram", url: "https://instagram.com/ammarnagarji_", icon: <Instagram size={18} /> },
        { type: "email", url: "mailto:ammar@nagarji.in", icon: <Mail size={18} /> },
      ],
    },
  ];

  // Add guides array with LinkedIn profile pictures
  const guides = [
    {
      name: "Dr. Kiran Deshpande",
      role: "Guide - HOD IT Department APSIT",
      image: "/HOD.jpeg", // LinkedIn profile picture
      socials: [
        { type: "linkedin", url: "https://www.linkedin.com/in/dr-kiran-deshpande-b2702045", icon: <Linkedin size={18} /> },
        { type: "instagram", url: "https://www.instagram.com/deshpande.82", icon: <Instagram size={18} /> },
        { type: "email", url: "mailto:Kbdeshpande@apsit.edu.in", icon: <Mail size={18} /> },
      ],
    },
    {
      name: "Ms. Charul Singh",
      role: "Co-Guide - Assistant Professor IT Department APSIT",
      image: "/mam.jpg", // LinkedIn profile picture
      socials: [
        { type: "linkedin", url: "https://www.linkedin.com/in/charul-singh-8a088b79", icon: <Linkedin size={18} /> },
        { type: "instagram", url: "https://www.instagram.com/charul_singh", icon: <Instagram size={18} /> },
        { type: "email", url: "mailto:crsingh@apsit.edu.in", icon: <Mail size={18} /> },
      ],
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-surface-900 text-surface-100' : 'bg-surface-50 text-surface-900'} transition-colors duration-200`}>
      <Navbar isAdmin={isAdmin} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link 
          to="/" 
          className={`inline-flex items-center mb-8 text-sm font-medium ${
            darkMode ? 'text-surface-300 hover:text-primary-400' : 'text-surface-600 hover:text-primary-600'
          }`}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>

        <h1 className={`text-3xl md:text-4xl font-bold mb-8 ${darkMode ? 'text-primary-400' : 'text-primary-700'}`}>
          About DockerLab
        </h1>

        <div className={`mb-12 p-6 rounded-xl ${darkMode ? 'bg-surface-800' : 'bg-white'} shadow-md`}>
          {/* Added project description */}
          <p className={`${darkMode ? 'text-surface-300' : 'text-surface-700'} mb-6 italic`}>
            DockerLab was developed as a final year Major project by our team named Moh-Maya during the academic year 2024–2025, under the guidance of Dr. Kiran Deshpande and Ms. Charul Singh.
          </p>

          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
            Our Mission
          </h2>
          <p className={`${darkMode ? 'text-surface-300' : 'text-surface-700'} mb-4`}>
            DockerLab was developed to simplify the Docker learning experience for students by providing a user-friendly interface to access and run containerized lab environments.
          </p>
          <p className={`${darkMode ? 'text-surface-300' : 'text-surface-700'} mb-4`}>
            We aim to bridge the gap between complex containerization technologies and educational environments, making it easier for both students and educators to focus on learning rather than infrastructure setup.
          </p>
          
          {/* Updated reference section */}
          <p className={`${darkMode ? 'text-surface-300' : 'text-surface-700'}`}>
            For more information refer to <a href="/B7_Black_Book.pdf" target="_blank" rel="noopener noreferrer" className={`font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}>Black-Book</a> and for more updates visit <a href="https://dockerhub.sanskrutimhatre.tech" target="_blank" rel="noopener noreferrer" className={`font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}>dockerhub.sanskrutimhatre.tech</a> or <a href="https://dockerhub.nagarji.in" target="_blank" rel="noopener noreferrer" className={`font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}>dockerhub.nagarji.in</a>.
          </p>
        </div>

        {/* Meet Our Team Section - Now FIRST */}
        <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {developers.map((dev, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-surface-800 border border-surface-700' : 'bg-white border border-surface-200'}`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={dev.image} 
                    alt={dev.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=" + dev.name.charAt(0);
                    }}
                  />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-primary-400' : 'text-primary-700'}`}>
                    {dev.name}
                  </h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-surface-300' : 'text-surface-600'}`}>
                    {dev.role}
                  </p>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    {dev.socials.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          darkMode 
                            ? 'bg-surface-700 hover:bg-surface-600 text-surface-300 hover:text-surface-100' 
                            : 'bg-surface-100 hover:bg-surface-200 text-surface-700 hover:text-surface-900'
                        }`}
                        title={social.type.charAt(0).toUpperCase() + social.type.slice(1)}
                      >
                        {social.icon}
                        <span>{social.type === "email" ? "Email" : social.type.charAt(0).toUpperCase() + social.type.slice(1)}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Meet Our Guides Section - Now SECOND */}
        <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
          Meet Our Guides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {guides.map((guide, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-surface-800 border border-surface-700' : 'bg-white border border-surface-200'}`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={guide.image} 
                    alt={guide.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-accent-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=" + guide.name.charAt(0);
                    }}
                  />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-accent-400' : 'text-accent-700'}`}>
                    {guide.name}
                  </h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-surface-300' : 'text-surface-600'}`}>
                    {guide.role}
                  </p>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    {guide.socials.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          darkMode 
                            ? 'bg-surface-700 hover:bg-surface-600 text-surface-300 hover:text-surface-100' 
                            : 'bg-surface-100 hover:bg-surface-200 text-surface-700 hover:text-surface-900'
                        }`}
                        title={social.type.charAt(0).toUpperCase() + social.type.slice(1)}
                      >
                        {social.icon}
                        <span>{social.type === "email" ? "Email" : social.type.charAt(0).toUpperCase() + social.type.slice(1)}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-6 ${darkMode ? 'bg-surface-900 text-surface-400' : 'bg-white text-surface-600'} border-t ${darkMode ? 'border-surface-800' : 'border-surface-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm mb-3 sm:mb-0">
  Developed at <a 
    href="https://www.apsit.edu.in/" 
    target="_blank" 
    rel="noopener noreferrer"
    className={`${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}
  >
    A.P. Shah Institute of Technology, Thane, India
  </a>
</p>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} DockerLab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;