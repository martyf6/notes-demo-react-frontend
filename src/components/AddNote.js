import React, { Component } from 'react'

import NotesService from '../services/NotesService';
import { withRouter } from '../common/withRouter'

class AddNoteComponent extends Component {

    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.saveNote = this.saveNote.bind(this);
        this.cancel = this.cancel.bind(this);
        
        this.state = {
            title: "",
            content: "",
            message: ""
        };
      }
    
      onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
      }
    
      onChangeContent(e) {
        this.setState({
            content: e.target.value
        });
      }

      cancel() {
        this.props.router.navigate('/');
        window.location.reload();
      }

      saveNote() {
        const data = {
          title: this.state.title,
          content: this.state.content
        };
    
        NotesService.createNote(data)
          .then(response => {
            console.log(response);
            this.props.router.navigate('/');
            //window.location.reload();
          })
          .catch(e => {
            console.log(e);
            this.setState({
                message: "Unable to save note."
            })
          });
      }

      render() {
        return (
            <div className="col-md-8 py-4 mx-auto">
                <div className="edit-form px-3">
                    <h3 className="text-center display-6">New Note</h3>
                    <form>
                    <div className="form-group mb-3">
                        <label htmlFor="title" className="form-label fs-5">Title</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            id="title"
                            placeholder="Title"
                            onChange={this.onChangeTitle}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="content" className="form-label fs-5">Content</label>
                        <textarea
                            className="form-control"
                            id="content"
                            placeholder="Note content here."
                            onChange={this.onChangeContent}
                            rows={12}
                        ></textarea>
                    </div>
                    </form>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={this.saveNote}
                    >
                    Save
                    </button>
                    <button
                        className="btn btn-secondary mx-2"
                        onClick={this.cancel}
                    >
                    Cancel
                    </button>
                    <p className="text-primary-emphasis fst-italic my-2">{this.state.message}</p>
                </div>
            </div>
        )
    }
}

export default withRouter(AddNoteComponent)