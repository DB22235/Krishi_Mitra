export interface WhatsAppRecord {
    id: string;
    phone: string;
    message: string;
    sentAt: string;
    schemeId?: string;
    type: 'deadline-urgent' | 'deadline-reminder' | 'status' | 'saved' | 'tip';
}


export function extractPhone(userData: any): string {
    if (!userData) return '';
    return userData.phone || userData.mobile || '';
}


export function maskPhone(phone: string): string {
    if (!phone || phone.length < 4) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
        return cleanPhone.slice(0, 2) + '******' + cleanPhone.slice(-2);
    }
    return '******' + cleanPhone.slice(-2);
}


export function isValidPhone(phone: string): boolean {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
}


export function buildWhatsAppMessage(title: string, text: string, language: string, schemeId?: string): string {
    return `*${title}*\n\n${text}\n\nShared via Krishi Mitra`;
}


const STORAGE_KEY = 'whatsapp-records';


export function getWhatsAppRecords(): WhatsAppRecord[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);
    } catch (e) {
        // ignore
    }
    return [];
}


function saveWhatsAppRecord(record: WhatsAppRecord) {
    const records = getWhatsAppRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}


export function getSentIds(): string[] {
    return getWhatsAppRecords().map(r => r.id);
}


export function wasAlreadySent(id: string): boolean {
    return getSentIds().includes(id);
}


export function sendViaWhatsApp(
    phone: string,
    message: string,
    id: string,
    schemeId?: string,
    type: 'deadline-urgent' | 'deadline-reminder' | 'status' | 'saved' | 'tip' = 'deadline-reminder'
): boolean {
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const fullPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;

    saveWhatsAppRecord({
        id, phone: fullPhone, message, sentAt: new Date().toISOString(), schemeId, type
    });

    const url = `https://wa.me/${fullPhone}?text=${encodedMessage}`;
    window.open(url, '_blank');
    return true;
}


export function sendToSelfWhatsApp(
    message: string,
    id: string,
    schemeId?: string,
    type: 'deadline-urgent' | 'deadline-reminder' | 'status' | 'saved' | 'tip' = 'deadline-reminder'
): boolean {
    const encodedMessage = encodeURIComponent(message);

    saveWhatsAppRecord({
        id, phone: 'self', message, sentAt: new Date().toISOString(), schemeId, type
    });


    const url = `https://wa.me/?text=${encodedMessage}`;
    window.open(url, '_blank');
    return true;
}


export async function shareViaWhatsApp(message: string): Promise<boolean> {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Krishi Mitra Notification',
                text: message
            });
            return true;
        } catch (err) {
            console.error('Error sharing:', err);
        }
    }

    // Fallback if no Web Share API
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/?text=${encodedMessage}`;
    window.open(url, '_blank');
    return true;
}


export function clearWhatsAppHistory() {
    localStorage.removeItem(STORAGE_KEY);
}