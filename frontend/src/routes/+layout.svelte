<script lang="ts">
  import { page } from '$app/stores';
  import { user, loading } from '$lib/stores/auth';
  import { auth } from '$lib/firebase';
  import { signOut } from 'firebase/auth';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import '../app.css';

  // Reactive statement to handle redirects
  $: if (browser && !$loading && !$user && $page.url.pathname !== '/login') {
    goto('/login');
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      goto('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
</script>

{#if $loading}
  <div class="min-h-screen flex items-center justify-center bg-charcoal">
    <div class="text-shiny-silver">Loading...</div>
  </div>
{:else if !$user && $page.url.pathname !== '/login'}
  <div class="min-h-screen flex items-center justify-center bg-charcoal">
    <div class="text-shiny-silver">Redirecting...</div>
  </div>
{:else}
  <slot />
{/if}

{#if $user && $page.url.pathname !== '/login'}
  <div class="fixed bottom-4 right-4">
    <button
      on:click={handleLogout}
      class="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
    >
      Logout
    </button>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style> 