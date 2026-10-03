This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
# Project Structure
## Getting Started
First, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```plaintext
aws-club/
├── app/
│   ├── about/
│   │   └── page.tsx            # About Us page
│   ├── contact/
│   │   └── page.tsx            # Contact & campus map page
│   ├── events/
│   │   └── page.tsx            # Events list and modal details
│   ├── resources/
│   │   └── page.tsx            # Study guides, workshops & learning paths
│   ├── error.tsx               # Global error boundary
│   ├── favicon.ico             # Site icon
│   ├── globals.css             # Global Tailwind & base styling
│   ├── layout.tsx              # Root layout (Header, Footer, Metadata)
│   ├── loading.tsx             # Route loading UI
│   ├── not-found.tsx           # 404 Not Found page
│   ├── page.tsx                # Home / Landing page
│   ├── robots.ts               # Robots.txt generator
│   └── sitemap.ts              # XML Sitemap generator
│
├── components/
│   ├── contact/
│   │   ├── campus-map.tsx      # Interactive/styled campus location map
│   │   └── contact-form.tsx    # Contact & inquiry form
│   ├── events/
│   │   ├── empty-events.tsx    # Empty state for event filters
│   │   ├── event-card.tsx      # Event card component
│   │   ├── event-gallery.tsx   # Past event photos/gallery
│   │   ├── event-list.tsx      # Filterable event list & categories
│   │   └── event-modal.tsx     # Event detail popup modal
│   ├── icons/
│   │   ├── aws-icons.tsx       # AWS service icons (EC2, S3, Lambda, etc.)
│   │   └── social-icons.tsx    # Social media vector icons
│   ├── layout/
│   │   ├── footer.tsx          # Global site footer
│   │   ├── header.tsx          # Global navigation header
│   │   ├── join-modal.tsx      # Community membership modal
│   │   └── mobile-nav.tsx      # Responsive mobile navigation drawer
Project Structure Documentation Request
in readme.md only give m eproject structure
4:51 PM


