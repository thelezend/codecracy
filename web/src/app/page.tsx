import { Hero } from "@/components/home-page/hero";
import { Features } from "@/components/home-page/features";
import { Explainer } from "@/components/home-page/explainer";
import { Team } from "@/components/home-page/team";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Explainer />
      <Team />
    </main>
  );
}
