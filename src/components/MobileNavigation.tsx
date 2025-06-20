
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Calendar, Shield, Settings } from 'lucide-react';
import { InteractiveMenu, InteractiveMenuItem } from './ui/interactive-menu';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const routes = ['/buy', '/rent', '/neighborhoods', '/pricing', '/manifesto'];
  
  const menuItems: InteractiveMenuItem[] = [
    { label: 'Buy', icon: Home },
    { label: 'Rent', icon: Briefcase },
    { label: 'Areas', icon: Calendar },
    { label: 'Pricing', icon: Shield },
    { label: 'About', icon: Settings },
  ];

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-black/95 backdrop-blur-sm border-t border-gray-800">
        <div className="menu">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === routes[index];
            const IconComponent = item.icon;

            return (
              <button
                key={item.label}
                className={`menu__item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(routes[index])}
                style={{ '--lineWidth': isActive ? '24px' : '0px' } as React.CSSProperties}
              >
                <div className="menu__icon">
                  <IconComponent className="icon" />
                </div>
                <strong className={`menu__text ${isActive ? 'active' : ''}`}>
                  {item.label}
                </strong>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
