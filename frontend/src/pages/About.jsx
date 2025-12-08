import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { Dumbbell, Building2, Users, Trophy, Star, Handshake, Lightbulb } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import ChromaGrid from '../component/ChromaGrid';
import PixelTransition from '../component/PixelTransition';
import colors from '../styles/design-tokens/colors';

function About() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5; // Play at 1.5x speed (50% faster)
    }
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative w-full py-20 md:py-32 flex items-center justify-center min-h-[400px] md:min-h-[500px]"
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            About Future Generation Academy
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white opacity-90 max-w-3xl mx-auto px-4">
            Empowering athletes to reach their full potential through excellence, dedication, and innovation
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="w-full py-12 sm:py-16 md:py-24 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
              Our History
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <video
                ref={videoRef}
                src="/videos/football-drawing.mp4"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate"
                className="w-full h-auto transition-all duration-300 hover:brightness-110"
                style={{ background: 'transparent' }}
              />
            </div>
            <div className="order-1 lg:order-2 prose prose-sm sm:prose-base md:prose-lg max-w-none">
              <p className="text-base sm:text-lg text-oslo-gray mb-4 sm:mb-6 leading-relaxed">
                Founded in 2015, Future Generation Academy began with a simple yet powerful vision: 
                to create a place where athletes of all backgrounds could come together to pursue excellence 
                in sports while developing essential life skills.
              </p>
              <p className="text-base sm:text-lg text-oslo-gray mb-4 sm:mb-6 leading-relaxed">
                What started as a small training facility with just a handful of athletes has grown into 
                a comprehensive academy serving hundreds of athletes across multiple sports disciplines. 
                Over the years, we've expanded our facilities, developed innovative training programs, 
                and built a community of dedicated coaches, athletes, and families.
              </p>
              <p className="text-base sm:text-lg text-oslo-gray leading-relaxed">
                Today, FGA stands as a testament to what can be achieved when passion meets purpose. 
                We continue to evolve, embracing new technologies and training methodologies while staying 
                true to our core values of excellence, integrity, and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission/Vision Section */}
      <section className="w-full py-12 sm:py-16 md:py-24" style={{ backgroundColor: colors['geyser'] }}>
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Mission */}
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
                  Our Mission
                </h2>
              </div>
              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-center">
                <p className="text-base sm:text-lg text-oslo-gray mb-4 sm:mb-6 leading-relaxed">
                  Future Generation Academy (FGA) is dedicated to fostering excellence in sports through 
                  comprehensive training programs, state-of-the-art facilities, and a commitment to 
                  developing well-rounded athletes.
                </p>
                <p className="text-base sm:text-lg text-oslo-gray leading-relaxed">
                  Our mission is to provide athletes of all levels with the resources, guidance, and 
                  opportunities they need to reach their full potential. We believe in the power of 
                  sports to build character, discipline, and lifelong friendships.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
                  Our Vision
                </h2>
              </div>
              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-center">
                <p className="text-base sm:text-lg text-oslo-gray mb-4 sm:mb-6 leading-relaxed">
                  To become the leading academy for athletic development, recognized nationally for 
                  producing not only exceptional athletes but also outstanding individuals who contribute 
                  positively to their communities.
                </p>
                <p className="text-base sm:text-lg text-oslo-gray leading-relaxed">
                  We envision a future where every athlete who walks through our doors leaves with 
                  enhanced skills, strengthened character, and the confidence to pursue their dreams, 
                  both on and off the field.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Staff Section */}
      <section className="w-full py-12 sm:py-16 md:py-24 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
              Our Coaching Staff
            </h2>
            <p className="text-base sm:text-lg text-oslo-gray max-w-2xl mx-auto px-4">
              Meet the experienced professionals dedicated to your success
            </p>
          </div>
          <div style={{ height: '1200px', minHeight: '1000px', position: 'relative' }}>
            <ChromaGrid 
              items={[
                {
                  image: 'https://i.pravatar.cc/300?img=1',
                  title: 'Michael Johnson',
                  subtitle: 'Head Coach',
                  handle: '@michaeljohnson',
                  gradient: 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
                  url: '#'
                },
                {
                  image: 'https://i.pravatar.cc/300?img=2',
                  title: 'Sarah Williams',
                  subtitle: 'Youth Development Coach',
                  handle: '@sarahwilliams',
                  gradient: 'linear-gradient(90deg, #22C55E, #16A34A)',
                  url: '#'
                },
                {
                  image: 'https://i.pravatar.cc/300?img=3',
                  title: 'David Chen',
                  subtitle: 'Strength & Conditioning Coach',
                  handle: '@davidchen',
                  gradient: 'linear-gradient(90deg, #9CA3AF, #6B7280)',
                  url: '#'
                },
                {
                  image: 'https://i.pravatar.cc/300?img=4',
                  title: 'Emily Rodriguez',
                  subtitle: 'Technical Skills Coach',
                  handle: '@emilyrodriguez',
                  gradient: 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
                  url: '#'
                },
                {
                  image: 'https://i.pravatar.cc/300?img=5',
                  title: 'James Thompson',
                  subtitle: 'Mental Performance Coach',
                  handle: '@jamesthompson',
                  gradient: 'linear-gradient(90deg, #22C55E, #16A34A)',
                  url: '#'
                },
                {
                  image: 'https://i.pravatar.cc/300?img=6',
                  title: 'Lisa Anderson',
                  subtitle: 'Rehabilitation Specialist',
                  handle: '@lisanderson',
                  gradient: 'linear-gradient(90deg, #9CA3AF, #6B7280)',
                  url: '#'
                }
              ]}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 sm:py-16 md:py-24" style={{ backgroundColor: colors['geyser'] }}>
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
              Our Core Values
            </h2>
            <p className="text-base sm:text-lg text-oslo-gray max-w-2xl mx-auto px-4">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: 'Excellence',
                description: 'We strive for the highest standards in training, facilities, and athlete development, constantly pushing boundaries to achieve outstanding results.',
                icon: Star
              },
              {
                title: 'Integrity',
                description: 'We conduct ourselves with honesty, respect, and ethical behavior, building trust with athletes, families, and the community.',
                icon: Handshake
              },
              {
                title: 'Innovation',
                description: 'We embrace new training methods, technologies, and approaches to stay at the forefront of athletic development and performance.',
                icon: Lightbulb
              }
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
              <Card
                key={index}
                title={value.title}
                description={value.description}
                variant="elevated"
              >
                <div className="mb-2 text-center flex justify-center">
                  <IconComponent size={48} color={colors['gulf-stream']} strokeWidth={1.5} />
                </div>
              </Card>
            );
            })}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="w-full py-12 sm:py-16 md:py-24 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
              What We Offer
            </h2>
            <p className="text-base sm:text-lg text-oslo-gray max-w-2xl mx-auto px-4">
              Comprehensive programs and services designed for athletes at every stage of their journey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: 'Training Programs',
                description: 'Comprehensive programs for all skill levels, from beginners to elite athletes.',
                icon: Dumbbell,
                image: '/images/fga-2.jpeg'
              },
              {
                title: 'State-of-the-Art Facilities',
                description: 'Modern equipment and facilities designed to enhance performance and safety.',
                icon: Building2,
                image: '/images/fga-5.jpg'
              },
              {
                title: 'Expert Coaching',
                description: 'Experienced coaches dedicated to developing each athlete\'s unique potential.',
                icon: Users,
                image: '/images/fga-3.jpg'
              },
              {
                title: 'Competitive Events',
                description: 'Regular tournaments and competitions to test skills and build experience.',
                icon: Trophy,
                image: '/images/fga-4.jpg'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
              <PixelTransition
                key={index}
                firstContent={
                  <img
                    src={feature.image}
                    alt={feature.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                }
                secondContent={
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: colors['gulf-stream'],
                      padding: "2rem"
                    }}
                  >
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <IconComponent size={48} color="#ffffff" strokeWidth={1.5} />
                      </div>
                      <h3 style={{ fontWeight: 900, fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.5rem" }}>
                        {feature.title}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.9)", lineHeight: "1.5" }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                }
                gridSize={12}
                pixelColor={colors['gulf-stream']}
                once={false}
                animationStepDuration={0.3}
                className="custom-pixel-card"
                style={{ height: '400px', borderRadius: '1rem', overflow: 'hidden' }}
              />
            );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="w-full py-12 sm:py-16 md:py-20"
        style={{ backgroundColor: colors['gulf-stream'] }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-base sm:text-lg text-white mb-6 sm:mb-8 opacity-90 px-4">
            Ready to start your journey with Future Generation Academy? Explore our programs and events today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              text="View Programs"
              variant="secondary"
              onClick={() => navigate('/programs')}
            />
            <Button
              text="View Events"
              variant="secondary"
              onClick={() => navigate('/events')}
            />
            <Button
              text="Contact Us"
              variant="secondary"
              onClick={() => navigate('/contact')}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default About;

