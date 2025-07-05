# GitchPage

This project is a personal website, currently undergoing a migration from a static HTML/CSS/JS site to a Next.js application.

## Project Structure

- `next-site/`: This directory contains the new Next.js application, which is actively under development.
- `archive/`: This directory contains the deprecated static website files. These files will be removed once the Next.js site is fully built out and deployed.

## Setup and Installation (Next.js Site)

To set up and run the Next.js development server:

1. Clone the repository:
   ```bash
   git clone https://github.com/gitchegumi/GitchPage.git
   ```
2. Navigate into the project directory:
   ```bash
   cd GitchPage
   ```
3. Navigate into the `next-site` directory:
   ```bash
   cd next-site
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

The Next.js application should now be running at `http://localhost:3000` (or another port if 3000 is in use).

## Building the Next.js Site

To build the Next.js application for production:

1. Navigate into the `next-site` directory:
   ```bash
   cd next-site
   ```
2. Run the build command:
   ```bash
   npm run build
   ```

This will create an optimized production build in the `.next` directory.
