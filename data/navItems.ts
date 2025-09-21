// src/data/navItems.js

export default [
  {
    name: 'Dashboard',
    link: '/admin',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13z" /></svg>`,
  },
  {
    name: 'Batch',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>`,
    children: [
      { name: 'All Batch', link: '/admin/batch' },
      { name: 'Add Batch', link: '/admin/batch/add' },
      { name: 'Categories', link: '#' },
    ],
  },
  {
    name: 'Analytics',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
    children: [
      { name: 'Sales Report', link: '#' },
      { name: 'Revenue', link: '#' },
      { name: 'Traffic', link: '#' },
    ],
  },
  {
    name: 'Sale',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4V2a1 1 0 0 1 2 0v2h6V2a1 1 0 0 1 2 0v2h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1z"/></svg>`,
    children: [
      { name: 'Recent Sales', link: '#' },
      { name: 'Promotions', link: '#' },
    ],
  },
  {
    name: 'Review',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    children: [
      { name: 'Customer Reviews', link: '#' },
      { name: 'Ratings', link: '#' },
    ],
  },
  {
    name: 'Chat',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
    children: [
      { name: 'Customer Support', link: '#' },
      { name: 'Live Chat', link: '#' },
    ],
  },
];