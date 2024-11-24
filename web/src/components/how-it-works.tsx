import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
          How It Works
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <Card>
            <CardHeader>
              <CardTitle>1. Project Initialization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                A team member initializes the project with metadata and authorized team members.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2. Code Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Team members submit pull requests for voting and evaluation.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>3. Voting Process</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Authorized team members vote on contributions, determining their impact score.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>4. Project Closure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Team members vote on project closure, and funds are distributed based on contribution scores.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

