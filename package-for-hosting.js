/**
 * Script to package the application for Hostinger deployment
 * Creates a zip file excluding node_modules, .git, .next, and other unnecessary files
 * 
 * Usage: node package-for-hosting.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = 'thesupport-agency';
const outputFile = `${projectName}-for-hostinger.zip`;

// Files and directories to exclude from the zip
const excludePatterns = [
  'node_modules',
  '.git',
  '.next',
  '.vercel',
  'out',
  'build',
  'coverage',
  '.DS_Store',
  '*.log',
  '.env.local',
  '.env.development',
  '.env.test',
  'public/uploads/*', // Exclude uploaded files, but keep .gitkeep
  '.pnp',
  '.pnp.js',
  '*.tsbuildinfo',
  'next-env.d.ts',
];

// Check if zip command is available (Windows PowerShell or Unix)
function createZip() {
  console.log('📦 Creating zip file for Hostinger deployment...\n');

  // Create exclusion list
  const excludeArgs = excludePatterns.flatMap(pattern => [
    '-x',
    `"${pattern}/*"`,
    `"${pattern}"`,
  ]);

  try {
    // Use PowerShell on Windows, zip on Unix
    if (process.platform === 'win32') {
      // Windows PowerShell Compress-Archive
      console.log('Using PowerShell Compress-Archive (Windows)...\n');
      
      // Get all files to include (exclude patterns)
      const filesToZip = getAllFiles('.')
        .filter(file => {
          const relativePath = path.relative('.', file);
          // Always include database schema files
          if (relativePath.includes('db-schema.sql') || relativePath.includes('db-schema.sql')) {
            return true;
          }
          return !shouldExclude(relativePath);
        });
      
      console.log(`📋 Found ${filesToZip.length} files to include`);
      console.log(`   Including database schema: lib/db-schema.sql`);

      // Use PowerShell to compress with full paths
      const outputPath = path.resolve(process.cwd(), outputFile);
      const filePaths = filesToZip.map(file => path.resolve(file)).join("','");
      
      const psCommand = `$files = @('${filePaths}'); Compress-Archive -Path $files -DestinationPath '${outputPath}' -Force`;
      
      try {
        execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
        console.log(`\n✅ Successfully created: ${outputFile}`);
      } catch (error) {
        throw error;
      }
    } else {
      // Unix/Linux zip command
      console.log('Using zip command (Unix/Linux)...\n');
      
      const zipCommand = `zip -r ${outputFile} . ${excludePatterns.map(p => `-x "${p}/*" "${p}"`).join(' ')}`;
      execSync(zipCommand, { stdio: 'inherit' });
      console.log(`\n✅ Successfully created: ${outputFile}`);
    }

    // Get file size
    const stats = fs.statSync(outputFile);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n📊 File size: ${fileSizeMB} MB`);
    console.log(`\n📤 Ready to upload to Hostinger!\n`);
    console.log(`   Upload this file: ${outputFile}`);
    console.log(`   Then run: npm install && npm run build && npm start\n`);

  } catch (error) {
    console.error('❌ Error creating zip file:', error.message);
    console.log('\n💡 Alternative: Manually create zip excluding:');
    excludePatterns.forEach(pattern => console.log(`   - ${pattern}`));
    process.exit(1);
  }
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function shouldExclude(filePath) {
  return excludePatterns.some(pattern => {
    const regex = new RegExp(
      pattern.replace(/\*/g, '.*').replace(/\//g, '[\\\\/]')
    );
    return regex.test(filePath);
  });
}

// Run the script
createZip();

