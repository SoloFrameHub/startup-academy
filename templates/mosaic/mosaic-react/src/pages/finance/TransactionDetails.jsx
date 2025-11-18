import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import DeleteButton from '../../partials/actions/DeleteButton';
import SearchForm from '../../partials/actions/SearchForm';
import DropdownTransaction from '../../components/DropdownTransaction';
import TransactionsTable from '../../partials/finance/TransactionsTable02';
import TransactionPanel from '../../partials/finance/TransactionPanel';
import PaginationClassic from '../../components/PaginationClassic';

function TransactionDetails() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [transactionPanelOpen, setTransactionPanelOpen] = useState(true);

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} variant="v2" />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} variant="v3" />

        <main className="grow">
          <div className="relative">
            {/* Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
              {/* Page header */}
              <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">$47,347.09</h1>
                </div>

                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {/* Delete button */}
                  <DeleteButton selectedItems={selectedItems} />

                  {/* Search form */}
                  <div className="hidden sm:block">
                    <SearchForm />
                  </div>

                  {/* Export button */}
                  <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">Export Transactions</button>
                </div>
              </div>

              <div className="mb-5">
                <span>Transactions from </span>
                <DropdownTransaction />
              </div>

              {/* Filters */}
              <div className="mb-5">
                <ul className="flex flex-wrap -m-1">
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800 transition">
                      View All
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                      Completed
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                      Pending
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                      Canceled
                    </button>
                  </li>
                </ul>
              </div>

              {/* Table */}
              <TransactionsTable selectedItems={handleSelectedItems} setTransactionPanelOpen={setTransactionPanelOpen} />

              {/* Pagination */}
              <div className="mt-8">
                <PaginationClassic />
              </div>
            </div>

            <TransactionPanel transactionPanelOpen={transactionPanelOpen} setTransactionPanelOpen={setTransactionPanelOpen} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default TransactionDetails;