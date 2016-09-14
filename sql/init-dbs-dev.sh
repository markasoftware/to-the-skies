#!/bin/sh

dropdb to_the_skies_test 2> /dev/null || true
dropdb to_the_skies_dev 2> /dev/null || true
dropdb to_the_skies_template 2> /dev/null || true
psql -d postgres -c "DROP USER to_the_skies;" 2> /dev/null || true
psql -d postgres -c "CREATE USER to_the_skies WITH SUPERUSER PASSWORD 'password';"
createdb to_the_skies_template
cat `dirname $0`'/template.sql' | psql -d to_the_skies_template
createdb to_the_skies_dev --owner to_the_skies --template to_the_skies_template
createdb to_the_skies_test --owner to_the_skies --template to_the_skies_template
