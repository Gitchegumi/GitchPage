"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="top-0 right-0 left-0 z-50 w-full md:sticky">
        <nav className="flex z-50 flex-col items-center p-2 mx-16 mt-2 bg-opacity-80 rounded-lg shadow-md md:flex-row md:justify-between bg-brand-blue shadow-brand-orange/40 font-oswald text-[1em] text-soft-white backdrop-blur-md">
          <div className="flex justify-between items-center w-full md:justify-start md:w-auto">
            <Image
              src={"/images/Mascot.png"}
              width={70}
              height={70}
              priority
              alt="Logo Mascot"
              className="hidden md:block w-auto h-15"
            />
            <div className="hidden px-4 text-4xl font-bold md:block font-oswald text-brand-orange">
              Gitchegumi Media
            </div>
            <div className="m-auto md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:text-brand-orange"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`
              md:flex 
              md:flex-row
              md:items-center 
              m-auto ${
                isMenuOpen ? "flex flex-col w-full" : "hidden"
              } md:w-auto`}
          >
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="flex flex-col gap-4 md:flex-row md:gap-16">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`
                      ${navigationMenuTriggerStyle()} 
                      bg-transparent 
                      hover:text-brand-orange 
                      hover:underline 
                      focus:text-brand-orange 
                      hover:bg-transparent 
                      focus:bg-transparent
                      `}
                  >
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:underline hover:bg-transparent focus:bg-transparent font-oswald hover:text-brand-orange focus:text-brand-orange">
                    Work & Content
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="md:-translate-x-1/2">
                    <div className="rounded-lg text-soft-white bg-brand-dark">
                      <div className="grid w-60 md:grid-cols-2 max-h-[calc(100vh-100px)] md:w-[600px] lg:w-[800px]">
                        <div>
                          <NavigationMenuLink asChild>
                            <div className="mb-2 text-2xl font-bold md:mb-4 hover:bg-transparent text-brand-orange font-oswald hover:text-brand-orange">
                              Work
                            </div>
                          </NavigationMenuLink>
                          <ul className="z-50 space-y-2">
                            <ListItem
                              href="/portfolio"
                              title="Technical CV"
                              className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                            >
                              <span className="hidden md:block">
                                A list of the tech credentials of Gitchegumi.
                              </span>
                            </ListItem>
                            <ListItem
                              href="https://github.com/Gitchegumi"
                              title="GitHub Profile"
                              target="_blank"
                              className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                            >
                              <span className="hidden md:block">
                                The GitHub Profile for Gitchegumi
                              </span>
                            </ListItem>
                          </ul>
                        </div>
                        <div>
                          <NavigationMenuLink asChild>
                            <div className="mb-2 text-2xl font-bold md:mb-4 hover:bg-transparent text-brand-orange font-oswald hover:text-brand-orange">
                              Content
                            </div>
                          </NavigationMenuLink>
                          <ul className="space-y-2">
                            <ListItem
                              href="/voice-over"
                              title="Voice Over"
                              className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                            >
                              <span className="hidden md:block">
                                Listen to Gitchegumi's VO Demos and Schedule him
                                for your next project!
                              </span>
                            </ListItem>
                            <ListItem
                              href="/blog"
                              title="Blog"
                              className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                            >
                              <span className="hidden md:block">
                                Read the latest from Gitchegumi!
                              </span>
                            </ListItem>
                            <ListItem
                              href="https://www.youtube.com/@Gitche_Gumi"
                              target="_blank"
                              title="YouTube"
                              className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                            >
                              <span className="hidden md:block">
                                Join Gitchegumi on YouTube!
                              </span>
                            </ListItem>
                            <ListItem
                              href="https://www.twitch.tv/gitchegumi"
                              target="_blank"
                              title="Twitch"
                              className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                            >
                              <span className="hidden md:block">
                                Join Gitchegumi on Twitch!
                              </span>
                            </ListItem>
                          </ul>
                        </div>
                      </div>
                      <div className="p-6 m-4 rounded-lg dark:bg-gray-800 bg-brand-blue font-oswald text-brand-orange">
                        <NavigationMenuLink asChild>
                          <div className="mb-2 text-2xl font-bold text-center md:mb-4 hover:bg-transparent hover:text-brand-orange">
                            Socials
                            <hr />
                          </div>
                        </NavigationMenuLink>
                        <ul className="grid gap-2 md:grid-cols-3">
                          <ListItem
                            href="https://www.instagram.com/gitchegumi"
                            target="_blank"
                            title="Instagram"
                            className="hover:bg-brand-dark/30 hover:text-brand-orange"
                          >
                            <span className="hidden md:block text-soft-white">
                              Follow on Instagram
                            </span>
                          </ListItem>
                          <ListItem
                            href="https://x.com/GitchegumiGames"
                            target="_blank"
                            title="X"
                            className="hover:bg-brand-dark/30 hover:text-brand-orange"
                          >
                            <span className="hidden md:block text-soft-white">
                              Follow on X
                            </span>
                          </ListItem>
                          <ListItem
                            href="https://www.facebook.com/GitchegumiGaming"
                            target="_blank"
                            title="Facebook"
                            className="hover:bg-brand-dark/30 hover:text-brand-orange"
                          >
                            <span className="hidden md:block text-soft-white">
                              Join FB Community
                            </span>
                          </ListItem>
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:underline hover:bg-transparent focus:bg-transparent font-oswald hover:text-brand-orange focus:text-brand-orange">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="md:-translate-x-1/2">
                    <div className="z-50 p-4 w-60 rounded-lg bg-brand-dark font-oswald text-brand-orange md:w-[500px]">
                      <ul className="grid gap-6">
                        <ListItem
                          href="/debtpipe"
                          title="DebtPipe"
                          className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                        >
                          <span className="hidden md:block">
                            Debt management tool - visualize and plan your debt payoff.
                          </span>
                        </ListItem>
                        {/* remark42 */}
                        <ListItem
                          href="/budget"
                          title="Budget Tool"
                          className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                        >
                          <span className="hidden md:block">
                            Monthly budgeting - track income, expenses, and cash flow.
                          </span>
                        </ListItem>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="mr-4 bg-transparent md:left-0 md:mr-16 hover:underline hover:bg-transparent font-oswald hover:text-brand-orange focus:text-brand-orange">
                    Shops
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="md:-translate-x-4/5">
                    <div className="z-50 p-4 w-60 rounded-lg bg-brand-dark font-oswald text-brand-orange md:w-[500px]">
                      <ul className="grid gap-6 md:grid-cols-2">
                        <ListItem
                          href="https://store.gitchegumi.com/"
                          target="_blank"
                          title="Gitchegumi Store"
                          className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                        >
                          <span className="hidden md:block">
                            Check out the Gitchegumi Merch Store!
                          </span>
                        </ListItem>
                        <ListItem
                          href="https://www.etsy.com/shop/GitchPrints"
                          target="_blank"
                          title="Etsy Store"
                          className="mx-2 hover:bg-brand-blue/30 hover:text-brand-orange"
                        >
                          <span className="hidden md:block">
                            Check out the GitchPrints Etsy Store!
                          </span>
                        </ListItem>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, target, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-md p-3 leading-none no-underline             outline-none transition-colors hover:bg-accent             hover:text-accent-foreground focus:text-accent-foreground",
            className,
          )}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          {...props}
        >
          <div className="mb-1 text-base font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
