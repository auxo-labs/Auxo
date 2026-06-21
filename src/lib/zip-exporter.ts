import JSZip from 'jszip';
import { CompiledPack } from './prompt-compiler';

/**
 * Packs the compiled files matrix into a ZIP archive and triggers a browser download.
 *
 * @param roomId - The room identifier, used to name the downloaded zip.
 * @param targetFiles - The CompiledPack containing agents, Claude config, phases, readme, and Cursor rule mdc files.
 * @returns A promise resolving when the export is complete.
 */
export async function exportCompiledPackToZip(
  roomId: string,
  targetFiles: CompiledPack
): Promise<void> {
  const zip = new JSZip();
  zip.file('AGENTS.md', targetFiles.agentsMd);
  zip.file('.windsurfrules', targetFiles.agentsMd);
  zip.file('CLAUDE.md', targetFiles.claudeMd);
  zip.file('phases.md', targetFiles.phasesMd);
  zip.file('README.md', targetFiles.readmeMd);

  const cursorFolder = zip.folder('.cursor');
  if (cursorFolder) {
    const rulesFolder = cursorFolder.folder('rules');
    if (rulesFolder) {
      Object.entries(targetFiles.cursorRules).forEach(([name, content]) => {
        rulesFolder.file(name, content);
      });
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `auxo-blueprint-${roomId.slice(0, 8)}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
