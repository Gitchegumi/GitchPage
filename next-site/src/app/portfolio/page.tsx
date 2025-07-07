import Certifications from "@/components/utilities/Certifications";
import Image from "next/image";

export const metadata = {
  title: "Technical Portfolio | Gitchegumi Media",
  description:
    "Mathew 'Gitchegumi' Lindholm's technical CV and certifications.",
};

export default function TechnicalPortfolioPage() {
  return (
    <div className="py-12 px-8 min-h-screen sm:px-20 text-soft-white bg-brand-dark">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">
          Mathew "Gitchegumi" Lindholm
        </h1>
        <p className="max-w-2xl text-lg">
          Army veteran turned technologist, blending discipline and creativity
          to build scalable solutions. Experienced in cloud infrastructure,
          DevOps, web development, and AI integrations. Passionate about
          continuous learning and empowering others through technology.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-3xl font-semibold">Experience & Skills</h2>
        <ul className="pl-6 space-y-4 text-lg list-disc">
          <li>
            Over 18 years of military leadership and technical problem-solving
            experience
          </li>
          <li>Full-stack web development with Next.js, React, TypeScript</li>
          <li>
            Containerization and orchestration using Docker, Docker Compose,
            Kubernetes
          </li>
          <li>Infrastructure as Code with Ansible and Terraform</li>
          <li>Cloud environments including Azure and Oracle Cloud</li>
          <li>Continuous Integration & Delivery pipelines (CI/CD)</li>
          <li>Data analysis with Python, Power BI, and Excel</li>
          <li>AI integrations with OpenAI APIs</li>
        </ul>
      </section>

      <Certifications />

      <section className="mb-12">
        <h2 className="mb-4 text-3xl font-semibold">Education</h2>
        <ul className="space-y-2 text-lg">
          <li>
            <strong>Master of Science, Applied Business Analytics</strong> –
            American Military University (in progress)
          </li>
          <li>
            <strong>Bachelor of Science, Accounting</strong> – University of
            Minnesota Crookston, 2022
          </li>
          <li>
            <strong>Executive AI Technician Program</strong> – Carnegie Mellon
            University, 2023
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-3xl font-semibold">Contact & Links</h2>
        <ul className="space-y-2 text-lg underline">
          <li>
            <a
              href="https://github.com/Gitchegumi"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Profile
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/mat-lindholm/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a href="mailto:mat@gitchegumi.com">mat@gitchegumi.com</a>
          </li>
        </ul>
      </section>
    </div>
  );
}
