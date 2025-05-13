import { useState } from 'react';

const ReusableComponents = (data) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = data.filter(item => {
        if (item.noteTitle && typeof item.noteTitle === 'string' && item.noteContent && typeof item.noteContent === 'string') {
            const combinedText = item.noteTitle.toLowerCase() + ' ' + item.noteContent.toLowerCase();
            return combinedText.includes(searchTerm.toLowerCase());
        } else {
            return false;
        }
    });

    return { searchTerm, handleSearch, filteredData };
};



const LogViewerSearch = (data) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = data.filter(data => {
        if (data.logAction && typeof data.logAction === 'string' && data.logLocation && typeof data.logLocation === 'string') {
            const combinedText = data.logAction.toLowerCase() + ' ' + data.logLocation.toLowerCase();
            return combinedText.includes(searchTerm.toLowerCase());
        } else {
            return false;
        }
    });

    return { searchTerm, handleSearch, filteredData };
};


const TimeConversion = ({ date }) => {
    if (!date) {
        return <span>nil date</span>;
    }

    const createDateFormat = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return <span>{createDateFormat}</span>;
};


export { ReusableComponents, LogViewerSearch, TimeConversion };