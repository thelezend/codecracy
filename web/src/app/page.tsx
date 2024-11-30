import { Features } from "@/components/home-page/features";
import { Hero } from "@/components/home-page/hero";
import { TargetAudience } from "@/components/home-page/target-audience";
import { Team } from "@/components/home-page/team";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <TargetAudience />
      <Features />
      {/* <Explainer /> */}
      <Team />
    </main>
  );
}
