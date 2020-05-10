import * as React from 'react'
import { Form, Button, Image } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile , getTodo} from '../api/todos-api'
import { Todo } from '../types/Todo'
import dateFormat from 'dateformat'
import { patchTodo } from '../api/todos-api'
import { History } from 'history'



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
  history: History,
}

interface EditTodoState {
  file: any
  uploadState: UploadState,
  todo?:Todo,
  
}

export class ViewArticle extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    todo:undefined
  }

  async componentDidMount() {
    console.log("Being called on component did mount")
    try {
      const todo = await getTodo(this.props.auth.getIdToken(), this.props.match.params.todoId)
      this.setState({
        todo
      })
      console.log(this.state)
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }


  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId)

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
    let todoCopy = JSON.parse(JSON.stringify(this.state.todo))
    todoCopy.author = event.target.value;
    this.setState({ todo: todoCopy })
  }
  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let todoCopy = JSON.parse(JSON.stringify(this.state.todo))
    todoCopy.title = event.target.value;
    this.setState({ todo:todoCopy })
  }
  handleContentChange = (event:any) => {
    let todoCopy = JSON.parse(JSON.stringify(this.state.todo))
    todoCopy.content = event.target.value;
    this.setState({ todo:todoCopy })
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  handleClick = async(event:React.SyntheticEvent) =>{
    event.preventDefault()
    this.props.history.push(`/`)
      

  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Image className ="imageclass" src={this.state.todo && this.state.todo.attachmentUrl} ></Image>
       <div className = "margintopbottom"><span className ="titleclass"> Title :</span> <span className="titlename"> {this.state.todo && this.state.todo.title} </span></div>
       <div className="margintopbottom">  <span className="titleclass">Author: </span><span> {this.state.todo && this.state.todo.author} </span> </div>
       <div className="margintopbottom"> <span className="titleclass">Content: </span> <span> {this.state.todo && this.state.todo.content} </span> </div>

        {/* <h1>Upload new image</h1>

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
        </Form> */}
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
        
        <Button
        content='Click'
        onClick={this.handleClick}
        >
          Back
        </Button>
  
      </div>
      
    )
  }




}
