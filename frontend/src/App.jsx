import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import colors from './styles/design-tokens/colors';
import Button from './components/Button';
import Navbar from './components/Navbar';

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section 
        className="py-20 md:py-32 flex items-center justify-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-river-bed text-center">
          Hero Section Here
        </h1>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-oslo-gray max-w-2xl mx-auto">
              Comprehensive programs designed to develop skills, build character, and foster excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Branches',
                description: 'Multiple locations across the region offering world-class facilities and training programs.',
                icon: '🏢'
              },
              {
                title: 'Camps',
                description: 'Intensive training camps designed to accelerate skill development and team building.',
                icon: '🏕️'
              },
              {
                title: 'Tournaments',
                description: 'Competitive events that showcase talent and provide opportunities for growth.',
                icon: '🏆'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                style={{ border: `1px solid ${colors['geyser']}` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-river-bed mb-3">
                  {feature.title}
                </h3>
                <p className="text-oslo-gray">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-16 md:py-20"
        style={{ backgroundColor: colors['gulf-stream'] }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white mb-8 opacity-90">
            Join our community of athletes and start your journey today.
          </p>
          <Button 
            text="Contact Us"
            onClick={() => window.location.href = '/contact'}
            variant="secondary"
          />
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-8">
            About FGA
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-oslo-gray mb-6 leading-relaxed">
              FGA is dedicated to fostering excellence in sports through comprehensive training programs, 
              state-of-the-art facilities, and a commitment to developing well-rounded athletes.
            </p>
            <p className="text-lg text-oslo-gray mb-6 leading-relaxed">
              Our mission is to provide athletes of all levels with the resources, guidance, and 
              opportunities they need to reach their full potential. We believe in the power of 
              sports to build character, discipline, and lifelong friendships.
            </p>
            <div 
              className="rounded-lg p-8 mb-8"
              style={{ backgroundColor: colors['geyser'] }}
            >
              <h2 className="text-2xl font-heading font-semibold text-river-bed mb-4">
                Our Values
              </h2>
              <ul className="space-y-3 text-oslo-gray">
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: colors['gulf-stream'] }}>✓</span>
                  <span>Excellence in everything we do</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: colors['gulf-stream'] }}>✓</span>
                  <span>Integrity and sportsmanship</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: colors['gulf-stream'] }}>✓</span>
                  <span>Community and teamwork</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: colors['gulf-stream'] }}>✓</span>
                  <span>Continuous improvement and growth</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Branches() {
  const branches = [
    {
      name: 'Downtown Branch',
      address: '123 Main Street, City Center',
      programs: ['Basketball', 'Soccer', 'Tennis'],
      image: colors['gulf-stream']
    },
    {
      name: 'North Branch',
      address: '456 North Avenue, North District',
      programs: ['Swimming', 'Volleyball', 'Track & Field'],
      image: colors['river-bed']
    },
    {
      name: 'South Branch',
      address: '789 South Boulevard, South Quarter',
      programs: ['Basketball', 'Soccer', 'Baseball'],
      image: colors['gulf-stream']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-4">
              Our Branches
            </h1>
            <p className="text-lg text-oslo-gray max-w-2xl mx-auto">
              Visit one of our state-of-the-art facilities located across the region.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                style={{ border: `1px solid ${colors['geyser']}` }}
              >
                <div 
                  className="h-48"
                  style={{ backgroundColor: branch.image, opacity: 0.8 }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                    {branch.name}
                  </h3>
                  <p className="text-oslo-gray mb-4">{branch.address}</p>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-river-bed mb-2">Programs:</p>
                    <div className="flex flex-wrap gap-2">
                      {branch.programs.map((program, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: colors['gulf-stream'] }}
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button 
                    text="Learn More"
                    onClick={() => {}}
                    variant="outline"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Camps() {
  const camps = [
    {
      title: 'Summer Intensive Camp',
      date: 'July 15-20, 2024',
      duration: '6 Days',
      description: 'An intensive training camp focusing on advanced techniques and team strategies.',
      spots: 'Limited spots available'
    },
    {
      title: 'Youth Development Camp',
      date: 'August 1-5, 2024',
      duration: '5 Days',
      description: 'Perfect for young athletes looking to develop fundamental skills and build confidence.',
      spots: 'Open for registration'
    },
    {
      title: 'Elite Performance Camp',
      date: 'August 15-22, 2024',
      duration: '8 Days',
      description: 'Advanced camp for experienced athletes seeking to reach the next level.',
      spots: 'By invitation only'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-4">
              Training Camps
            </h1>
            <p className="text-lg text-oslo-gray max-w-2xl mx-auto">
              Join our specialized training camps designed to accelerate your development.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {camps.map((camp, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                style={{ border: `1px solid ${colors['geyser']}` }}
              >
                <div 
                  className="h-40"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors['gulf-stream']}, ${colors['river-bed']})`,
                    opacity: 0.9
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                    {camp.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-3 text-sm text-oslo-gray">
                    <span>📅 {camp.date}</span>
                    <span>⏱️ {camp.duration}</span>
                  </div>
                  <p className="text-oslo-gray mb-4">{camp.description}</p>
                  <p className="text-sm font-medium mb-4" style={{ color: colors['gulf-stream'] }}>
                    {camp.spots}
                  </p>
                  <Button 
                    text="Register Now"
                    onClick={() => {}}
                    variant="primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Tournaments() {
  const tournaments = [
    {
      name: 'Regional Championship',
      date: 'September 10-12, 2024',
      location: 'Main Arena',
      status: 'Upcoming',
      participants: 24
    },
    {
      name: 'Youth League Finals',
      date: 'October 5-7, 2024',
      location: 'North Branch',
      status: 'Registration Open',
      participants: 16
    },
    {
      name: 'Elite Tournament',
      date: 'November 15-17, 2024',
      location: 'Downtown Branch',
      status: 'Upcoming',
      participants: 32
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-4">
              Tournaments
            </h1>
            <p className="text-lg text-oslo-gray max-w-2xl mx-auto">
              Compete in our exciting tournaments and showcase your skills.
            </p>
          </div>
          <div className="space-y-6">
            {tournaments.map((tournament, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                style={{ border: `1px solid ${colors['geyser']}` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                      {tournament.name}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-oslo-gray text-sm">
                      <span>📅 {tournament.date}</span>
                      <span>📍 {tournament.location}</span>
                      <span>👥 {tournament.participants} Teams</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span 
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: colors['gulf-stream'] }}
                    >
                      {tournament.status}
                    </span>
                    <Button 
                      text="View Details"
                      onClick={() => {}}
                      variant="outline"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-oslo-gray">
              Have questions? We'd love to hear from you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-river-bed mb-6">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-river-bed mb-1">Email</p>
                  <p className="text-oslo-gray">info@fga.com</p>
                </div>
                <div>
                  <p className="font-medium text-river-bed mb-1">Phone</p>
                  <p className="text-oslo-gray">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="font-medium text-river-bed mb-1">Address</p>
                  <p className="text-oslo-gray">
                    123 Main Street<br />
                    City Center, State 12345
                  </p>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-river-bed mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: colors['geyser'] }}
                    onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${colors['gulf-stream']}`}
                    onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-river-bed mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: colors['geyser'] }}
                    onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${colors['gulf-stream']}`}
                    onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-river-bed mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: colors['geyser'] }}
                    onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${colors['gulf-stream']}`}
                    onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                  />
                </div>
                <Button 
                  text="Send Message"
                  onClick={() => {}}
                  variant="primary"
                />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="white" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/camps" element={<Camps />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      {/* Footer placeholder */}
      <section className="py-12 flex items-center justify-center border-t border-geyser">
        <p className="text-river-bed font-heading text-lg text-center">
          Footer Section Here
        </p>
      </section>
    </div>
  );
}

export default App;
