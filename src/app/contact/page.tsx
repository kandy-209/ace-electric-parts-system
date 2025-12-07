import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Ace Electric Motor in Stockton, CA. Call (209) 555-1234.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Get in</span>
            <span className="text-white"> Touch</span>
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto">
            Questions? We're here to help with all your industrial equipment needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card-vercel p-8">
              <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Address</h3>
                    <p className="text-sm text-neutral-500">
                      123 Industrial Way<br />
                      Stockton, CA 95205
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Phone</h3>
                    <p className="text-sm text-neutral-500">
                      Sales: <a href="tel:+12095551234" className="text-amber-400 hover:underline">(209) 555-1234</a><br />
                      Emergency: <a href="tel:+12095559999" className="text-amber-400 hover:underline">(209) 555-9999</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Email</h3>
                    <p className="text-sm text-neutral-500">
                      <a href="mailto:sales@aceelectricmotor.com" className="text-amber-400 hover:underline">sales@aceelectricmotor.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Hours</h3>
                    <p className="text-sm text-neutral-500">
                      Mon-Fri: 7am - 5pm<br />
                      Sat: 8am - 12pm<br />
                      <span className="text-emerald-400">24/7 Emergency Available</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-vercel p-8">
            <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
            
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">First Name</label>
                  <input type="text" className="input-vercel" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Last Name</label>
                  <input type="text" className="input-vercel" placeholder="Smith" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
                <input type="email" className="input-vercel" placeholder="john@company.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Phone</label>
                <input type="tel" className="input-vercel" placeholder="(209) 555-0123" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Subject</label>
                <select className="input-vercel">
                  <option value="" className="bg-black">Select a topic</option>
                  <option value="sales" className="bg-black">Sales Inquiry</option>
                  <option value="service" className="bg-black">Service Request</option>
                  <option value="quote" className="bg-black">Quote Request</option>
                  <option value="other" className="bg-black">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Message</label>
                <textarea rows={4} className="input-vercel resize-none" placeholder="How can we help?" />
              </div>

              <button type="submit" className="w-full btn-primary py-4">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
