# Interactive Résumé

This project powers [Théo Pasquier's interactive résumé](https://theocat0.github.io/resume/). It is a React application with a simple AI powered search that returns pre-defined blocks of resume content.

## Getting Started

```bash
npm install
npm start
```

The app will be available at `http://localhost:3000`.

### Building

```bash
npm run build
```

The built files will be generated in the `build/` directory.

## Project Structure

- **src/** – React application source
  - **data/customBlocks.js** – Resume blocks queried by `AIService`
  - **services/AIService.js** – Logic for searching through blocks
  - `App.js` – Main UI
- **public/** – Static files used by React
- **resume/** – Example CRA project kept for reference

To add new sections to the résumé, edit `src/data/customBlocks.js` and restart the development server.

## Future Improvements

See [docs/architecture.md](docs/architecture.md) for more ideas on scaling this project.
