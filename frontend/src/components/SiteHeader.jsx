import { NavLink } from 'react-router-dom';

const navGroups = [
  {
    label: 'Customer',
    links: [
      { to: '/', text: 'Home' },
      { to: '/checkout', text: 'Checkout' },
      { to: '/customer/orders', text: 'Orders' },
      { to: '/customer/favorites', text: 'Favorites' }
    ]
  },
  {
    label: 'Driver',
    links: [
      { to: '/driver/dashboard', text: 'Dashboard' },
      { to: '/driver/jobs', text: 'Jobs' },
      { to: '/driver/profile', text: 'Profile' }
    ]
  },
  {
    label: 'Vendor',
    links: [
      { to: '/vendor/dashboard', text: 'Dashboard' },
      { to: '/vendor/applications', text: 'Applications' },
      { to: '/vendor/approved-drivers', text: 'Drivers' }
    ]
  }
];

function SiteHeader () {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <NavLink to="/">Uganda Food Delivery</NavLink>
        <p className="site-header__tagline">Multi-role experience preview</p>
      </div>
      <nav className="site-nav">
        {navGroups.map((group) => (
          <div key={group.label} className="site-nav__group">
            <span className="site-nav__label">{group.label}</span>
            <div className="site-nav__links">
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
                >
                  {link.text}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </header>
  );
}

export default SiteHeader;
