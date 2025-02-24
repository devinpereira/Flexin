// src/components/Layout.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Topbar from './Layout/Topbar';
import Bottombar from './Layout/Bottombar';
import Navigation from './Layout/Navigation';
import LeftSidebar from './Layout/LeftSidebar';

function Layout({ children }) {
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
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;