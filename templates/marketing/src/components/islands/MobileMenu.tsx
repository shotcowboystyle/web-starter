/* oxlint-disable jsx-a11y/prefer-tag-over-role -- animated motion.div panel; native <dialog> breaks framer-motion exit animation */
import { Menu, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

import BrandIcon from '~/components/common/BrandIcon';
import { ACTION_LINKS } from '~/site.config';

interface NavChild {
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

interface NavLink {
  label: string;
  href?: string;
  children?: NavChild[];
}

interface MobileMenuProps {
  links: NavLink[];
  currentPath?: string;
  labels?: {
    menu: string;
    getStarted: string;
  };
}

export default function MobileMenu({
  links,
  currentPath = '/',
  labels = {
    getStarted: 'Get Started',
    menu: 'Menu',
  },
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-foreground hover:bg-foreground/5 relative z-50 rounded-md p-2 transition-colors"
        aria-label="Open Mobile Menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'mobile-menu-panel' : undefined}
      >
        <Menu
          className="h-6 w-6"
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="bg-background/60 fixed inset-0 z-60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-out Panel / Full Screen Overlay */}
            <motion.div
              id="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ damping: 30, stiffness: 300, type: 'spring' }}
              className="bg-background md:border-foreground/10 fixed inset-0 z-70 flex h-dvh flex-col p-6 md:inset-auto md:top-0 md:right-0 md:h-full md:w-96 md:border-l md:shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-primary text-2xl font-bold md:text-lg">{labels.menu}</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-full p-2 transition-colors"
                  aria-label="Close Mobile Menu"
                >
                  <X
                    className="h-8 w-8 md:h-6 md:w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <nav
                className="min-h-0 flex-1 overflow-y-auto"
                aria-label="Mobile Menu Links"
              >
                <ul className="m-0 flex list-none flex-col gap-4 p-0 md:gap-2">
                  {links.map((link) => {
                    const isActive = (href: string) => {
                      if (href === '/') {
                        return currentPath === '/';
                      }
                      return currentPath.startsWith(href);
                    };
                    const isLinkActive =
                      isActive(link.href || '') ||
                      (link.children && link.children.map((c) => isActive(c.href)).some(Boolean));

                    return (
                      <li key={link.label}>
                        {link.children ? (
                          <div className="flex flex-col">
                            <div
                              className={`flex items-center justify-between py-2 text-xl font-bold md:text-lg ${
                                isLinkActive ? 'text-primary dark:text-blue-300' : 'text-foreground/80 dark:text-white'
                              }`}
                            >
                              {link.label}
                            </div>
                            <ul className="border-foreground/10 m-0 ml-2 flex list-none flex-col gap-3 border-l-2 pl-4 md:gap-2">
                              {link.children.map((child) => {
                                const Icon = child.icon ? (Icons as any)[child.icon] : null;
                                return (
                                  <li key={child.href}>
                                    <a
                                      href={child.href}
                                      onClick={() => setIsOpen(false)}
                                      className={`flex items-center gap-3 py-2 text-lg transition-colors md:text-base ${
                                        isActive(child.href)
                                          ? 'text-primary font-medium dark:text-blue-300'
                                          : 'text-foreground hover:text-primary dark:text-white dark:hover:text-blue-300'
                                      }`}
                                    >
                                      {Icon && (
                                        <Icon
                                          className="h-5 w-5 md:h-4 md:w-4"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {child.label}
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : (
                          <a
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between py-2 text-xl font-bold transition-colors md:text-lg ${
                              isActive(link.href || '')
                                ? 'text-primary dark:text-blue-300'
                                : 'text-foreground hover:text-primary dark:text-white dark:hover:text-blue-300'
                            }`}
                          >
                            {link.label}
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              whileHover={{ opacity: 1, x: 0 }}
                              className="text-primary opacity-0 transition-opacity group-hover:opacity-100"
                              aria-hidden="true"
                            >
                              →
                            </motion.span>
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-foreground/10 mt-auto flex flex-col gap-4 border-t pt-6 md:pt-8">
                <a
                  href={ACTION_LINKS.primary.href}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 w-full rounded-lg px-4 py-3 text-center font-semibold shadow-lg transition-all"
                >
                  {labels.getStarted}
                </a>

                <div className="mt-4 flex justify-center gap-6">
                  <a
                    href={ACTION_LINKS.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors"
                    aria-label="GitHub"
                  >
                    <BrandIcon
                      icon="github"
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
