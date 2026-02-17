import { useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { TableCell, IconButton } from '@mui/material';

{/* Células maiores que 50 carac. são colapsadas */ }
export default function CollapsibleCell({ content }, limit = 50) {
    const [expanded, setExpanded] = useState(false);
    const isLongText = content.length > limit;
    if (content == null) {
        content = '';
    }
    return (
        <TableCell>
            {isLongText ? (
                    <>
                        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                        {expanded ? (<span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>)
                                  : (`${content.substring(0, limit)}...`)}
                    </>
                ) : (content)
            }
        </TableCell>
    );
}