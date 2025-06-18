'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically handle the form submission,
    // such as sending the data to your server or a third-party service
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <Input type="text" id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <Input type="email" id="email" name="email" required className="mt-1" />
      </div>
      <div>
        <label htmlFor="project-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Type</label>
        <Input type="text" id="project-type" name="project-type" placeholder="e.g., Commercial, E-learning, Narration" className="mt-1" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
        <Textarea id="message" name="message" rows={4} required className="mt-1" />
      </div>
      <Button type="submit" className="text-black bg-brand-blue-light hover:bg-white dark:text-white dark:bg-brand-blue-dark dark:hover:bg-brand-blue">Send Message</Button>
    </form>
  );
}