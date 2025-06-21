"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "../lib/utils";
import { ModeToggle } from "./ui/ModeButton";
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

  const headerClassName = cn(`
    flex
    flex-col
    py-10
    md:py-10
    lg:py-16
    xl:py-20
    2xl:py-24
    rounded-lg
    mx-16
  `);

  const headerStyle = {
    backgroundImage: "url('/images/Banner1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <>
      {/* Top Material */}
      <div className={headerClassName} style={headerStyle}></div>
      {/* Navigation */}
      <div className="md:sticky top-0 left-0 right-0 z-50 w-full">
        <nav
          className="
          flex
          flex-col
          md:flex-row
          md:justify-between
          items-center
          p-2
          bg-gradient-to-r
          from-brand-blue
          to-brand-dark
          rounded-lg
          font-oswald
          text-[1em]
          text-white
          mx-16
          mt-2
          backdrop-blur-md
          bg-opacity-80
          z-50
          "
        >
          <div className="
                flex
                items-center
                w-full
                md:w-auto
                justify-between
                md:justify-start
              ">
            <div
              className="
            font-oswald
            px-4
            text-brand-orange
            text-xl
            hidden
            md:block
            "
            >
              Gitchegumi Media
            </div>
            <div className="md:hidden m-auto">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-hidden"
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
            className={`md:flex md:flex-row md:items-center m-auto ${
              isMenuOpen ? "flex flex-col w-full" : "hidden"
            } md:w-auto`}
          >
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="flex flex-col md:flex-row">
                <NavigationMenuItem className="mr-4 md:mr-16">
                    <NavigationMenuLink 
                    asChild 
                    className={`${navigationMenuTriggerStyle()} bg-transparent mr-4 hover:text-brand-orange hover:underline focus:text-brand-orange`}
                    >
                      <Link href="/">Home</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="mr-4 md:mr-16 bg-transparent 
                  hover:bg-transparent font-oswald hover:text-brand-orange 
                  hover:underline focus:text-brand-orange">
                    Projects
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="z-60 overflow-visible md:absolute 
                  md:top-full md:left-0 md:-translate-x-1/2 bg-brand-blue-dark/80">
                    <div className="grid md:grid-cols-2 w-60 md:w-[600px] 
                    lg:w-[800px] max-h-[calc(100vh-100px)]">
                      <div>
                        <NavigationMenuLink asChild>
                          <div className="underline text-2xl font-bold mb-2 md:mb-4 font-oswald">
                            Portfolio
                          </div>
                        </NavigationMenuLink>
                        <ul className="space-y-2 z-50">
                          <ListItem href="/portfolio" title="Tech Portfolio">
                            <span className="hidden md:block">
                              A list of the tech credentials of Gitchegumi.
                            </span>
                          </ListItem>
                          <ListItem
                            href="https://github.com/Gitchegumi"
                            title="GitHub Profile"
                            target="_blank"
                          >
                            <span className="hidden md:block">
                              The GitHub Profile for Gitchegumi
                            </span>
                          </ListItem>
                        </ul>
                      </div>
                      <div>
                        <NavigationMenuLink asChild>
                          <div className="underline text-2xl font-bold mb-2 md:mb-4 font-oswald">
                            Content Creation
                          </div>
                        </NavigationMenuLink>
                        <ul className="space-y-2">
                          <ListItem href="/voice-over" title="Voice Over">
                            <span className="hidden md:block">
                              Listen to Gitchegumi's VO Demos and Schedule him
                              for your next project!
                            </span>
                          </ListItem>
                          <ListItem href="/blog" title="Blog">
                            <span className="hidden md:block">
                              Read the latest from Gitchegumi!
                            </span>
                          </ListItem>
                          <ListItem
                            href="https://www.youtube.com/@Gitche_Gumi"
                            target="_blank"
                            title="YouTube"
                          >
                            <span className="hidden md:block">
                              Join Gitchegumi on YouTube!
                            </span>
                          </ListItem>
                          <ListItem
                            href="https://www.twitch.tv/gitchegumi"
                            target="_blank"
                            title="Twitch"
                          >
                            <span className="hidden md:block">
                              Join Gitchegumi on Twitch!
                            </span>
                          </ListItem>
                        </ul>
                      </div>
                    </div>
                    <div className="p-6 bg-gray-100 dark:bg-gray-800">
                      <NavigationMenuLink asChild>
                        <div className="underline text-2xl font-bold mb-2 md:mb-4 font-oswald">
                          Socials
                        </div>
                      </NavigationMenuLink>
                      <ul className="grid md:grid-cols-3 gap-2">
                        <ListItem
                          href="https://www.instagram.com/gitchegumi"
                          target="_blank"
                          title="Instagram"
                        >
                          <span className="hidden md:block">
                            Follow on Instagram
                          </span>
                        </ListItem>
                        <ListItem
                          href="https://x.com/GitchegumiGames"
                          target="_blank"
                          title="X"
                        >
                          <span className="hidden md:block">Follow on X</span>
                        </ListItem>
                        <ListItem
                          href="https://www.facebook.com/GitchegumiGaming"
                          target="_blank"
                          title="Facebook"
                        >
                          <span className="hidden md:block">
                            Join FB Community
                          </span>
                        </ListItem>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="mr-4 md:mr-16 bg-transparent 
                  hover:bg-transparent font-oswald hover:text-brand-orange 
                  hover:underline focus:text-brand-orange">
                    Shops
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-6 w-60 md:w-[500px] z-50">
                      <ul className="grid md:grid-cols-2 gap-6">
                        <ListItem
                          href="https://store.gitchegumi.com/"
                          target="_blank"
                          title="Gitchegumi Store"
                        >
                          <span className="hidden md:block">
                            Check out the Gitchegumi Merch Store!
                          </span>
                        </ListItem>
                        <ListItem
                          href="https://www.etsy.com/shop/GitchPrints"
                          target="_blank"
                          title="Etsy Store"
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
          <div className="mt-4 md:mt-0 md:ml-auto">
            <ModeToggle />
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
            "block select-none rounded-md p-3 leading-none no-underline \
            outline-hidden transition-colors hover:bg-accent \
            hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          {...props}
        >
          <div className="text-base font-medium mb-1 leading-none">{title}</div>
          <p className="text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
