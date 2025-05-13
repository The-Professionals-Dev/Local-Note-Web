import axios from 'axios';

const addToTheLog = async ({ data }) => {
    const sanitizedLogAction = JSON.stringify(data.logAction).replace(/\\/g, "");

    try {
        await axios.post("http://localhost:5000/log/notes", {
            logAction: sanitizedLogAction,
            logLocation: data.logLocation,
            createTime: new Date(),
        });        
    } catch (error) {
        console.error("Error creating log:", error.message);
    }
};


export { addToTheLog };