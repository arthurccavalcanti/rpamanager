import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';

export default function Notification({ messageNotification, typeNotification, duration }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (messageNotification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [messageNotification, duration]);

    if (!isVisible) return null;

    return (
        <Alert variant="standard" severity={typeNotification}>{messageNotification}</Alert>
    );
}