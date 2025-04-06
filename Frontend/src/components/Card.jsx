import { motion } from "framer-motion";
import { FaCode, FaBrain, FaCube, FaUserGraduate, FaLock, FaGlobe } from "react-icons/fa";

const features = [
  { icon: <FaBrain />, title: "AI-Powered Chat", desc: "Instant answers with AI-powered chat support." },
  { icon: <FaUserGraduate />, title: "Personalized Learning", desc: "Track your progress & learn at your pace." },
  { icon: <FaLock />, title: "Secure & Accessible", desc: "Learn anytime, anywhere with cloud-based access." },
  { icon: <FaGlobe />, title: "Free for Everyone", desc: "No hidden costs, accessible to all students." },
  { icon: <FaCube />, title: "Quiz-Based Learning", desc: "Reinforce concepts with personalized quizzes generated from your chats." },
  { icon: <FaCode />, title: "Code Generator", desc: "Get code snippets tailored to your questions for faster learning." }

];

const WhyUseFunStudy = () => {
  return (
    <section className="py-16  text-white bg-white">
      <motion.h2 
        className="text-3xl font-bold text-center text-black mb-8 "
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Why Use Fun Study?
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="p-6  bg-gray-900 rounded-lg shadow-lg flex flex-col items-center cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-4xl mb-4 text-blue-300">{feature.icon}</div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-300 text-center">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Optional: Explainer Video Section */}
      <div className="mt-16 flex flex-col items-center">
        {/* <h3 className="text-2xl font-semibold mb-4">How Fun Study Works?</h3>
        <iframe 
          className="w-full md:w-2/3 h-64 md:h-96 rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
          title="Fun Study Explainer Video"
          allowFullScreen
        ></iframe> */}
      </div>
    </section>
  );
};

export default WhyUseFunStudy;
