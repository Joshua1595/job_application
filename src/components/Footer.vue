<template>
  <footer class="bg-slate-900 text-slate-400 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main content -->
      <div class="py-12 md:py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <!-- Brand -->
          <div class="md:col-span-2">
            <RouterLink to="/" class="inline-flex items-center gap-2.5 group">
              <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 group-hover:bg-blue-500 transition">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <span class="text-xl font-bold tracking-tight text-white">
                JobBoard
              </span>
            </RouterLink>

            <p class="mt-4 text-sm leading-relaxed text-slate-400 max-w-sm">
              Discover curated opportunities, apply with confidence, and track every application — all in one modern platform built for your career.
            </p>
          </div>

          <!-- Quick links -->
          <div>
            <h3 class="text-sm font-semibold text-white tracking-wide uppercase mb-4">
              Platform
            </h3>
            <ul class="space-y-3">
              <li>
                <RouterLink
                  to="/jobs"
                  class="text-sm text-slate-400 hover:text-white transition"
                >
                  Browse Jobs
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/register"
                  class="text-sm text-slate-400 hover:text-white transition"
                >
                  Create Account
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/login"
                  class="text-sm text-slate-400 hover:text-white transition"
                >
                  Sign In
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-sm font-semibold text-white tracking-wide uppercase mb-4">
              Support
            </h3>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-sm text-slate-400 hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-slate-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-slate-400 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-slate-500">
          © 2026 JobBoard. All rights reserved.
        </p>

        <div class="flex items-center gap-5">
          <a
            href="#"
            class="text-slate-500 hover:text-white transition"
            aria-label="Twitter"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="#"
            class="text-slate-500 hover:text-white transition"
            aria-label="LinkedIn"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="#"
            class="text-slate-500 hover:text-white transition"
            aria-label="GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>