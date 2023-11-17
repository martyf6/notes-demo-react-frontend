import React, { Component } from 'react'

import NotesService from '../services/NotesService';
import { withRouter } from '../common/withRouter'

class ViewNoteComponent extends Component {

    constructor(props) {
        super(props);
        
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.getNote = this.getNote.bind(this);
        this.updateNote = this.updateNote.bind(this);
        this.revert = this.revert.bind(this);
        this.cancel = this.cancel.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
    
        this.state = {
          currentNote: {
            title: "",
            content: "",
            lastUpdated: ""
          },
          message: ""
        };
    }
    
    componentDidMount() {
        this.getNote();
    }

    onChangeTitle(e) {
        const title = e.target.value;

        this.setState(prevState =>({
            currentNote: {
                ...prevState.currentNote,
                title: title
            }
        }));
    }

    onChangeContent(e) {
        const content = e.target.value;
        
        this.setState(prevState => ({
            currentNote: {
                ...prevState.currentNote,
                content: content
            }
        }));
    }

    getNote() {
        NotesService.getNote(this.props.noteId)
        .then(response => {
            const note = response.data;
            if(note) {
                this.setState({
                    currentNote: response.data
                });
            } else {
                this.setState({
                    message: "Could not fetch note."
                });
            }
        })
        .catch(e => {
            console.log(e);
            this.setState({
                message: "Could not fetch note."
            });
        });
    }

    updateNote() {
        NotesService.updateNote(
            this.props.noteId,
            this.state.currentNote
        )
        .then(response => {
            const updatedNote = response.data;
            this.setState(prevState => ({
                currentNote: {
                    ...prevState.currentNote,
                    lastUpdated: updatedNote.lastUpdated
                },
                message: "Note successfully updated."
            }));
        })
        .catch(e => {
            console.log(e);
            this.setState({
                message: "Could not update note. Try logging in again."
            });
        });
    }

    deleteNote() {    
        NotesService.deleteNote(this.props.noteId)
        .then(response => {
            this.props.router.navigate('/');
            window.location.reload();
        })
        .catch(e => {
            console.log(e);
            this.setState({
                message: "Could not delete note. Try logging in again."
            });
        });
    }

    revert() {
        this.getNote();
    }

    cancel() {
        this.props.router.navigate('/');
        window.location.reload();
    }

    render() {
        const { currentNote } = this.state;
        const noteUpdate = new Date(currentNote.lastUpdated);
        const noteUpdateStr = (noteUpdate instanceof Date && !isNaN(noteUpdate)) ?
            noteUpdate.toLocaleString() : "Unknown";

        return (
            <div className="edit-form px-3">
                <h3 className="d-none">Note Details</h3>
                <form>
                <div className="form-group mb-3">
                    <label htmlFor="title" className="form-label fs-5">Title</label>
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        id="title"
                        value={currentNote.title}
                        onChange={this.onChangeTitle}
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="content" className="form-label fs-5">Content</label>
                    <textarea
                        className="form-control"
                        id="content"
                        value={currentNote.content}
                        onChange={this.onChangeContent}
                        rows={12}
                    ></textarea>
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="updated" className="form-label fw-semibold">Last Updated:</label>
                    {noteUpdateStr}
                </div>
                </form>
                <button
                    type="submit"
                    className="btn btn-primary me-2 mb-1"
                    onClick={this.updateNote}
                >
                Update
                </button>
                <button
                    className="btn btn-secondary me-2 mb-1"
                    onClick={this.revert}
                >
                Revert
                </button>
                <button
                    className="btn btn-secondary me-2 mb-1"
                    onClick={this.cancel}
                >
                Cancel
                </button>
                <button
                    className="btn btn-danger me-2 mb-1"
                    onClick={this.deleteNote}
                >
                Delete
                </button>
                <p className="text-primary-emphasis fst-italic my-2">{this.state.message}</p>
            </div>
        )
    }
}

export default withRouter(ViewNoteComponent);