const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white md:py-8 md:px-6 px-8 py-4">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div id="about">
            <h2 className="text-lg font-semibold mb-4">About</h2>
            <p className="text-gray-400">We provide high-quality services and ensure customer satisfaction with our reliable solutions.</p>
          </div>
  
          {/* Contact Section */}
          <div id="contact">
            <h2 className="text-lg font-semibold mb-4">Contact</h2>
            <p className="text-gray-400">Email: utkarshforiit@gmail.com</p>
            <p className="text-gray-400">Phone: 95087 61011</p>
            <p className="text-gray-400">Bakhtiyarpur College of Engineering ,Patna </p>
          </div>
  
          {/* Services Section */}
          <div id="services">
            <h2 className="text-lg font-semibold mb-4">Services</h2>
            <ul className="text-gray-400">
              <li>Educational AI Chatbot</li>
              <li>Interactive Study Tools</li>
              <li>Personalized Learning Plans</li>
            </ul>
          </div>
        </div>
  
        {/* Bottom Section */}
        <div className="text-center mt-8 text-gray-500">
          <p>&copy; {new Date().getFullYear()} Fun Study. All Rights Reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;

  