import { v4 as uuidv4 } from 'uuid';
import type { Contact } from '../types.js';
import { getContactsDb } from './index.js';

/**
 * Creates a new contact with generated UUID and timestamps.
 */
export async function create(
  data: Omit<Contact, 'id' | 'created_at' | 'updated_at'>,
): Promise<Contact> {
  const db = getContactsDb();
  const now = new Date().toISOString();

  const contact: Contact = {
    ...data,
    id: uuidv4(),
    created_at: now,
    updated_at: now,
  };

  db.data.contacts.push(contact);
  await db.write();

  return contact;
}

/**
 * Finds a contact by ID. Returns null if not found.
 */
export async function getById(id: string): Promise<Contact | null> {
  const db = getContactsDb();
  await db.read();
  return db.data.contacts.find((c) => c.id === id) ?? null;
}

/**
 * Returns all contacts.
 */
export async function getAll(): Promise<Contact[]> {
  const db = getContactsDb();
  await db.read();
  return db.data.contacts;
}

/**
 * Finds a contact by phone number. Returns null if not found.
 */
export async function getByPhone(phone: string): Promise<Contact | null> {
  const db = getContactsDb();
  await db.read();
  const normalized = phone.startsWith('+') ? phone : `+${phone}`;
  return db.data.contacts.find((c) => c.phone === normalized) ?? null;
}

/**
 * Finds a contact by Telegram chat ID. Returns null if not found.
 */
export async function getByTelegramChatId(chatId: string): Promise<Contact | null> {
  const db = getContactsDb();
  await db.read();
  return db.data.contacts.find((c) => c.telegram_chat_id === chatId) ?? null;
}

/**
 * Finds or creates a contact by phone number.
 * Used for auto-creating contacts from incoming messages.
 */
export async function findOrCreateByPhone(
  phone: string,
  channel: 'whatsapp' | 'telegram' | 'phone',
  telegramChatId?: string,
): Promise<Contact> {
  const normalized = phone.startsWith('+') ? phone : `+${phone}`;
  const existing = await getByPhone(normalized);
  if (existing) {
    // Update telegram_chat_id if we have one and the contact doesn't
    if (telegramChatId && !existing.telegram_chat_id) {
      return update(existing.id, { telegram_chat_id: telegramChatId });
    }
    return existing;
  }
  return create({
    name: normalized,
    phone: normalized,
    telegram_chat_id: telegramChatId ?? null,
    channel,
    notes: null,
  });
}

/**
 * Finds or creates a contact by Telegram chat ID.
 * Used when we only have a chat ID (no phone number).
 */
export async function findOrCreateByTelegramChatId(
  chatId: string,
  phone?: string,
): Promise<Contact> {
  const existing = await getByTelegramChatId(chatId);
  if (existing) {
    // Update phone if we have one and the contact doesn't
    if (phone && !existing.phone) {
      const normalized = phone.startsWith('+') ? phone : `+${phone}`;
      return update(existing.id, { phone: normalized });
    }
    return existing;
  }
  // Also check by phone if provided
  if (phone) {
    const normalized = phone.startsWith('+') ? phone : `+${phone}`;
    const byPhone = await getByPhone(normalized);
    if (byPhone) {
      return update(byPhone.id, { telegram_chat_id: chatId });
    }
  }
  const normalizedPhone = phone ? (phone.startsWith('+') ? phone : `+${phone}`) : null;
  return create({
    name: normalizedPhone ?? `telegram:${chatId}`,
    phone: normalizedPhone,
    telegram_chat_id: chatId,
    channel: 'telegram',
    notes: null,
  });
}

/**
 * Updates a contact by ID. Sets updated_at automatically.
 * Throws if the contact is not found.
 */
export async function update(
  id: string,
  data: Partial<Contact>,
): Promise<Contact> {
  const db = getContactsDb();
  await db.read();

  const index = db.data.contacts.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Contact not found: ${id}`);
  }

  const updated: Contact = {
    ...db.data.contacts[index],
    ...data,
    id, // Prevent ID override
    updated_at: new Date().toISOString(),
  };

  db.data.contacts[index] = updated;
  await db.write();

  return updated;
}

/**
 * Deletes a contact by ID. Returns true if deleted, false if not found.
 */
export async function remove(id: string): Promise<boolean> {
  const db = getContactsDb();
  await db.read();

  const index = db.data.contacts.findIndex((c) => c.id === id);
  if (index === -1) return false;

  db.data.contacts.splice(index, 1);
  await db.write();
  return true;
}
