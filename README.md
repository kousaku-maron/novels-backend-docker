#Get Started

## start neo4j

1. Run Docker

```
docker-compose up -d neo4j
```

## start graphql

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

3. Run Dockerfile

```
docker-compose up -d graphql
```

## end

```
docker-compose rm
```