/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: import('firebase/auth').User | null;
    }
    interface PageData {
      user: import('firebase/auth').User | null;
    }
    interface Error {
      message: string;
    }
    interface Platform {}
  }
}

export {}; 