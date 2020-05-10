export interface Todo {
  articleId: string
  createdAt: string
  author: string,
  title: string,
  content: string,
  modifiedAt: string,
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
