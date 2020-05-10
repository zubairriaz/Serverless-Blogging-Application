export interface ArticleItem {
  userId: string
  articleId: string
  createdAt: string
  modifiedAt: string
  author: string
  content: string
  title:string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
