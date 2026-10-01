# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
## Git Commands to create and merge a feature branch.
# Start
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/speech-input

# Work...
# Make your code changes

# Check changes
git status
git diff

# Test
npm run lint
npm run build

# Commit
git add .
git commit -m "Add speech input for expenses"

# Push
git push -u origin feature/speech-input

# Create a Pull Request
Click Compare & pull request.
Give the PR a useful title, for example:

# Review the PR
Before merging, look at the Files changed tab.

# Merge the PR

# Clean up the branch
First switch back to main:
git checkout main
Then update it:
git pull origin main
Then delete your local feature branch:
git branch -d feature/speech-input
If the GitHub branch wasn't automatically deleted by GitHub, you can delete the remote branch:
git push origin --delete feature/speech-input

# Complete workflow
                 ┌──────────────┐
                 │     main     │
                 └──────┬───────┘
                        │
              git checkout -b
                        │
                        ▼
             feature/speech-input
                        │
                 Make changes
                        │
                 Test + lint
                        │
                 git add .
                        │
                 git commit
                        │
                 git push
                        │
                        ▼
                 GitHub Pull Request
                        │
                     Review
                        │
                     Merge
                        │
                        ▼
                 ┌──────────────┐
                 │     main     │
                 └──────────────┘