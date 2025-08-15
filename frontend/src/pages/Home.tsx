import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { Scale, Shield, FileText, Users, Building2, CheckCircle, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { isConnected } = useWeb3();

  const features = [
    {
      icon: Shield,
      title: 'Secure Escrow',
      description: 'Trustless case funding with automated dispute resolution',
      href: '/escrow'
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Immutable legal documents with version control',
      href: '/documents'
    },
    {
      icon: Users,
      title: 'Lawyer Marketplace',
      description: 'Find verified legal practitioners for your case',
      href: '/marketplace'
    },
    {
      icon: Building2,
      title: 'Legal Fundraising',
      description: 'Crowdfund legal cases with transparent tracking',
      href: '/fundraising'
    },
    {
      icon: Scale,
      title: 'Verification System',
      description: 'Verified lawyer and judge credentials',
      href: '/verification'
    }
  ];

  const benefits = [
    'Transparent and immutable legal records',
    'Automated escrow and payment processing',
    'Reduced legal costs through efficiency',
    'Global access to legal services',
    'Built on secure blockchain technology'
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Legal Services at Your
            <span className="text-primary-600"> Fingertips</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready Lawyer is a decentralized platform that revolutionizes legal services 
            through blockchain technology, providing secure, transparent, and efficient 
            legal infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                to="/verification"
                className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            <Link
              to="/marketplace"
              className="btn-outline text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <span>Browse Lawyers</span>
              <Users className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Legal Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for modern legal services, built on the secure 
            Avalanche blockchain network.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.href}
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 group-hover:bg-primary-200 transition-colors">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Ready Lawyer?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the future of legal services with our innovative platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {benefits.slice(0, 3).map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {benefits.slice(3).map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-primary-600 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Legal Experience?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already benefiting from our 
          decentralized legal services platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/verification"
            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Start Today
          </Link>
          <Link
            to="/marketplace"
            className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Explore Services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
