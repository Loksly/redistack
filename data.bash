#!/bin/bash

mkdir data
wget http://neuromancer.inf.um.es:8080/es.stackoverflow/Posts.csv.gz -O data/posts.csv.gz 2>/dev/null
wget http://neuromancer.inf.um.es:8080/es.stackoverflow/Users.csv.gz -O data/users.csv.gz 2>/dev/null
wget http://neuromancer.inf.um.es:8080/es.stackoverflow/Tags.csv.gz -O data/tags.csv.gz 2>/dev/null
wget http://neuromancer.inf.um.es:8080/es.stackoverflow/Comments.csv.gz -O data/comments.csv.gz 2>/dev/null
wget http://neuromancer.inf.um.es:8080/es.stackoverflow/Votes.csv.gz -O data/votes.csv.gz 2>/dev/null
