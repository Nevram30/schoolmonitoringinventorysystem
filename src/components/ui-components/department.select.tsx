'use client';

import { DEPARTMENTS, departmentValue } from '@/lib/departments';

interface DepartmentSelectProps {
    name?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    className?: string;
}

/**
 * The school's programs as a single dropdown. Programs that offer majors are grouped: the program
 * itself stays selectable for anyone who has not declared a major yet, with its majors listed
 * underneath.
 */
export default function DepartmentSelect({
    name = 'b_department',
    value,
    onChange,
    required = false,
    className = 'mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
}: DepartmentSelectProps) {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={className}
        >
            <option value="">Choose a department...</option>
            {DEPARTMENTS.map((department) =>
                department.majors?.length ? (
                    <optgroup key={department.name} label={department.name}>
                        <option value={department.name}>{department.name}</option>
                        {department.majors.map((major) => (
                            <option
                                key={major}
                                value={departmentValue(department.name, major)}
                            >
                                Major in {major}
                            </option>
                        ))}
                    </optgroup>
                ) : (
                    <option key={department.name} value={department.name}>
                        {department.name}
                    </option>
                )
            )}
        </select>
    );
}
