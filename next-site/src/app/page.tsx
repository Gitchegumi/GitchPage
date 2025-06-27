import Image from "next/image";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/getAllPosts";

const allPosts = await getAllPosts();
const recentPosts = allPosts.slice(0, 3);

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-brand-dark to-brand-blue items-center justify-items-center gap-16">
      <main className="flex flex-col row-start-2 items-center text-soft-white">
        <div className="flex md:flex-row-reverse md:m-0 mt-8 flex-col md:gap-20 gap-8 items-center sm:px-20 px-8 py-8">
          <Image
            className="dark:invert rounded-lg shadow-md shadow-soft-white/30"
            src="/images/beach-selfie.jpg"
            alt="Beach selfie"
            width={180}
            height={38}
          />
          <div className="flex flex-col gap-4 font-oswald">
            <span className="text-3xl font-bold">
              Welcome to Gitchegumi Media
            </span>
            <span className="w-full md:text-lg">
              I’m Mat—Army vet, tech builder, content creator, voice actor, and unapologetic nerd. Gitchegumi Media is my digital playground, where I blend code with creativity, share my latest projects, write about everything from dev tools to streaming, and run a small shop of original designs and gear. Whether you’re here to check out my work, geek out over a blog post, or snag a sticker, you’re in the right place.
            </span>
            <span className="mt-8">
              Stick around. Explore. Let’s build something cool.
            </span>
          </div>
        </div>
        {/* About Me Section */}
        <div className="bg-brand-dark w-full">
          <div className="max-w-5xl sm:px-20 px-8 font-roboto-serif">
            <div className="flex flex-col gap-8 my-8">
              <h1 className="text-3xl font-bold">
                About Me
              </h1>
              <p className="text-lg">
                From the infantry to AI, my journey has been anything but ordinary.
              </p> 
              <p className="text-lg">
                I began my military career in 2006 as an infantryman, eventually becoming a UH-60 Blackhawk pilot in 2014. In 2023, I transitioned into the tech world through the Army’s Artificial Intelligence Integration Center (AI2C), where I was honored to be part of the fourth cohort of AI Technicians trained at Carnegie Mellon University.
              </p>
              <p className="text-lg">
                Before the military, I studied classical guitar performance at the Boston Conservatory in 2004—a creative foundation that still influences how I approach problem-solving. While on active duty, I earned my Bachelor of Science in Accounting from the University of Minnesota – Crookston in 2022, and I’m currently working toward a Master’s in Applied Business Analytics through American Military University.
              </p>
              <p className="text-lg">
                One of my buddies has been keeping a running tally of all the jobs I’ve had over the years, and the current count is at 56. It’s not a record I set out to break, but it does reflect one truth about me: I’m always learning, always exploring, and never afraid to try something new.
              </p>
              <p className="text-lg">
                Since moving into tech, I’ve immersed myself in the fast-paced world of DevOps, cloud infrastructure, automation, web development, and data analytics. Whether I’m designing a clean, performant website or researching trading algorithms, I approach each challenge with curiosity, adaptability, and a desire to build tools that empower others.
              </p>
              <p className="text-lg">
                This site is where I bring it all together.
              </p>
              <p className="text-lg">
                It’s my digital workshop and journal—a place to share what I’m learning, what I’m building, and what I’m thinking about. You’ll find blog posts here covering everything from technical deep-dives and research experiments to reflections on life, personal milestones, and whatever else I happen to dream up.
              </p>
              <p className="text-lg">
                Thanks for stopping by. I hope you find something here that informs, inspires, or at the very least, sparks an interesting thought.
              </p>
            </div>
          </div>
        </div>
        {/* Latest Blogs Section */}
        <div className="bg-soft-white w-full pb-8">
          <h1 className="text-3xl text-bold text-black text-center py-8">
            Latest Blog Posts
          </h1>
          <div className="grid gap-6 md:grid-cols-3 px-8 sm:px-20">
            {recentPosts.map(post => (
              <BlogCard key={post.slug} {...post} showTags={false} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
