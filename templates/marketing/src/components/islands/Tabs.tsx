import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}

export default function Tabs({ items, defaultValue, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.id);

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-6 flex max-w-fit space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-white/5">
        {items.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2',
              activeTab === tab.id
                ? 'text-primary dark:text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5'
            )}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-white/10"
                transition={{ bounce: 0.2, duration: 0.6, type: 'spring' }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-2">
        {items.map(
          (tab) =>
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-black/5 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                {tab.content}
              </motion.div>
            )
        )}
      </div>
    </div>
  );
}
