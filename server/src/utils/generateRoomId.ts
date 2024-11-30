

export default function generateRoomId(): string {
    const allowedChars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
    return Array.from({ length: 6 }, () => allowedChars[Math.floor(Math.random() * allowedChars.length)]).join('');
}