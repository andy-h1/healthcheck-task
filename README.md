# Livi Task

## Overview

This project is built in Typescript and Vite. I've implemented a custom React hook, `useQuestionNavigation`, to manage the navigation logic of a questionnaire application. The hook controls the flow of questions, tracks user responses, and calculates scores based on answers. It leverages `useReducer` for complex state management, ensuring state transitions are predictable and maintainable.

## User Stories

-   [ ] As a user, I can navigate the questionnaire in a UI. Mimic this design, or make up an even nicer one.
-   [ ] As a user, I can navigate back and forth in the questionnaire.
-   [ ] As a user, after answering all the questions, I am presented with suggested actions to take.
-   [ ] As a user that has completed the questionnaire, I can restart the questionnaire and take it again.
-   [ ] As a user, I can visualize the progress of the questionnaire as I answer the questions.

## TODOs if Given More Time

-   [ ] **Unit Testing:** Implement unit tests for `useQuestionNavigation` and `useCalculateOutcome` to ensure it works as intended.
-   [ ] **User Interface Enhancement:** Develop a more interactive and user-friendly interface for the questionnaire.
-   [ ] **Deploy:** Implement the build for production and deploy onto Netlify/Vercel etc.
