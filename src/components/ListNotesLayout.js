import React, { Component } from 'react'

import NotesService from '../services/NotesService'
import ViewNote from './ViewNote';
import { withNav } from '../common/withRouter';

// enum defining note sorting options
const SORT_OPT = Object.freeze({
    SORT: {
        name: "sort by", 
        sorter: _ => 0
    }, 
    ID: {
        name: "id", 
        sorter: (noteA, noteB) =>
            (noteA.id - noteB.id)
    }, 
    NEW: {
        name: "newest", 
        sorter: (noteA, noteB) =>
            (new Date(noteB.lastUpdated)) - (new Date(noteA.lastUpdated))
    },
    OLD: {
        name: "oldest", 
        sorter: (noteA, noteB) =>
            (new Date(noteA.lastUpdated)) - (new Date(noteB.lastUpdated))
    }
});

// default sorting option
const SORT_DEFAULT = SORT_OPT.SORT;

class ListNotesLayout extends Component {
    constructor(props) {
        super(props);

        this.selectNote = this.selectNote.bind(this);
        this.addNote = this.addNote.bind(this);
        this.refreshNotes = this.refreshNotes.bind(this);
        this.updateSort = this.updateSort.bind(this);
        this.selectNoteById = this.selectNoteById.bind(this);
        this.addDefaultNote = this.addDefaultNote.bind(this);

        this.state = {
            notes: [],
            activeIndex: -1,
            sort: SORT_DEFAULT,
        };
    }

    componentDidMount(){
        this.refreshNotes();
    }

    refreshNotes(){
        /*
        // to reset selection and sorting option:
        this.setState({
            activeIndex: -1,
            sort: SORT_DEFAULT,
        });
        */
        NotesService.getNotes()
        .then((res) => {
            this.sortNotes(this.state.sort, res.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    selectNote(index){
        this.setState({ activeIndex: index });
    }

    selectNoteById(noteId){
        this.setState({
            activeIndex: this.state.notes.findIndex(note => note.id === noteId)
        })
    }

    addNote(){
        this.props.navigate(`/add`);
    }

    updateSort(event){
        const sortType = SORT_OPT[event.target.value];
        this.sortNotes(sortType);
    }

    sortNotes(sortType, notes = [...this.state.notes]){
        if(sortType === undefined || !Object.values(SORT_OPT).includes(sortType)) return;

        notes.sort(sortType.sorter);

        // update selected index to its new location in the sorted list
        let sortedIndex = this.state.activeIndex;
        if(sortedIndex > -1)
            sortedIndex = notes.indexOf(this.state.notes[this.state.activeIndex]);

        this.setState({
            notes: notes,
            activeIndex: sortedIndex,
            sort: sortType,
        });
    }

    /**
     * Quick-add a blank/default note (a la Apple Notes),
     * and select it in the list for the user to edit.
     */
    addDefaultNote(){
        NotesService.createNote({
            title: "New Note",
            content: ""
        })
        .then((res) => {
            const defaultNote = res.data;
            console.log("New note created:",'\n',defaultNote);

            // add new note to beginning (or end) of notes list, and select it
            const updatedNotes = [...this.state.notes];
            let updatedIndex = this.state.activeIndex;
            if(this.state.sort === SORT_OPT.NEW) {
                updatedNotes.unshift(defaultNote);
                updatedIndex = 0;
            } else {
                const noteCount = updatedNotes.push(defaultNote);
                updatedIndex = noteCount - 1;
            }

            this.setState({
                notes: updatedNotes,
                activeIndex: updatedIndex,
            });
        })
        .catch(e => {
            console.log(e);
        });
    }

    render() {
        const { notes, activeIndex } = this.state;
        const isActiveNote = (activeIndex >= 0);
        const activeNote = (isActiveNote) ? notes[activeIndex] : null;
        const sortKey = Object.entries(SORT_OPT).find(ent => ent[1] === this.state.sort)?.[0];

        return (
            <div>
                <div className="row p-3 mb-3">
                    <div className="col">
                        <h2 className="border-bottom">Your Notes</h2>
                    </div>
                    <div className="col-auto d-none">
                        <button onClick={this.refreshNotes} className="btn btn-primary">Refresh </button>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="col-4 col-md-3">
                        <div className="d-flex p-1 mb-1 border-bottom">
                            <button 
                                onClick={this.addDefaultNote}
                                className="btn btn-outline-secondary btn-sm rounded-3 me-auto py-0" 
                                type="button"
                                title="Add Note">
                                {/* <span className="align-text-bottom fs-4 fw-light lh-sm">+</span> */}
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    height="16"
                                    width="16">
                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
                                </svg>
                            </button>

                            <div className="input-group w-auto me-2">
                                <select 
                                    value={sortKey}
                                    onChange={this.updateSort}
                                    className="form-select form-select-sm rounded-3" 
                                    aria-label="sort notes">
                                    {Object.keys(SORT_OPT).map(sortOpt => (
                                        <option 
                                            key={sortOpt} 
                                            value={sortOpt}
                                        >{SORT_OPT[sortOpt].name}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                onClick={this.refreshNotes} 
                                className="btn btn-outline-secondary btn-sm rounded-3" 
                                type="button"
                                title="Refresh">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="16"
                                    width="16">
                                    <path d="M6 18.7V21a1 1 0 01-2 0v-5a1 1 0 011-1h5a1 1 0 110 2H7.1A7 7 0 0019 12a1 1 0 112 0 9 9 0 01-15 6.7zM18 5.3V3a1 1 0 012 0v5a1 1 0 01-1 1h-5a1 1 0 010-2h2.9A7 7 0 005 12a1 1 0 11-2 0 9 9 0 0115-6.7z" />
                                </svg>
                            </button>
                        </div>
                        <ul className="list-group overflow-auto"
                            style={{ maxHeight: 600 }}>
                            {notes && notes.map((note, index) => (
                                <li className={"list-group-item list-group-item-action" +
                                        (index === activeIndex ? " active" : "")}
                                    key={index}
                                    onClick={() => this.selectNote(index)}
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{note.title}</div>
                                        <small>{(new Date(note.lastUpdated)).toLocaleString()}</small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col px-3 py-1">
                        {activeNote ? (
                            <ViewNote 
                                key={ activeNote.id } 
                                noteId={ activeNote.id } 
                                note={ activeNote }
                            />
                        ) : (
                            <p className="fs-4 mx-3">
                                Please select a note...
                                <br />
                                <br />
                                Or try creating one!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
export default withNav(ListNotesLayout)
