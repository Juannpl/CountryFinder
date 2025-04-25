<template>
  <nav class="p-4 border-b-1 border-gray-800 flex justify-between items-center bg-opacity-0">
    <div>
      <NuxtLink to="/" class="mr-4 font-medium text-gray-600 hover:text-white" active-class="text-white">Accueil</NuxtLink>
      <NuxtLink to="/countries" class="mr-4 font-medium text-gray-600 hover:text-white" active-class="text-white">Pays</NuxtLink>
    </div>
    <CountrySearch />
  </nav>
</template>
  