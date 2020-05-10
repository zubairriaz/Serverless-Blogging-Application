import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';

// dev imported
import ArticlesAccess from '../dataLayer/articlesAccess';
import AarticlesStorage from '../dataLayer/articlesStorage';
import { getUserId } from '../lambda/utils';
import { CreateArticleRequest } from '../requests/CreateArticleRequest';
import { UpdateArticleRequest } from '../requests/UpdateArticleRequest';
import { ArticleItem } from '../models/ArticleItem';

const articlesAccess = new ArticlesAccess();
const articlesStorage = new AarticlesStorage();

export async function createArticle(event: APIGatewayProxyEvent,
                                 createArticleRequest: CreateArticleRequest): Promise<ArticleItem> {
    const userId = getUserId(event);
    const createdAt = new Date(Date.now()).toISOString();
    const modifiedAt = new Date(Date.now()).toISOString();


    const articleItem = {
        userId,
        createdAt,
        modifiedAt,
        done: false,
        attachmentUrl: `https://${articlesStorage.getBucketName()}.s3.amazonaws.com/${createArticleRequest.articleId}`,
        ...createArticleRequest
    };

    await articlesAccess.addArticleToDB(articleItem);

    return articleItem;
}

export async function deleteArticle(event: APIGatewayProxyEvent) {
    const articleId = event.pathParameters.articleId;
    const userId = getUserId(event);

    if (!(await articlesAccess.getArticleFromDB(articleId, userId))) {
        return false;
    }

    await articlesAccess.deleteArticleFromDB(articleId, userId);

    return true;
}

export async function getArticle(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters.articleId;
    const userId = getUserId(event);

    return await articlesAccess.getArticleFromDB(todoId, userId);
}

export async function getArticles(event: APIGatewayProxyEvent) {
    const userId = getUserId(event);

    return await articlesAccess.getAllArticlesFromDB(userId);
}

export async function updateArticle(event: APIGatewayProxyEvent,
                                 UpdateArticleRequest: UpdateArticleRequest) {
    const articleId = event.pathParameters.articleId;
    const userId = getUserId(event);

    if (!(await articlesAccess.getArticleFromDB(articleId, userId))) {
        return false;
    }

    await articlesAccess.updateArticleInDB(articleId, userId, UpdateArticleRequest);

    return true;
}

export async function generateUploadUrl(event: APIGatewayProxyEvent) {
    const bucket = articlesStorage.getBucketName();
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
    const articleId = event.pathParameters.articleId;

    const createSignedUrlRequest = {
        Bucket: bucket,
        Key: articleId,
        Expires: urlExpiration
    }

    return articlesStorage.getPresignedUploadURL(createSignedUrlRequest);
}