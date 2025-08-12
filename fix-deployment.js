#!/usr/bin/env node

// Deployment fix script - ensures static files are in correct location for production
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Running deployment fix...');

const distDir = path.resolve(__dirname, 'dist');
const publicDir = path.resolve(distDir, 'public');

// Check if public directory exists
if (fs.existsSync(publicDir)) {
  console.log('📁 Found dist/public directory');
  
  // Copy all files from dist/public to dist/
  const files = fs.readdirSync(publicDir);
  
  for (const file of files) {
    const srcPath = path.join(publicDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      // Copy directory recursively
      fs.cpSync(srcPath, destPath, { recursive: true, force: true });
      console.log(`📂 Copied directory: ${file}`);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 Copied file: ${file}`);
    }
  }
  
  console.log('✅ Deployment fix completed successfully!');
} else {
  console.log('❌ dist/public directory not found - build may have failed');
  process.exit(1);
}