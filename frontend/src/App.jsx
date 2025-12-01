import { useState } from 'react';
import colors from './styles/design-tokens/colors';
import Button from './components/Button';
import Navbar from './components/Navbar';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Variants Section */}
      <section className="border-b pb-12 mb-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-heading font-bold text-river-bed mb-8">
            Navbar Variants
          </h1>
          
          <div className="space-y-12">
            {/* White Variant */}
            <div>
              <h2 className="text-2xl font-heading font-semibold text-river-bed mb-4">
                White Variant (Default)
              </h2>
              <div className="bg-white border border-geyser rounded-lg overflow-hidden">
                <Navbar variant="white" />
                <div className="px-4 py-8">
                  <p className="text-river-bed font-body">
                    This is the default white variant with border.
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Variant */}
            <div>
              <h2 className="text-2xl font-heading font-semibold text-river-bed mb-4">
                Menu Variant
              </h2>
              <div className="bg-white border border-geyser rounded-lg overflow-hidden">
                <Navbar variant="menu" />
                <div className="px-4 py-8">
                  <p className="text-river-bed font-body">
                    This variant shows a hamburger icon with "MENU" text instead of navigation links on desktop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Original Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-16">
        <h1 className="text-4xl font-heading font-bold text-river-bed mb-8">
          Component Visual Preview
        </h1>

        {/* Buttons Section */}
        <section id="buttons" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Buttons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                text="Primary Button"
                onClick={() => alert('Primary button clicked!')}
                variant="primary"
              />
              <Button 
                text="Secondary Button"
                onClick={() => alert('Secondary button clicked!')}
                variant="secondary"
              />
              <Button 
                text="Danger Button"
                onClick={() => alert('Danger button clicked!')}
                variant="danger"
              />
              <Button 
                text="Outline Button"
                onClick={() => alert('Outline button clicked!')}
                variant="outline"
              />
              <button 
                className="px-8 py-8 rounded-lg transition-colors font-medium"
                style={{ padding: '8px', color: colors['river-bed'] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Ghost Button
              </button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <button 
                className="px-8 py-8 text-white rounded-lg text-sm font-medium"
                style={{ padding: '8px', backgroundColor: colors['gulf-stream'] }}
              >
                Small
              </button>
              <button 
                className="px-8 py-8 text-white rounded-lg font-medium"
                style={{ padding: '8px', backgroundColor: colors['gulf-stream'] }}
              >
                Medium
              </button>
              <button 
                className="px-8 py-8 text-white rounded-lg text-lg font-medium"
                style={{ padding: '8px', backgroundColor: colors['gulf-stream'] }}
              >
                Large
              </button>
              <button 
                className="px-8 py-8 text-white rounded-lg cursor-not-allowed font-medium" 
                style={{ padding: '8px', backgroundColor: '#9ca3af' }}
                disabled
              >
                Disabled
              </button>
            </div>
          </div>
        </section>

        {/* Forms Section */}
        <section id="forms" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Forms</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-river-bed mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ borderColor: colors['geyser'] }}
                onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${colors['gulf-stream']}`}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-river-bed mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ borderColor: colors['geyser'] }}
                onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${colors['gulf-stream']}`}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-river-bed mb-1">Email (Error State)</label>
              <input
                type="email"
                className="w-full px-4 py-2 border-2 border-red-500 rounded-lg focus:outline-none"
                placeholder="invalid@email"
              />
              <p className="text-sm text-red-600 mt-1">Please enter a valid email address</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-river-bed mb-1">Email (Success State)</label>
              <input
                type="email"
                className="w-full px-4 py-2 border-2 border-green-500 rounded-lg focus:outline-none"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-river-bed mb-1">Select Program</label>
              <select 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors['geyser'] }}
                onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${colors['gulf-stream']}`}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <option>Select a program</option>
                <option>Basketball</option>
                <option>Soccer</option>
                <option>Tennis</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="w-4 h-4 rounded" 
                style={{ accentColor: colors['gulf-stream'] }}
              />
              <label htmlFor="terms" className="text-sm text-river-bed">I agree to the terms and conditions</label>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section id="cards" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="bg-white rounded-lg shadow-md"
              style={{ border: `1px solid ${colors['geyser']}`, padding: '8px' }}
            >
              <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">Default Card</h3>
              <p className="text-oslo-gray mb-4">This is a standard card with shadow and rounded corners.</p>
              <button 
                className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                style={{ padding: '8px', backgroundColor: colors['gulf-stream'] }}
              >
                Learn More
              </button>
            </div>
            <div 
              className="bg-white rounded-lg"
              style={{ border: `2px solid ${colors['river-bed']}`, padding: '8px' }}
            >
              <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">Outlined Card</h3>
              <p className="text-oslo-gray mb-4">This card uses a border instead of shadow.</p>
              <button 
                className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                style={{ padding: '8px', backgroundColor: colors['river-bed'] }}
              >
                View Details
              </button>
            </div>
            <div 
              className="bg-white rounded-lg shadow-xl"
              style={{ padding: '8px' }}
            >
              <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">Elevated Card</h3>
              <p className="text-oslo-gray mb-4">This card has a stronger shadow for emphasis.</p>
              <button 
                className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                style={{ padding: '8px', backgroundColor: colors['gulf-stream'] }}
              >
                Register
              </button>
            </div>
          </div>
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md">
              <div 
                className="h-48"
                style={{ background: `linear-gradient(to right, ${colors['gulf-stream']}, #6fa0a1)` }}
              ></div>
              <div style={{ padding: '8px' }}>
                <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">Image Card</h3>
                <p className="text-oslo-gray mb-4">This card has an image at the top with content below.</p>
                <button 
                  className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                  style={{ padding: '8px', backgroundColor: colors['gulf-stream'] }}
                >
                  View Event
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section id="navigation" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Navigation</h2>
          <div 
            className="bg-white shadow-sm"
            style={{ borderBottom: `1px solid ${colors['geyser']}` }}
          >
            <nav className="max-w-6xl mx-auto flex items-center justify-between" style={{ padding: '16px' }}>
              <img 
                src="/FGA-Logo.png" 
                alt="FGA Logo" 
                style={{ height: '55px', width: 'auto' }}
              />
              <div className="flex gap-6">
                <a 
                  href="#" 
                  className="font-medium pb-1"
                  style={{ color: colors['gulf-stream'], borderBottom: `2px solid ${colors['gulf-stream']}` }}
                >
                  Home
                </a>
                <a 
                  href="#" 
                  className="font-medium"
                  style={{ color: colors['river-bed'] }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors['gulf-stream']}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors['river-bed']}
                >
                  Programs
                </a>
                <a 
                  href="#" 
                  className="font-medium"
                  style={{ color: colors['river-bed'] }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors['gulf-stream']}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors['river-bed']}
                >
                  Events
                </a>
                <a 
                  href="#" 
                  className="font-medium"
                  style={{ color: colors['river-bed'] }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors['gulf-stream']}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors['river-bed']}
                >
                  About
                </a>
              </div>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: colors['geyser'] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['gulf-stream']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: colors['river-bed'] }}
                >
                  <path 
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
                    fill="currentColor"
                  />
                  <path 
                    d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
            </nav>
          </div>
        </section>

        {/* Modals & Dialogs Section */}
        <section id="modals" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Modals & Dialogs</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 text-white rounded-lg font-medium"
            style={{ padding: '8px', backgroundColor: colors['gulf-stream'] }}
          >
            Open Modal
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div 
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 flex flex-col"
                style={{ padding: '24px', minHeight: '240px' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-heading font-semibold text-river-bed">Confirm Deletion</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-river-bed hover:text-red-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-oslo-gray" style={{ marginTop: '12px', marginBottom: '24px' }}>
                  Are you sure you want to delete this item? This action cannot be undone.
                </p>
                <div className="flex gap-4 justify-end" style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg font-medium"
                    style={{ 
                      padding: '8px', 
                      border: `1px solid ${colors['river-bed']}`, 
                      color: colors['river-bed'],
                      backgroundColor: 'transparent'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
                    style={{ padding: '8px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Alerts Section */}
        <section id="alerts" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Alerts</h2>
          <div className="space-y-4 max-w-2xl">
            <div className="bg-green-100 border-l-4 border-green-500 rounded" style={{ padding: '16px' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Success!</h4>
                  <p className="text-green-700">Your registration was successful.</p>
                </div>
                <button className="text-green-800 hover:text-green-600">×</button>
              </div>
            </div>
            <div className="bg-red-100 border-l-4 border-red-500 rounded" style={{ padding: '16px' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Error</h4>
                  <p className="text-red-700">Please check your input and try again.</p>
                </div>
                <button className="text-red-800 hover:text-red-600">×</button>
              </div>
            </div>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded" style={{ padding: '16px' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Warning</h4>
                  <p className="text-yellow-700">Your session will expire in 5 minutes.</p>
                </div>
                <button className="text-yellow-800 hover:text-yellow-600">×</button>
              </div>
            </div>
            <div className="bg-blue-100 border-l-4 border-blue-500 rounded" style={{ padding: '16px' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Info</h4>
                  <p className="text-blue-700">New events are posted every Monday.</p>
                </div>
                <button className="text-blue-800 hover:text-blue-600">×</button>
              </div>
            </div>
          </div>
        </section>

        {/* Tables Section */}
        <section id="tables" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Tables</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr 
                  className="text-white"
                  style={{ backgroundColor: colors['river-bed'] }}
                >
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  className="bg-white hover:bg-[#f0f5f5]"
                  style={{ borderBottom: `1px solid ${colors['geyser']}` }}
                >
                  <td className="px-6 py-4 text-river-bed">John Doe</td>
                  <td className="px-6 py-4 text-oslo-gray">john@example.com</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      className="text-sm"
                      style={{ color: colors['gulf-stream'] }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#6fa0a1'}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors['gulf-stream']}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                <tr 
                  className="hover:bg-[#f0f5f5]"
                  style={{ backgroundColor: colors['geyser'], borderBottom: `1px solid ${colors['geyser']}` }}
                >
                  <td className="px-6 py-4 text-river-bed">Jane Smith</td>
                  <td className="px-6 py-4 text-oslo-gray">jane@example.com</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Pending</span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      className="text-sm"
                      style={{ color: colors['gulf-stream'] }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#6fa0a1'}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors['gulf-stream']}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                <tr 
                  className="bg-white hover:bg-[#f0f5f5]"
                  style={{ borderBottom: `1px solid ${colors['geyser']}` }}
                >
                  <td className="px-6 py-4 text-river-bed">Bob Johnson</td>
                  <td className="px-6 py-4 text-oslo-gray">bob@example.com</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      className="text-sm"
                      style={{ color: colors['gulf-stream'] }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#6fa0a1'}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors['gulf-stream']}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Lists Section */}
        <section id="lists" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Lists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Unordered List</h3>
              <ul className="list-disc list-inside space-y-2 text-oslo-gray">
                <li>Basketball Program</li>
                <li>Soccer Program</li>
                <li>Tennis Program</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Ordered List</h3>
              <ol className="list-decimal list-inside space-y-2 text-oslo-gray">
                <li>Register for account</li>
                <li>Select a program</li>
                <li>Complete payment</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Interactive List</h3>
              <div className="space-y-1">
                <div 
                  className="px-4 py-2 text-white rounded cursor-pointer"
                  style={{ backgroundColor: colors['gulf-stream'] }}
                >
                  Dashboard
                </div>
                <div 
                  className="px-4 py-2 rounded cursor-pointer"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Events
                </div>
                <div 
                  className="px-4 py-2 rounded cursor-pointer"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Programs
                </div>
                <div 
                  className="px-4 py-2 rounded cursor-pointer"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Settings
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Divided List</h3>
              <div 
                className="rounded"
                style={{ border: `1px solid ${colors['geyser']}` }}
              >
                <div 
                  className="px-4 py-3"
                  style={{ borderBottom: `1px solid ${colors['geyser']}` }}
                >
                  Item 1
                </div>
                <div 
                  className="px-4 py-3"
                  style={{ borderBottom: `1px solid ${colors['geyser']}` }}
                >
                  Item 2
                </div>
                <div className="px-4 py-3">Item 3</div>
              </div>
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section id="icons" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Icons</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Icon Sizes</h3>
              <div className="flex items-center gap-6">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                <span className="text-sm text-oslo-gray">xs (12px)</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                <span className="text-sm text-oslo-gray">sm (16px)</span>
                <div className="w-5 h-5 rounded" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                <span className="text-sm text-oslo-gray">md (20px)</span>
                <div className="w-6 h-6 rounded" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                <span className="text-sm text-oslo-gray">lg (24px)</span>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                <span className="text-sm text-oslo-gray">xl (32px)</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Icon Colors</h3>
              <div className="flex items-center gap-6">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: colors['river-bed'] }}></div>
                <span className="text-sm text-oslo-gray">Default</span>
                <div className="w-6 h-6 rounded" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                <span className="text-sm text-oslo-gray">Primary</span>
                <div className="w-6 h-6 rounded" style={{ backgroundColor: colors['oslo-gray'] }}></div>
                <span className="text-sm text-oslo-gray">Secondary</span>
                <div className="w-6 h-6 bg-green-500 rounded"></div>
                <span className="text-sm text-oslo-gray">Success</span>
                <div className="w-6 h-6 bg-red-500 rounded"></div>
                <span className="text-sm text-oslo-gray">Error</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Icons with Labels</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                  <span className="text-oslo-gray">Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                  <span className="text-oslo-gray">User</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                  <span className="text-oslo-gray">Calendar</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tooltips & Popovers Section */}
        <section id="tooltips" className="border-b pb-12" style={{ marginBottom: '12px', paddingBottom: '200px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Tooltips & Popovers</h2>
          <div className="space-y-8" style={{ marginTop: '60px', marginLeft: '120px' }}>
            <div className="relative inline-block">
              <button 
                className="px-4 py-2 text-white rounded-lg"
                style={{ padding: '8px', backgroundColor: colors['gulf-stream'] }}
              >
                Hover me
              </button>
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-white text-sm px-3 py-2 rounded shadow-lg whitespace-nowrap z-10"
                style={{ backgroundColor: colors['river-bed'] }}
              >
                This is a tooltip
                <div 
                  className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent"
                  style={{ borderTopColor: colors['river-bed'] }}
                ></div>
              </div>
            </div>
            <div className="relative inline-block">
              <button 
                className="px-4 py-2 rounded-lg"
                style={{ 
                  padding: '8px', 
                  border: `1px solid ${colors['river-bed']}`, 
                  color: colors['river-bed'],
                  backgroundColor: 'transparent'
                }}
              >
                Click me
              </button>
              <div 
                className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl w-64 z-10"
                style={{ border: `1px solid ${colors['geyser']}`, padding: '8px' }}
              >
                <h4 className="font-semibold text-river-bed mb-2">Popover Title</h4>
                <p className="text-sm text-oslo-gray">This is a popover with more content and formatting.</p>
                <div className="absolute -top-2 left-4 border-4 border-transparent border-b-white"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Dropdowns & Selects Section */}
        <section id="dropdowns" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Dropdowns & Selects</h2>
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-river-bed mb-1">Select Program</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white text-left flex items-center justify-between"
                  style={{ borderColor: colors['geyser'] }}
                  onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${colors['gulf-stream']}`}
                  onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <span>{selectedValue || 'Select a program'}</span>
                  <div 
                    className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                    style={{ borderTopColor: colors['river-bed'] }}
                  ></div>
                </button>
                {isDropdownOpen && (
                  <div 
                    className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg"
                    style={{ borderColor: colors['geyser'] }}
                  >
                    <div 
                      className="cursor-pointer hover:bg-[#f0f5f5]"
                      style={{ padding: '12px' }}
                      onClick={() => { setSelectedValue('Basketball'); setIsDropdownOpen(false); }}
                    >
                      Basketball
                    </div>
                    <div 
                      className="cursor-pointer hover:bg-[#f0f5f5]"
                      style={{ padding: '12px' }}
                      onClick={() => { setSelectedValue('Soccer'); setIsDropdownOpen(false); }}
                    >
                      Soccer
                    </div>
                    <div 
                      className="cursor-pointer hover:bg-[#f0f5f5] rounded-b-lg"
                      style={{ padding: '12px' }}
                      onClick={() => { setSelectedValue('Tennis'); setIsDropdownOpen(false); }}
                    >
                      Tennis
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-river-bed mb-1">Multi-Select</label>
              <div 
                className="rounded-lg min-h-[40px] flex flex-wrap gap-2"
                style={{ border: `1px solid ${colors['geyser']}`, padding: '12px' }}
              >
                <span 
                  className="text-white rounded-full text-sm"
                  style={{ backgroundColor: colors['gulf-stream'], padding: '8px' }}
                >
                  Basketball ×
                </span>
                <span 
                  className="text-white rounded-full text-sm"
                  style={{ backgroundColor: colors['gulf-stream'], padding: '8px' }}
                >
                  Soccer ×
                </span>
                <input type="text" className="flex-1 min-w-[100px] outline-none" style={{ marginLeft: '8px' }} placeholder="Add more..." />
              </div>
            </div>
          </div>
        </section>

        {/* Loading States Section */}
        <section id="loading" className="border-b pb-12" style={{ marginBottom: '12px' }}>
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Loading States</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Spinner</h3>
              <div className="flex items-center gap-4">
                <div 
                  className="w-8 h-8 border-4 rounded-full animate-spin"
                  style={{ borderColor: colors['geyser'], borderTopColor: colors['gulf-stream'] }}
                ></div>
                <span className="text-oslo-gray">Loading events...</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Skeleton Loader</h3>
              <div className="space-y-3 max-w-md">
                <div className="h-4 rounded animate-pulse" style={{ backgroundColor: colors['geyser'] }}></div>
                <div className="h-4 rounded animate-pulse w-3/4" style={{ backgroundColor: colors['geyser'] }}></div>
                <div className="h-4 rounded animate-pulse w-1/2" style={{ backgroundColor: colors['geyser'] }}></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Progress Bar</h3>
              <div className="max-w-md">
                <div className="w-full rounded-full h-2" style={{ backgroundColor: colors['geyser'] }}>
                  <div className="h-2 rounded-full" style={{ width: '65%', backgroundColor: colors['gulf-stream'] }}></div>
                </div>
                <p className="text-sm text-oslo-gray mt-1">65% complete</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-river-bed mb-3">Dots Loader</h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors['gulf-stream'] }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0.1s', backgroundColor: colors['gulf-stream'] }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0.2s', backgroundColor: colors['gulf-stream'] }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Pagination Section */}
        <section id="pagination" className="pb-12">
          <h2 className="text-3xl font-heading font-semibold text-river-bed mb-6">Pagination</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              <button 
                className="px-3 py-2 rounded-lg text-river-bed disabled:opacity-50 disabled:cursor-not-allowed" 
                style={{ 
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = colors['geyser'])}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                disabled
              >
                Previous
              </button>
              <button 
                className="text-white rounded-lg flex items-center justify-center"
                style={{ width: '40px', height: '40px', padding: '8px', backgroundColor: colors['gulf-stream'] }}
              >
                1
              </button>
              <button 
                className="rounded-lg text-river-bed flex items-center justify-center"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                2
              </button>
              <button 
                className="rounded-lg text-river-bed flex items-center justify-center"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                3
              </button>
              <button 
                className="rounded-lg text-river-bed flex items-center justify-center"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                4
              </button>
              <button 
                className="rounded-lg text-river-bed flex items-center justify-center"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                5
              </button>
              <button 
                className="px-3 py-2 rounded-lg text-river-bed"
                style={{ 
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Next
              </button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button 
                className="px-3 py-2 rounded-lg text-river-bed"
                style={{ 
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Previous
              </button>
              <span className="text-oslo-gray">Page 2 of 10</span>
              <button 
                className="px-3 py-2 rounded-lg text-river-bed"
                style={{ 
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Next
              </button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button 
                className="px-3 py-2 rounded-lg text-river-bed"
                style={{ 
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                First
              </button>
              <button 
                className="px-3 py-2 rounded-lg text-river-bed"
                style={{ 
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Previous
              </button>
              <span className="px-4 py-2" style={{ color: colors['river-bed'] }}>Page 3 of 10</span>
              <button 
                className="px-3 py-2 rounded-lg text-river-bed"
                style={{ 
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Next
              </button>
              <button 
                className="px-3 py-2 rounded-lg text-river-bed"
                style={{ 
                  padding: '8px', 
                  border: `1px solid ${colors['geyser']}`,
                  color: colors['river-bed']
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors['geyser']}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Last
              </button>
              <select 
                className="px-3 py-2 border rounded-lg text-river-bed"
                style={{ 
                  borderColor: colors['geyser'],
                  color: colors['river-bed']
                }}
              >
                <option>10 per page</option>
                <option>20 per page</option>
                <option>50 per page</option>
                <option>100 per page</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

