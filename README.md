# To The Skies

[![Build Status](https://semaphoreci.com/api/v1/markasoftware/to-the-skies/branches/master/badge.svg)](https://semaphoreci.com/markasoftware/to-the-skies)
[![Code Climate](https://codeclimate.com/github/markasoftware/to-the-skies/badges/gpa.svg)](https://codeclimate.com/github/markasoftware/to-the-skies)
[![Dependency Status](https://david-dm.org/markasoftware/to-the-skies.svg)](https://david-dm.org/markasoftware/to-the-skies)

To The Skies is an extensible work of interactive fiction. Basically, that means it's a choose your own adventure game, but people can add on to the "tree" of choices, meaning it could potentially be extremely large, and people could spend hours playing before reaching any sort of ending.
## What languages/frameworks/things does it use?
HTML5/CSS3/JavaScript is used on the front-end, with Mithril as an MVC framework. Node.js with Express is used on the back-end. PostgreSQL is the database used.
## What state is it in currently?
It is currently in very early development, and at least a month or two out from any sort of release.
## What is the pricing/business model?
It will be completely free to play. Some sort of monetization may be added later on, but it will be small and won't hurt the gameplay for people who want to play for free. It'll be somewhere between WinRAR and Reddit Gold, probably.

# Technical Stuff Starts Here

## Setting up your own To The Skies development environment

Important: If you just want to play To The Skies, this is not the right place for you. The following part of the readme is for people who want to contribute to To The Skies by helping to develop it.

Also Important: This is not a good way to set up a fully functional server. I'd really only recommend it for testing and development. Following this guide to setup a server will result in something very insecure and not fit for production, due to things like default database passwords, default cookie secrets, etc.

### Dependencies:

- Node.js and npm (Node Package Manager)
- PostgreSQL
- Git
- Linux (probably will work on Mac too, but not Windows)
- Flyway (not currently, but in the future)

### Getting the source code set up and stuff (thank me for not using Babel):

1. Clone the repo somewhere safe
2. Navigate to the cloned repo, and install all node dependencies: `npm i`

### Setting up the database:

1. Start up PostgreSQL, listening on the default ports. This varies by operating system/distro, so figure it out. If for some reason you can't run it on default, make sure to update the `DB_HOST` and `DB_PORT` environment variables to match (these are the variables that To The Skies uses for database connection).
2. Set your system account as a user in Postgres, with superuser permissions. Usually you can do this by becoming the Postgres user (`sudo -i -u postgres`), then using the postgres shell to create your user (`psql -c 'CREATE USER your_unix_username WITH SUPERUSER;'`). This step is required. Unit tests will not run properly otherwise, as they use the default user to create the database and stuff.
3. Run the `init-dbs.sh` script in the `sql` folder to create users and databases needed, and load them from the sql dumps in the `sql` folder. It may print errors, but will ignore them and continue. This is normal, as it attempts to delete the old databases to start with a clean slate.

If you ever need to reset the development database, you can re-run the init script, or just manually delete the to_the_skies_dev database and then recreate it from the template database to_the_skies_template

### Running the server:

I'm working on it guys

## Tests

### About the tests

To The Skies uses 3 distinct types of tests: client side unit tests, server side unit tests, and server side integration tests. The server side integration tests are split into many parts because they take a while to run, so I don't want to have to run them all at once. The client side unit and integration tests are kind've mixed together, because they all run very fast. Note that client side tests are actually run in Node with jsdom to emulate the DOM

### Running the tests

Run `npm test` to run all tests. Provide `help` as a parameter (no hyphens or dashes) to see the options, which allow you to choose which tests to run. Without options it runs all tests. Before submitting a pull request, please ensure that your modified code passes ALL tests, and please write tests for most of your code, unless it is very trivial or very difficult to write tests for (such as the login system).
