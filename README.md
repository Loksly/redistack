# RediStack

Stackoverflow clone using Redis as storage engine.
This is just a toy, not intended to be a production ready solution.

This solution uses these technologies for the server side:
* [nodejs](https://nodejs.org/en/)
* [redis](https://redis.io/)
* [expressjs](https://expressjs.com/)

and these others for the client side:
* [angularjs](https://angularjs.org/)
* [angular material](https://material.angularjs.org/latest/)

and many others not listed here. You are welcome to check the code.


# Deploy redis
 
## <a name="redis"></a> Redis installation


[Redis](http://redis.io/) is an open source (BSD licensed), in-memory data structure store, used as database, cache and message broker.

I suggest two ways to install Redis, one based on *vagrant* and another one based on *docker*. The second one is lighter but you may choose
the one you prefer. Take in count you may install this VM or container in another host, there's no need to be on the same machine of the
the application server.


### <a name="redisvagrant"></a> Vagrant Version


#### Install virtualbox, vagrant and git:
```bash
$ sudo apt-get install -y virtualbox vagrant
```

Test versions:

```bash:
$ vagrant -v
Vagrant 1.8.1

$ vboxmanage --version
5.0.24_Ubuntur108355

$ git --version
git version 2.7.4 
```

### Deploy redis using vagrant:
```bash
$ git clone https://github.com/ffis/vagrant-redis vagrant-redis
$ cd vagrant-redis
$ vagrant up # to wake up the Virtual Machine
$ vagraht halt # use this anytime you want or you need to, you may turn it off

```

Test:
```bash
$ wget https://github.com/crypt1d/redi.sh/raw/master/redi.sh
$ echo "this is a variable" | bash redi.sh -s testvar
$ bash redi.sh -g testvar
# If you can read "this is a variable" then everything is ok.
```

Filtering connections:
```bash
$ sudo iptables -I INPUT -p TCP -s 10.0.0.0/8 --dport 6379 -j ACCEPT
$ sudo iptables -I INPUT -p TCP --dport 6379 -j DROP
```


## <a name="redisdocker"></a> Docker version (experimental)

### Install docker:
```bash
$ sudo apt-get install -y docker.io 
```


### Deploy redis using docker:

```bash
$ sudo service docker start
$ sudo docker pull redis
$ sudo docker run --name some-redis -p6379:6379 -d redis

$ pidredis=`sudo docker ps -a | grep redis | cut -f 1 -d " "`
$ sudo docker stop $pidredis 
$ sudo docker rm $pidredis 
```

Test:
```bash
$ wget https://github.com/crypt1d/redi.sh/raw/master/redi.sh
$ echo "this is a variable" | bash redi.sh -s testvar
$ bash redi.sh -g testvar
# If you can read "this is a variable" then everything is ok.
```

Filtering connections:
```bash
$ sudo iptables -I INPUT -p TCP -s 10.0.0.0/8 --dport 6379 -j ACCEPT
$ sudo iptables -I INPUT -p TCP --dport 6379 -j DROP
```


# Deploy application server

To deploy you just simple use these commands:

```bash
$ git clone https://github.com/Loksly/redistack # get the source code
$ cd redistack	# change thee directory
$ sudo npm install -g npm bower # to keep both updated
$ npm install
$ bower install
```

*Download the data*:

```bash
$ bash data.bash
```

*Run the server*:

Then you just need to run the app using:

```bash
$ node index.js
```

Then open your web browser to: [http://localhost:8080/](http://localhost:8080/) and enjoy.

## Rest server API, JSON version

The server provides this urls to access to a service:

<table>
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">URL</th>
			<th scope="col">Meaning</th>
			<th scope="col">Requirements and Comments</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row">GET</i></th>
			<th scope="row">/api/v1/users</th>
			<td>Retrieves the list of the users</td>
			<td>Read notes in the pagination section.</td>
		</tr>
		<tr>
			<th scope="row">GET</i></th>
			<th scope="row">/api/v1/users/<i>:id</i></th>
			<td>Retrieves information related to the user with id <i>id</i></td>
			<td>
				<ul>
					<li>id must be a positive number</li>
					<li>should belong to an existing user</li>
				</ul>
			</td>
		</tr>
		<tr>
			<th scope="row">GET</i></th>
			<th scope="row">/api/v1/posts/<i>:id</i></th>
			<td>Retrieves information related to the post with id <i>id</i></td>
			<td>
				<ul>
					<li>id must be a positive number</li>
					<li>should belong to an existing post</li>
				</ul>
			</td>
		</tr>
		<tr>
			<th scope="row">GET</i></th>
			<th scope="row">/api/v1/posts/?Tag=<i>:tag</i></th>
			<td>Retrieves posts related to the tag with name <i>tag</i></td>
			<td>
				<ul>
					<li>tag must be a non empty string</li>
					<li>should belong to an existing tag</li>
				</ul>
			</td>
		</tr>
		<tr>
			<th scope="row">GET</i></th>
			<th scope="row">/api/v1/posts/?PostTypeId=1</th>
			<td>Retrieves posts related to questions</td>
			<td>

			</td>
		</tr>
	</tbody>
</table>


## Pagination information

Options:

* http://www.restapitutorial.com/httpstatuscodes.html
* https://medium.com/@jonasrenault/setting-up-pagination-with-angularjs-and-django-rest-framework-4acadd4b787a

