import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import colors from '../styles/design-tokens/colors';

function About() {
  const navigate = useNavigate();

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center mb-6 sm:mb-8">
            <div className="order-2 lg:order-1">
              <img
                src="https://via.placeholder.com/800x600"
                alt="FGA Academy Facility"
                className="w-full h-auto rounded-lg shadow-lg object-cover"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div>
              <img
                src="https://via.placeholder.com/400x300"
                alt="Early Days"
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
              <p className="text-center text-xs sm:text-sm text-oslo-gray mt-2">Early Days (2015)</p>
            </div>
            <div>
              <img
                src="https://via.placeholder.com/400x300"
                alt="Expansion"
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
              <p className="text-center text-xs sm:text-sm text-oslo-gray mt-2">Expansion (2018)</p>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Today"
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
              <p className="text-center text-xs sm:text-sm text-oslo-gray mt-2">Today (2025)</p>
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
              <div className="mb-4 sm:mb-6">
                <img
                  src="https://via.placeholder.com/600x400"
                  alt="Our Mission"
                  className="w-full h-auto rounded-lg shadow-md object-cover"
                />
              </div>
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
              <div className="mb-4 sm:mb-6">
                <img
                  src="https://via.placeholder.com/600x400"
                  alt="Our Vision"
                  className="w-full h-auto rounded-lg shadow-md object-cover"
                />
              </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: 'Michael Johnson',
                role: 'Head Coach',
                experience: '15+ years',
                specialization: 'Elite Training & Performance',
                bio: 'Former professional athlete with extensive coaching experience. Specializes in developing elite-level athletes.',
                image: 'https://via.placeholder.com/300x300'
              },
              {
                name: 'Sarah Williams',
                role: 'Youth Development Coach',
                experience: '12+ years',
                specialization: 'Youth Programs & Fundamentals',
                bio: 'Passionate about developing young athletes. Focuses on building strong fundamentals and character.',
                image: 'https://via.placeholder.com/300x300'
              },
              {
                name: 'David Chen',
                role: 'Strength & Conditioning Coach',
                experience: '10+ years',
                specialization: 'Athletic Performance',
                bio: 'Certified strength and conditioning specialist. Designs comprehensive training programs.',
                image: 'https://via.placeholder.com/300x300'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Technical Skills Coach',
                experience: '8+ years',
                specialization: 'Technical Development',
                bio: 'Expert in technical skill refinement. Helps athletes perfect their technique and form.',
                image: 'https://via.placeholder.com/300x300'
              },
              {
                name: 'James Thompson',
                role: 'Mental Performance Coach',
                experience: '7+ years',
                specialization: 'Sports Psychology',
                bio: 'Licensed sports psychologist. Focuses on mental toughness and performance under pressure.',
                image: 'https://via.placeholder.com/300x300'
              },
              {
                name: 'Lisa Anderson',
                role: 'Rehabilitation Specialist',
                experience: '9+ years',
                specialization: 'Injury Prevention & Recovery',
                bio: 'Physical therapist specializing in sports injuries. Ensures athletes stay healthy and recover quickly.',
                image: 'https://via.placeholder.com/300x300'
              }
            ].map((coach, index) => (
              <Card
                key={index}
                variant="elevated"
              >
                <div className="text-center">
                  <div className="mb-3 sm:mb-4">
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mx-auto object-cover border-4"
                      style={{ borderColor: colors['geyser'] }}
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-river-bed mb-2">
                    {coach.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gulf-stream font-medium mb-2">{coach.role}</p>
                  <p className="text-xs sm:text-sm text-oslo-gray mb-2 sm:mb-3">{coach.experience} Experience</p>
                  <p className="text-xs sm:text-sm font-medium text-river-bed mb-2 sm:mb-3">{coach.specialization}</p>
                  <p className="text-xs sm:text-sm text-oslo-gray leading-relaxed">{coach.bio}</p>
                </div>
              </Card>
            ))}
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
                icon: '⭐',
                image: 'https://via.placeholder.com/400x250'
              },
              {
                title: 'Integrity',
                description: 'We conduct ourselves with honesty, respect, and ethical behavior, building trust with athletes, families, and the community.',
                icon: '🤝',
                image: 'https://via.placeholder.com/400x250'
              },
              {
                title: 'Innovation',
                description: 'We embrace new training methods, technologies, and approaches to stay at the forefront of athletic development and performance.',
                icon: '💡',
                image: 'https://via.placeholder.com/400x250'
              }
            ].map((value, index) => (
              <Card
                key={index}
                title={value.title}
                description={value.description}
                image={value.image}
                imageAlt={value.title}
                variant="elevated"
              >
                <div className="text-4xl mb-2 text-center">{value.icon}</div>
              </Card>
            ))}
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
                icon: '🏋️',
                image: 'https://via.placeholder.com/400x250'
              },
              {
                title: 'State-of-the-Art Facilities',
                description: 'Modern equipment and facilities designed to enhance performance and safety.',
                icon: '🏟️',
                image: 'https://via.placeholder.com/400x250'
              },
              {
                title: 'Expert Coaching',
                description: 'Experienced coaches dedicated to developing each athlete\'s unique potential.',
                icon: '👨‍🏫',
                image: 'https://via.placeholder.com/400x250'
              },
              {
                title: 'Competitive Events',
                description: 'Regular tournaments and competitions to test skills and build experience.',
                icon: '🏆',
                image: 'https://via.placeholder.com/400x250'
              }
            ].map((feature, index) => (
              <Card
                key={index}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                imageAlt={feature.title}
              >
                <div className="text-4xl mb-2 text-center">{feature.icon}</div>
              </Card>
            ))}
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

