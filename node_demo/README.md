# Dockerising a Node.js and MongoDB App

A quick overview of containers and why we would want to use them:

Containers such as Docker let us package up entire applications, including the application’s libraries, dependencies, environment and everything else needed by the application to run.

So we can think of containers as portable, packaged bits of functionality.

Containers isolate the application from the infrastructure beneath so we can run our application on different platforms without having to worry about the underlying systems.

This allows consistency between environments, for example, a container can be easily moved from a development environment to a test environment and then to a production environment. Containers can also be easily scaled in response to increased user load and demand.

## Quickstart

1. The application serves as a (very!) basic product management system

2. To run this application in a Docker container, we have written a Dockerfile using the official node image from the Docker Hub registry. We have then use Docker Compose, a tool for running multi-container applications, to spin up our containers and run our app.

3. We have Added a docker-compose.yml file to define the services in our application.

### Let’s summarise a Dockerfile in the project directory.

```
FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
```

`FROM` lets us specify which base image from Docker Hub we want to build from. In our case, we are using the latest version of the official node image.

`RUN` lets us execute a command, which in our case is to create a new directory.

`WORKDIR` sets this newly created directory as the working directory for any COPY, RUN and CMD instructions that follow in the Dockerfile.

`COPY` is pretty straightforward and lets us copy files or a whole directory from a source to a destination. We are going to COPY the package.json file over to our working directory.

`RUN` lets us execute the npm install command which will download all the dependencies defined in package.json.

`COPY` lets us copy our entire local directory into our working directory to bundle our application source code.

`EXPOSE` exposes a port which the container will listen on.

And finally, `CMD` sets the default command to execute our container.

### Let’s summarise a Docker-Compose file in the project directory.

```
version: "2"
services:
  app:
    container_name: demo
    restart: always
    build: .
    ports:
      - "3000:3000"
    links:
      - "mongodb"
    depends_on:
      - "mongodb"
      
  mongodb:
    container_name: mongo
    image: mongo
    volumes:
      - data:/data/db
    ports:
      - "27017:27017"

volumes:
  data:
```

Breaking this down, what we are doing here is

1. defining a service called `app`.

2. adding a container name for the app service as giving the container a memorable name makes it easier to work with and we can avoid randomly generated container names (Although in this case, container_name is also app, this is merely personal preference, the name of the service and container do not have to be the same.)

3. instructing Docker to restart the container automatically if it fails.

4. building the app image using the Dockerfile in the current directory or you can use your own docker image from docker hub for that you have to replace `build: .` to `image: image_name` for example `image: amanjain119/node-demo`.

5. mapping the host port to the container port.

We then add another service called mongo but this time instead of building our own mongo image, we simply pull down the standardmongo image from the Docker Hub registry.

For persistent storage, we mount the host directory data (this is where the dummy data I added when I was running the app locally lives) to the container directory /data/db, which was identified as a potential mount point in the mongo Dockerfile we saw earlier.

Mounting volumes gives us persistent storage so when starting a new container, Docker Compose will use the volume of any previous containers and copy it to the new container, ensuring that no data is lost.

Finally, we link the `app` container to the `mongo` container so that the `mongodb` service is reachable from the `app` service.


### Finally run the containers 

We can now navigate to the project directory, open up a terminal window and run docker-compose up which will spin up two containers and aggregate the logs of both containers.

if you got the following error:
```
ERROR: for mongodb  Cannot start service mongodb: driver failed programming external connectivity on endpoint mongo (d9e533ec75417140a9ba63468efd106b65c7d2ce5cdbb2466fc9b76de4917364): Error starting userland proxy: listen tcp 0.0.0.0:27017: bind: address already in use
ERROR: Encountered errors while bringing up the project.
```

To remove this error please stop the mongodb service in your system with command this `sudo service mongodb stop` or change external port of mongo in docker-compose.yml file like `- "37017:27017"`

An interesting point to note is that if you stop your containers ctrl c and run docker-compose up again, you will notice that the build happens much faster this time. This is because Docker caches the results of the first build of a Dockerfile and subsequently uses this cache the next time round, saving valuable time.


## How I have publish my first Docker Image (i.e amanjain119/node-demo) to Docker Hub

Now create the image.

`docker build -t amanjain119/node-demo .`

Where is my image? It’s in my local image registry.

```
$ docker images
REPOSITORY                      TAG                 IMAGE ID            CREATED             SIZE
amanjain119/node-demo           latest              729f68621a36        39 minutes ago      907MB
```

### Let’s Run it too

`docker run -p 3000:3000 amanjain119/node-demo`

we will be pushing our built image to the registry so that we can use it anywhere. The Docker CLI uses Docker’s public registry by default.

1. Log into the Docker public registry on your local machine.(If you don’t have account make it here [cloud.docker.com](https://cloud.docker.com))

`docker login`

2. Tag the image: It is more like naming the version of the image. It’s optional but it is recommended as it helps in maintaining the version(same like ubuntu:16.04 and ubuntu:17.04)

`docker tag amanjain119/node-demo amanjain119/node-demo:part1`

3. Publish the image: Upload your tagged image to the repository: Once complete, the results of this upload are publicly available. If you log into Docker Hub, you will see the new image there, with its pull command.

`docker push amanjain119/node-demo:part1`

Yeah, that’s it, We have done. Now we can go to Docker hub and can check about it also ;). We have published our first image.


