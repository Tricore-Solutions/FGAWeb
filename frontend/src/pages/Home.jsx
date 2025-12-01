import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative w-full py-20 md:py-32 flex items-center justify-center min-h-[500px] md:min-h-[600px]"
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
        <div className="relative z-10 text-center px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Welcome to FGA
          </h1>
          <Button
            text="Explore Programs"
            variant="primary"
            onClick={() => navigate('/programs')}
          />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="w-full mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-oslo-gray max-w-2xl mx-auto">
              Join us for exciting events and competitions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Summer Championship',
                description: 'Annual summer championship tournament featuring top athletes from across the region.',
                date: 'July 15, 2025',
                location: 'Main Arena',
                image: 'https://via.placeholder.com/400x250'
              },
              {
                title: 'Youth Development Workshop',
                description: 'Interactive workshop focused on developing fundamental skills for young athletes.',
                date: 'August 5, 2025',
                location: 'Training Center',
                image: 'https://via.placeholder.com/400x250'
              },
              {
                title: 'Elite Training Camp',
                description: 'Intensive training camp for advanced athletes seeking to reach the next level.',
                date: 'September 10, 2025',
                location: 'Sports Complex',
                image: 'https://via.placeholder.com/400x250'
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
                    <div className="text-sm text-oslo-gray">
                      <span className="font-medium">📅</span> {event.date}
                    </div>
                    <div className="text-sm text-oslo-gray">
                      <span className="font-medium">📍</span> {event.location}
                    </div>
                    <Button
                      text="Learn More"
                      variant="primary"
                      onClick={() => navigate(`/events/${index + 1}`)}
                    />
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Us Preview Section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
              About Us
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-center">
            <p className="text-lg text-oslo-gray mb-6 leading-relaxed">
              Future Generation Academy (FGA) is dedicated to fostering excellence in sports through 
              comprehensive training programs, state-of-the-art facilities, and a commitment to 
              developing well-rounded athletes.
            </p>
            <Button
              text="Learn More About Us"
              variant="outline"
              onClick={() => navigate('/about')}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
