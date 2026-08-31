'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowPathIcon, ClockIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

import Layout from '../Layout';
import Alert from '@/components/ui-components/alert';
import { useAlert } from '@/components/ui-components/useAlert';
import { trpcClient } from '@/trpc/client';
import { DEFAULT_FEE_SETTINGS, suggestFees, type FeeSettings } from '@/lib/fees';

/** The form keeps every amount as a string so a half-typed value does not snap back to 0. */
type FeeForm = {
    [K in keyof FeeSettings]: FeeSettings[K] extends boolean ? boolean : string;
};

const toForm = (settings: FeeSettings): FeeForm => ({
    f_overdue_fee_per_day: String(settings.f_overdue_fee_per_day ?? 0),
    f_overdue_grace_days: String(settings.f_overdue_grace_days ?? 0),
    f_overdue_max_fee: String(settings.f_overdue_max_fee ?? 0),
    f_damage_fee_fair: String(settings.f_damage_fee_fair ?? 0),
    f_damage_fee_damaged: String(settings.f_damage_fee_damaged ?? 0),
    f_damage_fee_lost: String(settings.f_damage_fee_lost ?? 0),
    f_lost_charge_item_price: Boolean(settings.f_lost_charge_item_price)
});

const toSettings = (form: FeeForm): FeeSettings => ({
    f_overdue_fee_per_day: parseFloat(form.f_overdue_fee_per_day) || 0,
    f_overdue_grace_days: parseInt(form.f_overdue_grace_days, 10) || 0,
    f_overdue_max_fee: parseFloat(form.f_overdue_max_fee) || 0,
    f_damage_fee_fair: parseFloat(form.f_damage_fee_fair) || 0,
    f_damage_fee_damaged: parseFloat(form.f_damage_fee_damaged) || 0,
    f_damage_fee_lost: parseFloat(form.f_damage_fee_lost) || 0,
    f_lost_charge_item_price: form.f_lost_charge_item_price
});

const formatFee = (value: number) => Number(value ?? 0).toFixed(2);

interface MoneyFieldProps {
    label: string;
    hint?: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function MoneyField({ label, hint, value, onChange, disabled = false }: MoneyFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="number"
                min="0"
                step="0.01"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                placeholder="0.00"
            />
            {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
    );
}

/**
 * Fee policy setup. The amounts saved here drive the suggested late and damage fees on
 * /admin/returned-items — the admin can still override any individual assessment there.
 */
export default function AdminSettingsPage() {
    const [form, setForm] = useState<FeeForm>(toForm(DEFAULT_FEE_SETTINGS));
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const { alert, showSuccess, showError, hideAlert } = useAlert();

    const setField = <K extends keyof FeeForm>(key: K, value: FeeForm[K]) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await trpcClient.settings.getFees.query();

            if (data.success) {
                setForm(toForm(data.data));
                setUpdatedAt(data.data.updatedAt ? new Date(data.data.updatedAt) : null);
            } else {
                showError(data.error, 'Something went wrong');
            }
        } catch (error) {
            console.error('Error fetching fee settings:', error);
            showError('Error loading fee settings', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const settings = toSettings(form);

        if (Object.values(settings).some(value => typeof value === 'number' && value < 0)) {
            showError('Fees and grace days cannot be negative.', 'Check the amounts');
            return;
        }

        if (
            settings.f_overdue_max_fee > 0 &&
            settings.f_overdue_max_fee < settings.f_overdue_fee_per_day
        ) {
            showError(
                'The maximum late fee is lower than one day of overdue charge.',
                'Check the amounts'
            );
            return;
        }

        try {
            setSaving(true);
            const data = await trpcClient.settings.updateFees.mutate(settings);

            if (data.success) {
                setForm(toForm(data.data));
                setUpdatedAt(new Date(data.data.updatedAt));
                showSuccess('Fee settings saved successfully', 'Success');
            } else {
                showError(data.error, 'Something went wrong');
            }
        } catch (error) {
            console.error('Error saving fee settings:', error);
            showError('Error saving fee settings', 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    // Live worked example so the admin can see what the policy actually costs a borrower.
    const preview = (() => {
        const settings = toSettings(form);
        const returnedAt = new Date();
        const dueDate = new Date(returnedAt.getTime() - 5 * 24 * 60 * 60 * 1000);
        const late = suggestFees(settings, { dueDate, returnedAt, condition: 'Good', quantity: 1 });
        const damaged = suggestFees(settings, {
            dueDate: returnedAt,
            returnedAt,
            condition: 'Damaged',
            quantity: 1
        });
        return { late, damaged, settings };
    })();

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Set the overdue and damaged-item charges used to suggest fees on the
                            Returned Items screen.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                        <button
                            type="button"
                            onClick={fetchSettings}
                            disabled={loading || saving}
                            className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            <ArrowPathIcon className="mr-1.5 h-4 w-4" />
                            Reload
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white shadow rounded-lg">
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Overdue fee */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <ClockIcon className="h-6 w-6 text-blue-600 shrink-0" />
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">Overdue Fee</h2>
                                        <p className="text-sm text-gray-500">
                                            Charged for every day an item is returned after its due date.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <MoneyField
                                        label="Fee per day late"
                                        hint="Amount added for each chargeable day."
                                        value={form.f_overdue_fee_per_day}
                                        onChange={(value) => setField('f_overdue_fee_per_day', value)}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Grace period (days)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={form.f_overdue_grace_days}
                                            onChange={(e) => setField('f_overdue_grace_days', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Late days that are not charged. 0 charges from the first day.
                                        </p>
                                    </div>

                                    <MoneyField
                                        label="Maximum late fee"
                                        hint="Ceiling on the total late fee. 0 means no limit."
                                        value={form.f_overdue_max_fee}
                                        onChange={(value) => setField('f_overdue_max_fee', value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Damage fee */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600 shrink-0" />
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">Damaged Item Fee</h2>
                                        <p className="text-sm text-gray-500">
                                            Charged per item, based on the condition recorded when the item was
                                            returned. Items returned in <strong>Good</strong> condition are never
                                            charged.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <MoneyField
                                        label="Fair condition"
                                        hint="Light wear, still usable."
                                        value={form.f_damage_fee_fair}
                                        onChange={(value) => setField('f_damage_fee_fair', value)}
                                    />
                                    <MoneyField
                                        label="Damaged condition"
                                        hint="Needs repair before it can be lent again."
                                        value={form.f_damage_fee_damaged}
                                        onChange={(value) => setField('f_damage_fee_damaged', value)}
                                    />
                                    <MoneyField
                                        label="Lost item"
                                        hint={
                                            form.f_lost_charge_item_price
                                                ? "Ignored while lost items are charged at the item's price."
                                                : 'Flat replacement charge for an unreturned item.'
                                        }
                                        value={form.f_damage_fee_lost}
                                        onChange={(value) => setField('f_damage_fee_lost', value)}
                                        disabled={form.f_lost_charge_item_price}
                                    />
                                </div>

                                <label className="flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-3">
                                    <input
                                        type="checkbox"
                                        checked={form.f_lost_charge_item_price}
                                        onChange={(e) =>
                                            setField('f_lost_charge_item_price', e.target.checked)
                                        }
                                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Charge lost items at the item&apos;s own price
                                        <span className="block text-xs text-gray-500">
                                            Uses the price recorded on the item instead of the flat lost fee above.
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Worked example */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-5 sm:p-6">
                            <h3 className="text-sm font-medium text-blue-900">How this applies</h3>
                            <ul className="mt-2 space-y-1 text-sm text-blue-800">
                                <li>
                                    An item returned <strong>5 days</strong> after its due date in Good condition:
                                    late fee <strong>{formatFee(preview.late.lateFee)}</strong>
                                    {preview.late.chargeableDays !== preview.late.daysLate && (
                                        <> ({preview.late.chargeableDays} of 5 days charged after the grace period)</>
                                    )}
                                    {preview.late.lateFeeCapped && <> — trimmed by the maximum</>}
                                </li>
                                <li>
                                    One item returned on time but <strong>Damaged</strong>: damage fee{' '}
                                    <strong>{formatFee(preview.damaged.damageFee)}</strong>
                                </li>
                                <li>
                                    A lost item is charged{' '}
                                    <strong>
                                        {preview.settings.f_lost_charge_item_price
                                            ? "the item's own price"
                                            : formatFee(preview.settings.f_damage_fee_lost)}
                                    </strong>
                                </li>
                            </ul>
                            <p className="mt-3 text-xs text-blue-700">
                                These are suggestions. An admin can still adjust the fee on any individual return.
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                {updatedAt
                                    ? `Last updated ${updatedAt.toLocaleString()}`
                                    : 'No fee policy saved yet.'}
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={fetchSettings}
                                    disabled={saving}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

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
