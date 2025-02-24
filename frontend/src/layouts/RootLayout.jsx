// src/layouts/RootLayout.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Topbar from '../components/Layout/Topbar';
import Bottombar from '../components/Layout/Bottombar';
import Navigation from '../components/Layout/Navigation';
import LeftSidebar from '../components/Layout/LeftSidebar';

function RootLayout({ children }) {
  return (
    <div>
      <Topbar />
      <Navigation />
      <LeftSidebar />
      <main>{children}</main>
      <Bottombar />
    </div>
  );
}
RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RootLayout;