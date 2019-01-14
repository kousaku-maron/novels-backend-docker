## Get Started

### start neo4j

1. Run Docker

```
docker-compose up -d neo4j
```

2. Access "http://localhost:7474"

### start graphql

1. Put firebase admin config in `graphql/src/modules/firebase/admin.json`.

```json:graphql/src/modules/firebase/admin.json
{
  "type": "-- type --",
  "project_id": "-- project_id --",
  "private_key_id": "-- private_key_id --",
  "private_key": "-- private_key --",
  "client_email": "-- client_email --",
  "client_id": "-- client_id --",
  "auth_uri": "-- auth_url --",
  "token_uri": "-- token_uri --",
  "auth_provider_x509_cert_url": "-- auth_provider_x509_cert_url --",
  "client_x509_cert_url": "-- client_x509_cert_url --"
}
```

2. Build graphql source code.

```
cd graphql
npm install
npm run build
```

3. Set parameters to neo4j and firebase ENV in `docker-compose.yml`

```
NEO4J_URI: -- bolt endpoint --
NEO4J_USER: -- neo4j user --
NEO4J_PASSWORD: -- neo4j password --
FIREBASE_DATABASE_ENDPOINT: -- firebase database endpoint --
```

3. Run Dockerfile

```
docker-compose up -d graphql
```

4. Access "http://localhost:4000"

### start neo4j and graphql

```
docker-compose up -d
```

### end

```
docker-compose stop
docker-compose rm
```

### check container

```
docker-compose ps
```

you can check docker containers.

```
         Name                       Command               State                            Ports                          
--------------------------------------------------------------------------------------------------------------------------
neo4j-docker_graphql_1   node dist/main.js                Up      0.0.0.0:4000->4000/tcp                                  
neo4j-docker_neo4j_1     /sbin/tini -g -- /docker-e ...   Up      7473/tcp, 0.0.0.0:7474->7474/tcp, 0.0.0.0:7687->7687/tcp
```

## Trouble Shooting

if you wanna update graphql image, follow the below.

0. Stop all docker container

```
docker-compose stop
docker-compose rm
```

1. Check graphql image

```
docker images
```

you will be able to check graphql image.

```
REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
neo4j-docker_graphql   latest              09558d147ecf        7 minutes ago       174MB
...
```

2. Delete graphql image

```
docker image rm neo4j-docker_graphql
```

※ "neo4j-docekr_graphql" is the name you checked before.

3. Run graphql

```
docker-compose up -d graphql
```