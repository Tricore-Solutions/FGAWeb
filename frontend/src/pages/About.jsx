import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { Dumbbell, Building2, Users, Trophy, Star, Handshake, Lightbulb } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import ChromaGrid from '../component/ChromaGrid';
import TiltedCover from '../components/animata/image/TiltedCover';
import OutlinedHeading from '../components/OutlinedHeading';
import colors from '../styles/design-tokens/colors';

function About() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const imageSectionRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [imagePadding, setImagePadding] = useState(100);
  const [imageBorderRadius, setImageBorderRadius] = useState(40);
  const [headingScrollProgress, setHeadingScrollProgress] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5; // Play at 1.5x speed (50% faster)
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!imageSectionRef.current) return;
      
      if (!ticking) {
        requestAnimationFrame(() => {
      const rect = imageSectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Calculate scroll progress: 
          // When section top is at viewport top (rect.top = 0): progress = 0 (small image)
          // As user scrolls down, rect.top becomes negative
          // When section is scrolled past viewport: progress = 1 (full size)
          // Use windowHeight as the scroll distance for smooth transition
          const scrollProgress = Math.max(0, Math.min(1, -rect.top / windowHeight));
      
          // Start with padding and border-radius, reduce to 0 as user scrolls
          const initialPadding = 100;
          const initialBorderRadius = 40;
          const padding = initialPadding * (1 - scrollProgress); // From 100px to 0px
          const borderRadius = initialBorderRadius * (1 - scrollProgress); // From 40px to 0px
          
          setImagePadding(Math.max(0, padding));
          setImageBorderRadius(Math.max(0, borderRadius));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-linked animation for heading (same as Home page)
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!heroSectionRef.current) return;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          const section = heroSectionRef.current;
          if (!section) return;
          
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Calculate progress: 0 when section top enters viewport bottom, 1 when section top reaches viewport center
          const startPoint = windowHeight * 0.85;
          const endPoint = windowHeight * 0.3;
          
          // Progress calculation
          const progress = Math.max(0, Math.min(1, (startPoint - rect.top) / (startPoint - endPoint)));
          
          setHeadingScrollProgress(progress);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to absolute top (image section) if hash is present or coming from home page button
  useEffect(() => {
    if (location.hash === '#image-section' || location.state?.scrollToImage) {
      // Force scroll to absolute top - use instant scroll to ensure it goes to the very top
      const scrollToAbsoluteTop = () => {
        // Try all methods to ensure we scroll to absolute top
        window.scrollTo(0, 0);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTop = 0;
        }
      };
      
      // Immediate scroll on mount
      scrollToAbsoluteTop();
      
      // Additional attempts after render
      requestAnimationFrame(scrollToAbsoluteTop);
      setTimeout(scrollToAbsoluteTop, 0);
      setTimeout(scrollToAbsoluteTop, 10);
      setTimeout(scrollToAbsoluteTop, 50);
    }
  }, [location.hash, location.state]);

  return (
    <>
      {/* Top Image Section */}
      <section id="image-section" ref={imageSectionRef} className="w-full overflow-hidden" style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            padding: `${imagePadding}px`,
            borderRadius: `${imageBorderRadius}px`,
            transition: 'padding 0.15s ease-out, border-radius 0.15s ease-out',
            willChange: 'padding, border-radius',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
        <img 
          src="/images/fga-6.jpg" 
          alt="Future Generation Academy" 
          className="w-full h-full object-cover"
          style={{ 
            display: 'block',
              width: '100%',
              height: '100%',
              borderRadius: `${imageBorderRadius}px`,
              transition: 'border-radius 0.15s ease-out'
          }}
        />
        </div>
      </section>

      {/* Hero Section */}
      <section 
        ref={heroSectionRef}
        className="relative w-full pt-20 md:pt-32 pb-8 md:pb-12 flex items-center justify-center min-h-[400px] md:min-h-[500px]"
        style={{
          backgroundImage: 'url(https://via.placeholder.com/1920x1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Content */}
        <div className="relative z-10 text-center px-4 md:px-8">
          <div className="flex flex-col items-center gap-2" style={{ transform: 'scale(0.92)' }}>
            <div className="flex flex-row items-center justify-center gap-4 md:gap-8" style={{ marginLeft: '-30rem' }}>
              <OutlinedHeading 
                text="About" 
                offset="" 
                shadowDirection="left" 
                scrollProgress={headingScrollProgress}
                animateFrom="left"
                textColor="text-river-bed"
                strokeColor="#454f59"
                strokeWidth={3}
              />
              <OutlinedHeading 
                text="Future" 
                offset="" 
                shadowDirection="left" 
                scrollProgress={headingScrollProgress}
                animateFrom="left"
                textColor="text-gulf-stream"
                strokeColor="#80b3b4"
                strokeWidth={3}
              />
            </div>
            <OutlinedHeading 
              text="Generation Academy" 
              offset="ml-20 md:ml-56" 
              shadowDirection="right" 
              scrollProgress={headingScrollProgress}
              animateFrom="right"
              textColor="text-gulf-stream"
              strokeColor="#80b3b4"
              strokeWidth={3}
            />
          </div>
        </div>
      </section>

      {/* Mission/Vision Section */}
      <section className="w-full pt-10 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-24 bg-white relative overflow-visible">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 relative" style={{ overflow: 'visible', alignItems: 'stretch', minHeight: '600px' }}>
            {/* Mission */}
            <div className="relative z-20 flex flex-col justify-start" style={{ paddingTop: '0', marginLeft: '3rem' }}>
              <div className="text-right mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-river-bed mb-3">
                  Our <span style={{ color: colors['gulf-stream'] }}>Mission</span>
            </h2>
          </div>
              <div className="prose prose-sm max-w-none text-right">
                <p className="text-sm sm:text-base text-oslo-gray leading-relaxed">
                  Future Generation Academy holds a commendable mission of promoting sports, particularly football, among the youth of society. By focusing on discovering and nurturing sporting talents, the academy provides a conducive environment for future generations to explore and express their athletic potential.
                </p>
              </div>
            </div>

            {/* Video */}
            <div 
              className="order-2 lg:order-2 relative z-10 self-center"
              style={{
                transform: 'scale(2)',
                marginTop: '-20%',
                marginBottom: '-20%',
                marginLeft: '3rem',
                width: '100%',
                overflow: 'visible',
                position: 'relative',
                border: 'none',
                outline: 'none',
                boxShadow: 'none'
              }}
            >
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
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  borderRadius: '0'
                }}
              />
            </div>

            {/* Vision */}
            <div className="order-3 lg:order-3 relative z-20 flex flex-col justify-end" style={{ paddingBottom: '0', marginTop: 'auto', marginBottom: '6rem', marginLeft: '-4rem', marginRight: '3rem' }}>
              <div className="text-left mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-river-bed mb-3">
                  Our <span style={{ color: colors['gulf-stream'] }}>Vision</span>
                </h2>
              </div>
              <div className="prose prose-sm max-w-none text-left">
                <p className="text-sm sm:text-base text-oslo-gray leading-relaxed">
                  Established in January 2021 with our main branch in Muscat, the academy has achieved significant success, boasting over 1000 registered participants across four different age categories ranging from 5 to 16 years old. We envision fostering a culture of athleticism and providing opportunities for young individuals to pursue their passion for sports while promoting physical fitness and overall well-being.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Staff Section */}
      <section className="w-full py-12 sm:py-16 md:py-24">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-river-bed mb-4">
              Our Founders
            </h2>
            <p className="text-base sm:text-lg text-oslo-gray max-w-2xl mx-auto px-4">
              Meet the experienced professionals dedicated to your success
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <ChromaGrid 
              items={[
                {
                  image: '/images/fga-saif.jpg',
                  title: 'Saif Al-Harthi',
                  subtitle: 'Sport & Training Manager',
                  gradient: 'linear-gradient(90deg, #7db8b9, #7db8b9)',
                  url: '#'
                },
                {
                  image: '/images/fga-ali.jpg',
                  title: 'Ali Al-Maani',
                  subtitle: 'General Manager',
                  gradient: 'linear-gradient(90deg, #7db8b9, #7db8b9)',
                  url: '#'
                },
                {
                  image: '/images/fga-khalid.jpg',
                  title: 'Khalid Al-Maani',
                  subtitle: 'Finance & HR Manager',
                  gradient: 'linear-gradient(90deg, #7db8b9, #7db8b9)',
                  url: '#'
                }
              ]}
              radius={230}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: 'Training Programs',
                description: 'Comprehensive programs for all skill levels, from beginners to elite athletes.',
                icon: Dumbbell,
                image: '/images/fga-2.jpeg'
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
              const directions = ['left', 'left', 'right']; // Alternate directions for three items (right-most tilts to the right)
              return (
              <div key={index} className="flex justify-center">
                <TiltedCover
                  direction={directions[index]}
                  tiltCover={index === 1 ? false : undefined}
                  image={{
                    src: feature.image,
                    alt: feature.title
                  }}
                  className="w-full max-w-[14rem] h-[420px] sm:h-[460px] md:h-[420px] flex-shrink-0"
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors['gulf-stream'],
                      padding: "1rem"
                    }}
                  >
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <IconComponent size={40} color="#ffffff" strokeWidth={1.5} />
                      </div>
                      <h3 style={{ fontWeight: 900, fontSize: "1.125rem", color: "#ffffff", marginBottom: "0.5rem" }}>
                        {feature.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.9)", lineHeight: "1.4" }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </TiltedCover>
              </div>
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




