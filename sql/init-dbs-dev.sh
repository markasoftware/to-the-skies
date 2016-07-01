#!/bin/sh

dropdb to_the_skies_test || true
dropdb to_the_skies_dev || true
dropdb to_the_skies_template || true
psql -d postgres -c "DROP USER to_the_skies;" || true
psql -d postgres -c "CREATE USER to_the_skies WITH SUPERUSER PASSWORD 'password';"
createdb to_the_skies_template
cat `dirname $0`'/template.sql' | psql -d to_the_skies_template
createdb to_the_skies_dev --owner to_the_skies --template to_the_skies_template
createdb to_the_skies_test --owner to_the_skies --template to_the_skies_template
