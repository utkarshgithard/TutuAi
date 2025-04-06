import React from 'react';
import homep1 from '../assets/p5.png';
import WhyUseFunStudy from '../components/Card';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Typewriter } from 'react-simple-typewriter';

const Home = () => {
    return (
        <>
            <Navbar />
            <div className='min-h-screen w-full  text-white flex flex-col' id='home'>
                <div className='flex flex-col md:flex-row items-center justify-between mt-20 px-6 md:px-12 gap-8'>

                    {/* Left Section */}
                    <div className='flex flex-col justify-center gap-6 max-w-xl text-center md:text-left'>
                        <h2 className='text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent'>
                            <Typewriter
                                words={[
                                    'TUTU-AI combines AI with real-time doubt-solving and personalized quizzes.',
                                ]}
                                loop={false}
                                cursor
                                cursorStyle='|'
                                typeSpeed={90}
                                deleteSpeed={0}
                                delaySpeed={1000}
                            />
                        </h2>
                        <h3 className='px-3 text-md md:text-lg text-gray-900 fade-in'>
                            No more passive studying—just active conversations, dynamic explanations, and targeted quizzes to make every concept stick.
                        </h3>
                        <div className='flex justify-center md:justify-start '>
                            <Link
                                to={'/login'}
                                className="px-6 py-3 font-semibold rounded-full border border-cyan-400 text-blue-500 hover:bg-cyan-500 hover:text-black shadow-md transition duration-300 ease-in-out"
                            >
                                Get Started 🚀
                            </Link>
                        </div>
                    </div>

                    {/* Right Section */}
                    <img
                        className='w-full md:w-1/2 max-w-md mx-auto md:mx-0 animate-fade-in-up rounded-xl shadow-lg'
                        src={homep1}
                        alt="AI Learning"
                    />
                </div>

                {/* Feature Section */}
                <div className='mt-10'>
                    <WhyUseFunStudy />
                </div>

                <Footer />
            </div>
        </>
    );
};

export default Home;
