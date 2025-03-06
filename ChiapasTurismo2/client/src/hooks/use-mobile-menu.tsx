import { useState, useEffect } from 'react';

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('#mobileMenu') && !target.closest('[data-event="click:toggleMobileMenu"]')) {
        setIsOpen(false);
      }
    };

    // Close mobile menu when clicking on navigation link
    const handleNavLinkClick = () => {
      setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    document.querySelectorAll('#mobileMenu a').forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.removeEventListener('click', handleNavLinkClick);
      });
    };
  }, [isOpen]);

  return { isOpen, toggleMobileMenu };
}
