# PROJECT: AWS BUILDER CENTER GCET — COMPLETE WEBSITE REDESIGN

## 1. ROLE AND OBJECTIVE

Act as a senior frontend engineer, UI/UX designer, design systems architect, and experienced Next.js developer.

Your task is to transform my existing AWS Builder Center GCET website into a premium, modern, responsive, production-quality developer community platform.

The website should look and feel like a professionally designed technology community website, comparable in visual quality to modern developer platforms, open-source communities, cloud engineering websites, and technology event platforms.

This is not a request to build another generic landing page.

I want a complete, detailed, cohesive website with meaningful content, carefully designed sections, polished interactions, a consistent design system, and fully functional navigation.

The website should represent the AWS Builder community at Galgotias College of Engineering & Technology (GCET), Greater Noida.

Its primary audience includes:

* Students interested in AWS and cloud computing.
* Developers learning cloud technologies.
* Students exploring DevOps, AI, serverless computing, and infrastructure.
* Members participating in workshops and technical events.
* Beginners looking for structured developer learning resources.
* Students contributing to projects and the developer community.

The final result should look professional enough to present to students, faculty, technical communities, and potential industry collaborators.

## 2. FIRST: INSPECT THE EXISTING CODEBASE

Before changing any code, inspect the existing project thoroughly.

Understand the current implementation, including:

* Header.tsx
* MobileNav.tsx
* NavLink.tsx
* lib/constants.ts
* app/layout.tsx
* app/page.tsx
* app/globals.css
* Existing components and section components.
* Existing content JSON files.
* Existing asset directories.
* package.json and installed dependencies.
* Existing routing and application architecture.

The existing website already includes a navbar.

Its current functionality includes:

1. A sticky header approximately 64px high.
2. The AWS Builder Center GCET logo or brand text.
3. Desktop navigation links:
   Home, About, Events, Resources, Learning, Contact.
4. A Join Club button.
5. A mobile hamburger menu.
6. A right-side mobile navigation drawer implemented using Radix Dialog.
7. Active navigation styling using usePathname().
8. A shared NAV_ITEMS configuration in lib/constants.ts.
9. A root layout containing Header, main content, and Footer.

PRESERVE THIS FUNCTIONALITY.

Do not replace working components unnecessarily.

Improve their design, responsiveness, accessibility, and maintainability while retaining existing behavior.

The home page currently contains a placeholder. Replace the placeholder with the complete homepage described below.

Do not stop after producing a plan. Implement the actual website.

## 3. DESIGN SYSTEM

Create a cohesive design system and use it consistently throughout the website.

### Visual direction

Use a premium developer-community aesthetic inspired by modern cloud platforms, engineering communities, technical documentation sites, and contemporary SaaS interfaces.

The design must feel original and specifically tailored to AWS Builder Center GCET.

Do not copy another website's exact design.

### Color palette

Use a controlled palette:

* AWS-inspired orange for primary actions and highlights.
* Deep navy or near-black for dark surfaces.
* White and soft off-white for light surfaces.
* Muted slate for secondary text.
* Subtle gray borders for cards and dividers.
* Carefully selected semantic colors for success, information, and warnings.

Use CSS variables or Tailwind theme tokens to maintain consistency.

Avoid using bright colors everywhere.

Orange should highlight important actions, selected states, links, and visual accents.

### Typography

Use a modern, highly readable sans-serif typeface such as Geist or Inter.

Create a clear type scale for:

* Hero headings.
* Section headings.
* Card titles.
* Body text.
* Eyebrows and labels.
* Navigation.
* Metadata and captions.

Use responsive typography with appropriate line lengths, line heights, and font weights.

Large headings should be distinctive without overflowing on mobile.

### Layout and spacing

Use a consistent spacing system.

Create a reusable Container component or equivalent shared layout utility.

Maintain consistent maximum content widths and horizontal padding.

Use a clear visual hierarchy, intentional whitespace, and balanced section proportions.

Avoid unnecessarily narrow content areas, oversized empty spaces, and excessive nested cards.

### Components

Create reusable components where appropriate:

* Container
* SectionHeading
* Button
* Badge
* Card
* EventCard
* ResourceCard
* LearningPathCard
* StatCard
* SocialLinks
* EmptyState
* Footer
* PageHeader

Do not introduce abstractions that make simple sections unnecessarily complicated.

## 4. HEADER AND NAVIGATION

Upgrade the existing header without breaking its functionality.

### Desktop navigation

Retain these links:

* Home
* About
* Events
* Resources
* Learning
* Contact

Keep the Join Club button on the right.

Requirements:

* Sticky positioning.
* A refined translucent background where appropriate.
* Subtle backdrop blur.
* A thin border or divider.
* Clear active-route styling.
* Accessible hover and focus states.
* Smooth, restrained transitions.
* Correct spacing and alignment.
* Responsive behavior across desktop and tablet widths.

The navbar should look premium without being excessively tall.

A subtle background change on scroll is acceptable if implemented accessibly and without unnecessary JavaScript.

### Mobile navigation

Retain the existing Radix Dialog-based mobile drawer.

Requirements:

* Accessible hamburger button.
* Proper dialog labeling.
* Keyboard navigation.
* Escape-to-close behavior.
* Focus management.
* Scroll locking when the drawer is open.
* Clear close button.
* All existing navigation links.
* Full-width Join Club CTA.
* Automatic drawer closure after navigation.
* No horizontal overflow.

Use the existing NAV_ITEMS in lib/constants.ts as the single source of truth.

Do not duplicate navigation configuration.

Ensure the active navigation state works correctly for every implemented route.

## 5. HOMEPAGE STRUCTURE

Build the homepage as a complete, polished experience.

### SECTION A: HERO

Create a striking hero section that immediately communicates the purpose of AWS Builder Center GCET.

Include:

* A small community or technology eyebrow.
* A compelling main headline.
* A concise supporting paragraph.
* A primary CTA: Explore Events.
* A secondary CTA: Explore Learning Paths.
* A community-focused visual element.
* Subtle cloud infrastructure or developer-inspired visual details.

Suggested headline:

"Build Skills. Ship Projects. Grow Together."

Suggested supporting text:

"A student-driven developer community at GCET exploring AWS, cloud computing, DevOps, AI, and modern software engineering through hands-on learning, technical events, and collaborative projects."

Use this copy as a starting point and improve it if necessary.

Visual direction:

* Strong typography.
* Balanced two-column composition on larger screens.
* A carefully composed visual area using existing assets, CSS illustrations, or lightweight decorative graphics.
* Clean responsive stacking on mobile.
* Subtle background grids, gradients, or architectural patterns.
* Strong contrast between the headline, supporting text, and CTAs.

Do not use an enormous gradient blob as the main visual.

Do not fill the hero with fake dashboards, random floating icons, or meaningless statistics.

### SECTION B: COMMUNITY SNAPSHOT

Create a compact section introducing the community.

Possible metrics include:

* Community members.
* Technical events.
* Learning resources.
* Collaborative projects.

IMPORTANT:

Do not invent real membership counts, event totals, achievements, partnerships, or certifications.

Use verified values from the existing project content if available.

If values are unavailable, use descriptive highlights instead of fake statistics.

Possible highlights:

* Learn by building.
* Explore cloud technologies.
* Collaborate on projects.
* Share knowledge.

Use a clean grid with subtle visual accents.

### SECTION C: ABOUT THE COMMUNITY

Explain what AWS Builder Center GCET is and what students can gain from joining.

Include three or four feature cards:

1. Hands-on Learning
   Learn through practical exercises, guided labs, and implementation-focused sessions.

2. Community Building
   Collaborate with other students, share ideas, and learn from peers.

3. Real Projects
   Apply concepts by contributing to projects and experimenting with cloud technologies.

4. Technical Exploration
   Explore AWS, DevOps, serverless architectures, AI, and related engineering topics.

Each card should have:

* A relevant icon.
* A concise title.
* A meaningful description.
* Consistent spacing and visual treatment.

Avoid repetitive copy.

### SECTION D: UPCOMING EVENTS

Build a professional events section.

Include:

* Section heading.
* Short description.
* View All Events link.
* Responsive event-card grid.

Each event card should support:

* Event title.
* Date and time.
* Event category.
* Short description.
* Location or online format.
* Registration status.
* Registration link.
* Optional event image.

Use real event data from the existing repository.

Do not invent confirmed upcoming events or registration URLs.

If no upcoming events are available, show a designed empty state explaining that new events will be announced soon.

Past events may be shown in a separate section or on the events page.

Do not make an event appear upcoming if its date has already passed.

### SECTION E: CURATED DEVELOPER RESOURCES

Create a resource section that helps students discover useful technical materials.

Use the existing resources.json or equivalent content file if available.

Preserve existing resource content and ownership conventions.

Suggested categories:

* AWS Fundamentals.
* Cloud Architecture.
* Linux and Networking.
* DevOps and Containers.
* Serverless Computing.
* AI and Generative AI.
* Developer Tools.
* Project Inspiration.

Each resource card should support:

* Title.
* Category.
* Description.
* Difficulty level where relevant.
* Resource type.
* External destination link.

Use clear icons or small visual indicators.

Include a View All Resources action.

Do not invent resource URLs.

Validate that every displayed external resource link comes from existing content or a verified destination.

### SECTION F: LEARNING PATHS

Create a dedicated section for structured technical learning.

Prioritize the existing learningPaths content in the repository.

If a learning path already exists, preserve its actual title, description, resources, and sequence.

Support the following information where available:

* Learning path title.
* Description.
* Target audience.
* Estimated duration.
* Difficulty level.
* Number of learning stages.
* Topics covered.
* Start Learning CTA.

Possible learning themes include:

* Cloud Foundations.
* AWS Free Tier and Core Services.
* Linux and Networking Fundamentals.
* Cloud Deployment.
* Containers and DevOps.
* Serverless Applications.
* AI Application Development.

These are potential learning themes, not claims that all paths already exist.

Each learning path should look like a structured journey rather than a generic marketing card.

Use progress indicators only when real user progress is implemented.

Do not display fake progress bars or completion percentages.

### SECTION G: BUILDER SPOTLIGHT OR PROJECT SHOWCASE

Create a section that highlights student projects, technical experiments, or community contributions.

Each project card can contain:

* Project title.
* Project description.
* Technologies used.
* Contributor names if available and approved.
* Repository link.
* Live demo link if one exists.

Use existing project information wherever possible.

Do not fabricate projects, contributors, GitHub repositories, awards, or production deployments.

If project data is unavailable, design an attractive contribution-focused empty state encouraging students to share their projects.

### SECTION H: WHY JOIN THE COMMUNITY?

Create a high-quality CTA section.

Suggested headline:

"Your Next Build Starts Here."

Supporting text:

"Learn new technologies, explore practical projects, and connect with fellow builders at GCET."

Include a prominent Join Club button.

Use the existing club registration destination from the project.

If the registration URL is missing, do not invent one.

Create a visually distinctive section using the established color palette.

### SECTION I: FOOTER

Create a comprehensive footer.

Include:

* AWS Builder Center GCET branding.
* Short community description.
* Navigation links.
* Events and learning links.
* Verified social media links.
* Contact information if available.
* Copyright information.

Do not invent official email addresses or social profiles.

Use consistent spacing, readable text, and accessible link styling.

The footer should feel like an intentional part of the website, not an afterthought.

## 6. INTERNAL PAGES

Implement all routes linked from the navigation.

Use the existing route structure if it already exists.

At minimum, provide:

### Home

A complete homepage with all relevant sections.

### About

Include:

* Community introduction.
* Mission and objectives.
* Learning philosophy.
* Community activities.
* Participation and contribution information.

Only state official affiliations or partnerships that are supported by existing content.

### Events

Include:

* Upcoming events.
* Past events.
* Event categories.
* Event details.
* Registration links where available.
* Useful empty states when data is unavailable.

Do not add nonfunctional filters.

If filters are implemented, they must actually filter the displayed event data.

### Resources

Include:

* Resource search.
* Category filtering.
* Difficulty filtering when supported by the data.
* Resource cards.
* External links.
* Clear empty and no-results states.

Search and filtering must work with the actual resource dataset.

### Learning

Include:

* Learning path overview.
* Individual path details.
* Ordered learning stages.
* Linked resources.
* Estimated durations when available.
* Clear next-step actions.

If dynamic routes are introduced, implement appropriate route handling and metadata.

### Contact

Include:

* Available contact information.
* Verified social links.
* A contact form only if a functioning submission mechanism exists or is implemented.

Do not build a form that appears to submit successfully while silently discarding the user's message.

If no backend or submission service is configured, provide a truthful alternative using existing verified contact channels.

## 7. MODERN INTERACTIONS

Use interaction design that improves usability.

Appropriate enhancements include:

* Subtle card hover states.
* Animated button feedback.
* Smooth anchor navigation.
* Lightweight entrance transitions.
* Clear focus indicators.
* Small icon transitions.
* Responsive mobile drawer animations.
* Useful loading states when asynchronous content exists.

Respect prefers-reduced-motion.

Avoid:

* Excessive parallax.
* Constantly moving backgrounds.
* Long animation delays.
* Scroll hijacking.
* Unnecessary custom cursors.
* Animation on every element.
* Heavy animation libraries when CSS is sufficient.

Animations should support the content rather than compete with it.

## 8. TECHNICAL ARCHITECTURE

Work with the existing stack instead of replacing it unnecessarily.

Preferred technologies, if already installed or compatible with the project:

* Next.js App Router.
* React.
* TypeScript.
* Tailwind CSS.
* Radix UI for accessible primitives.
* Lucide React for icons.
* CSS transitions for lightweight animations.

Do not migrate frameworks or replace the existing styling system without a compelling reason.

Use:

* Semantic HTML.
* Reusable components.
* Strict TypeScript types.
* Consistent naming.
* Shared design tokens.
* Centralized navigation configuration.
* Structured content files.
* Server Components by default.
* Client Components only when interactivity requires them.

Avoid turning the entire application into a Client Component.

Keep data-driven content separate from presentation.

Do not create unnecessarily large components containing the entire website.

## 9. CONTENT MANAGEMENT

Preserve the existing content architecture.

If the repository already uses JSON files for content, continue using them.

Keep content separate from reusable UI components.

For example, use the existing equivalent of:

* events.json
* resources.json
* learning paths data
* navigation constants
* community information

Do not rename, delete, or restructure existing content files without a clear reason.

Preserve existing content ownership conventions documented in the project.

If content is missing, build graceful empty states rather than manufacturing facts.

## 10. RESPONSIVE DESIGN

The website must work properly across:

* Small mobile phones.
* Large mobile phones.
* Tablets.
* Laptops.
* Desktop monitors.
* Wide desktop displays.

Requirements:

* No horizontal overflow.
* No clipped headings.
* No overlapping navigation.
* No inaccessible buttons.
* No broken card layouts.
* No excessively small mobile text.
* No desktop-only interactions.
* No content that disappears unexpectedly at smaller breakpoints.

Use responsive grids and flexible layouts.

Check the design at narrow widths, not just at a typical laptop viewport.

Ensure the mobile experience is deliberately designed rather than merely shrinking the desktop layout.

## 11. ACCESSIBILITY

Implement practical accessibility best practices.

Include:

* Semantic landmarks.
* Correct heading hierarchy.
* Keyboard-accessible navigation.
* Visible focus states.
* Accessible button labels.
* Appropriate ARIA attributes.
* Sufficient text contrast.
* Meaningful image alt text.
* Accessible mobile navigation.
* Reduced-motion support.
* Proper form labels and validation messages.

Do not add ARIA attributes where native HTML semantics already provide the necessary behavior.

Ensure the website remains usable without a mouse.

## 12. PERFORMANCE

Optimize the website for real-world usage.

Requirements:

* Use next/image where appropriate.
* Avoid unnecessarily large images.
* Prefer appropriately sized, optimized assets.
* Lazy-load below-the-fold imagery where appropriate.
* Avoid unnecessary client-side JavaScript.
* Avoid large dependency additions.
* Avoid unnecessary state management.
* Prevent avoidable layout shifts.
* Use efficient rendering patterns.
* Keep interactions responsive.
* Avoid heavy visual effects that significantly degrade performance.

Use the Next.js production checklist as a reference for performance, accessibility, and production readiness.

Do not claim the website has achieved a particular performance score without measuring it.

## 13. SEO AND SHARING

Implement appropriate metadata for every major route.

Include:

* Meaningful page titles.
* Useful meta descriptions.
* Appropriate Open Graph metadata.
* Relevant social sharing metadata.
* Favicon and application icon support where assets are available.
* Canonical URL configuration when the official deployment domain is known.
* A sitemap and robots configuration where appropriate.

Use the Next.js Metadata API.

Do not invent a production domain.

Use a configured site URL if the repository already provides one.

Avoid duplicating metadata unnecessarily.

## 14. CODE QUALITY AND ERROR HANDLING

Maintain a reliable development workflow.

Before implementation:

1. Inspect the project.
2. Identify the existing architecture.
3. Check installed dependencies.
4. Identify reusable components.
5. Understand the existing content schema.

During implementation:

1. Preserve working functionality.
2. Make focused changes.
3. Reuse existing utilities.
4. Maintain TypeScript correctness.
5. Avoid unnecessary dependencies.
6. Keep components maintainable.
7. Verify navigation destinations.
8. Check for broken assets and missing content.

After implementation:

1. Run the available lint command.
2. Run the TypeScript check if configured.
3. Run the production build.
4. Fix errors introduced by your changes.
5. Check every navigation link.
6. Check mobile navigation behavior.
7. Verify that search and filters work.
8. Verify external links.
9. Check responsive layouts.
10. Check console errors and accessibility issues where practical.

Do not claim tests passed unless you actually ran them.

If a command fails because of an unrelated pre-existing issue, identify the problem and explain it clearly.

## 15. VISUAL QUALITY REQUIREMENTS

The finished website must satisfy these design expectations:

* A strong visual identity.
* Consistent typography.
* Balanced spacing.
* Clear content hierarchy.
* Professional navigation.
* Carefully designed cards.
* Distinctive section layouts.
* Useful calls to action.
* High-quality mobile presentation.
* Consistent interaction patterns.
* Realistic content.
* No broken or fake functionality.

Avoid the appearance of a generic AI-generated template.

Do not repeat the same three-card grid in every section.

Vary the layouts appropriately: editorial sections, split layouts, event grids, resource collections, learning journeys, and CTA panels.

Use a consistent design system while giving each section a clear purpose.

## 16. IMPLEMENTATION RULES

Do not stop after inspecting the project or presenting recommendations.

Do not provide only a design plan.

Implement the actual changes in the existing repository.

Do not rewrite working components simply to make the code look different.

Do not delete existing features or content without justification.

Do not fabricate event information, registration URLs, community metrics, student projects, partnerships, or contact information.

Do not leave the homepage as a placeholder.

Do not create buttons that do nothing.

Do not add filters that do not filter data.

Do not display fake statistics, fake testimonials, fake progress, or fake achievements.

When an external service or backend is required, implement the available integration if credentials and configuration are present. Otherwise, provide a clear, honest fallback.

Preserve existing design and content decisions where they are already correct, but improve areas that are incomplete, inconsistent, or visually weak.

## 17. FINAL DELIVERABLE

When finished, provide a concise implementation report containing:

1. Major visual improvements.
2. Components created or updated.
3. Pages implemented.
4. Existing functionality preserved.
5. New functionality implemented.
6. Content sources reused.
7. Dependencies added, if any.
8. Validation commands executed and their actual results.
9. Any remaining configuration requirements.
10. Any features that could not be completed and why.

The final result must be a working, cohesive, responsive website—not a mockup or a collection of disconnected UI components.

Begin by inspecting the existing repository and then implement the complete redesign.

## ADDITIONAL REQUIREMENTS: AWS BUILDER CENTER-INSPIRED EXPERIENCE

These requirements extend the existing website redesign specification. They do not replace or remove any previous requirements.

### 1. Resources page: Developer discovery experience

Design `/resources` as a polished technical resource discovery portal inspired by the discovery and toolbox experiences of AWS Builder Center.

The page should include:

* A compact, editorial-style page introduction.
* A prominent resource search bar.
* Technology and topic filters.
* Featured developer resources.
* A curated resource directory.
* Official AWS documentation and tutorials.
* Developer tools and open-source repositories.
* A section for community-curated resources.
* Links to relevant learning paths.
* Clear resource metadata and external navigation.

Use a clean, content-first layout with excellent readability.

Avoid making every resource a large marketing card. Mix compact resource rows, featured cards, category navigation, and selected editorial sections.

Each resource should display its title, description, source, resource type, category, and difficulty when available.

Provide working search and filtering using the existing resource data.

### 2. Learning page: Structured learning portal

Design `/learning` as a professional cloud learning platform inspired by the structured courses and learning-plan experience of AWS Skill Builder.

Include:

* A featured learning experience.
* A searchable or filterable learning-path catalog.
* Beginner, intermediate, and advanced filters.
* Technology and skill categories.
* Clearly presented learning objectives.
* Prerequisites and estimated duration when available.
* Ordered learning stages.
* Hands-on exercises and practical projects.
* Recommended supporting resources.
* Related learning paths.

Create dedicated learning-path detail pages where appropriate.

Each detail page should explain what students will learn, what they need beforehand, which stages they will follow, and which resources they should use.

Make the learning sequence visually understandable through a polished timeline or staged curriculum.

Do not show fake course completion, user progress, ratings, or enrollment counts.

### 3. Stronger visual hierarchy

Use a modern design system with:

* AWS-inspired orange accents.
* White and neutral content surfaces.
* Dark navy sections where visually appropriate.
* Restrained borders and shadows.
* High-quality typography.
* Carefully controlled spacing.
* Responsive layouts.
* Accessible focus states.
* Subtle transitions.

Use varied layouts instead of repeating identical card grids.

The Resources page should emphasize exploration and discovery.

The Learning page should emphasize progression and skill development.

### 4. Preserve the existing website

Retain the existing:

* Header and desktop navigation.
* Mobile navigation drawer.
* Active-route indicators.
* Shared navigation constants.
* Homepage and its existing sections.
* About page.
* Events page.
* Contact page.
* Join Club registration link.
* Footer and verified social links.
* Existing JSON content and ownership conventions.

Do not rebuild the application from scratch.

Inspect the repository and existing content schemas before modifying files.

### 5. Functional requirements

Every interactive element must work.

Implement real resource search, category filtering, difficulty filtering where supported, learning-path navigation, and resource-to-learning-path links.

Use verified external destinations.

If content is missing, provide polished empty states rather than fabricated information.

Keep the existing Next.js App Router architecture, use TypeScript, and prefer Server Components unless client-side interactivity is necessary.

### 6. Production quality

Follow the current Next.js guidance for routing, accessibility, performance, metadata, and production readiness.

Official references:

* Next.js App Router: https://nextjs.org/docs/app
* Production checklist: https://nextjs.org/docs/app/guides/production-checklist
* Metadata and social sharing: https://nextjs.org/docs/app/getting-started/metadata-and-og-images

After implementation, run the available lint, type-check, and production-build commands. Verify both pages on mobile and desktop.

### FINAL INSTRUCTION

Implement these additions alongside the original redesign specification.

Do not stop at a mockup or plan. Make the actual changes in the existing repository, preserve all previous features, reuse existing content, and report which checks were actually completed.
