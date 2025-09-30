import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Cloud, Wind, Droplets, Sun, Moon, Zap, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import TiltedCard from '../components/react-bits/TiltedCard/TiltedCard.jsx';

function Home() {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (location.trim()) {
      navigate(`/weatherpage/${encodeURIComponent(location.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const features = [
    {
      icon: <Cloud className="w-12 h-12 text-blue-500" />,
      title: 'Real-Time Weather',
      description: 'Get up-to-the-minute weather updates powered by AI.',
    },
    {
      icon: <Wind className="w-12 h-12 text-indigo-500" />,
      title: 'Wind & Pressure Insights',
      description: 'Detailed analysis of wind patterns and atmospheric pressure.',
    },
    {
      icon: <Droplets className="w-12 h-12 text-cyan-500" />,
      title: 'Humidity & Precipitation',
      description: 'Accurate forecasts for rain, snow, and humidity levels.',
    },
    {
      icon: <Sun className="w-12 h-12 text-yellow-500" />,
      title: 'Sunrise & Sunset',
      description: 'Know exactly when the day begins and ends.',
    },
    {
      icon: <Moon className="w-12 h-12 text-purple-500" />,
      title: 'Weather Forecasting',
      description: 'Advanced weather predictions and forecasting capabilities.',
    },
    {
      icon: <Zap className="w-12 h-12 text-orange-500" />,
      title: 'AI-Powered Insights & Forecasts',
      description: 'Better insights and forecasts for severe weather events.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md py-4 px-8 rounded-full shadow-lg mx-auto w-full max-w-4xl mt-5 mb-6 border border-amber-200/50">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-amber-800">WeatherAi</Link>
          <div className="flex space-x-6">
            <a href="#features" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">Features</a>
            <Link to="/about" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">About</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col justify-center items-center text-center mt-6 py-28 px-4">
        <h1 className="text-5xl font-extrabold text-amber-900 mb-4 animate-fade-in">
          Discover the Future of Weather Forecasting
        </h1>
        <p className="text-xl text-amber-800 mb-8 max-w-2xl">
          WeatherAi uses cutting-edge AI to provide precise, real-time weather insights for any location worldwide.
        </p>
        <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg p-2 w-full max-w-md border border-amber-300/50">
          <input
            type="text"
            placeholder="Enter location (e.g., New Delhi)"
            className="flex-grow px-4 py-2 outline-none bg-transparent text-amber-900 placeholder-amber-600"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button 
            onClick={handleSearch}
            className="bg-amber-600 text-white p-3 rounded-full hover:bg-amber-700 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white/20 py-16 px-6">
        <h2 className="text-5xl font-bold text-center text-amber-900 mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex justify-center">
              <TiltedCard
                imageSrc=""
                altText=""
                captionText=""
                containerHeight="220px"
                containerWidth="100%"
                imageHeight="200px"
                imageWidth="100%"
                scaleOnHover={1.06}
                rotateAmplitude={10}
                showMobileWarning={false}
                showTooltip={false}
                overlayContent={
                  <div className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md p-6 rounded-xl h-full w-full flex flex-col justify-center items-center text-center border border-amber-300/50">
                    <div className="flex justify-center mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">{feature.title}</h3>
                    <p className="text-amber-800">{feature.description}</p>
                  </div>
                }
                displayOverlayContent={true}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row gap-12 mb-12">
            {/* Company Info - Takes left side */}
            <div className="lg:w-1/3 space-y-6">
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-bold text-amber-900">WeatherAi</h3>
              </div>
              <p className="text-amber-800 leading-relaxed text-lg max-w-md">
                Revolutionizing weather forecasting with cutting-edge AI technology. 
                Get accurate, real-time weather insights for any location worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/cyphering101Raman" className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://x.com/Raman__Gupta" className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/raman--gupta/" className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/me.ramangupta/" className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Right Side - Contains Quick Links, Support, and Contact */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-amber-900">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-amber-700 hover:text-amber-900 transition-colors duration-300 flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Home
                    </Link>
                  </li>
                  <li>
                    <a href="#features" className="text-amber-700 hover:text-amber-900 transition-colors duration-300 flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Features
                    </a>
                  </li>
                  <li>
                    <Link to="#" className="text-amber-700 hover:text-amber-900 transition-colors duration-300 flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-amber-900">Support</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="#" className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                      API Documentation
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-amber-900">Get in Touch</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-amber-700">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <span className="text-sm">support@weatherai.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-amber-700">
                    <Phone className="w-5 h-5 text-amber-600" />
                    <span className="text-sm">+91 92890-41XXX</span>
                  </div>
                  <div className="flex items-start space-x-3 text-amber-700">
                    <MapPin className="w-5 h-5 text-amber-600 mt-1" />
                    <span className="text-sm">New Delhi<br />India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="border-t border-amber-300 pt-8 mb-8">
            <div className="max-w-md mx-auto text-center">
              <h4 className="text-lg font-semibold text-amber-900 mb-4">Stay Updated</h4>
              <p className="text-amber-700 mb-4">Subscribe to our newsletter for weather insights and updates.</p>
              <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 outline-none text-gray-800"
                />
                <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-amber-300 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-amber-600 text-sm">
                &copy; 2025 WeatherAi. All rights reserved. | 
                <Link to="#" className="hover:text-amber-800 transition-colors duration-300 ml-1">Privacy Policy</Link> | 
                <Link to="#" className="hover:text-amber-800 transition-colors duration-300 ml-1">Terms of Service</Link>
              </div>
              <div className="flex items-center space-x-2 text-amber-600 text-sm">
                <span>Made with</span>
                <span className="text-red-400">❤️</span>
                <span>for weather enthusiasts</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;