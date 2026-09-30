/* oxlint-disable jsx-a11y/no-noninteractive-element-interactions -- hover-intent dropdown handlers on nav/li; links and buttons inside stay keyboard-accessible */
import { ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

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

interface DesktopNavProps {
  links: NavLink[];
  currentPath?: string;
}

export default function DesktopNav({ links, currentPath = '/' }: DesktopNavProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setHoveredIndex(hoveredIndex === index ? null : index);
    } else if (e.key === 'Escape') {
      setHoveredIndex(null);
    }
  };

  return (
    <nav
      className="hidden items-center gap-6 md:flex"
      onMouseLeave={() => setHoveredIndex(null)}
      aria-label="Main Navigation"
    >
      <ul className="m-0 flex list-none items-center gap-6 p-0">
        {links.map((link, index) => {
          const isLinkActive =
            isActive(link.href || '') || (link.children && link.children.some((child) => isActive(child.href)));

          return (
            <li
              key={link.label}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {link.children ? (
                <button
                  className={`flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-sm font-medium transition-colors ${
                    hoveredIndex === index || isLinkActive
                      ? 'text-primary dark:text-blue-300'
                      : 'text-foreground/70 hover:text-foreground dark:text-white dark:hover:text-blue-300'
                  }`}
                  aria-expanded={hoveredIndex === index}
                  aria-haspopup="menu"
                  aria-controls={hoveredIndex === index ? `dropdown-${index}` : undefined}
                  onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  {link.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      hoveredIndex === index ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <a
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isLinkActive
                      ? 'text-primary dark:text-blue-300'
                      : 'text-foreground/70 hover:text-foreground dark:text-white dark:hover:text-blue-300'
                  }`}
                >
                  {link.label}
                </a>
              )}

              <AnimatePresence>
                {hoveredIndex === index && link.children && (
                  <motion.div
                    id={`dropdown-${index}`}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-0 z-50 w-60 pt-4"
                    role="menu"
                  >
                    <div className="bg-background/95 border-foreground/10 overflow-hidden rounded-xl border p-2 shadow-xl shadow-black/5 backdrop-blur-xl">
                      <ul className="m-0 flex list-none flex-col gap-1 p-0">
                        {link.children.map((child) => {
                          const Icon = child.icon ? (Icons as any)[child.icon] : null;
                          return (
                            <li
                              key={child.href}
                              role="none"
                            >
                              <a
                                href={child.href}
                                className="hover:bg-foreground/5 group block rounded-lg px-4 py-3 text-sm transition-colors"
                                role="menuitem"
                              >
                                <div className="flex items-center gap-3">
                                  {Icon && (
                                    <Icon
                                      className="text-primary/70 group-hover:text-primary h-5 w-5 transition-colors dark:text-white/70 dark:group-hover:text-blue-300"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <div>
                                    <div className="text-foreground group-hover:text-primary font-medium transition-colors dark:text-white dark:group-hover:text-blue-300">
                                      {child.label}
                                    </div>
                                    {child.description && (
                                      <div className="text-foreground/50 mt-1 line-clamp-1 text-xs">
                                        {child.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
