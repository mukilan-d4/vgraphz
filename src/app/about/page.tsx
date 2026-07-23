export default function AboutPage() {
  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20">

        <h1 className="text-5xl font-bold text-slate-900">
          Building India's Creative Professional Network
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          VgraphZ is a marketplace connecting customers with talented
          photographers, videographers, video editors, photo editors and
          creative professionals across India.
        </p>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Our platform helps customers discover creative professionals based
          on location, skills, experience and portfolio.
        </p>

      </section>


      {/* Mission */}
      <section className="bg-slate-50 py-16">

        <div className="mx-auto max-w-6xl px-6">

          <h2 className="text-3xl font-bold text-slate-900">
            Our Mission
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Our mission is to simplify the way people find creative talent
            while helping photographers, videographers and editors grow their
            professional opportunities.
          </p>

        </div>

      </section>


      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        <h2 className="text-3xl font-bold text-slate-900">
          How VgraphZ Works
        </h2>


        <div className="mt-10 grid gap-8 md:grid-cols-2">


          <div className="rounded-2xl border p-8">

            <h3 className="text-xl font-semibold">
              For Customers
            </h3>

            <ul className="mt-5 space-y-3 text-slate-600">
              <li>✓ Search professionals by category</li>
              <li>✓ View portfolios and experience</li>
              <li>✓ Contact professionals directly</li>
              <li>✓ Choose the right creative partner</li>
            </ul>

          </div>



          <div className="rounded-2xl border p-8">

            <h3 className="text-xl font-semibold">
              For Providers
            </h3>

            <ul className="mt-5 space-y-3 text-slate-600">
              <li>✓ Create a professional profile</li>
              <li>✓ Showcase your portfolio</li>
              <li>✓ Reach new customers</li>
              <li>✓ Grow your creative business</li>
            </ul>

          </div>


        </div>

      </section>


      {/* Trust */}
      <section className="bg-blue-600 py-16">

        <div className="mx-auto max-w-6xl px-6 text-white">

          <h2 className="text-3xl font-bold">
            Why Choose VgraphZ?
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            <div className="rounded-xl bg-white/10 p-6">
              Trusted Creative Profiles
            </div>

            <div className="rounded-xl bg-white/10 p-6">
              Portfolio Based Discovery
            </div>

            <div className="rounded-xl bg-white/10 p-6">
              Direct Customer Connection
            </div>

          </div>

        </div>

      </section>


    </main>
  );
}