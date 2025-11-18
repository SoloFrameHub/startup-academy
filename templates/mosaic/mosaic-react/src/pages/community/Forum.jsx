import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ForumLeftContent from '../../partials/community/ForumLeftContent';
import ForumEntries from '../../partials/community/ForumEntries';
import ForumRightContent from '../../partials/community/ForumRightContent';

function Forum() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-0 w-full max-w-[96rem] mx-auto">

            <div className="xl:flex">

              {/* Left + Middle content */}
              <div className="md:flex flex-1">

                {/* Left content */}
                <ForumLeftContent />

                {/* Middle content */}
                <div className="flex-1 md:ml-8 xl:mx-4 2xl:mx-8">
                  <div className="md:py-8">

                    {/* Buttons group */}
                    <div className="mb-4">
                      <div className="w-full flex flex-wrap -space-x-px">
                        <button className="btn grow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-violet-500 rounded-none first:rounded-l-lg last:rounded-r-lg">Popular</button>
                        <button className="btn grow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">Newest</button>
                        <button className="btn grow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">Following</button>
                      </div>
                    </div>

                    {/* Forum Entries */}
                    <div className="space-y-2">
                      <ForumEntries />
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 text-right">
                      <nav className="inline-flex" role="navigation" aria-label="Navigation">
                        <ul className="flex justify-center">
                          <li className="ml-3 first:ml-0">
                            <span className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-gray-300 dark:text-gray-600">&lt;- Previous</span>
                          </li>
                          <li className="ml-3 first:ml-0">
                            <a className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" href="#0">Next -&gt;</a>
                          </li>
                        </ul>
                      </nav>
                    </div>

                  </div>
                </div>                

              </div>

              {/* Right content */}
              <ForumRightContent />              

            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default Forum;