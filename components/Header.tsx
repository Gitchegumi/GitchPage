"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  const headerClassName = cn(`
    flex
    flex-col
    p-24
    rounded-lg
    mx-16
    shadow-md
    shadow-brand-orange
  `);

  const headerStyle = {
    backgroundImage: "url('/assets/images/Banner1.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center -250px',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <header>
      {/* Top Material */}
      <div className={headerClassName} style={headerStyle}></div>
      {/* Navigation */}
      <nav className="
        flex
        flex-row
        justify-around
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
        <div className='
          font-oswald
          px-16
          text-brand-orange
          text-xl
          centered
          '>
          <span className='block'>Gitchegumi Media</span>
          <span className='block text-xs'>LLC.</span>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className='mr-16'>
              <Link 
                href='/'
                legacyBehavior
                passHref
              >
                <NavigationMenuLink className={`{navigationMenuTriggerStyle()} hover:text-brand-orange hover:underline focus:text-brand-orange`}>
                Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='mr-16 bg-transparent hover:bg-transparent font-oswald hover:text-brand-orange hover:underline focus:text-brand-orange'>
                Projects
              </NavigationMenuTrigger>
                <NavigationMenuContent className='justify-end'>
                  <NavigationMenuLink asChild>
                    <div className='text-3xl p-2 font-oswald'>
                      Portfolio
                    </div>
                  </NavigationMenuLink>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <ListItem href="/portfolio" title="Tech Portfolio">
                      A list of the tech credentials of Gitchegumi.
                    </ListItem>
                    <ListItem href="https://github.com/Gitchegumi" title="GitHub Profile">
                      The GitHub Profile for Gitchegumi
                    </ListItem>
                  </ul>
                  <NavigationMenuLink asChild>
                    <div className='text-3xl p-2 font-oswald'>
                      Content Creation
                    </div>
                  </NavigationMenuLink>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
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
                  <NavigationMenuLink asChild>
                    <div className='text-xl p-2 font-oswald'>
                      Socials
                    </div>
                  </NavigationMenuLink>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <ListItem href="https://www.instagram.com/gitchegumi" target='_blank' title="Instagram">
                      Follow Gitchegumi on Instagram!
                    </ListItem>
                    <ListItem href="https://x.com/GitchegumiGames" target='_blank' title="X">
                      Follow Gitchegumi on X!
                    </ListItem>
                    <ListItem href="https://www.facebook.com/GitchegumiGaming" target='_blank' title="Facebook">
                      Gitchegumi Gaming Facebook Community!
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='mr-16 bg-transparent hover:bg-transparent font-oswald hover:text-brand-orange hover:underline focus:text-brand-orange'>
                Shops
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <ListItem href="https://store.gitchegumi.com/" target='_blank' title="Gitchegumi Merch">
                      Check out the Gitchegumi Merch Store!
                    </ListItem>
                    <ListItem href="https://www.etsy.com/shop/GitchPrints" target='_blank' title="Etsy">
                      Check out the GitchPrints Etsy Store!
                    </ListItem>
                  </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className='ml-auto mr-16'>
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"