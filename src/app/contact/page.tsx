export default function ContactPage() {

  return (

    <main className="mx-auto max-w-6xl px-6 py-20">


      <h1 className="text-5xl font-bold text-slate-900">
        Contact VgraphZ
      </h1>


      <p className="mt-6 text-lg text-slate-600">
        Have questions, suggestions or need support?
        Our team is here to help.
      </p>



      <div className="mt-12 grid gap-8 md:grid-cols-3">


        <div className="rounded-2xl border p-8">

          <h2 className="text-xl font-bold">
            Customer Support
          </h2>

          <p className="mt-4 text-slate-600">
            Need help finding a professional?
          </p>

          <p className="mt-3 font-medium">
            support@vgraphz.com
          </p>

        </div>



        <div className="rounded-2xl border p-8">

          <h2 className="text-xl font-bold">
            Provider Support
          </h2>

          <p className="mt-4 text-slate-600">
            Already registered as a provider?
            Contact us for profile assistance.
          </p>

        </div>



        <div className="rounded-2xl border p-8">

          <h2 className="text-xl font-bold">
            Business Partnership
          </h2>

          <p className="mt-4 text-slate-600">
            Interested in collaborating with VgraphZ?
          </p>

        </div>


      </div>


    </main>

  );
}