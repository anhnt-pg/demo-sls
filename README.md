# Serverless Nodejs Rest API with TypeScript And DynamoDb

This is simple REST API example for AWS Lambda By Serverless framwork with TypeScript and DynamoDb.

## Use Cases

* Serverless Framework - Lamda

* CRUD

* Store data in DynamoDB

* CI/CD and support multi-stage deployments

## Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

src/
|   handlers.ts
|   route.yml
|
+---common
|       HttpResponseCode.ts
|
+---entities
|       User.ts
|
+---repositories
|       UserRepository.ts
|
+---requests
|       UserRequest.ts
|
+---response
|       UserRespose.ts
|
\---services
        UserService.ts
## Deploy

* Run ```npm install``` to install all the necessary dependencies.
* Run ```npm run local``` use serverless offline to test locally. 
* Run ```npm run deploy``` Deploy on AWS. 

## List enpoint

```
  POST - https://xan1wtbel3.execute-api.ap-southeast-1.amazonaws.com/user
  GET - https://xan1wtbel3.execute-api.ap-southeast-1.amazonaws.com/user/{id}
  PUT - https://xan1wtbel3.execute-api.ap-southeast-1.amazonaws.com/user/{id}
  DELETE - https://xan1wtbel3.execute-api.ap-southeast-1.amazonaws.com/user/{id}
  GET - https://xan1wtbel3.execute-api.ap-southeast-1.amazonaws.com/users
```

## CI/CD & multi-stage deployments

* Created 2 environments: `dev` and `prod`
![alt text](https://github.com/ngocnguyenvan26/serverless/blob/master/images/mutil_stage.jpg)

* Parameters to set secrets/variables 
![alt text](https://github.com/ngocnguyenvan26/serverless/blob/master/images/parameter_each_stage.jpg)

* Auto deploy When push to `dev` or `prod` branch:
![alt text](https://github.com/ngocnguyenvan26/serverless/blob/master/images/deploy_detail.jpg)

* Preview `prod` branch from pull requests
![alt text](https://github.com/ngocnguyenvan26/serverless/blob/master/images/ci_pr.jpg)