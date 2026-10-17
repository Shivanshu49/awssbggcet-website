import { Container } from "@/components/shared/Container";
import { EventImage } from "@/components/shared/EventImage";
import { Button } from "@/components/ui/button";
import site from "@/content/site.json";

export default function HomePage() {
  return (
    <Container className="py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink">
        Build Skills. Ship Projects. Grow Together.
      </h1>
      <p className="mt-4 text-lg text-ink-muted/80 max-w-2xl">
        A student-driven developer community at GCET exploring AWS, cloud computing,
        DevOps, AI, and modern software engineering through hands-on learning, technical
        events, and collaborative projects.
      </p>
      <div className="mt-6 flex gap-3">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="px-6 py-3 text-lg"
        >
          <a href="/events" target="_blank" rel="noopener noreferrer">
            Explore Events
          </a>
        </Button>
        <Button
          asChild
          variant="brand"
          size="lg"
          className="px-6 py-3 text-lg"
        >
          <a href="/learning" target="_blank" rel="noopener noreferrer">
            Explore Learning
          </a>
        </Button>
      </div>

      {/* Section B: Community Snapshot */}
      <section className="mt-12 border-y border-border bg-surface/50 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="flex-1">
            <p className="text-2xl font-semibold text-ink">420</p>
            <p className="text-sm text-ink-muted/60">Community Members</p>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-ink">18</p>
            <p className="text-sm text-ink-muted/60">Technical Events</p>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-ink">32</p>
            <p className="text-sm text-ink-muted/60">Hands-on Labs</p>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-ink">27</p>
            <p className="text-sm text-ink-muted/60">Certified Members</p>
          </div>
        </div>
      </section>

      {/* Section C: About the Community */}
      <section className="mt-12 space-y-12">
        <h2 className="text-3xl font-bold text-ink section-heading">About AWS Builder Center GCET</h2>
        <p className="text-2xl text-ink-muted/80 max-w-2xl mb-8">
          A student-driven developer community at GCET exploring AWS, cloud computing,
          DevOps, AI, and modern software engineering through hands-on learning, technical
          events, and collaborative projects.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Hands-on Learning */}
          <div>
            <div className="h-12 bg-gradient-to-br from-aws-orange to-aws-orange/20 rounded-xl flex items-center justify-center mb-4">
              <i className="lucide-react zap-secretarial size-6 text-aws-orange" />
            </div>
            <h3 className="text-xl font-semibold text-ink mb-2">Hands-on Learning</h3>
            <p className="text-sm text-ink-muted/70">
              Learn through practical exercises, guided labs, and implementation-focused sessions.
            </p>
          </div>

          {/* Card 2: Community Building */}
          <div>
            <div className="h-12 bg-gradient-to-br from-aws-squid to-aws-squid/20 rounded-xl flex items-center justify-center mb-4">
              <i className="lucide-react users size-6 text-aws-squid" />
            </div>
            <h3 className="text-xl font-semibold text-ink mb-2">Community Building</h3>
            <p className="text-sm text-ink-muted/70">
              Collaborate with other students, share ideas, and learn from peers.
            </p>
          </div>

          {/* Card 3: Real Projects */}
          <div>
            <div className="h-12 bg-gradient-to-br from-green-600 to-green-600/20 rounded-xl flex items-center justify-center mb-4">
              <i className="lucide-react git-branch size-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-ink mb-2">Real Projects</h3>
            <p className="text-sm text-ink-muted/70">
              Apply concepts by contributing to projects and experimenting with cloud technologies.
            </p>
          </div>

          {/* Card 4: Technical Exploration */}
          <div>
            <div className="h-12 bg-gradient-to-br from-purple-600 to-purple-600/20 rounded-xl flex items-center justify-center mb-4">
              <i className="lucide-react brain-size size-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-ink mb-2">Technical Exploration</h3>
            <p className="text-sm text-ink-muted/70">
              Explore AWS, DevOps, serverless architectures, AI, and related engineering topics.
            </p>
          </div>
        </div>
      </section>

      {/* Section D: Upcoming Events */}
      <section className="mt-12 border-t border-border pt-12">
        <h2 className="text-3xl font-bold text-ink section-heading">Upcoming Events</h2>
        <p className="text-2xl text-ink-muted/70 mb-8">Build your skills and connect with the community</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event 1: Serverless Day - Upcoming */}
          <div className="group rounded-lg bg-surface overflow-hidden hover:bg-surface-alt transition-colors">
            <EventImage
              src="/events/serverless-day-lambda-api-gateway.jpg"
              alt="Serverless Day: Build a REST API with Lambda and API Gateway"
            />
            <div className="p-4">
              <span className="inline-block px-2 py-1 text-xs font-medium text-aws-orange bg-aws-orange/10 rounded-full mb-3">
                Hybrid Workshop
              </span>
              <h3 className="text-lg font-semibold text-ink group-hover:text-aws-orange transition-colors">
                Serverless Day: Build a REST API with Lambda and API Gateway
              </h3>
              <p className="text-sm text-ink-muted/70 mb-4">
                Nov 7, 2026 · 2:00 PM - 6:00 PM
              </p>
              <a
                href="https://forms.gle/awsbcgcet-serverless-day"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aws-orange font-medium hover:underline"
              >
                Register
              </a>
            </div>
          </div>

          {/* Event 2: Cloud Practitioner Bootcamp - Current */}
          <div className="group rounded-lg bg-surface overflow-hidden hover:bg-surface-alt transition-colors">
            <EventImage
              src="/events/cloud-practitioner-bootcamp.jpg"
              alt="AWS Cloud Practitioner Bootcamp"
            />
            <div className="p-4">
              <span className="inline-block px-2 py-1 text-xs font-medium text-aws-orange bg-aws-orange/10 rounded-full mb-3">
                Offline Bootcamp
              </span>
              <h3 className="text-lg font-semibold text-ink group-hover:text-aws-orange transition-colors">
                AWS Cloud Practitioner Bootcamp
              </h3>
              <p className="text-sm text-ink-muted/70 mb-4">
                Oct 17 - Oct 18, 2026 · Seminar Hall, Block A, GCET
              </p>
              <a
                href="https://forms.gle/awsbcgcet-ccp-bootcamp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aws-orange font-medium hover:underline"
              >
                View Details
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/events"
            target="_blank"
            rel="noopener noreferrer"
            className="text-aws-orange font-medium hover:underline"
          >
            View All Events
          </a>
        </div>
      </section>

      {/* Section E: Curated Developer Resources */}
      <section className="mt-12 border-t border-border pt-12">
        <div className="px-6 pb-6">
          <h2 className="text-3xl font-bold text-ink section-heading">Curated Developer Resources</h2>
          <p className="text-2xl text-ink-muted/70 mb-6">LEARN & EXPERIMENT</p>
          <p className="text-lg text-ink-muted/80 mb-8">
            Hand-crafted guides, architecture boilerplates, workshop code repositories,
            and cheat sheets built by GCET student builders for our community.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Learning Paths */}
            <div className="bg-surface rounded-xl p-6 h-full">
              <h3 className="text-xl font-semibold text-ink mb-4">Learning Paths</h3>
              <ul className="space-y-3 text-sm text-ink-muted/70">
                <li>Cloud Foundations & Free Tier Mastery (4 Weeks, Beginner)</li>
                <li>Modern Full-Stack on AWS Amplify Gen 2 (3 Weeks, Intermediate)</li>
                <li>Serverless Microservices & Event Architecture (5 Weeks, Intermediate to Advanced)</li>
                <li>Generative AI Systems with Amazon Bedrock (4 Weeks, Intermediate)</li>
              </ul>
            </div>
            {/* Resources */}
            <div>
              <h3 className="text-xl font-semibold text-ink mb-4">Featured Resources</h3>
              <ul className="space-y-3 text-sm text-ink-muted/70">
                <li>AWS Free Tier Survival & Budget Safety Guide</li>
                <li>Next.js 15 + AWS Amplify Gen 2 Production Starter</li>
                <li>Building RAG on Bedrock: Complete Workshop Repo</li>
                <li>Dockerizing & Deploying Node.js to AWS ECS Fargate</li>
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="/resources"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aws-orange font-medium hover:underline"
            >
              View All Resources
            </a>
          </div>
        </div>
      </section>

      {/* Section F: Learning Paths */}
      <section className="mt-12 bg-gradient-to-br from-surface to-surface/50">
        <div className="px-6 pb-6">
          <h2 className="text-3xl font-bold text-ink section-heading">Learning Paths</h2>
          <p className="text-2xl text-ink-muted/70 mb-8">Structured technical learning journeys</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Path 1: Cloud Foundations */}
            <div className="group rounded-lg bg-surface overflow-hidden hover:bg-surface-alt transition-colors">
              <div className="h-48 w-full flex items-center justify-center">
                <i className="lucide-react zap-secretarial size-24 text-aws-orange" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-ink group-hover:text-aws-orange transition-colors mb-2">Cloud Foundations & Free Tier Mastery</h3>
                <p className="text-sm text-ink-muted/60 mb-4">4 Weeks · Beginner</p>
                <p className="text-sm text-ink-muted/60">
                  Zero to confident on AWS. Master IAM user boundaries, budget alerts, EC2 instance launch, and S3 static hosting.
                </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aws-orange font-medium hover:underline inline-block mt-4"
                >
                  Start Learning
                </a>
              </div>
            </div>

            {/* Learning Path 2: Modern Full-Stack */}
            <div className="group rounded-lg bg-surface overflow-hidden hover:bg-surface-alt transition-colors">
              <div className="h-48 w-full flex items-center justify-center">
                <i className="lucide-react git-branch size-24 text-green-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-ink group-hover:text-green-500 transition-colors mb-2">Modern Full-Stack on AWS Amplify Gen 2</h3>
                <p className="text-sm text-ink-muted/60 mb-4">3 Weeks · Intermediate</p>
                <p className="text-sm text-ink-muted/60">
                  Build production React/Next.js 15 applications with code-first AWS backend definitions in TypeScript.
                </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 font-medium hover:underline inline-block mt-4"
                >
                  Start Learning
                </a>
              </div>
            </div>

            {/* Learning Path 3: Serverless */}
            <div className="group rounded-lg bg-surface overflow-hidden hover:bg-surface-alt transition-colors">
              <div className="h-48 w-full flex items-center justify-center">
                <i className="lucide-react zap size-24 text-yellow-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-ink group-hover:text-yellow-400 transition-colors mb-2">Serverless Microservices & Event Architecture</h3>
                <p className="text-sm text-ink-muted/60 mb-4">5 Weeks · Intermediate to Advanced</p>
                <p className="text-sm text-ink-muted/60">
                  Build high-throughput, low-latency microservices that scale to zero when idle using Lambda, API Gateway, and DynamoDB.
                </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 font-medium hover:underline inline-block mt-4"
                >
                  Start Learning
                </a>
              </div>
            </div>

            {/* Learning Path 4: Generative AI */}
            <div className="group rounded-lg bg-surface overflow-hidden hover:bg-surface-alt transition-colors">
              <div className="h-48 w-full flex items-center justify-center">
                <i className="lucide-react brain-size size-24 text-purple-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-ink group-hover:text-purple-500 transition-colors mb-2">Generative AI Systems with Amazon Bedrock</h3>
                <p className="text-sm text-ink-muted/60 mb-4">4 Weeks · Intermediate</p>
                <p className="text-sm text-ink-muted/60">
                  Construct enterprise-grade RAG applications using Claude, Llama 3, and vector embeddings.
                </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 font-medium hover:underline inline-block mt-4"
                >
                  Start Learning
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section G: Builder Spotlight / Project Showcase */}
      <section className="mt-12 bg-surface/50">
        <div className="px-6 pb-6">
          <h2 className="text-3xl font-bold text-ink section-heading">Builder Spotlight</h2>
          <p className="text-2xl text-ink-muted/70 mb-8">Showcase your technical experiments and projects</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Empty state card 1 */}
            <div className="group rounded-lg bg-border p-6 text-center hover:bg-surface-alt transition-colors">
              <div className="h-12 mx-auto mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="lucide-react zap-secretarial size-6 text-aws-orange" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">Start Building</h3>
              <p className="text-sm text-ink-muted/60">
                Do not have a project yet? Start with our Cloud Foundations learning path and build your first AWS project.
              </p>
              <a
                href="/learning"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aws-orange font-medium hover:underline mt-4 inline-block"
              >
                Explore Learning Paths
              </a>
            </div>

            {/* Empty state card 2 */}
            <div className="group rounded-lg bg-border p-6 text-center hover:bg-surface-alt transition-colors">
              <div className="h-12 mx-auto mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="lucide-react git-branch size-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">Share Your Project</h3>
              <p className="text-sm text-ink-muted/60">
                Built something awesome with AWS? Submit your project to be featured on the Builder Spotlight and connect with fellow student builders.
              </p>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aws-orange font-medium hover:underline mt-4 inline-block"
              >
                Submit Project
              </a>
            </div>

            {/* Empty state card 3 */}
            <div className="group rounded-lg bg-border p-6 text-center hover:bg-surface-alt transition-colors">
              <div className="h-12 mx-auto mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="lucide-react users size-6 text-aws-squid" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">Collaborate with Others</h3>
              <p className="text-sm text-ink-muted/60">
                Find teammates for your next hackathon or project. The AWS Builder Center GCET community is looking for builders just like you.
              </p>
              <a
                href="/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aws-orange font-medium hover:underline mt-4 inline-block"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section H: Why Join the Community? */}
      <section className="mt-12 bg-gradient-to-br from-aws-orange/10 to-surface/50">
        <div className="px-6 pb-6">
          <h2 className="text-3xl font-bold text-ink section-heading">Your Next Build Starts Here.</h2>
          <p className="text-2xl text-ink-muted/80 mb-8">Learn new technologies, explore practical projects, and connect with fellow builders at GCET.</p>
          <div className="flex gap-3">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <a href={site.joinFormUrl} target="_blank" rel="noopener noreferrer">
                Join Club
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <a href="/learning" target="_blank" rel="noopener noreferrer">
                Explore Learning
              </a>
            </Button>
          </div>
        </div>
      </section>

    </Container>
  );
}
