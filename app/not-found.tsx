import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start gap-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink">
        Page not found
      </h1>
      <Button asChild size="lg">
        <Link href="/">Back to home</Link>
      </Button>
    </Container>
  );
}
