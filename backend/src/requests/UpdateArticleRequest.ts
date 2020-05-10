/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateArticleRequest {
  title: string
  dueDate: string
  done: boolean
  content: string
}