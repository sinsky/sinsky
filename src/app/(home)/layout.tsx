"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import { usePathname } from "next/navigation";

type HeroiconsProps = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
    titleId?: string | undefined;
  }
>;

type NavigationProps = {
  name: string;
  href: string;
  icon: HeroiconsProps;
};

const navigation: NavigationProps[] = [
  { name: "home", href: "/", icon: HomeIcon },
  { name: "about", href: "/about", icon: UsersIcon },
  { name: "contact", href: "/contact", icon: ChatBubbleOvalLeftEllipsisIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const NavArea = ({
  active,
  setSidebarOpen,
}: {
  active: string | null;
  setSidebarOpen?: (value: React.SetStateAction<boolean>) => void;
}) => {
  return (
    <nav className="flex-1 px-2 mt-5 space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={`${item.href}`}
          className={classNames(
            active && active === item.href
              ? "bg-green-800 text-white"
              : "text-white hover:bg-green-600 hover:bg-opacity-75",
            "md:text-md group flex items-center rounded-md px-2 py-2 text-sm font-medium capitalize"
          )}
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        >
          <item.icon
            className="flex-shrink-0 w-6 h-6 mr-3 text-green-300"
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const path = usePathname();

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs bg-green-700">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                      <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-300"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <NavArea active={path} setSidebarOpen={setSidebarOpen} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* サイドバーを強制的に縮小して閉じるアイコンに合わせる */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-1 min-h-0 bg-green-700">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <NavArea active={path} />
            </div>
          </div>
        </div>
        {/* home */}
        <div className="flex flex-col flex-1 md:pl-64">
          <div className="sticky top-0 z-10 pt-1 pl-1 bg-gray-200 border-b border-gray-400 sm:pl-3 sm:pt-0 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-2">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
