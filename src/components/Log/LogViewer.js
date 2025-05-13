import React, { useState, useEffect } from 'react';

import { LogViewerSearch, TimeConversion } from '../etc/ReusableComponents.js'

const LogViewer = () => {
    const [data, setData] = useState([]);
    const { searchTerm, handleSearch, filteredData } = LogViewerSearch(data);

    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/log/notes')
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const toggleExpand = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div>
            <div className="Orders--Top">
                <button className="button button-close" disabled>Admin Mode</button>
                <h3 className="Orders--Title center">Log Viewer</h3>
                <input
                    type="text"
                    className='searchbar'
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search..."
                />
            </div>
            <div className="max-width">
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th className="col-1 timestamp-log-width">Timestamp</th>
                            <th className="col-2 action-log-width">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData
                            .slice()
                            .reverse()
                            .map(data => {
                                const formattedTime = <TimeConversion date={data.createTime} />;
                                const rowStyle = expandedRow === data.id ? { maxHeight: '100%', cursor: 'pointer' } : { maxHeight: '40px', cursor: 'pointer' };

                                return (
                                    <tr
                                        key={data.id}
                                        onClick={() => toggleExpand(data.id)}
                                        className="row-height-max"
                                    >
                                        <td className="align-left">{formattedTime}</td>
                                        <td className="align-left">
                                            <div className="note-content"
                                                style={rowStyle}
                                                dangerouslySetInnerHTML={{ __html: data.logAction }}>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LogViewer;
