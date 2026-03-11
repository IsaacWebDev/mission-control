'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * ClientOnly - Higher-order component for client-only rendering
 * 
 * Purpose: Prevents hydration mismatches for components that depend on
 * client-side state (time, browser APIs, etc.)
 * 
 * Usage:
 *   const TimeDisplay = withClientOnly(({ time }: { time: string }) => (
 *     <span>{time}</span>
 *   ));
 */

export function ClientOnly<P extends object>({
  component: Component,
  ...props
}: { component: ComponentType<P> } & P) {
  return <Component {...(props as P)} />;
}

/**
 * withClientOnly - Wraps a component for client-only rendering with SSR disabled
 * 
 * Benefits over suppressHydrationWarning:
 * - Explicitly declares client-only intent
 * - Provides loading placeholder for consistent SSR/client renders
 * - No console warnings
 * - Better performance (no wasted server render)
 */
export const withClientOnly = <P extends object>(
  Component: ComponentType<P>
) => {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => <div className="w-9 h-9" />, // Placeholder matches button size
  });
};
