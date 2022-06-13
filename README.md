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
┣ common/
┃ ┗ products/
┃   ┣ models/
┃ ┃ ┃ ┣ entities.ts                             # other entities
┃ ┃ ┃ ┗ index.ts                                # include product model, schema
┃   ┣ tests/                                    # Test section for product
┃ ┃ ┃ ┣ product.mock.ts
┃ ┃ ┃ ┣ productController.test.ts
┃ ┃ ┃ ┗ productService.test.ts
┃   ┣ productController.ts                      # products lambda controller
┃   ┣ productHandler.ts                         # export function for `products` lambda
┃   ┣ productService.ts                         # products lambda service
┃   ┣ productUltils.ts                          # ultils
┃   ┣ productValidate.ts                        # validate
┃   ┗ serverless.yml                            # serverless fuction config                              
┗ shares/                                       # containing all shared data
  ┣ utils/                                      # containing all share ultils
┃ ┃ ┗ stringUtils.ts
  ┗ response.ts                                 # format response for the project
  ┣ config/                               
┃ ┗ index.ts                                    # containing config for the project
```
## Deploy

* Run ```npm install``` to install all the necessary dependencies.
* Run ```npm run local``` use serverless offline to test locally. 
* Run ```npm run deploy``` Deploy on AWS. 

## List enpoint

```
  POST - https://hc44ryn5ue.execute-api.us-east-1.amazonaws.com/dev/products
  PUT - https://hc44ryn5ue.execute-api.us-east-1.amazonaws.com/dev/products/{id}
  GET - https://hc44ryn5ue.execute-api.us-east-1.amazonaws.com/dev/products
  GET - https://hc44ryn5ue.execute-api.us-east-1.amazonaws.com/dev/products/{id}
  DELETE - https://hc44ryn5ue.execute-api.us-east-1.amazonaws.com/dev/products/{id}
```

## Unit test

```
npm run test

npm run coverage

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