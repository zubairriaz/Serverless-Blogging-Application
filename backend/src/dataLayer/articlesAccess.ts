import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const XAWS = AWSXRay.captureAWS(AWS);

export default class ArticlesAccess {
  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly articlesTable = process.env.ARTICLE_TABLE,
      private readonly indexName = process.env.INDEX_NAME
  ) {}

  async addArticleToDB(artilceItem) {
      await this.docClient.put({
          TableName: this.articlesTable,
          Item: artilceItem
      }).promise();
  }

  async deleteArticleFromDB(articleId, userId) {
      await this.docClient.delete({
          TableName: this.articlesTable,
          Key: {
            articleId,
              userId
          }
      }).promise();
  }

  async getArticleFromDB(articleId, userId) {
      const result = await this.docClient.get({
          TableName: this.articlesTable,
          Key: {
            articleId,
              userId
          }
      }).promise();

      return result.Item;
  }

  async getAllArticlesFromDB(userId) {
      const result = await this.docClient.query({
          TableName: this.articlesTable,
          IndexName: this.indexName,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }
      }).promise();

      return result.Items;
  }

  async updateArticleInDB(articleId, userId, updatedTodo) {
      await this.docClient.update({
          TableName: this.articlesTable,
          Key: {
            articleId,
              userId
          },
          UpdateExpression: 'set #title = :n, #content = :c , #dueDate = :due, #done = :d',
          ExpressionAttributeValues: {
              ':n': updatedTodo.title,
              ':due': updatedTodo.dueDate,
              ':d': updatedTodo.done,
              ':c' : updatedTodo.content
          },
          ExpressionAttributeNames: {
              '#title': 'title',
              '#content' : 'content',
              '#dueDate': 'dueDate',
              '#done': 'done'
          }
      }).promise();
  }
}