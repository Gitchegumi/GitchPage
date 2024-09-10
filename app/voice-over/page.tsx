import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/utilities/ContactForm';

export const metadata: Metadata = {
  title: 'Voice Over - Gitch\'s Page',
  description: 'Listen to Gitchegumi\'s VO Demos and Schedule him for your next project!',
};

export default function VoiceOver() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Commercial Demo</h2>
          <audio controls className="w-full mb-4">
            <source src='/assets/demos/GITCHEGUMI-MEDIA_COMMERICAL-DEMO.mp3' type='audio/mpeg' />
            Your browser does not support the audio element.
          </audio>
          <Button variant='default' className="z-40 mt-2 text-black bg-brand-blue-light hover:bg-white dark:text-white dark:bg-brand-blue-dark dark:hover:bg-brand-blue">
            <a
              href='/assets/demos/GITCHEGUMI-MEDIA_COMMERICAL-DEMO.mp3'
              download
            >
              Download Commercial Demo
            </a>
          </Button>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">E-learning Demo</h2>
          <audio controls className="w-full mb-4">
            <source src='/assets/demos/GITCHEGUMI-MEDIA_ELEARNING-DEMO.mp3' type='audio/mpeg' />
            Your browser does not support the audio element.
          </audio>
          <Button variant='default' className="z-40 mt-2 text-black bg-brand-blue-light hover:bg-white dark:text-white dark:bg-brand-blue-dark dark:hover:bg-brand-blue">
            <a
              href='/assets/demos/GITCHEGUMI-MEDIA_ELEARNING-DEMO.mp3'
              download={true}
            >
                Download E-learning Demo
            </a>
          </Button>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Bring Your Project to Life with Professional Voiceover</h2>
          <p className="mb-4">
            Are you looking for a versatile voice to elevate your project? Look no further! With experience in both commercial and e-learning voiceover, I bring characters and concepts to life with clarity and enthusiasm.
          </p>
          <p className="mb-4">
            Whether you need a friendly voice for your next ad campaign or an engaging narrator for your educational content, I'm here to deliver high-quality audio that meets your specific needs.
          </p>
          <h3 className="text-2xl font-semibold mb-2">Why Choose Me?</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Versatile voice suitable for various projects</li>
            <li>Quick turnaround times</li>
            <li>Professional home studio for consistent quality</li>
            <li>Collaborative approach to ensure your vision is realized</li>
          </ul>
          <p className="mb-4">
            Ready to take your project to the next level? Let's work together to create something amazing!
          </p>
        </section>

        {/* Contact form section */}
        <section className="bg-white dark:bg-gray-900 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-4">
            Fill out the form below to discuss your project, request a custom audition, or get a quote. I'll get back to you as soon as possible!
          </p>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}