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

    const [sortOption, setSortOption] = useState("date-asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

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

    const sortedData = useMemo(() => {
        return [...filteredData].sort((a,b) => {
            switch (sortOption) {
                case "title-desc":
                    return b.noteTitle.localeCompare(a.noteTitle);
                case "date-asc":
                    return new Date(a.createDate) - new Date(b.createDate);
                case "date-desc":
                    return new Date(b.createDate) - new Date(a.createDate);
                default:
                    return 0;
            }
        })
    }, [filteredData, sortOption]);    

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage]);    


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
        <div>
            <div className="Orders--Top">
                <button className="button button-create" onClick={() => openManualCreate()} >Create</button>
                <h3 className="header center">Notes</h3>
                <div>    
                    <input
                        type="text"
                        value={searchTerm}
                        className='searchbar'
                        onChange={handleSearch}
                        placeholder="Search..."
                    />
                    <select
                        className="sort-controls"
                        onChange={(e) => setSortOption(e.target.value)}
                        value={sortOption}
                    >
                        <option value="date-asc">Old to New</option>
                        <option value="date-desc">New to Old</option>
                        <option value="title-asc">Ascending Order</option>
                        <option value="title-desc">Descending Order</option>
                    </select>
                </div>
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

            {isManualViewOpen && selectedNote && (
                <ManualListView
                    onClose={closeManualView}
                    note={selectedNote}
                    onDelete={handleDelete}
                    handleRefresh={handleRefresh}
                />
            )}

            <div className="notes-container">
                {paginatedData.map(note => (
                    <div key={note.id} className="note-card" onClick={() => openManualView(note)}>
                        <h3>{note.noteTitle}</h3>
                        <div className="note-content" dangerouslySetInnerHTML={{ __html: note.noteContent.substring(0, 100) }}></div>
                    </div>
                ))}
            </div>
            <div className="pagination-controls">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ManualList