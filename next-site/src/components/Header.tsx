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
      <div className="md:sticky top-0 left-0 right-0 z-50 w-full">
        <nav
          className="
          flex
          flex-col
          md:flex-row
          md:justify-between
          items-center
          p-2
          bg-brand-blue
          rounded-lg
          shadow-brand-orange/40
          shadow-md
          font-oswald
          text-[1em]
          text-soft-white
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
              <Image
               src={"/images/Mascot.png"}
               width="70"
               height="70"
               alt="Logo Mascot"
               className="hidden md:block"
               />
            <div
              className="
            font-oswald
            font-bold
            px-4
            text-brand-orange
            text-4xl
            hidden
            md:block
            "
            >
              Gitchegumi Media
            </div>
            <div className="md:hidden m-auto">
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
            className={`md:flex md:flex-row md:items-center m-auto ${
              isMenuOpen ? "flex flex-col w-full" : "hidden"
            } md:w-auto`}
          >
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="flex flex-col md:flex-row">
                <NavigationMenuItem className="mr-4 md:mr-16">
                    <NavigationMenuLink 
                    asChild 
                    className={`${navigationMenuTriggerStyle()} bg-transparent mr-4 hover:text-brand-orange hover:underline focus:text-brand-orange hover:bg-transparent focus:bg-transparent`}
                    >
                      <Link href="/">Home</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="mr-4 md:mr-16 bg-transparent 
                  hover:bg-transparent font-oswald hover:text-brand-orange 
                  hover:underline focus:bg-transparent focus:text-brand-orange">
                    Projects
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="z-60 overflow-visible md:absolute 
                  md:top-full md:left-0 md:-translate-x-1/2">
                  <div className="bg-brand-dark rounded-lg text-soft-white">
                    <div className="grid md:grid-cols-2 w-60 md:w-[600px] 
                    lg:w-[800px] max-h-[calc(100vh-100px)]">
                      <div>
                        <NavigationMenuLink asChild>
                          <div className="hover:bg-transparent hover:text-brand-orange text-brand-orange text-2xl font-bold mb-2 md:mb-4 font-oswald">
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
                          <div className="text-brand-orange hover:text-brand-orange hover:bg-transparent text-2xl font-bold mb-2 md:mb-4 font-oswald">
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
                    <div className="p-6 m-4 bg-brand-blue font-oswald text-brand-orange rounded-lg dark:bg-gray-800">
                      <NavigationMenuLink asChild>
                        <div className="text-center hover:bg-transparent hover:text-brand-orange text-2xl font-bold mb-2 md:mb-4">
                          Socials
                          <hr />
                        </div>
                      </NavigationMenuLink>
                      <ul className="grid md:grid-cols-3 gap-2">
                        <ListItem
                          href="https://www.instagram.com/gitchegumi"
                          target="_blank"
                          title="Instagram"
                          className="hover:bg-brand-dark/30 hover:text-brand-orange"
                        >
                          <span className="hidden text-soft-white md:block">
                            Follow on Instagram
                          </span>
                        </ListItem>
                        <ListItem
                          href="https://x.com/GitchegumiGames"
                          target="_blank"
                          title="X"
                          className="hover:bg-brand-dark/30 hover:text-brand-orange"
                        >
                          <span className="hidden text-soft-white md:block">
                            Follow on X
                          </span>
                        </ListItem>
                        <ListItem
                          href="https://www.facebook.com/GitchegumiGaming"
                          target="_blank"
                          title="Facebook"
                          className="hover:bg-brand-dark/30 hover:text-brand-orange"
                        >
                          <span className="hidden text-soft-white md:block">
                            Join FB Community
                          </span>
                        </ListItem>
                      </ul>
                    </div>
                  </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="mr-4 md:mr-16">
                  <NavigationMenuTrigger className="mr-4 md:mr-16 bg-transparent 
                  hover:bg-transparent font-oswald hover:text-brand-orange 
                  hover:underline focus:text-brand-orange md:left-0">
                    Shops
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-60 md:w-[500px] z-50 bg-brand-dark font-oswald text-brand-orange rounded-lg">
                      <ul className="grid md:grid-cols-2 gap-6">
                        <ListItem
                          href="https://store.gitchegumi.com/"
                          target="_blank"
                          title="Gitchegumi Store"
                          className="hover:text-brand-orange"
                        >
                          <span className="hidden md:block">
                            Check out the Gitchegumi Merch Store!
                          </span>
                        </ListItem>
                        <ListItem
                          href="https://www.etsy.com/shop/GitchPrints"
                          target="_blank"
                          title="Etsy Store"
                          className="hover:text-brand-orange"
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
