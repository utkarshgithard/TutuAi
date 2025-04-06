import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaRocket,
  FaLaptopCode,
  FaChartLine
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div id='about' className="container mx-auto flex flex-col md:flex-row md:divide-x divide-gray-700 gap-10 md:gap-0">
        
        {/* About Section */}
        <div className="md:w-1/3 px-4">
          <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
            <FaRocket className="text-lg" /> About Fun Study
          </h2>
          <p className="text-gray-400">
            We blend cutting-edge AI with interactive tools to revolutionize how students learn—making education smarter, faster, and more personalized.
          </p>
        </div>

        {/* Contact Section */}
        <div id='contact' className="md:w-1/3 px-4">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">📡 Contact</h2>
          <div className="text-gray-400 space-y-2">
            <p className="flex items-center gap-2">
              <FaEnvelope />
              <a href="mailto:utkarshforiit@gmail.com" className="hover:text-blue-300 transition-all">
                utkarshforiit@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt />
              <a href="tel:+919508761011" className="hover:text-blue-300 transition-all">
                +91 95087 61011
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <a
                href="https://www.google.com/maps/place/Bakhtiyarpur+College+of+Engineering"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition-all"
              >
                BCE, Patna - Bihar
              </a>
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div id='services' className="md:w-1/3 px-4">
          <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
            <FaLaptopCode className="text-lg" /> Services
          </h2>
          <ul className="text-gray-400 space-y-2">
            <li className="flex items-center gap-2"><FaGraduationCap /> AI Chatbot for Education</li>
            <li className="flex items-center gap-2"><FaLaptopCode /> Code-based Learning Tools</li>
            <li className="flex items-center gap-2"><FaChartLine /> Smart Quizzes & Learning Analytics</li>
          </ul>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} <span className="text-blue-300 font-semibold">Fun Study</span>. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
