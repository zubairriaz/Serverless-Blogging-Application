# Serverless Blogging App


# Functionality of the application

This application will allow creating/removing/updating/fetching article items. Each article item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

# ARTICLE items

The application should store ARTICLE items, and each ARTICLE item contains the following fields:

* `articleId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a ARTICLE item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a ARTICLE item

You might also store an id of a user who created a ARTICLE item.


# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetTodos` - should return all ARTICLEs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "articleId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Buy milk",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "articleId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Send a letter",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://example.com/image.png"
    },
  ]
}
```

* `CreateTodo` - should create a new ARTICLE for a current user. A shape of data send by a client application to this function can be found in the `CreateTodoRequest.ts` file

It receives a new ARTICLE item to be created in JSON format that looks like this:

```json
{"content":"hello what are you upto now updated",
"modifiedAt":"2020-05-10T02:05:42.866Z",
"articleId":"b5bd445b-bebd-4e07-9d5b-98bc6117a5a7",
"attachmentUrl":"https://bloggingapp-bucket-dev.s3.amazonaws.com/b5bd445b-bebd-4e07-9d5b-98bc6117a5a7",
"userId":"testing123456",
"dueDate":"2020-05-15",
"createdAt":"2020-05-10T02:05:42.866Z",
"done":false,
"title":"a new app",
"author": "Zubair"
}
```

It should return a new ARTICLE item that looks like this:

```json
{
  "item": {
"modifiedAt":"2020-05-10T02:05:42.866Z",
"articleId":"b5bd445b-bebd-4e07-9d5b-98bc6117a5a7",
"attachmentUrl":"https://bloggingapp-bucket-dev.s3.amazonaws.com/b5bd445b-bebd-4e07-9d5b-98bc6117a5a7",
"userId":"testing123456",
"dueDate":"2020-05-15",
"createdAt":"2020-05-10T02:05:42.866Z",
"done":false,
"title":"a new app",
"author": "Zubair",
"content":"hello what are you upto now updated",
}
}
```

* `UpdateArticle` - should update a ARTICLE item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateArticleRequest.ts` file

It receives an object that contains three fields that can be updated in a ARTICLE item:

```json
{
  "title":"a new app",
"author": "Zubair",
"content":"hello what are you upto now updated",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteArticle` - should delete a ARTICLE item created by a current user. Expects an id of a ARTICLE item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a ARTICLE item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

# Best practices

To complete this exercise, please follow the best practices from the 6th lesson of this course.

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```


