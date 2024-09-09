import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';

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
      </div>
    </main>
  );
}