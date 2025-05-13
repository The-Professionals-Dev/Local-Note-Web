import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';

import ManualListView from './ManualListView.js';
import { ReusableComponents } from '../etc/ReusableComponents.js';
import { addToTheLog } from '../Log/LogComponents.js';

import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';

const ManualList = () => {
    const [data, setData] = useState([]);
    const { searchTerm, handleSearch, filteredData } = ReusableComponents(data);
    const quillRef = useRef(null);

    const [isManualCreateOpen, setIsManualCreateOpen] = useState(false);
    const openManualCreate = () => setIsManualCreateOpen(true);
    const closeManualCreate = () => setIsManualCreateOpen(false);

    const [isManualViewOpen, setIsManualViewOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const openManualView = (note) => {
        setSelectedNote(note);
        setIsManualViewOpen(true);
    };
    const closeManualView = () => {
        setIsManualViewOpen(false);
        setSelectedNote(null);
    };

    const [note, setNote] = useState({
        noteTitle: '',
        noteContent: '',
        createDate: '',
        lastDate: ''
    });


    /**
     * CC - useEffect()
     */

    useEffect(() => {
        fetch('http://localhost:5000/local/notes')
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    /**
     * CC - handleManualCreate()
     */

    const handleManualCreate = async (e) => {
        e.preventDefault();

        if (!note.noteTitle || !note.noteContent) { return false; }

        try {
            const postedLog = await axios.post('http://localhost:5000/local/notes', {
                noteTitle: note.noteTitle,
                noteContent: note.noteContent,
                createDate: new Date(),
                lastDate: new Date()
            })
            console.log("Created successfully.", postedLog);

            const logData = {
                logAction: `Created a manual: ${postedLog.data.id}, ${JSON.stringify(note)}`,
                logLocation: "ManualList.js, handleManualCreate()"
            };
            addToTheLog({ data: logData });

            const response = await fetch('http://localhost:5000/local/notes');
            const updatedData = await response.json();
            setData(updatedData);

        } catch (error) {
            console.log("Error message: ", error.message);
        } finally {
            setNote({
                noteTitle: '',
                noteContent: '',
                createDate: '',
                lastDate: ''
            });
            closeManualCreate();
        }
    };


    const handleDelete = async (id) => {
        closeManualView();

        try {
            const response = await axios.get(`http://localhost:5000/local/notes/${id}`);
            const note = response.data;

            const logData = {
                logAction: `Deleted a manual: ${id}, ${JSON.stringify(note)}`,
                logLocation: "ManualList.js, handleDelete()"
            };
            addToTheLog({ data: logData });

            const deleteResponse = await axios.delete(`http://localhost:5000/local/notes/${id}`);

            if (deleteResponse.status === 200) {
                console.log("Order deleted successfully");

                const updatedResponse = await fetch('http://localhost:5000/local/notes');
                const updatedData = await updatedResponse.json();
                setData(updatedData);
            }

        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };


    const handleRefresh = async () => {
        fetch('http://localhost:5000/local/notes')
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }


    
    // Custom function to upload image via API
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
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image'],
                ['clean'],
            ],
        },
        clipboard: {
            matchVisual: false,
        },
    }), []);


    return (
        <div>
            <div className="Orders--Top">
                <button className="button button-create" onClick={() => openManualCreate()} >Create</button>
                <h3 className="header center">Notes</h3>
                <input
                    type="text"
                    value={searchTerm}
                    className='searchbar'
                    onChange={handleSearch}
                    placeholder="Search..."
                />
            </div>

            {isManualCreateOpen ? (
                <div className="modal-container">
                    <div className="modal-inner">
                        <h2 className="modal-header">Create a Note</h2>
                        <div className="Flex column">
                            <div className="small-group">
                                <div className="small-width bold">Title:</div>
                                <input
                                    type="text"
                                    className="max-width below searchbar black"
                                    value={note.noteTitle}
                                    onChange={e => setNote({ ...note, noteTitle: e.target.value })}
                                />
                                <ReactQuill
                                    ref={quillRef}
                                    value={note.noteContent}
                                    onChange={(value) => setNote({ ...note, noteContent: value })}
                                    className="mid-height"
                                    modules={modules}
                                /> 
                            </div>
                        </div>
                        <div className="Modal--Button">
                            <button onClick={handleManualCreate} className="button button-modify">Submit</button>
                            <button onClick={closeManualCreate} className="button button-close">Cancel</button>
                        </div>
                    </div>
                </div>
            ) : (
              <></>  
            )}

            {/* Modal - only shown when isModalOpen is true */}
            {isManualViewOpen && selectedNote && (
                <ManualListView
                    onClose={closeManualView}
                    note={selectedNote}
                    onDelete={handleDelete}
                    handleRefresh={handleRefresh}
                />
            )}

            <div className="notes-container">
                {filteredData.map(note => (
                    <div key={note.id} className="note-card" onClick={() => openManualView(note)}>
                        <h3>{note.noteTitle}</h3>
                        <div className="note-content" dangerouslySetInnerHTML={{ __html: note.noteContent.substring(0, 100) }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManualList


{/* 
    import ManualListCreate from './ManualListCreate.js';
    <ManualListCreate
        isOpen={isManualCreateOpen}
        onClose={closeManualCreate}
        onSubmit={handleManualCreate}
        note={note}
        setNote={setNote}
    />

    // backup
    <div>
        <table className='table table-striped' aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th className="col-1">Title</th>
                    <th className="col-2">Contents</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map(note => (
                    <tr className="row-height-max" key={note.id} onClick={() => openManualView(note)} style={{ cursor: "pointer" }}>
                        <td className="align-left limit-width">{note.noteTitle}</td>
                        <td className="align-left">
                            <div className="note-content" dangerouslySetInnerHTML={{ __html: note.noteContent.substring(0, 100) }}></div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div> 
*/}