import JSZip from 'jszip';

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
}

export const downloadProjectZip = async (
  projectName: string,
  files: ProjectFile[],
  extraFolder?: string
): Promise<void> => {
  const zip = new JSZip();
  const folder = extraFolder ? zip.folder(extraFolder) || zip : zip;

  files.forEach((file) => {
    const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    folder.file(cleanPath, file.content);
  });

  // Add README.md if not present
  if (!files.some((f) => f.name.toLowerCase() === 'readme.md')) {
    folder.file(
      'README.md',
      `# ${projectName}\n\nGenerated with Reach AI (Reach.ai) - Autonomous Growth & Development Platform.\n\n## Getting Started\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nBuilt with modern TypeScript and responsive UI/UX.\n`
    );
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-source-code.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
