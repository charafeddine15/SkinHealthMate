// SidebarApp.jsx
import React from 'react';
import './style.css';
const SidebarApp = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Add your sidebar content here */}
        <ul>
          <li>Link 1</li>
          <li>Link 2</li>
          {/* Add more links or components as needed */}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarApp;
