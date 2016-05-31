# To The Skies
To The Skies is an extensible work of interactive fiction. Basically, that means it's a choose your own adventure game, but people can add on to the "tree" of choices, meaning it could potentially be extremely large, and people could spend hours playing before reaching any sort of ending.
## What languages/frameworks/things does it use?
HTML5/CSS3/JavaScript is used on the front-end, with no major frameworks. Node.js with Express is used on the back-end. PostgreSQL is the database used.
## What state is it in currently?
It is currently in very early development, and at least a month or two out from any sort of release.
## What is the pricing/business model?
It will be completely free to play. It is possible that ads, in-game-purchases, or something similar may be added. However, I personally hate p2w games, and I will make absolutely sure that any sort of paid things will be completely optional and not give a big boost to people who buy them, and To The Skies will be completely playable and enjoyable without paying a dime. Like Reddit Gold.

# Technical Stuff Starts Here

## Setting up your own To The Skies development environment

Important: If you just want to play To The Skies, this is not the right place for you. The following part of the readme is for people who want to contribute to To The Skies by helping to develop it.

### Dependencies:

- Node.js and npm (Node Package Manager)
- PostgreSQL
- Git
- Linux (probably will work on Mac too, but probably not Windows)

### Getting the source code set up and stuff:

1. Clone the repo somewhere safe
2. Navigate to the cloned repo, and install all node dependencies: `npm i`

### Setting up the database:

1. Start up PostgreSQL, listening on the default ports. This varies by operating system/distro, so figure it out.
2. Create a new user named "to_the_skies_dev" with the password "password".
3. Create the template database: `createdb to_the_skies_template -O to_the_skies_dev`
4. Load the contents of the database from the sql dump located at `sql/template.sql`: `psql to_the_skies_template < sql/template.sql`
5. Create the development database from the template: `createdb to_the_skies_dev -O to_the_skies_dev -T to_the_skies_template`

### Running the server:

The server is located at `src/server.js`, so just run that with node (`node src/server.js`) to get the server going. It will use the development database that you created earlier by default.

## Tests

### About the tests

To The Skies uses 3 distinct types of tests: client side unit tests, server side unit tests, and server side integration tests. There are no client side unit tests because anything that they would test can be really easily tested "by hand", and integration tests that interact with the UI, deal with the DOM, etc are hard to write and maintain. The server side unit tests are used where unit tests make sense and don't take excessive effort to write. Integration tests cover everything. Note that the client side tests aren't actually run on the client side, they're run in node.js and 

### Running the tests

Run `npm test` to run all tests. Provide `--help` to see the options, which allow you to choose which tests to run. Without options it runs all tests. Before submitting a pull request, please ensure that your modified code passes ALL tests, and please write tests for most of your code, unless it is very trivial or very difficult to write tests for.
