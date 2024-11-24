import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <a className="flex items-center justify-center" href="#">
        <span className="font-bold text-xl">CollabScore</span>
      </a>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost" className="text-sm font-medium">
          Features
        </Button>
        <Button variant="ghost" className="text-sm font-medium">
          How It Works
        </Button>
        <Button variant="ghost" className="text-sm font-medium">
          Get Started
        </Button>
      </nav>
    </header>
  )
}

