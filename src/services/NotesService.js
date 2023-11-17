import axios from 'axios';
import { authHeader } from './AuthService';

const API_BASE = 'http://localhost:8080/notes';

class NotesService {

    getNotes(){
        return axios.get(`${API_BASE}/`, {headers: authHeader()});
    }

    createNote(note){
        return axios.post(API_BASE, note, {headers: authHeader()});
    }

    getNote(noteId){
        return axios.get(`${API_BASE}/get/${noteId}`, {headers: authHeader()});
    }

    updateNote(noteId, note){
        return axios.put(`${API_BASE}/update/${noteId}`, note, {headers: authHeader()});
    }

    deleteNote(noteId){
        return axios.delete(`${API_BASE}/delete/${noteId}`, {headers: authHeader()});
    }
}

export default new NotesService();