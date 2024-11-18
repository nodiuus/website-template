"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Phone, Mail, MapPin, Clock, ChevronDown, Star, ArrowRight } from 'lucide-react';

interface TestimonialType {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

interface QuoteFormType {
  name: string;
  email: string;
  phone: string;
  message: string;
  service_type: string;
}

interface ContactFormType {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface SubmitStatusType {
  type: string;
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [quoteForm, setQuoteForm] = useState<QuoteFormType>({
    name: '',
    email: '',
    phone: '',
    message: '',
    service_type: 'installation'
  });
  const [contactForm, setContactForm] = useState<ContactFormType>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatusType>({
    type: '',
    message: ''
  });

  const services = [
    { title: 'Installation', description: 'Expert HVAC system installation' },
    { title: 'Troubleshooting & Repair', description: 'Fast, reliable repair service' },
    { title: 'Maintenance', description: 'Regular maintenance plans' }
  ];

  const brands = [
    'Tosot', 'Daikin', 'Mitsubishi', 'LG', 'Trane', 'Goodman', 'Carrier', 'GREE'
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`);
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteForm),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Quote request submitted successfully!'
        });
        setQuoteForm({
          name: '',
          email: '',
          phone: '',
          message: '',
          service_type: 'installation'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit quote request'
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully!'
        });
        setContactForm({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Continental HVAC</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600">Services</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                <a href="#services" className="text-gray-700 hover:text-blue-600">Services</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Expert Heating and Cooling Solutions for Year Round Comfort</h2>
            <p className="text-xl mb-8">Specializing in all forms of air conditioning</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50">
              View Services
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Expert HVAC Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <a href="#" className="text-blue-600 flex items-center hover:text-blue-700">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <span>24/7 Emergency Service Available</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <span>info@continentalhvac.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Serving NYC & Tri-State Area</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Mon-Fri: 8am-6pm</span>
                </div>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              {submitStatus.message && (
                <div className={`mb-4 p-4 rounded ${
                  submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-3 border rounded"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full p-3 border rounded"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full p-3 border rounded"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                />
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 w-full"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Continental HVAC</h3>
              <p className="text-gray-400">Expert heating and cooling solutions for year-round comfort</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Installation</li>
                <li>Repair</li>
                <li>Maintenance</li>
                <li>Commercial HVAC</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency Service</li>
                <li>Request Quote</li>
                <li>Service Areas</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Continental HVAC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
