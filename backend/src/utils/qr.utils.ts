import QRCode from 'qrcode';
import crypto from 'crypto';

export function generateSecureVerificationToken(ticketNumber: string): string {
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return `ETH-VERIFY-${ticketNumber}-${randomBytes}`;
}

export async function generateQrCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#087443', // Brand deep emerald
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    return '';
  }
}
