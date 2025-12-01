export default function ChildPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Child Profile
        </h1>
  
        {/* BASIC INFO */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3 text-emerald-300">
            Basic Information
          </h2>
  
          <div className="space-y-2 text-sm text-slate-200">
            <p>
              <span className="font-semibold text-slate-100">Name:</span>{" "}
              Olivia Rose
            </p>
            <p>
              <span className="font-semibold text-slate-100">Age:</span>{" "}
              3 years old
            </p>
            <p>
              <span className="font-semibold text-slate-100">Preferred
              nickname:</span>{" "}
              Liv
            </p>
          </div>
        </section>
  
        {/* HEALTH & ALLERGIES */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3 text-emerald-300">
            Health & Allergies
          </h2>
  
          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            <li>Allergic to peanuts – avoid all nut products.</li>
            <li>Mild lactose intolerance – oat or almond milk preferred.</li>
            <li>Vitamin D drops once a day (morning).</li>
          </ul>
        </section>
  
        {/* ROUTINE NOTES */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3 text-emerald-300">
            Routine Notes
          </h2>
  
          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            <li>Nap time usually between 1:00pm – 2:30pm.</li>
            <li>
              Calms down well with soft music and a favorite stuffed animal.
            </li>
            <li>
              Screen time limited to 30 minutes in the late afternoon only.
            </li>
          </ul>
        </section>
      </div>
    );
  }
  