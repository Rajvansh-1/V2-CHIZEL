// src/pages/BrainrotCurePage.jsx
import { Link } from 'react-router-dom';
import { FaHome, FaBrain, FaExternalLinkAlt } from 'react-icons/fa';
import { memo } from 'react';

const BrainrotCurePage = memo(() => {
  return (
    <div className="bg-background text-text min-h-screen py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center bg-card/70 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-primary/20 shadow-xl space-y-8">
          
          <FaBrain className="text-6xl text-red-500 mx-auto drop-shadow-lg animate-pulse" />
          
          <h1 className="font-heading text-4xl sm:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400">
            THE CHIZEL BRAINROT CURE
          </h1>
          
          <p className="text-secondary-text text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            This page provides the comprehensive, step-by-step detox plan for parents to transform passive screen consumption into active skill development for their children.
          </p>

          <div className="space-y-4">
              <h2 className="font-heading text-2xl text-primary mt-6">Phase I: Digital Quarantine (Placeholder)</h2>
              <p className="text-sm text-secondary-text">
                  Future content will include downloadable guides, recommended time schedules, and a digital tool checklist.
              </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a 
                href="https://rajvansh-1.github.io/ParentPage-CV/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold transform transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-primary/40"
            >
              View Parent Portal <FaExternalLinkAlt className="ml-2 text-sm" />
            </a>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-card/80 border border-white/10 text-secondary-text font-semibold hover:text-text transition-colors duration-300 hover:scale-105">
              <FaHome className="mr-2 text-sm" /> Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

BrainrotCurePage.displayName = 'BrainrotCurePage';
export default BrainrotCurePage;