import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { marked } from 'marked';

// Rendered at build time from repo-authored files, so the HTML is trusted and the page stays static.
export async function LegalPage({ title, file }: { title: string; file: string }) {
  const markdown = await readFile(path.join(process.cwd(), 'content/legal', file), 'utf8');
  return (
    <article className="mx-auto max-w-3xl px-4 pt-4 pb-20 text-[#CFC5DC] sm:px-6 sm:pt-14">
      <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{title}</h1>
      <div
        className="mt-8 text-sm leading-relaxed sm:text-base [&_a]:text-[#FBBF24] [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-white [&_li]:mt-1 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: marked.parse(markdown, { async: false }) }}
      />
    </article>
  );
}
