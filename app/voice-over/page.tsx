import React from 'react';
import { Metadata } from 'next';

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
          <a
            href='/assets/demos/GITCHEGUMI-MEDIA_COMMERICAL-DEMO.mp3'
            download
            className="inline-block bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-2 px-4 rounded"
          >
            Download Commercial Demo
          </a>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">E-learning Demo</h2>
          <audio controls className="w-full mb-4">
            <source src='/assets/demos/GITCHEGUMI-MEDIA_ELEARNING-DEMO.mp3' type='audio/mpeg' />
            Your browser does not support the audio element.
          </audio>
          <a
            href='/assets/demos/GITCHEGUMI-MEDIA_ELEARNING-DEMO.mp3'
            download
            className="inline-block bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-2 px-4 rounded"
          >
            Download E-learning Demo
          </a>
        </section>
      </div>
    </main>
  );
}