import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiYoutube, 
  FiTwitter, 
  FiFacebook, 
  FiInstagram, 
  FiGithub,
  FiHelpCircle,
  FiMail,
  FiGlobe,
  FiCode
} from 'react-icons/fi';
import { BsYoutube } from 'react-icons/bs';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    About: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' },
    ],
    Support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Community Guidelines', path: '/guidelines' },
      { name: 'Safety Center', path: '/safety' },
      { name: 'Contact Us', path: '/contact' },
    ],
    Legal: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Copyright', path: '/copyright' },
    ],
    Developers: [
      { name: 'API', path: '/api' },
      { name: 'Documentation', path: '/docs' },
      { name: 'GitHub', path: 'https://github.com' },
      { name: 'Status', path: '/status' },
    ]
  };

  const socialLinks = [
    { icon: <FiYoutube />, name: 'YouTube', url: 'https://youtube.com' },
    { icon: <FiTwitter />, name: 'Twitter', url: 'https://twitter.com' },
    { icon: <FiFacebook />, name: 'Facebook', url: 'https://facebook.com' },
    { icon: <FiInstagram />, name: 'Instagram', url: 'https://instagram.com' },
    { icon: <FiGithub />, name: 'GitHub', url: 'https://github.com' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <BsYoutube className="text-3xl text-red-600" />
              <span className="text-2xl font-bold">MyTube</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              MyTube is a video sharing platform where you can watch, share, and discover amazing videos from creators around the world.
            </p>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2 mb-6">
              <FiGlobe className="text-gray-400" />
              <select className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 text-sm">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">
              &copy; {currentYear} MyTube. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Made with <FiCode className="inline text-red-500" /> by the MyTube team
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to="/help"
              className="flex items-center space-x-2 text-gray-400 hover:text-white"
            >
              <FiHelpCircle />
              <span>Help</span>
            </Link>
            
            <Link
              to="/contact"
              className="flex items-center space-x-2 text-gray-400 hover:text-white"
            >
              <FiMail />
              <span>Contact</span>
            </Link>
            
            <Link
              to="/feedback"
              className="text-gray-400 hover:text-white"
            >
              Send Feedback
            </Link>
            
            <a
              href="#top"
              className="text-gray-400 hover:text-white"
            >
              Back to top ↑
            </a>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-500">
            <div className="mb-4 md:mb-0">
              <p>MyTube is a demonstration project for educational purposes.</p>
              <p className="mt-1">Not affiliated with YouTube or Google.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile App Banner */}
      <div className="bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2">Get the MyTube app</h3>
              <p className="text-gray-400 text-sm">Watch on your phone, tablet, or computer.</p>
            </div>
            
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                iOS App
              </button>
              <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Android App
              </button>
              <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Desktop App
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;