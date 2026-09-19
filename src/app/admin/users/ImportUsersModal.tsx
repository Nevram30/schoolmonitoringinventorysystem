'use client';

import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { trpcClient } from '@/trpc/client';

type Role = 'admin' | 'staff' | 'faculty' | 'student';

interface ImportRow {
  /** Row number as shown in Excel (header is row 1). */
  row: number;
  name: string;
  username: string;
  password: string;
  email: string;
  id_number: string;
  role: Role | null;
  status: 1 | 2 | null;
  errors: string[];
}

interface ImportResult {
  created: number;
  failed: { row: number; username: string; error: string }[];
}

const MIN_PASSWORD_LENGTH = 8;
const MAX_ROWS = 1000;

const TEMPLATE_HEADERS = ['Name', 'Username', 'Email', 'ID Number', 'Role', 'Password', 'Status'];

/**
 * Accepted spellings for each column, compared after lower-casing and
 * stripping everything but letters and digits ("ID Number" → "idnumber").
 */
const COLUMN_ALIASES: Record<keyof Omit<ImportRow, 'row' | 'errors'>, string[]> = {
  name: ['name', 'fullname'],
  username: ['username', 'user'],
  email: ['email', 'emailaddress'],
  id_number: ['idnumber', 'idno', 'id', 'schoolid', 'studentid', 'facultyid', 'staffid', 'adminid'],
  role: ['role', 'type', 'usertype'],
  password: ['password'],
  status: ['status']
};

const REQUIRED_COLUMNS = {
  name: 'Name',
  username: 'Username',
  email: 'Email',
  id_number: 'ID Number',
  role: 'Role',
  password: 'Password'
};

const normalizeHeader =(header: string) => header.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Role by name, or by the numeric type used elsewhere (1=admin … 4=student). */
const parseRole = (value: string): Role | null => {
  const v = value.trim().toLowerCase();
  const byNumber: Record<string, Role> = { '1': 'admin', '2': 'faculty', '3': 'staff', '4': 'student' };
  if (v in byNumber) return byNumber[v]!;
  return (['admin', 'faculty', 'staff', 'student'] as const).find((r) => r === v) ?? null;
};

/** Blank means active, matching the database default. */
const parseStatus = (value: string): 1 | 2 | null => {
  const v = value.trim().toLowerCase();
  if (v === '' || v === '1' || v === 'active') return 1;
  if (v === '2' || v === 'inactive') return 2;
  return null;
};

const parseWorkbook = (buffer: ArrayBuffer): { rows: ImportRow[]; missing: string[] } => {
  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]!]!;
  // raw: false returns cell text as displayed, so ID numbers stay as typed.
  const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false
  });

  // Map each database field to whichever sheet header matches it.
  const headers = Object.keys(records[0] ?? {});
  const columnFor = Object.fromEntries(
    Object.entries(COLUMN_ALIASES).map(([field, aliases]) => [
      field,
      headers.find((h) => aliases.includes(normalizeHeader(h)))
    ])
  ) as Record<keyof typeof COLUMN_ALIASES, string | undefined>;

  // Status is optional; every other column must be present.
  const missing = Object.entries(REQUIRED_COLUMNS)
    .filter(([field]) => !columnFor[field as keyof typeof COLUMN_ALIASES])
    .map(([, label]) => label);

  const cell = (record: Record<string, unknown>, field: keyof typeof COLUMN_ALIASES) => {
    const column = columnFor[field];
    return column ? String(record[column] ?? '').trim() : '';
  };

  const seenUsernames = new Set<string>();
  const seenEmails = new Set<string>();
  const seenIds = new Set<string>();

  const rows = records
    .map((record, index) => ({ record, row: index + 2 }))
    // Skip rows that are completely empty.
    .filter(({ record }) => Object.values(record).some((v) => String(v).trim() !== ''))
    .map(({ record, row }): ImportRow => {
      const item = {
        row,
        name: cell(record, 'name'),
        username: cell(record, 'username'),
        // Passwords are taken as typed, spaces included.
        password: columnFor.password ? String(record[columnFor.password] ?? '') : '',
        email: cell(record, 'email'),
        id_number: cell(record, 'id_number'),
        role: parseRole(cell(record, 'role')),
        status: parseStatus(cell(record, 'status')),
        errors: [] as string[]
      };

      if (!item.name) item.errors.push('Name is required');
      else if (item.name.length > 50) item.errors.push('Name is over 50 characters');
      if (!item.username) item.errors.push('Username is required');
      else if (item.username.length > 50) item.errors.push('Username is over 50 characters');
      if (!item.email) item.errors.push('Email is required');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) item.errors.push('Email is invalid');
      if (!item.id_number) item.errors.push('ID number is required');
      if (!item.role) item.errors.push('Role must be admin, faculty, staff or student');
      if (item.password.length < MIN_PASSWORD_LENGTH)
        item.errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      if (!item.status) item.errors.push('Status must be Active or Inactive');

      const username = item.username.toLowerCase();
      const email = item.email.toLowerCase();
      if (username && seenUsernames.has(username)) item.errors.push('Duplicate username in file');
      if (email && seenEmails.has(email)) item.errors.push('Duplicate email in file');
      if (item.id_number && seenIds.has(item.id_number)) item.errors.push('Duplicate ID number in file');
      seenUsernames.add(username);
      seenEmails.add(email);
      seenIds.add(item.id_number);

      return item;
    });

  return { rows, missing };
};

const downloadTemplate = () => {
  const sheet = XLSX.utils.aoa_to_sheet([
    TEMPLATE_HEADERS,
    ['Juan Dela Cruz', 'jdelacruz', 'juan.delacruz@school.edu', '2024-0001', 'student', 'ChangeMe123', 'Active'],
    ['Maria Santos', 'msantos', 'maria.santos@school.edu', 'FAC-0001', 'faculty', 'ChangeMe123', 'Active']
  ]);
  sheet['!cols'] = TEMPLATE_HEADERS.map(() => ({ wch: 24 }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Users');
  XLSX.writeFile(workbook, 'user-import-template.xlsx');
};

interface ImportUsersModalProps {
  onClose: () => void;
  /** Called after an import that created at least one user. */
  onImported: (created: number) => void;
}

export default function ImportUsersModal({ onClose, onImported }: ImportUsersModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileError, setFileError] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const validRows = rows.filter((r) => r.errors.length === 0);
  const invalidCount = rows.length - validRows.length;

  const reset = () => {
    setFileName('');
    setRows([]);
    setFileError('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    reset();
    setFileName(file.name);

    try {
      const { rows, missing } = parseWorkbook(await file.arrayBuffer());

      if (missing.length > 0) {
        setFileError(`Missing column${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}. Download the template to see the expected layout.`);
        return;
      }
      if (rows.length === 0) {
        setFileError('The first sheet has no user rows.');
        return;
      }
      if (rows.length > MAX_ROWS) {
        setFileError(`The file has ${rows.length} rows; import at most ${MAX_ROWS} at a time.`);
        return;
      }

      setRows(rows);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      setFileError('Could not read this file. Upload an .xlsx, .xls or .csv file.');
    }
  };

  const handleImport = async () => {
    if (validRows.length === 0) return;
    setImporting(true);

    try {
      const data = await trpcClient.users.bulkCreate.mutate({
        rows: validRows.map(({ errors, role, status, ...row }) => ({
          ...row,
          role: role!,
          status: status!
        }))
      });

      if (!data.success) {
        setFileError(data.error);
        return;
      }

      setResult({ created: data.created, failed: data.failed });
      setRows([]);
      if (data.created > 0) onImported(data.created);
    } catch (error) {
      console.error('Error importing users:', error);
      setFileError('Something went wrong while importing. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-gray-600/25" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-4xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Upload Users from Excel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p>
              The first sheet needs a header row with the columns{' '}
              <span className="font-medium">{TEMPLATE_HEADERS.join(', ')}</span>. Role is admin,
              faculty, staff or student; Status is Active or Inactive (blank means Active). Passwords
              must be at least {MIN_PASSWORD_LENGTH} characters.
            </p>
            <button
              type="button"
              onClick={downloadTemplate}
              className="mt-3 inline-flex items-center rounded-md border border-blue-300 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              <ArrowDownTrayIcon className="mr-1 h-4 w-4" />
              Download template
            </button>
          </div>

          <div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-8 text-center hover:border-blue-400">
              <ArrowUpTrayIcon className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm font-medium text-gray-700">
                {fileName || 'Choose an Excel file'}
              </span>
              <span className="mt-1 text-xs text-gray-500">.xlsx, .xls or .csv</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFile}
                className="sr-only"
              />
            </label>
          </div>

          {fileError && (
            <div role="alert" className="flex items-start rounded-md border border-red-200 bg-red-50 p-4">
              <XCircleIcon className="h-5 w-5 shrink-0 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{fileError}</p>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="flex items-start rounded-md border border-green-200 bg-green-50 p-4">
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-500" />
                <p className="ml-3 text-sm text-green-800">
                  {result.created} user{result.created === 1 ? '' : 's'} imported.
                  {result.failed.length > 0 && ` ${result.failed.length} row${result.failed.length === 1 ? '' : 's'} could not be imported.`}
                </p>
              </div>

              {result.failed.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Row</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Username</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {result.failed.map((f) => (
                      <tr key={f.row}>
                        <td className="px-3 py-2 text-gray-500">{f.row}</td>
                        <td className="px-3 py-2 text-gray-900">{f.username || '—'}</td>
                        <td className="px-3 py-2 text-red-600">{f.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {rows.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-medium">{validRows.length}</span> ready to import
                {invalidCount > 0 && (
                  <>
                    , <span className="font-medium text-red-600">{invalidCount}</span> with problems
                    (these will be skipped)
                  </>
                )}
                .
              </p>
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Row', 'Name', 'Username', 'Email', 'ID Number', 'Role', 'Status', 'Check'].map((h) => (
                        <th key={h} className="whitespace-nowrap px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rows.map((r) => (
                      <tr key={r.row} className={r.errors.length ? 'bg-red-50' : undefined}>
                        <td className="px-3 py-2 text-gray-500">{r.row}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-900">{r.name || '—'}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700">{r.username || '—'}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700">{r.email || '—'}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700">{r.id_number || '—'}</td>
                        <td className="px-3 py-2 capitalize text-gray-700">{r.role ?? '—'}</td>
                        <td className="px-3 py-2 text-gray-700">
                          {r.status === 1 ? 'Active' : r.status === 2 ? 'Inactive' : '—'}
                        </td>
                        <td className="px-3 py-2">
                          {r.errors.length === 0 ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <ul className="space-y-0.5 text-xs text-red-600">
                              {r.errors.map((e) => (
                                <li key={e}>{e}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={result ? reset : onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {result ? 'Upload another file' : 'Cancel'}
          </button>
          {result ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || validRows.length === 0}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {importing
                ? 'Importing...'
                : `Import ${validRows.length} user${validRows.length === 1 ? '' : 's'}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
