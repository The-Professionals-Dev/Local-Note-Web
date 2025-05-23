import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill from "react-quill-new";
import axios from 'axios';

import { TimeConversion } from '../etc/ReusableComponents.js';
import { addToTheLog } from '../Log/LogComponents.js';

import 'react-quill-new/dist/quill.snow.css';


const ManualListView = ({ onClose, note, onDelete, handleRefresh }) => {
    const [editMode, setEditMode] = useState(false);
    const lastDateFormat = TimeConversion({ date: note.lastDate });
    const quillRef = useRef(null); 

    const [editNote, setEditNote] = useState({
        noteTitle: note.noteTitle,
        noteContent: note.noteContent,
        createDate: note.createDate,
        lastDate: note.lastDate
    });

    const editText = () => {
        setEditMode(true);
    };

    const onSave = async () => {
        try {
            await axios.put(`http://localhost:5000/local/notes/${note.id}`, {
                noteTitle: editNote.noteTitle,
                noteContent: editNote.noteContent,
                createDate: editNote.createDate,
                lastDate: new Date()
            })
                .then(response => {
                    handleRefresh();
                    onClose();

                    const logData = {
                        logAction: `Edited a manual: ${editNote.id}, ${JSON.stringify(editNote)}`,
                        logLocation: "ManualListView.js, onSave()"
                    };
                    addToTheLog({ data: logData });
                })
                .catch(error => {
                    console.error('Error saving note:', error);
                });
        } catch (error) {
            console.log("Error message: ", error.message);
        }
    };

    const handleImageUpload = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;
    
            const formData = new FormData();
            formData.append("file", file);
    
            try {
                const response = await fetch("http://localhost:5000/local/upload-images", {
                    method: "POST",
                    body: formData,
                });
    
                const data = await response.json();
                const imageUrl = `http://localhost:5000/local/uploads/${data.fileName}`;
    
                insertImageIntoEditor(imageUrl);
            } catch (error) {
                console.error("Upload failed:", error);
            }
        };
        input.click();
    };    

    const insertImageIntoEditor = (imageUrl) => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
    
        quill.insertEmbed(range.index, "image", imageUrl);
    };
    
    const modules = useMemo(() => ({
        toolbar: {
            handlers: {
                image: handleImageUpload,
            },
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ["code-block"],
                [{ script: "sub"}, { script: "super" }],
                [{ color: [] }, { background: [] }],
                [{ font: [] }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean'],
            ],
        },
        clipboard: {
            matchVisual: false,
        },
    }), []);


    return (
        <div className="modal-container">
            <div className="modal-inner">
                {editMode ? (
                    <>
                        <div className="modal-button">
                            <button onClick={onSave} className="button button-modify">Save</button>
                            <button onClick={onClose} className="button button-close">Cancel</button>
                        </div>
                        <h2 className="modal-header">Edit this Note</h2>
                        <div className="small-group">
                            <div className="small-width bold">Title:</div>
                            <input
                                type="text"
                                className="max-width below searchbar black"
                                value={editNote.noteTitle}
                                onChange={e => setEditNote({ ...editNote, noteTitle: e.target.value })}
                            />
                            <ReactQuill
                                ref={quillRef}
                                value={editNote.noteContent}
                                onChange={(value) => setEditNote({ ...editNote, noteContent: value })}
                                className="mid-height"
                                modules={modules}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="modal-button">
                            <button onClick={() => onDelete(note.id)} className="button button-delete">Delete</button>
                            <button onClick={editText} className="button button-modify">Modify</button>
                            <button onClick={onClose} className="button button-close">Cancel</button>
                        </div>
                        <div className="bold tiny-top small-text">Last edited on {lastDateFormat}</div>
                        <h2 className="limit-width note-title">{note.noteTitle}</h2>
                        <ReactQuill
                            value={note.noteContent}
                            className="mid-height same-width"
                            readOnly={true}
                            modules={{ toolbar: false }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ManualListView;