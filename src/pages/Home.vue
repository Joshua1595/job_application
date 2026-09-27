<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
    <!-- Subtle background accents -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-100/40 blur-3xl"></div>
      <div class="absolute top-40 right-0 w-72 h-72 rounded-full bg-indigo-100/30 blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div class="text-center max-w-3xl mx-auto">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-blue-50 text-blue-700 text-sm font-medium ring-1 ring-blue-100">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Thousands of opportunities waiting
        </div>

        <!-- Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
          Find Your Next
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Opportunity
          </span>
        </h1>

        <!-- Subtext -->
        <p class="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Discover curated jobs, apply in minutes, and track every application — all in one clean, modern workspace built for your career.
        </p>

        <!-- CTAs -->
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <RouterLink
            to="/jobs"
            class="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-blue-600 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            Browse Jobs
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </RouterLink>

          <RouterLink
            to="/register"
            class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-white text-slate-700 text-base font-semibold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Account
          </RouterLink>
        </div>

        <!-- Trust / social proof line -->
        <p class="mt-10 text-sm text-slate-500">
          Trusted by job seekers at leading companies worldwide
        </p>
      </div>
    </div>
  </section>
</template>