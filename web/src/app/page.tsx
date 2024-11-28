import { Hero } from "@/components/home-page/hero";
import { Features } from "@/components/home-page/features";
import { Explainer } from "@/components/home-page/explainer";
import { Team } from "@/components/home-page/team";
import { TargetAudience } from "@/components/home-page/target-audience";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <TargetAudience />
      <Features />
      <Explainer />
      <Team />
    </main>
  );
}
