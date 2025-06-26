# Project Architecture

This project is intentionally lightweight but can be extended easily. Key concepts:

- **AIService** is responsible for matching user queries to data blocks.
- **customBlocks** lives in `src/data/customBlocks.js` and contains all resume information.
- The React UI in `App.js` renders a simple search page and displays the results.

## Suggested Enhancements

- **Modular Components** – Split the UI into smaller components under `src/components` as features grow.
- **External Data Source** – Replace the static blocks file with a CMS or database when more content is required.
- **Unit Tests** – Add tests for `AIService` search logic.
- **Deployment** – Configure GitHub Actions to build and deploy the site automatically.

These ideas aim to keep the codebase maintainable and ready for future expansion.
