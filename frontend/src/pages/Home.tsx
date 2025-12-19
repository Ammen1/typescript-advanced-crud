import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Baby,
  Users,
  Calendar,
  Bell,
  FileText,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Play,
} from 'lucide-react';

// Import images
import heroImage from '../assets/images/hero-teacher.jpg';
import handsImage from '../assets/images/hands.jpg';
import playImage from '../assets/images/play-learn.jpg';

interface ContactFormValues {
  name: string;
  email: string;
  organization: string;
  role: string;
  message: string;
}

interface TestItem {
  id: number;
  text: string;
}

const Home: React.FC = () => {
  // --- Validation / CRUD Section State ---
  const [items, setItems] = useState<TestItem[]>([
    { id: 1, text: 'Morning Circle Time' },
    { id: 2, text: 'Art & Crafts Session' },
    { id: 3, text: 'Outdoor Play' },
  ]);
  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: TestItem = {
      id: Date.now(),
      text: newItemText,
    };
    setItems([...items, newItem]);
    setNewItemText('');
    toast.success('Activity added!');
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success('Activity deleted');
  };

  const startEdit = (item: TestItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setItems(items.map((item) => (item.id === editingId ? { ...item, text: editText } : item)));
    setEditingId(null);
    setEditText('');
    toast.success('Activity updated!');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // --- Existing Features Data ---
  const features = [
    {
      icon: Baby,
      title: 'Child Management',
      description: 'Comprehensive child profiles with medical information and emergency contacts',
      color: 'bg-blue-500',
    },
    {
      icon: Calendar,
      title: 'Attendance Tracking',
      description: 'Daily attendance monitoring with check-in/check-out timestamps',
      color: 'bg-green-500',
    },
    {
      icon: FileText,
      title: 'Child Evaluations',
      description: 'Track developmental progress across multiple categories',
      color: 'bg-purple-500',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Real-time communication between staff and parents',
      color: 'bg-orange-500',
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      description: 'Generate weekly and monthly reports with detailed insights',
      color: 'bg-pink-500',
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Role-based access control for administrators, managers, and staff',
      color: 'bg-indigo-500',
    },
  ];

  const benefits = [
    'Secure and reliable data management',
    'Easy-to-use interface for all users',
    'Real-time updates and notifications',
    'Comprehensive reporting system',
    'Mobile-friendly design',
    '24/7 system availability',
  ];

  // --- Contact Form Logic ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>();

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Thank you! We will contact you shortly.');
      reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-primary-600 to-primary-500 p-2.5 rounded-xl shadow-lg shadow-primary-200">
                <Baby className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                  EEUSR Childcare
                </h1>
                <p className="text-xs font-medium text-gray-500 tracking-wide">MANAGEMENT SYSTEM</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary-600 font-semibold transition-colors"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full hover:shadow-lg hover:shadow-primary-200 transition-all font-medium transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 font-medium text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                </span>
                <span>Now Accepting New Admissions</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Nurturing Little Minds, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                  Building Bright Futures
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Experience the perfect blend of care and education. Our comprehensive management system ensures your child receives the best attention they deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-bold text-lg flex items-center justify-center space-x-2 shadow-xl shadow-primary-200"
                >
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-lg flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Play className="w-5 h-5 text-gray-400 fill-current" />
                  <span>How it Works</span>
                </a>
              </div>
            </div>
            <div className="relative animate-fade-in-left hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-200 to-purple-200 rounded-2xl blur-2xl opacity-50 transform rotate-6"></div>
              <img
                src={heroImage}
                alt="Teacher reading to children"
                className="relative rounded-2xl shadow-2xl w-full object-cover h-[600px] transform transition-transform hover:scale-[1.01]"
              />
              {/* Floating Cards */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl max-w-xs animate-bounce-slow">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Verified System</h3>
                    <p className="text-xs text-gray-500">Secure & Compliant</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW TEST SECTION (CRUD) --- */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 skew-x-12 transform translate-x-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Interactive <span className="text-orange-500">Activity Planner</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Test our dynamic management features. Add, edit, and update daily activities in real-time.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: The Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-pink-400 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
              <img
                src={handsImage}
                alt="Children playing"
                className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>

            {/* Right Side: The CRUD Interface */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Daily Schedule</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Live Test
                </span>
              </div>

              {/* Add Item Form */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add new activity..."
                  className="flex-1 input border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <button
                  onClick={handleAddItem}
                  className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* List Items */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.length === 0 && (
                  <p className="text-center text-gray-400 py-4">No activities yet. Add one!</p>
                )}
                {items.map((item) => (
                  <div key={item.id} className="group bg-gray-50 p-4 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                    {editingId === item.id ? (
                      <div className="flex flex-1 gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 input py-1 px-2 text-sm"
                          autoFocus
                        />
                        <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1 flex items-center gap-1">
                          <Save className="w-5 h-5" />
                          <span className="text-sm font-medium">Save</span>
                        </button>
                        <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 p-1 flex items-center gap-1">
                          <X className="w-5 h-5" />
                          <span className="text-sm font-medium">Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium text-gray-700">{item.text}</span>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(item)}
                            className="px-3 py-1.5 bg-white text-blue-500 rounded-lg shadow-sm hover:text-blue-600 hover:shadow-md transition-all flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-3 py-1.5 bg-white text-red-500 rounded-lg shadow-sm hover:text-red-600 hover:shadow-md transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Management Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your childcare center efficiently and effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
                >
                  <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transform group-hover:-translate-y-1 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual Break / Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 lg:p-16">
                <h2 className="text-4xl font-bold text-white mb-6">Why Parents Choose Us</h2>
                <p className="text-primary-100 text-lg mb-8">
                  We understand that choosing a childcare center is one of the most important decisions a parent makes.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                      <span className="text-white text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-full min-h-[400px]">
                <img
                  src={playImage}
                  alt="Kids playing and learning"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary-900/30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
            <p className="text-gray-600 mt-2">Request a demo or ask us anything.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Jane Doe"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="jane@company.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Child Care Center Name"
                  {...register('organization', { required: 'Organization is required' })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                  {...register('role', { required: 'Role is required' })}
                >
                  <option value="">Select your role</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="MANAGER">Manager</option>
                  <option value="GUARDIAN">Guardian</option>
                  <option value="FAMILY">Family / Parent</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="How can we help you?"
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Please provide at least 10 characters',
                    },
                  })}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Request...' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Baby className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">EEUSR Childcare</span>
              </div>
              <p className="max-w-xs leading-relaxed">
                Empowering childcare centers with modern tools for better management, security, and care.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
                <li><a href="#features" className="hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Contact</h4>
              <ul className="space-y-4">
                <li>Hawassa, Ethiopia</li>
                <li>support@eeusr-childcare.com</li>
                <li>+251 911 234 567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} EEUSR Childcare Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
