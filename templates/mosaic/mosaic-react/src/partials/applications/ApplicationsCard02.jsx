import React from 'react';
import { Link } from 'react-router-dom';

function ApplicationsCard02(props) {
  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Image */}
        <img className="w-full" src={props.image} width="286" height="160" alt={props.name} />
        {/* Card Content */}
        <div className="grow flex flex-col p-5">
          {/* Card body */}
          <div className="grow">
            {/* Header */}
            <header className="mb-2">
              <h3 className="text-lg text-gray-800 dark:text-gray-100 font-semibold mb-1">{props.title}</h3>
              <div className="text-sm">{props.content}</div>
            </header>
            {/* Price */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="inline-flex text-sm font-medium bg-green-500/20 text-green-700 rounded-full text-center px-2.5 py-0.5">{props.deal}</div>
              <div className="inline-flex text-sm font-medium text-gray-400 dark:text-gray-500 line-through">{props.price}</div>
            </div>
          </div>
          {/* Card footer */}
          <div>
            <Link className="btn-sm w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" to={props.link}>Buy Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationsCard02;