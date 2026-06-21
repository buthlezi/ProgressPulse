import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { listEntries } from './entries';

export async function exportEntriesToCsv() {
  const entries = await listEntries();

  const header = 'Id,Date,Entry';
  const csvRows = entries.map((entry) => {
    const escapedText = entry.text.replace(/"/g, '""'); // Escape double quotes
    return `"${entry.id}","${entry.createdAt}","${escapedText}"`;
  });

  const csvContent = [header, ...csvRows].join('\n');
  const fileUri = new File(Paths.document, `progresspulse-export-${Date.now()}.csv`);
  fileUri.write(csvContent);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri.uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export ProgressPulse Entries',
      UTI: 'public.comma-separated-values-text',
    });
  }
}
