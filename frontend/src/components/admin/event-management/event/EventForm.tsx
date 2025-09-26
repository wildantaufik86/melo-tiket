'use client'

import { createEvent, fetchEventById, ICreateEventPayload, updateEvent } from "@/app/api/event";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EventFormProps {
    eventId?: string;
}

type FormData = Omit<ICreateEventPayload, 'date'> & { date: string };

const initialState: FormData = {
    eventName: '',
    date: '',
    time: '',
    address: '',
    description: '',
    eventDesc: '',
    ticketDesc: '',
    headlineImage: '',
    isPublished: false
};

export default function EventForm({ eventId }: EventFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>(initialState);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const isEditMode = !!eventId;

    useEffect(() => {
        if (isEditMode) {
            const loadEventData = async () => {
                const result = await fetchEventById(eventId);
                if (result.status === 'success' && result.data) {
                    const event = result.data.event;
                    const cleanTime = event.time.split(' ')[0];

                    setFormData({
                        ...event,
                        time: cleanTime,
                        date: new Date(event.date).toISOString().split('T')[0],
                    });
                } else {
                    setMessage(`Error loading event: ${result.message}`);
                }
                setLoading(false);
            };
            loadEventData();
        } else {
            setLoading(false);
        }
    }, [eventId, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (publish: boolean) => {
        setSaving(true);
        setMessage('');

        const payload: ICreateEventPayload = {
            ...formData,
            isPublished: publish,
        };

        const result = isEditMode
            ? await updateEvent(eventId, payload)
            : await createEvent(payload);

        if (result.status === 'success') {
            setMessage(`Event berhasil ${isEditMode ? 'diperbarui' : 'dibuat'}.`);
            setTimeout(() => router.push('/admin/event-management/event'), 1500);
        } else {
            setMessage(`Error: ${result.message}`);
        }
        setSaving(false);
    };

    if (loading) return <div>Loading form...</div>;

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {message && <p className="text-center p-2 bg-gray-100 rounded-md">{message}</p>}
            <div>
                <label>Event Name</label>
                <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" />
                </div>
                <div>
                    <label>Time</label>
                    <input type="time" name="time" value={formData.time} onChange={handleChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" />
                </div>
            </div>
            <div>
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" rows={2}></textarea>
            </div>
            <div>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" rows={4}></textarea>
            </div>
            <div>
                <label>Event Description</label>
                <textarea name="eventDesc" value={formData.eventDesc} onChange={handleChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" rows={4}></textarea>
            </div>
            <div>
                <label>Ticket Description</label>
                <textarea name="ticketDesc" value={formData.ticketDesc} onChange={handleChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" rows={4}></textarea>
            </div>

            <div className="flex items-center gap-4">
                <input type="checkbox" name="isPublished" id="isPublished" checked={formData.isPublished} onChange={handleChange} className="h-4 w-4" />
                <label htmlFor="isPublished">Publish this event immediately</label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={() => handleSubmit(false)} disabled={saving} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400">
                    {saving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button type="button" onClick={() => handleSubmit(true)} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400">
                    {saving ? 'Publishing...' : 'Save and Publish'}
                </button>
            </div>
        </form>
    );
}
