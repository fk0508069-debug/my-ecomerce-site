"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

import LogoutButton from "@/components/logoutbtn";
interface User {
 
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (!res.ok) {
          if (res.status === 401) {
            // Not authenticated, redirect to login
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCartOpen={() => {}} />
      <main className="max-w-2xl mx-auto px-4 py-20 mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {loading && (
          <div className="text-center text-gray-600">Loading profile...</div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

       {user?.role === 'admin' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-sm font-semibold text-blue-800 mb-3">Admin Dashboard</h2>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-all shadow-sm"
            >
              ＋ dashboard
            </Link>
          </div>
        )}

        {user && (
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded">{user.name}</p>
            </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded">{user.email}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded">{user.role}</p>
                </div>



            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
                <LogoutButton />
            </div>
          </div>
        )}

        

      </main>
    </div>
  );
}
