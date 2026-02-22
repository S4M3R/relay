import { Command } from 'commander';
import { daemonRequest, handleDaemonError, handleHttpError } from './client.js';
import type { Contact } from '../types.js';

export function registerContactsCommand(program: Command): void {
  const contacts = program
    .command('contacts')
    .description('Manage contacts');

  // relay contacts list
  contacts
    .command('list')
    .description('List all contacts')
    .action(async () => {
      try {
        const res = await daemonRequest<Contact[]>('GET', '/contacts');

        if (res.status >= 400) {
          handleHttpError(res.status, res.data, 'Failed to list contacts');
        }

        const contactList = res.data;

        if (contactList.length === 0) {
          console.log('No contacts found.');
          return;
        }

        const nameWidth = 25;
        const phoneWidth = 18;
        const channelWidth = 12;
        const telegramWidth = 15;
        const idWidth = 36;

        const header = [
          'Name'.padEnd(nameWidth),
          'Phone'.padEnd(phoneWidth),
          'Channel'.padEnd(channelWidth),
          'Telegram ID'.padEnd(telegramWidth),
          'ID'.padEnd(idWidth),
        ].join('  ');

        const separator = '-'.repeat(header.length);

        console.log(header);
        console.log(separator);

        for (const contact of contactList) {
          const name = (contact.name || '—').length > nameWidth
            ? contact.name.substring(0, nameWidth - 3) + '...'
            : (contact.name || '—');

          const row = [
            name.padEnd(nameWidth),
            (contact.phone || '—').padEnd(phoneWidth),
            contact.channel.padEnd(channelWidth),
            (contact.telegram_chat_id || '—').padEnd(telegramWidth),
            contact.id.padEnd(idWidth),
          ].join('  ');

          console.log(row);
        }

        console.log(`\n${contactList.length} contact(s) total`);
      } catch (err) {
        handleDaemonError(err);
      }
    });

  // relay contacts get <id>
  contacts
    .command('get')
    .description('Get contact details')
    .argument('<id>', 'Contact ID')
    .action(async (id: string) => {
      try {
        const res = await daemonRequest<Contact>('GET', `/contacts/${id}`);

        if (res.status >= 400) {
          handleHttpError(res.status, res.data, 'Failed to get contact');
        }

        const contact = res.data;
        console.log(`Contact: ${contact.name}`);
        console.log(`  ID:              ${contact.id}`);
        console.log(`  Phone:           ${contact.phone || '—'}`);
        console.log(`  Telegram ID:     ${contact.telegram_chat_id || '—'}`);
        console.log(`  Channel:         ${contact.channel}`);
        console.log(`  Notes:           ${contact.notes || '—'}`);
        console.log(`  Created:         ${contact.created_at}`);
        console.log(`  Updated:         ${contact.updated_at}`);
      } catch (err) {
        handleDaemonError(err);
      }
    });

  // relay contacts add
  contacts
    .command('add')
    .description('Add a new contact')
    .requiredOption('--name <name>', 'Contact name')
    .option('--phone <phone>', 'Phone number (E.164 format)')
    .option('--telegram-chat-id <id>', 'Telegram chat ID')
    .option('--channel <type>', 'Channel: "whatsapp", "telegram", or "phone" (default: whatsapp)', 'whatsapp')
    .option('--notes <text>', 'Notes about the contact')
    .action(
      async (options: {
        name: string;
        phone?: string;
        telegramChatId?: string;
        channel: string;
        notes?: string;
      }) => {
        try {
          const body: Record<string, unknown> = {
            name: options.name,
            channel: options.channel,
          };
          if (options.phone) body.phone = options.phone;
          if (options.telegramChatId) body.telegram_chat_id = options.telegramChatId;
          if (options.notes) body.notes = options.notes;

          const res = await daemonRequest<Contact>('POST', '/contacts', body);

          if (res.status >= 400) {
            handleHttpError(res.status, res.data, 'Failed to add contact');
          }

          const contact = res.data;
          console.log(`Contact added`);
          console.log(`  ID:    ${contact.id}`);
          console.log(`  Name:  ${contact.name}`);
          console.log(`  Phone: ${contact.phone || '—'}`);
        } catch (err) {
          handleDaemonError(err);
        }
      },
    );

  // relay contacts update <id>
  contacts
    .command('update')
    .description('Update a contact')
    .argument('<id>', 'Contact ID')
    .option('--name <name>', 'New name')
    .option('--phone <phone>', 'New phone number')
    .option('--telegram-chat-id <id>', 'New Telegram chat ID')
    .option('--notes <text>', 'New notes')
    .action(
      async (
        id: string,
        options: {
          name?: string;
          phone?: string;
          telegramChatId?: string;
          notes?: string;
        },
      ) => {
        try {
          const body: Record<string, unknown> = {};
          if (options.name !== undefined) body.name = options.name;
          if (options.phone !== undefined) body.phone = options.phone;
          if (options.telegramChatId !== undefined) body.telegram_chat_id = options.telegramChatId;
          if (options.notes !== undefined) body.notes = options.notes;

          if (Object.keys(body).length === 0) {
            console.error('Error: Provide at least one field to update (--name, --phone, --telegram-chat-id, --notes)');
            process.exit(1);
          }

          const res = await daemonRequest<Contact>('PUT', `/contacts/${id}`, body);

          if (res.status >= 400) {
            handleHttpError(res.status, res.data, 'Failed to update contact');
          }

          const contact = res.data;
          console.log(`Contact updated`);
          console.log(`  ID:    ${contact.id}`);
          console.log(`  Name:  ${contact.name}`);
          console.log(`  Phone: ${contact.phone || '—'}`);
        } catch (err) {
          handleDaemonError(err);
        }
      },
    );

  // relay contacts delete <id>
  contacts
    .command('delete')
    .description('Delete a contact')
    .argument('<id>', 'Contact ID')
    .action(async (id: string) => {
      try {
        const res = await daemonRequest<{ deleted: boolean }>('DELETE', `/contacts/${id}`);

        if (res.status >= 400) {
          handleHttpError(res.status, res.data, 'Failed to delete contact');
        }

        console.log('Contact deleted.');
      } catch (err) {
        handleDaemonError(err);
      }
    });
}
