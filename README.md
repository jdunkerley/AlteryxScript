# AlteryxScript

An experiment to create a script language which will compile into Alteryx workflows.

Live demo at https://alterscript.io

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the front end app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Parsing Process

1. Input text into list of Tokens
2. Split into statements
3. Merge functions
4. Identify Unary / Binary Operators
5. Convert to Nodes
6. Identify terms
  - Fold Dots into function or assignment
  - Within a term:
  a. Assignment
  b. Unary operators (+ / - / !)
  c. Binary operators ()
  - Must become a single node otherwise not valid statement

- Initial version will not handle comment folding
