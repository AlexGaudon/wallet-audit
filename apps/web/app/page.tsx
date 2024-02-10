import { getSession } from "@/lib/pb";

const WalletAuditDashboard = () => {
  return (
    <main className="flex-1">
      <section className="pt-12 md:pt-24 lg:pt-32">
        <div className="container space-y-6 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Wallet Audit. Audit instead of Budget.
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Budgeting shouldn't be a source of frustration. WalletAudit is
                born from the realization that understanding your spending
                patterns by category is the key to financial empowerment. No
                more rigid budget constraints – just a clear, insightful view of
                where your money goes.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">
                      Category-Centric Insights
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Dive into a user-friendly dashboard designed to give you a
                      comprehensive breakdown of your spending by category.
                      Easily identify areas where your money is making the most
                      impact.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Simplified Finances</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Say goodbye to complex budgeting methods. WalletAudit
                      streamlines the process, offering simplicity without
                      sacrificing depth. Easily audit your wallet without the
                      headache.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">No More Guilt</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      We get it – life happens. WalletAudit doesn't judge.
                      Instead, it empowers you with knowledge, so you can make
                      informed decisions about your spending without the guilt
                      trip.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default async function Home() {
  const session = await getSession();

  return (
    <main className="w-full">
      {session && (
        <>
          <h1 className="font text-lg">
            Hello <span className="text-orange-600">{session?.name}</span>
          </h1>
          <h1>DASHBOARD</h1>
        </>
      )}

      {!session && <WalletAuditDashboard />}
    </main>
  );
}
