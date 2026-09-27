<script setup>
defineProps({
  job: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article
    class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
  >

    <div class="flex items-start justify-between gap-4">

      <div>
        <h2 class="text-xl font-semibold text-gray-900">
          {{ job.title }}
        </h2>

        <p class="mt-1 text-gray-600">
          {{ job.company }}
        </p>
      </div>

      <span
        class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full whitespace-nowrap"
      >
        {{ job.type }}
      </span>

    </div>

    <div class="mt-5 space-y-2 text-sm text-gray-600">

      <p>
        📍 {{ job.location }}
      </p>

      <p>
        💰 {{ job.salary }}
      </p>

      <p>
        🏷️ {{ job.category }}
      </p>

    </div>

    <p class="mt-5 text-gray-600 line-clamp-2">
      {{ job.description }}
    </p>

    <div class="mt-6">

      <RouterLink
        :to="`/jobs/${job.id}`"
        class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        View Details
      </RouterLink>

    </div>

  </article>
</template>