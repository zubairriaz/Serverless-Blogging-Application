/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateArticleRequest {
  dueDate: string
  author: string
  content: string
  title:string
  articleId:string
}
