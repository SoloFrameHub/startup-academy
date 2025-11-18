import React, { useState } from 'react';

function Mail(props) {

  const [open, setOpen] = useState(props.open);

  return (
    <div className="py-6">
      {/* Header */}
      <header className="flex items-start">
        {/* Avatar */}
        <img className="rounded-full shrink-0 mr-3" src={props.image} width="40" height="40" alt={props.name} />
        {/* Meta */}
        <div className="grow">
          <div className="sm:flex items-start justify-between mb-0.5">
            {/* Message author */}
            <div className="xl:flex items-center mb-2 sm:mb-0">
              <button className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-left truncate" onClick={() => setOpen(!open)}>{props.name}</button>
              {open &&
                <>
                  <div className="text-sm text-gray-400 dark:text-gray-600 hidden xl:block mx-1">·</div>
                  <div className="text-xs dark:text-gray-500">{props.email}</div>
                </>
              }
            </div>
            {/* Date */}
            <div className="text-xs font-medium text-gray-500 whitespace-nowrap mb-2 sm:mb-0">{props.date}</div>
          </div>
          {/* To */}
          {open &&
            <div className="text-xs font-medium text-gray-500">To {props.recipients.join(', ')}</div>
          }
          {/* Excerpt */}
          {!open &&
            <div className="text-sm">{props.excerpt}</div>
          }
        </div>
      </header>
      {/* Body */}
      {open &&
        <div className="text-sm text-gray-800 dark:text-gray-100 mt-4 space-y-2" dangerouslySetInnerHTML={{ __html: props.message }}></div>
      }
    </div>
  );
}

export default Mail;
