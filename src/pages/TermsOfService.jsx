import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="bg-background text-text min-h-screen">
      <div className="container mx-auto px-4 sm:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-2">Terms of Service</h1>
            <p className="text-secondary-text">Last Updated: September 5, 2025</p>
          </div>

          <div className="space-y-8 font-body text-secondary-text leading-relaxed">
            <section>
              <h2 className="font-heading text-2xl text-text mb-4">1. Agreement to Terms</h2>
              <p>By accessing and using the Chizel website (chizel.in), you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-text mb-4">2. Intellectual Property Rights</h2>
              <p>The website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design thereof) are owned by Chizel, its licensors, or other providers of such material and are protected by copyright, trademark, and other intellectual property laws. You are not permitted to use these materials without our prior written consent.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-text mb-4">3. Acceptable Use</h2>
              <p>You agree not to use the website:</p>
              <ul className="list-disc list-inside mt-2 pl-4">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
                <li>To impersonate or attempt to impersonate Chizel, a Chizel employee, another user, or any other person or entity.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website.</li>
              </ul>
            </section>
            
            <section className="bg-card border border-primary/20 p-6 rounded-lg">
              <h2 className="font-heading text-2xl text-text mb-4">4. User-Generated Content (Future Feature)</h2>
              <p>Our future services, like the "Chizel Club," may allow users to post, link, and share content. By submitting content, you grant Chizel a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with the service. You are solely responsible for the content you submit and must ensure it does not violate any third-party rights or laws.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-text mb-4">5. Disclaimer of Warranties</h2>
              <p>The website is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted, secure, or error-free.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-text mb-4">6. Limitation of Liability</h2>
              <p>In no event will Chizel, its affiliates, or their licensors, service providers, employees, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the website.</p>
            </section>
            
            <section>
              <h2 className="font-heading text-2xl text-text mb-4">7. Governing Law</h2>
              <p>These Terms of Service shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-text mb-4">8. Contact Us</h2>
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
              <p className="mt-2"><a href="mailto:contact@chizel.in" className="text-primary hover:underline">chizelconnect@gmail.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;