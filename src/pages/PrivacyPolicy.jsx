import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="bg-background text-text min-h-screen">
      <div className="container mx-auto px-4 sm:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-secondary-text">Last Updated: September 5, 2025</p>
          </div>

          <div className="space-y-8 font-body text-secondary-text leading-relaxed">
            <section>
              <h2 className="font-heading text-2xl text-text mb-4">1. Introduction</h2>
              <p>Welcome to Chizel! We are committed to protecting your privacy and creating a safe, transparent experience for all our users, especially children and their parents. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (chizel.in) and interact with our services.</p>
            </section>

            <section className="bg-card border border-primary/20 p-6 rounded-lg">
              <h2 className="font-heading text-2xl text-text mb-4">2. A Note for Parents and Guardians</h2>
              <p className="mb-2">We take children's privacy very seriously. Our goal is to comply with the Children's Online Privacy Protection Act (COPPA) and other applicable privacy laws. We do not knowingly collect personal information from children under 13 without verifiable parental consent.</p>
              <p>This website is primarily intended for a general audience to learn about our upcoming products. Any data collection forms, such as our waitlist or feedback forms, are intended for use by parents, guardians, and adult investors.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-text mb-4">3. Information We Collect</h2>
              <div>
                <h3 className="font-semibold text-text mb-2">a. Information You Provide to Us</h3>
                <p>We collect information that you voluntarily provide when you express interest in our services, such as when you:</p>
                <ul className="list-disc list-inside mt-2 pl-4">
                  <li><strong>Join our Waitlist or Contact Us:</strong> When you sign up for our app waitlist or contact us via our Google Forms, we may collect your name, email address, and any message you provide.</li>
                  <li><strong>Provide Feedback:</strong> When you use our feedback forms, we collect the information and feedback you submit.</li>
                </ul>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-text mb-2">b. Information We Collect Automatically</h3>
                <p>When you navigate our website, we use third-party services like Google Analytics to automatically collect certain information:</p>
                <ul className="list-disc list-inside mt-2 pl-4">
                  <li><strong>Usage Data:</strong> This includes your IP address, browser type, device information, pages visited, and time spent on our site. This data is aggregated and helps us understand how our site is used so we can improve it.</li>
                  <li><strong>Cookies:</strong> Our site uses cookies (small text files stored on your device) to help Google Analytics function. You can control cookie preferences through your browser settings.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-text mb-4">4. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside mt-2 pl-4">
                <li>To operate and maintain our website.</li>
                <li>To improve your experience and our product offerings.</li>
                <li>To respond to your comments, questions, and feedback.</li>
                <li>To send you updates and information about our launch if you have joined our waitlist.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="font-heading text-2xl text-text mb-4">5. Sharing Your Information</h2>
              <p>We do not sell your personal information. We may share information with the following third parties:</p>
              <ul className="list-disc list-inside mt-2 pl-4">
                <li><strong>Service Providers:</strong> We use Google for analytics (Google Analytics) and data collection (Google Forms). These companies have their own privacy policies, and we encourage you to review them.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-text mb-4">6. Your Privacy Rights</h2>
              <p>You have the right to access, update, or request deletion of your personal information. Parents and guardians have the right to review any information we may have collected from their child and request its deletion. Please contact us at [Your Contact Email Address] to exercise these rights.</p>
            </section>

            <section>
            <h2 className="font-heading text-2xl text-text mb-4">7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <a 
              href="mailto:chizelconnect@gmail.com" 
              className="inline-block mt-2 px-6 py-3 rounded-full bg-primary text-white font-semibold transform transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-primary/40"
            >
              chizelconnect@gmail.com
            </a>
          </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;