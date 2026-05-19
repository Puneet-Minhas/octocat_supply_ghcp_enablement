import { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

interface Supplier {
  supplierId: number;
  name: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  active: boolean;
  verified: boolean;
}

const fetchSuppliers = async (): Promise<Supplier[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.suppliers}`);
  return data;
};

type ActiveFilter = 'all' | 'active' | 'inactive';
type VerifiedFilter = 'all' | 'verified' | 'unverified';

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>('all');
  const { data: suppliers, isLoading, error } = useQuery('suppliers', fetchSuppliers);
  const { darkMode } = useTheme();

  const filteredSuppliers = suppliers?.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive =
      activeFilter === 'all' ||
      (activeFilter === 'active' && supplier.active) ||
      (activeFilter === 'inactive' && !supplier.active);

    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && supplier.verified) ||
      (verifiedFilter === 'unverified' && !supplier.verified);

    return matchesSearch && matchesActive && matchesVerified;
  });

  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to fetch suppliers</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <h1
            className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
          >
            Suppliers
          </h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-300`}
                aria-label="Search suppliers"
              />
              <svg
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            {/* Active filter */}
            <div>
              <label
                htmlFor="active-filter"
                className={`sr-only`}
              >
                Filter by status
              </label>
              <select
                id="active-filter"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-300`}
                aria-label="Filter by active status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Verified filter */}
            <div>
              <label
                htmlFor="verified-filter"
                className={`sr-only`}
              >
                Filter by verification
              </label>
              <select
                id="verified-filter"
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value as VerifiedFilter)}
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-300`}
                aria-label="Filter by verification status"
              >
                <option value="all">All Verifications</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Empty state */}
          {(!filteredSuppliers || filteredSuppliers.length === 0) && (
            <div
              className={`flex flex-col items-center justify-center text-center py-20 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              role="status"
              aria-live="polite"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-12 w-12 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className={`${darkMode ? 'text-light' : 'text-gray-800'} text-lg font-medium`}>
                No suppliers found
              </p>
              {(searchTerm || activeFilter !== 'all' || verifiedFilter !== 'all') && (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Try clearing or changing your search filters.
                </p>
              )}
            </div>
          )}

          {/* Supplier cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers?.map((supplier) => (
              <div
                key={supplier.supplierId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 flex flex-col space-y-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(118,184,82,0.3)]`}
              >
                <div className="flex items-start justify-between">
                  <h2
                    className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                  >
                    {supplier.name}
                  </h2>
                  <div className="flex gap-2 flex-shrink-0 ml-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${supplier.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      aria-label={supplier.active ? 'Active supplier' : 'Inactive supplier'}
                    >
                      {supplier.active ? 'Active' : 'Inactive'}
                    </span>
                    {supplier.verified && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        aria-label="Verified supplier"
                      >
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {supplier.description && (
                  <p
                    className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-300`}
                  >
                    {supplier.description}
                  </p>
                )}

                <dl className={`space-y-1 mt-auto pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {supplier.contactPerson && (
                    <div className="flex items-center gap-2">
                      <dt className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-24 flex-shrink-0`}>
                        Contact
                      </dt>
                      <dd className={`text-sm ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                        {supplier.contactPerson}
                      </dd>
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2">
                      <dt className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-24 flex-shrink-0`}>
                        Email
                      </dt>
                      <dd className="text-sm">
                        <a
                          href={`mailto:${supplier.email}`}
                          className="text-primary hover:text-accent transition-colors duration-300"
                        >
                          {supplier.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2">
                      <dt className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-24 flex-shrink-0`}>
                        Phone
                      </dt>
                      <dd className={`text-sm ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                        {supplier.phone}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
