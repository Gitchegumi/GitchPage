"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from "../lib/utils"
import { ModeToggle } from './ui/mode-button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const headerClassName = cn(`
    flex
    flex-col
    py-16
    md:py-20
    lg:py-24
    xl:py-28
    2xl:py-36
    rounded-lg
    mx-16
    shadow-md
    shadow-brand-orange
  `);

  const headerStyle = {
    backgroundImage: "url('/assets/images/Banner1.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <header className='dark:bg-gradient-to-t dark:from-slate-900 dark:to-bg-slate-700 pt-2'>
      {/* Top Material */}
      <div className={headerClassName} style={headerStyle}></div>
      {/* Navigation */}
      <nav className="
        flex
        flex-col
        md:flex-row
        md:justify-between
        items-center
        p-2
        bg-gradient-to-r
        from-brand-blue
        to-brand-blue-dark
        shadow-sm
        shadow-brand-orange
        rounded-lg
        font-oswald
        text-[1em]
        text-white
        z-50
        mx-16
        mt-2
        relative
        ">
        <div className="flex items-center w-full md:w-auto justify-between md:justify-start">
          <div className='
            font-oswald
            px-4
            text-brand-orange
            text-xl
            '>
            <span className='block'>Gitchegumi Media</span>
            <span className='block text-xs'>LLC.</span>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className={`md:flex md:flex-row md:items-center ${isMenuOpen ? 'flex flex-col w-full' : 'hidden'} md:w-auto`}>
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col md:flex-row">
              <NavigationMenuItem className='mr-4 md:mr-16'>
                <Link 
                  href='/'
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent hover:text-brand-orange hover:underline focus:text-brand-orange`}>
                  Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className='mr-4 md:mr-16 bg-transparent hover:bg-transparent font-oswald hover:text-brand-orange hover:underline focus:text-brand-orange'>
                  Projects
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-2 gap-6 p-6 w-[350px] md:w-[600px] lg:w-[800px]">
                    <div>
                      <NavigationMenuLink asChild>
                        <div className='text-2xl font-bold mb-4 font-oswald'>
                          Portfolio
                        </div>
                      </NavigationMenuLink>
                      <ul className="space-y-4">
                        <ListItem href="/portfolio" title="Tech Portfolio">
                          A list of the tech credentials of Gitchegumi.
                        </ListItem>
                        <ListItem href="https://github.com/Gitchegumi" title="GitHub Profile">
                          The GitHub Profile for Gitchegumi
                        </ListItem>
                      </ul>
                    </div>
                    <div>
                      <NavigationMenuLink asChild>
                        <div className='text-2xl font-bold mb-4 font-oswald'>
                          Content Creation
                        </div>
                      </NavigationMenuLink>
                      <ul className="space-y-4">
                        <ListItem href="https://www.youtube.com/@GitcheGumi." target='_blank' title="YouTube">
                          Join Gitchegumi on YouTube!
                        </ListItem>
                        <ListItem href="https://www.twitch.tv/gitchegumi" target='_blank' title="Twitch">
                          Join Gitchegumi on Twitch!
                        </ListItem>
                        <ListItem href="/voice-over" title="Voice Over">
                          Listen to Gitchegumi's VO Demos and Schedule him for your next project!
                        </ListItem>
                        <ListItem href="/blog" title="Blog">
                          Read the latest from Gitchegumi!
                        </ListItem>
                      </ul>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-100 dark:bg-gray-800">
                    <NavigationMenuLink asChild>
                      <div className='text-2xl font-bold mb-4 font-oswald'>
                        Socials
                      </div>
                    </NavigationMenuLink>
                    <ul className="grid grid-cols-3 gap-4">
                      <ListItem href="https://www.instagram.com/gitchegumi" target='_blank' title="Instagram">
                        Follow on Instagram
                      </ListItem>
                      <ListItem href="https://x.com/GitchegumiGames" target='_blank' title="X">
                        Follow on X
                      </ListItem>
                      <ListItem href="https://www.facebook.com/GitchegumiGaming" target='_blank' title="Facebook">
                        Join FB Community
                      </ListItem>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className='mr-4 md:mr-16 bg-transparent hover:bg-transparent font-oswald hover:text-brand-orange hover:underline focus:text-brand-orange'>
                  Shops
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 md:w-[500px]">
                    <ul className="grid grid-cols-2 gap-6">
                      <ListItem href="https://store.gitchegumi.com/" target='_blank' title="Gitchegumi Store">
                        Check out the Gitchegumi Merch Store!
                      </ListItem>
                      <ListItem href="https://www.etsy.com/shop/GitchPrints" target='_blank' title="Etsy Store">
                        Check out the GitchPrints Etsy Store!
                      </ListItem>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className='mt-4 md:mt-0 md:ml-auto'>
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
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
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          {...props}
        >
          <div className="text-base font-medium mb-1 leading-none">{title}</div>
          <p className="text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"