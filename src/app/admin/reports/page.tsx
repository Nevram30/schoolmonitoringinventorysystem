'use client';

import { useState, useEffect, useCallback } from 'react';
import { DocumentArrowDownIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Layout from '../Layout';
import ItemAvatar from '@/components/ui-components/item.avatar';
import BarcodeGenerator from '@/components/ui-components/barcode.generator';
import Alert from '@/components/ui-components/alert';
import { useAlert } from '@/components/ui-components/useAlert';
import {
  escapeHtml,
  openPrintableReport,
  photoCellHtml,
  printColorStyles,
} from '@/lib/print-report';
import { trpcClient } from '@/trpc/client';

interface ReportData {
  totalItems: number;
  totalMembers: number;
  totalRooms: number;
  activeBorrows: number;
  overdueBorrows: number;
  returnedThisMonth: number;
  popularItems: Array<{
    id: number;
    i_model: string;
    i_deviceID: string;
    i_photo?: string | null;
    i_brand?: string | null;
    borrowCount: number;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    date: string;
  }>;
  monthlyStats?: Array<{
    month: string;
    borrowed: number;
    returned: number;
  }>;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const { alert, showSuccess, showError, hideAlert } = useAlert();

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await trpcClient.reports.summary.query({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      if (data.success) {
        setReportData(data.data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  /**
   * Builds the report in a print window rather than asking the server for a file: the old
   * handler fetched /api/reports/export, a REST route that no longer exists, so nothing ever
   * downloaded. The document mirrors what is on screen for the selected date range.
   */
  const buildReportHtml = (data: ReportData) => {
    const summaryRows = [
      ['Total Items', data.totalItems],
      ['Total Members', data.totalMembers],
      ['Total Rooms', data.totalRooms],
      ['Active Borrows', data.activeBorrows],
      ['Overdue Items', data.overdueBorrows],
      ['Returned This Month', data.returnedThisMonth]
    ]
      .map(([label, value]) => `<tr><th class="label">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
      .join('');

    const popularRows = data.popularItems
      .map(
        item => `
        <tr>
          <td class="photo">${photoCellHtml(item.i_photo, item.i_brand, item.i_model, 40)}</td>
          <td>${escapeHtml(item.i_model)}</td>
          <td>${escapeHtml(item.i_deviceID)}</td>
          <td>${escapeHtml(item.borrowCount)}</td>
        </tr>`
      )
      .join('');

    const activityRows = data.recentActivity
      .map(
        activity => `
        <tr>
          <td>${new Date(activity.date).toLocaleDateString()}</td>
          <td>${escapeHtml(activity.description)}</td>
        </tr>`
      )
      .join('');

    return `
      <html>
        <head>
          <title>Inventory Report - ${dateRange.startDate} to ${dateRange.endDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 11px; ${printColorStyles} }
            h1 { color: #333; text-align: center; margin-bottom: 4px; }
            h2 { color: #333; font-size: 14px; margin: 20px 0 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
            .meta { color: #444; text-align: center; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { background-color: #f8f9fa; border: 1px solid #ddd; padding: 6px; font-weight: bold; text-align: left; }
            td { border: 1px solid #ddd; padding: 6px; }
            td.photo { width: 48px; padding: 4px; }
            th.label { width: 40%; }
            .summary { width: 60%; }
            tr { page-break-inside: avoid; }
            @media print {
              body { margin: 10px; }
              thead { display: table-header-group; }
            }
          </style>
        </head>
        <body>
          <h1>Property Monitoring Report</h1>
          <div class="meta">
            <strong>Period:</strong> ${new Date(dateRange.startDate).toLocaleDateString()} –
            ${new Date(dateRange.endDate).toLocaleDateString()} &nbsp;·&nbsp;
            <strong>Generated:</strong> ${new Date().toLocaleString()}
          </div>

          <h2>Summary</h2>
          <table class="summary">${summaryRows}</table>

          <h2>Most Borrowed Items</h2>
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Item</th>
                <th>Device ID</th>
                <th>Borrow Count</th>
              </tr>
            </thead>
            <tbody>
              ${popularRows ||
                '<tr><td colspan="4" style="text-align: center; color: #666;">No borrowing data for this period.</td></tr>'}
            </tbody>
          </table>

          <h2>Recent Activity</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              ${activityRows ||
                '<tr><td colspan="2" style="text-align: center; color: #666;">No recent activity.</td></tr>'}
            </tbody>
          </table>
        </body>
      </html>`;
  };

  const handleExportPDF = () => {
    if (!reportData) {
      showError('Wait for the report data to finish loading.', 'Nothing to export');
      return;
    }

    openPrintableReport({
      html: buildReportHtml(reportData),
      onBlocked: () =>
        showError('Please allow pop-ups for this site and try again.', 'Blocked by the browser'),
      onReady: () =>
        showSuccess('Choose "Save as PDF" in the print dialog to save the report', 'Success'),
      onError: (error) => {
        console.error('Error building report:', error);
        showError('Failed to build the report', 'Something went wrong');
      },
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="mt-2 text-sm text-gray-700">
              View analytics and generate reports for property monitoring.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={handleExportPDF}
              disabled={loading || !reportData}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    id="startDate"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    id="endDate"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reportData ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                        <dd className="text-lg font-medium text-gray-900">{reportData.totalItems}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                        <dd className="text-lg font-medium text-gray-900">{reportData.totalMembers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Rooms</dt>
                        <dd className="text-lg font-medium text-gray-900">{reportData.totalRooms}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Borrows</dt>
                        <dd className="text-lg font-medium text-yellow-600">{reportData.activeBorrows}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Overdue Items</dt>
                        <dd className="text-lg font-medium text-red-600">{reportData.overdueBorrows}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Returned This Month</dt>
                        <dd className="text-lg font-medium text-green-600">{reportData.returnedThisMonth}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Items */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Most Borrowed Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Device ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Borrow Count
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.popularItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center gap-3">
                              <ItemAvatar
                                photo={item.i_photo}
                                brand={item.i_brand}
                                alt={item.i_model}
                                className="h-10 w-10 shrink-0"
                                textClassName="text-sm"
                              />
                              {item.i_model}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.i_deviceID}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.borrowCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reportData.popularItems.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-500">No borrowing data available for this period.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {reportData.recentActivity.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== reportData.recentActivity.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <CalendarIcon className="h-5 w-5 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {activity.description}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {new Date(activity.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {reportData.recentActivity.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-500">No recent activity.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Failed to load report data.</p>
          </div>
        )}

        {/* Independent of the date range, so it stays available while the report loads. */}
        <BarcodeGenerator onSuccess={showSuccess} onError={showError} />

        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          isVisible={alert.isVisible}
          onClose={hideAlert}
        />
      </div>
    </Layout>
  );
}
