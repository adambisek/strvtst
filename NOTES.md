Developer notes
===================================

This code is richly commented. Please read all my notes in code.

I used Firebase for the first time. There is few technical limitations.
Huge crap is firebase library state storing - one state at the time. On backend is it unusable.

API input is documented on its function definition - closely to code.

Standard.js produces two minor warnings in tests files.
I didn't find quick solution. See comments on that lines.

Usage:
------------
npm install

- npm start
- npm test (in a nutshell is integration tests, but for demonstrations I think it is suffiecient)
- gulp lint
- gulp lint-fix (autofixer by Standard.js, sometimes produces bad indentation)

Caveats:
------------
I know that config should not be in a repository.
Its only for simplicity (npm install and you go) and it would complicate deploy
