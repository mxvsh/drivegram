'use client';

import { motion } from 'framer-motion';
import {
  BookmarkIcon,
  ChevronLeft,
  ChevronRight,
  HomeIcon,
  SettingsIcon,
  TrashIcon,
} from 'lucide-react';

import { useState } from 'react';

import Link from 'next/link';
import {
  useParams,
  usePathname,
} from 'next/navigation';

import { Button } from '#/lib/components/ui/button';

const options = [
  {
    title: 'Home',
    href: '/account/[accountId]',
    icon: HomeIcon,
  },
  {
    title: 'Bookmark',
    href: '/account/[accountId]/bookmark',
    icon: BookmarkIcon,
  },
  {
    title: 'Trash',
    href: '/account/[accountId]/trash',
    icon: TrashIcon,
  },
  {
    title: 'Settings',
    href: '/account/[accountId]/settings',
    icon: SettingsIcon,
  },
];

function Sidebar() {
  const params = useParams();
  const pathname = usePathname();
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div
      className={`relative h-full ${!collapsed && 'w-56'} space-y-1 px-2 pt-2`}
    >
      {options.map((option) => {
        const parsed = option.href.replace(
          /\[([^\]]+)\]/g,
          (_, key) => {
            return params[key] as string;
          },
        );
        const isActive = pathname === parsed;

        return (
          <motion.div key={option.title}>
            <Link
              href={parsed}
              className={`flex cursor-default items-center gap-2 rounded-lg px-4 py-2 ${
                isActive
                  ? // ? 'bg-gradient-to-l from-primary/80 to-primary text-white'
                    'bg-primary font-semibold text-white'
                  : ''
              }`}
              draggable="false"
            >
              <option.icon size={20} />
              {!collapsed && (
                <span>{option.title}</span>
              )}
            </Link>
          </motion.div>
        );
      })}
      <div className="absolute bottom-2 right-2">
        <Button
          variant="outline"
          icon={
            collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )
          }
          size={'xs'}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>
    </div>
  );
}

export default Sidebar;
