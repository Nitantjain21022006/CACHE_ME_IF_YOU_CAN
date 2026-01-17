import React from 'react';
import clsx from 'clsx';

const SeverityBadge = ({ severity }) => {
    const styles = {
        LOW: 'bg-accent/10 text-accent border-accent/20',
        MEDIUM: 'bg-warning/10 text-warning border-warning/20',
        HIGH: 'bg-danger/10 text-danger border-danger/20',
    };

    return (
        <span className={clsx(
            'rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
            styles[severity] || 'bg-gray-500/10 text-gray-500'
        )}>
            {severity}
        </span>
    );
};

export default SeverityBadge;
