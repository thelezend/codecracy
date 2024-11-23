import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
          Key Features
        </h2>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <Card>
            <CardHeader>
              <CardTitle>Contribution Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Evaluate pull requests through team voting, assigning points based on perceived impact.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Funding Lock-In</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Optional mechanism to lock in project funding, distributed based on final contribution scores.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Impact Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track contribution scores and gain insights into team members' impact, even without locked funds.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

