import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar isAdmin={false} />

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-6 py-36 bg-gradient-to-r from-blue-100 to-blue-200">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 leading-tight">
          Welcome to <span className="text-blue-700">DockerLab</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          A modern lab simulation platform using Docker containers. Practice real-world setups with zero hassle.
        </p>
        <Link to="/student">
          <button className="px-8 py-3 bg-blue-700 text-white font-medium rounded-lg shadow hover:bg-blue-800 transition">
            Explore Labs
          </button>
        </Link>
      </section>

      {/* Features */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-blue-800 mb-12">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Real Lab Simulations',
                desc: 'Use real Docker containers to simulate lab environments—experience practical learning.',
              },
              {
                title: 'Centralized Documentation',
                desc: 'Admins can upload detailed step-by-step guides and students can follow along easily.',
              },
              {
                title: 'Seamless Access',
                desc: 'No setup required. Just click, copy commands, and launch containers directly.',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-blue-900 mb-12">How DockerLab Works</h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            {[
              {
                step: '1. Choose a Semester or Lab',
                desc: 'Navigate through semesters or browse all labs to find what you want to work on.',
              },
              {
                step: '2. Launch Docker Containers',
                desc: 'Click to copy or run predefined Docker commands. Everything runs in real containers.',
              },
              {
                step: '3. Follow Admin Docs',
                desc: 'Go through structured, admin-curated documentation while you practice hands-on.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <div className="text-3xl font-bold text-blue-700 mb-4">{item.step}</div>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-6 mt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">DockerLab</h3>
            <p className="text-sm text-gray-300">
              Empowering students and educators through containerized lab environments.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-gray-200">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/student" className="hover:underline">Labs</Link></li>
              <li><Link to="/semesters" className="hover:underline">Semesters</Link></li>
              <li><Link to="/student/docs" className="hover:underline">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Admin</h4>
            <ul className="space-y-1 text-sm text-gray-200">
              <li><Link to="/admin/login" className="hover:underline">Admin Portal</Link></li>
              <li><Link to="/admin/docs" className="hover:underline">Manage Docs</Link></li>
              <li><Link to="/admin/dashboard" className="hover:underline">Manage Labs</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-300 mt-6">
          &copy; {new Date().getFullYear()} DockerLab. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
