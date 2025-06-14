## 🧠 Cursor Copilot Development Guide

### 🎯 Core Objective
Build a **ChatGPT-like user experience**, with a modular architecture that supports future feature expansion by the admin. Design must be scalable, secure, and intuitive for both frontend users and backend systems.

---

### ✅ General Principles

1. **Use Best Practices Always**
   - All code must adhere to current best practices across frontend and backend.
   - Backend logic should follow API security, async patterns, and maintainability.
   - Frontend should use component-driven design, Svelte 5 conventions, and clean UI/UX principles.
   - Always properly configure TypeScript in the Svelte 5 files correctly.

2. **Be Flexible and Context-Aware**
   - Understand whether the task belongs to frontend or backend.
   - Adjust logic style accordingly (e.g., reactive data stores for frontend vs event-based architecture for backend).

3. **Reference the Right Docs**
   | Domain       | Docs                                                                 |
   |--------------|----------------------------------------------------------------------|
   | Svelte 5     | https://github.com/sveltejs/rfcs/pull/52                            |
   | FastAPI      | https://fastapi.tiangolo.com/deployment/                            |
   | Firebase     | https://firebase.google.com/docs/admin/setup                         |
   | GCS (Python) | https://cloud.google.com/python/docs/reference/storage/latest       |
   | RunPod       | https://docs.runpod.io/docs/intro                                    |
   | Ollama       | https://ollama.com/docs                                              |

4. **Understand the Project Goal**
   - Build a production-ready chat interface powered by LLMs
   - Ensure the design supports future tools like: Idea Enhancer, Idea Protector, Blockchain Record Generator
   - Facilitate tiered features (free, $20.89, $60, $300)
   - Respect user data integrity and chat history continuity

---

### 🧱 Folder Conventions

- `/backend/` → FastAPI logic: `main.py`, `auth.py`, `llm.py`, etc.
- `/frontend/` → SvelteKit frontend: Chat interface, animations, UI state
- `/docs/` → Development standards, dev notes, future planning
- `/scripts/` or `/tools/` → Dev utilities, RunPod automations, setup tools

---

### 🔒 Sensitive Info Handling
- Never commit `.env`, service keys, or secrets
- Use `FIREBASE_CREDENTIAL_PATH` and Docker volumes for secrets

---

### 📦 Admin Roadmap
- Admin will systematically roll out new features
- All components must be modular, scalable, and easy to integrate into existing architecture
- New ideas must be evaluated for collisions and optionally enhanced for uniqueness

Certainly! Here are the latest and most relevant resources for Svelte 5, which will be invaluable for your Arcano frontend project:

---

### 📘 Official Svelte 5 Resources

* **Svelte 5 Release Candidate Announcement**
  Details the features introduced in the release candidate, including the new reactivity model with runes, improved event handling, and native TypeScript support.
  🔗 [Svelte 5 Release Candidate](https://svelte.dev/blog/svelte-5-release-candidate)([app.daily.dev][1])

* **Svelte 5 Roadmap**
  Outlines the planned features and milestones for Svelte 5, providing insights into upcoming developments.
  🔗 [Svelte 5 Roadmap](https://github.com/sveltejs/svelte/projects/5)

* **Svelte 5 Overview by Vercel**
  An in-depth look at what's new in Svelte 5, including compiler improvements and deployment enhancements.
  🔗 [What's New in Svelte 5](https://vercel.com/blog/whats-new-in-svelte-5)([host-hunters.com][2])

* **Svelte 5 Is Coming**
  An announcement discussing the transition to Svelte 5 and what developers can expect.
  🔗 [Svelte 5 Is Coming](https://sveltekit.io/blog/svelte-5)

---

### 🛠️ Migration and Tooling

* **Svelte 5 Migration Guide**
  Comprehensive instructions on how to migrate existing projects to Svelte 5, including syntax changes and new features.
  🔗 [Svelte 5 Migration Guide](https://svelte.dev/blog/svelte-5-migration-guide)

* **SvelteKit Roadmap**
  Details the future plans for SvelteKit, especially in relation to Svelte 5 integration.
  🔗 [SvelteKit Roadmap](https://sveltekit.io/blog/sveltekit-roadmap)([svelte.dev][3])

---

### 📰 Monthly Updates

* **What's New in Svelte: May 2025**
  Highlights recent developments, including asynchronous component support and performance optimizations.
  🔗 [What's New in Svelte: May 2025](https://svelte.dev/blog/whats-new-in-svelte-may-2025)

* **What's New in Svelte: April 2025**
  Covers updates such as improved hydration strategies and new compiler options.
  🔗 [What's New in Svelte: April 2025](https://svelte.dev/blog/whats-new-in-svelte-april-2025)([svelte.dev][4])

---

### 📚 Additional Resources

* **Svelte 5 Features You Should Know**
  An article exploring the key features of Svelte 5, including the runes system and snippets.
  🔗 [Svelte 5 Features You Should Know](https://www.manuelsanchezdev.com/blog/svelte-5-features-you-should-know)([github.com][5])

* **Svelte 5: What's New - CFE.dev**
  A recorded session discussing the new features and improvements in Svelte 5.
  🔗 [Svelte 5: What's New](https://cfe.dev/sessions/jamdev2024-whats-new-svelte-5/)

---

Feel free to explore these resources to get up to speed with Svelte 5 and integrate its features into your project. If you need further assistance or specific examples, don't hesitate to ask!

[1]: https://app.daily.dev/posts/svelte-5-release-candidate-p5svcidxx?utm_source=chatgpt.com "Svelte 5 Release Candidate - daily.dev"
[2]: https://host-hunters.com/threads/vercel-whats-new-in-svelte-5.2980/?utm_source=chatgpt.com "[VERCEL] What's new in Svelte 5 | Host Hunters Community"
[3]: https://svelte.dev/blog/svelte-5-is-alive?utm_source=chatgpt.com "Svelte 5 is alive"
[4]: https://svelte.dev/blog/whats-new-in-svelte-august-2024?utm_source=chatgpt.com "What’s new in Svelte: August 2024"
[5]: https://github.com/MarcoBasileDev/Svelte5?utm_source=chatgpt.com "GitHub - MarcoBasileDev/Svelte5: Svelte 5 has recently been released ..."
