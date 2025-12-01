import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative w-full py-20 md:py-32 flex items-center justify-center min-h-[600px] md:min-h-[700px]"
        style={{
          backgroundImage: 'url(https://via.placeholder.com/1920x1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 md:px-8 flex flex-col items-center justify-center gap-6 md:gap-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white">
            Welcome to FGA
          </h1>
          <Button
            text="Explore Programs"
            variant="primary"
            onClick={() => navigate('/programs')}
          />
        </div>
      </section>

      {/* About Us Preview Section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <p className="text-xl md:text-3xl font-heading font-thin text-river-bed mb-16 leading-normal">
              Future Generation Academy (FGA) is dedicated to fostering excellence in sports through 
              comprehensive training programs, state-of-the-art facilities, and a commitment to 
              developing well-rounded athletes.
            </p>
            <button
              onClick={() => navigate('/about')}
              className="px-6 py-6 rounded-full font-bold transition-all duration-fast cursor-pointer bg-transparent border-3 border-gulf-stream hover:bg-gulf-stream text-gulf-stream hover:text-white flex items-center gap-2 mx-auto"
            >
              More About Us
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="w-full mx-auto px-[10rem]">
          <div className="text-center mb-12">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <h2 className="text-6xl md:text-7xl font-heading font-bold text-river-bed uppercase tracking-sm -ml-32 md:-ml-40 relative z-10">
                  Upcoming
                </h2>
                <h2 
                  className="text-6xl md:text-7xl font-heading font-bold uppercase tracking-sm -ml-32 md:-ml-40 absolute top-0 left-0 z-0"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px #454f59',
                    textStroke: '2px #454f59',
                    transform: 'translate(-4px, 4px)',
                  }}
                >
                  Upcoming
                </h2>
              </div>
              <div className="relative">
                <h2 className="text-6xl md:text-7xl font-heading font-bold text-river-bed uppercase tracking-sm ml-32 md:ml-40 relative z-10">
                  Events
                </h2>
                <h2 
                  className="text-6xl md:text-7xl font-heading font-bold uppercase tracking-sm ml-32 md:ml-40 absolute top-0 left-0 z-0"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px #454f59',
                    textStroke: '2px #454f59',
                    transform: 'translate(4px, 4px)',
                  }}
                >
                  Events
                </h2>
              </div>
            </div>
            <p className="text-lg text-oslo-gray max-w-2xl mx-auto">
              Join us for exciting events and competitions
            </p>
          </div>
          {/* Featured Event (Soonest) */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Large Image on Left */}
              <div className="w-full md:w-1/2">
                <img
                  src="/images/events-2.jpg"
                  alt="Summer Championship"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {/* Content on Right */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <div className="text-sm text-oslo-gray mb-2">
                  EVENTS - July 15, 2025
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-river-bed mb-4">
                  Summer Championship
                </h3>
                <p className="text-base text-oslo-gray mb-6 leading-relaxed">
                  Annual summer championship tournament featuring top athletes from across the region. 
                  Join us for an exciting competition showcasing the best talent in sports.
                </p>
                <div className="text-sm text-oslo-gray mb-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-oslo-gray" />
                    <span>July 15, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-oslo-gray" />
                    <span>Main Arena</span>
                  </div>
                </div>
                <Button
                  text="Learn More"
                  variant="primary"
                  onClick={() => navigate('/events/1')}
                />
              </div>
            </div>
          </div>

          {/* Other Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Youth Development Workshop',
                description: 'Interactive workshop focused on developing fundamental skills for young athletes.',
                date: 'August 5, 2025',
                location: 'Training Center',
                image: '/images/events-1.jpg'
              },
              {
                title: 'Elite Training Camp',
                description: 'Intensive training camp for advanced athletes seeking to reach the next level.',
                date: 'September 10, 2025',
                location: 'Sports Complex',
                image: '/images/events-3.jpg'
              }
            ].map((event, index) => (
              <Card
                key={index}
                title={event.title}
                description={event.description}
                image={event.image}
                imageAlt={event.title}
                footer={
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-oslo-gray flex items-center gap-2">
                      <Calendar size={16} className="text-oslo-gray" />
                      <span>{event.date}</span>
                    </div>
                    <div className="text-sm text-oslo-gray flex items-center gap-2">
                      <MapPin size={16} className="text-oslo-gray" />
                      <span>{event.location}</span>
                    </div>
                    <Button
                      text="Learn More"
                      variant="primary"
                      onClick={() => navigate(`/events/${index + 2}`)}
                    />
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
