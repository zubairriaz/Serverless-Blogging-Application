import * as React from 'react'
import { Form, Button , TextArea ,Input } from 'semantic-ui-react'
import { History } from 'history'
import * as uuid from 'uuid';


import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/todos-api'
import dateFormat from 'dateformat'
import { createTodo } from '../api/todos-api'


enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth,
  history:History
}

interface EditTodoState {
  file: any
  uploadState: UploadState,
  author:string,
  title:string,
  content:string,
  uuid:string
}

export class NewArticle extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    author:"",
    title:"",
    content:"",
    uuid: uuid.v4()
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }
   
  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  handleClick = async(event:React.SyntheticEvent) =>{
    event.preventDefault()
    try {
        const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        content: this.state.content,
        title:this.state.title,
        author:this.state.author,
        dueDate,
        articleId:this.state.uuid
      })
      console.log(newTodo);
  
        console.log('article was uploaded!')
      } catch (e) {
        alert('Could not save the article: ' + e.message)
      } finally {
        this.props.history.push(`/`)
      }

  }
  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.state.uuid)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ author: event.target.value })
  }
  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: event.target.value })
  }
  handleContentChange = (event:any) => {
    this.setState({ content: event.target.value })
  }

  render() {
    return (
      <div>
       <h1>Title</h1>

       <div><Input type="text" fluid placeholder="Title" onChange={this.handleTitleChange} /></div>
       <h1>Author</h1>

       <div><Input type="text" fluid placeholder="Author Name" onChange={this.handleAuthorChange} /></div>

       <h1>Content</h1>

        <Form><TextArea rows={5} placeholder='add your content here' onChange={this.handleContentChange}/></Form>

        <h1>Upload Image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
        {this.renderCreateButton()}
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          
           loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }


  renderCreateButton() {

    return (
      <div>
        
        {this.state.author && this.state.content && this.state.title && 
        <Button
        content='Click'
        onClick={this.handleClick}
        >
          Save
        </Button>
  }
      </div>
      
    )
  }
}
