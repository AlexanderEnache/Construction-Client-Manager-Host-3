'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    { href: '/dashboard', label: 'All Proposals' },
    { href: '/view-clients', label: 'Clients' }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirect to login after logout
  };

  return (
    <nav className="w-full border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold text-gray-900 dark:text-white"
        >
          MyApp
        </Link>
        <div className="space-x-6 flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
