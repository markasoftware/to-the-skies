# To The Skies

[![Build Status](https://travis-ci.org/markasoftware/to-the-skies.svg?branch=master)](https://travis-ci.org/markasoftware/to-the-skies)

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

Also Important: This is not a good way to set up a fully functional server. I'd really only recommend it for testing and development. Following this guide to setup a server will result in something very insecure and not fit for production, due to things like default database passwords, default cookie secrets, etc.

### Dependencies:

- Node.js and npm (Node Package Manager)
- PostgreSQL
- Git
- Linux (probably will work on Mac too, but not Windows)

### Getting the source code set up and stuff:

1. Clone the repo somewhere safe
2. Navigate to the cloned repo, and install all node dependencies: `npm i`

### Setting up the database:

1. Start up PostgreSQL, listening on the default ports. This varies by operating system/distro, so figure it out.
2. Set your system account as a user in Postgres, with superuser permissions. Usually you can do this by becoming the Postgres user (`sudo -i -u postgres`), starting a Postgres shell (`psql`), then creating the user (`CREATE USER your_unix_username WITH SUPERUSER;`). This step is required. Unit tests will not run properly otherwise.
2. Create a new user named "to_the_skies_dev" with the password "password" (`psql` then `CREATE USER to_the_skies_dev WITH PASSWORD password;`).
3. Create the template database: `createdb to_the_skies_template -O to_the_skies_dev`
4. Load the contents of the database from the sql dump located at `sql/template.sql`: `psql to_the_skies_template < sql/template.sql`
5. Create the development database from the template: `createdb to_the_skies_dev -O to_the_skies_dev -T to_the_skies_template`

### Running the server:

The server is located at `src/server.js`, so just run that with node (`node src/server.js`) to get the server going. It will use the development database that you created earlier by default.

## Tests

### About the tests

To The Skies uses 4 distinct types of tests: client side unit tests, server side unit tests, and server side integration tests, and database tests. The database tests test code that interacts with the database. I felt like they did not fit in with the other server side tests because they are unit-ish tests, because they test one thing at a time, but they aren't exactly isolated because they require a live database. There are no client side integration tests because anything that they would test can be really easily tested "by hand", and integration tests that interact with the UI, deal with the DOM, etc are hard to write and maintain compared to the benefits they provide. The server side unit tests are used where unit tests make sense and don't take excessive effort to write. Integration tests cover pretty much everything. Note that the client side tests aren't actually run on the client side, they're run in node.js and use jsdom to emulate a DOM.

### Running the tests

Run `npm test` to run all tests. Provide `help` as a parameter (no hyphens or dashes) to see the options, which allow you to choose which tests to run. Without options it runs all tests. Before submitting a pull request, please ensure that your modified code passes ALL tests, and please write tests for most of your code, unless it is very trivial or very difficult to write tests for.
