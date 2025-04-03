
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ChevronLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Helmet } from 'react-helmet-async';

const blogPosts = {
  'why-independent-mechanics-choose-viafix': {
    title: 'Why Independent Mechanics Choose ViaFix in Austin',
    date: 'April 2, 2025',
    author: 'Michael Rodriguez',
    category: 'Mechanic Insights',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60',
    content: `
      <p class="text-lg mb-4">Independent mechanics across Austin are discovering the advantages of working with ViaFix, the innovative gig-based auto repair platform that's transforming how vehicle services are delivered throughout Texas.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">Flexible Work Opportunities</h2>
      <p class="mb-4">For ASE-certified mechanics looking to take control of their careers, ViaFix offers unprecedented scheduling flexibility. Unlike traditional auto repair shops with rigid hours, ViaFix mechanics can set their own availability, choose which jobs to accept, and work as much or as little as they want.</p>
      <p class="mb-4">This flexibility is particularly valuable for mechanics in Austin who want to:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Earn supplemental income alongside existing employment</li>
        <li class="mb-2">Build their own independent business without overhead costs</li>
        <li class="mb-2">Create work-life balance that traditional employment doesn't offer</li>
        <li class="mb-2">Serve specific neighborhoods or areas within the greater Austin area</li>
      </ul>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">Higher Earning Potential</h2>
      <p class="mb-4">Many mechanics report earning significantly more through ViaFix than at traditional repair shops in Austin. With our platform, mechanics:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Set their own rates based on their expertise and certification level</li>
        <li class="mb-2">Keep a higher percentage of job costs compared to employment at chains</li>
        <li class="mb-2">Build a loyal customer base that provides consistent work</li>
        <li class="mb-2">Earn bonuses and higher visibility through our rating system</li>
      </ul>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">Professional Growth and Support</h2>
      <p class="mb-4">ViaFix isn't just a marketplace - it's a community of automotive professionals in Austin supporting each other's growth. The platform offers:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Access to continuing education resources and certification support</li>
        <li class="mb-2">Digital tools for managing appointments, customer relationships, and payments</li>
        <li class="mb-2">Marketing support to help mechanics build their personal brand</li>
        <li class="mb-2">Insurance options and liability protection</li>
      </ul>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">Direct Customer Connections</h2>
      <p class="mb-4">Unlike working for a large shop where mechanics rarely interact directly with customers, ViaFix facilitates direct relationships between skilled professionals and vehicle owners throughout Austin. This creates:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Higher customer satisfaction through personalized service</li>
        <li class="mb-2">Repeat business and referrals</li>
        <li class="mb-2">Professional pride in delivering quality auto repairs</li>
        <li class="mb-2">Stronger community connections in Austin neighborhoods</li>
      </ul>
      
      <p class="text-lg font-medium mt-8">Ready to transform your career as an automotive professional in Austin? Join ViaFix today and discover why so many independent mechanics are choosing our platform for gig-based auto repair work.</p>
    `,
    metaDescription: "Discover why ASE-certified mechanics in Austin choose ViaFix's gig-based platform for flexible work, higher earnings, and direct customer relationships.",
    tags: ['independent mechanics', 'ASE-certified', 'gig economy', 'auto repair', 'Austin TX']
  },
  
  'top-auto-repair-services-austin': {
    title: 'Top 5 Auto Repair Services in Austin, TX',
    date: 'March 28, 2025',
    author: 'Sarah Johnson',
    category: 'Auto Repair Tips',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60',
    content: `
      <p class="text-lg mb-4">As Austin's premier mobile mechanic platform, ViaFix has unique insight into the most common vehicle issues facing drivers throughout the city. Our network of ASE-certified mobile mechanics provides a wide range of services, but these five stand out as the most frequently requested in the Austin area.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">1. Diagnostic Services</h2>
      <p class="mb-4">With modern vehicles becoming increasingly computerized, professional diagnostic services are more important than ever. Austin drivers frequently use ViaFix to:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Identify the cause of check engine lights</li>
        <li class="mb-2">Troubleshoot electrical system problems</li>
        <li class="mb-2">Diagnose strange noises, vibrations, or performance issues</li>
        <li class="mb-2">Perform comprehensive vehicle inspections</li>
      </ul>
      <p class="mb-4">ViaFix mechanics come equipped with professional diagnostic tools and the expertise to interpret results accurately, saving Austin drivers time and preventing unnecessary repairs.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">2. Brake System Repairs</h2>
      <p class="mb-4">Austin's diverse terrain, from downtown traffic to Hill Country drives, puts significant stress on vehicle braking systems. Common brake services include:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Brake pad and rotor replacement</li>
        <li class="mb-2">Brake fluid flush and replacement</li>
        <li class="mb-2">Caliper repair or replacement</li>
        <li class="mb-2">Brake line inspection and repair</li>
      </ul>
      <p class="mb-4">Mobile mechanics through ViaFix can perform most brake services on-site at your home or office in Austin.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">3. Battery Replacement and Electrical Repairs</h2>
      <p class="mb-4">Austin's extreme summer heat is particularly hard on vehicle batteries. Our mechanics frequently provide:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Battery testing and replacement</li>
        <li class="mb-2">Alternator testing and replacement</li>
        <li class="mb-2">Starter motor repairs</li>
        <li class="mb-2">Electrical system troubleshooting</li>
      </ul>
      <p class="mb-4">The convenience of having a mobile mechanic replace your battery at home or work has made this one of our most popular services throughout Austin.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">4. Oil Changes and Fluid Services</h2>
      <p class="mb-4">Regular maintenance is essential for vehicle longevity, especially in Austin's climate. ViaFix mechanics routinely perform:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Conventional and synthetic oil changes</li>
        <li class="mb-2">Transmission fluid exchanges</li>
        <li class="mb-2">Coolant system flushes</li>
        <li class="mb-2">Power steering and brake fluid replacements</li>
      </ul>
      <p class="mb-4">Mobile oil changes eliminate the hassle of waiting rooms and allow Austin residents to maintain their vehicles without disrupting their busy schedules.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">5. AC System Repairs</h2>
      <p class="mb-4">Given Austin's hot climate, functioning air conditioning isn't a luxury—it's a necessity. Our mechanics specialize in:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">AC system diagnostics</li>
        <li class="mb-2">Refrigerant recharging</li>
        <li class="mb-2">Compressor replacement</li>
        <li class="mb-2">Condenser and evaporator repairs</li>
      </ul>
      <p class="mb-4">With summers regularly exceeding 100°F, it's no surprise that AC repair is one of the most requested services in Austin.</p>
      
      <p class="text-lg font-medium mt-8">Need one of these common services in Austin? ViaFix connects you with qualified mobile mechanics who can perform these repairs at your home or workplace, saving you time and hassle. Our platform ensures transparent pricing and quality workmanship for all your automotive needs.</p>
    `,
    metaDescription: "From diagnostics to AC repairs, discover the most common auto repair services in Austin, TX and how ViaFix's mobile mechanics deliver quality service to your location.",
    tags: ['auto repair', 'Austin TX', 'mobile mechanics', 'brake repair', 'oil change', 'AC repair']
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug as keyof typeof blogPosts] : null;
  
  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link to="/blog" className="text-primary hover:underline">
              Back to blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | ViaFix Blog | Austin, TX</title>
        <meta name="description" content={post.metaDescription || `Read about ${post.title} from ViaFix, Austin's premier mobile auto repair service.`} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <link rel="canonical" href={`https://tryviafix.com/blog/${slug}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="article:published_time" content={new Date(post.date).toISOString()} />
        <meta property="article:author" content={post.author} />
        {post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={post.image} />
      </Helmet>

      <article className="bg-white">
        {/* Hero section */}
        <div 
          className="w-full h-[400px] relative bg-cover bg-center"
          style={{ backgroundImage: `url(${post.image})` }}
        >
          <div className="absolute inset-0 bg-black/50 flex items-end">
            <div className="container mx-auto px-4 sm:px-6 py-12">
              <div className="max-w-3xl">
                <div className="bg-primary text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                  {post.category}
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center text-white/80 text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <User className="w-4 h-4 mr-1" />
                  <span>{post.author}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content section */}
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Link to="/blog">
                <Button variant="ghost" size="sm" icon={<ChevronLeft className="w-4 h-4" />}>
                  Back to Blog
                </Button>
              </Link>
              <Button variant="ghost" size="sm" icon={<Share2 className="w-4 h-4" />}>
                Share
              </Button>
            </div>
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-sm font-medium flex items-center">
                  <Tag className="w-4 h-4 mr-2" /> Tags:
                </span>
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="text-xl font-bold mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(blogPosts)
                  .filter(([key]) => key !== slug)
                  .slice(0, 2)
                  .map(([key, relatedPost]) => (
                    <Link 
                      key={key} 
                      to={`/blog/${key}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-medium mb-2 hover:text-primary">{relatedPost.title}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{relatedPost.date}</span>
                      </div>
                    </Link>
                  ))}
              </div>
              
              <div className="mt-12 p-8 bg-gray-50 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Need Auto Repair Services in Austin?</h3>
                <p className="text-gray-600 mb-4">
                  Connect with ASE-certified mobile mechanics who come to your location.
                </p>
                <Link to="/">
                  <Button size="lg">
                    Find a Mechanic Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
