export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
          Teknik servis yönetimi, sadeleştirildi
        </span>

        <h1 className="mt-8 max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
          Saha operasyonlarınızı tek panelden yönetin.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
          UstaFlow Lite; müşteri kayıtlarını, servis taleplerini, personel
          atamalarını ve görev durumlarını takip etmek isteyen teknik servis ve
          saha ekipleri için geliştirilmiştir.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["Müşteri kayıtları", "Müşteri bilgilerini düzenli ve erişilebilir tutun."],
            ["Servis talepleri", "Yeni talepleri kaydedin ve süreci takip edin."],
            ["Görev yönetimi", "Ekip atamalarını ve görev durumlarını yönetin."],
          ].map(([title, description]) => (
            <section
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="font-semibold text-emerald-300">{title}</h2>
              <p className="mt-3 leading-7 text-slate-400">{description}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
