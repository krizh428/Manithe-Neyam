const fs = require('fs');
const path = require('path');

const walk = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
};

const srcDir = path.join(__dirname, 'src');
const files = walk(srcDir);

const replacements = [
    // Backgrounds
    { regex: /bg-\[#[0-9A-Fa-f]{6}\]/g, replace: 'bg-theme-bg' },
    { regex: /bg-white/g, replace: 'bg-theme-card' },
    { regex: /bg-slate-[0-9]{3}/g, replace: 'bg-theme-bg' },
    { regex: /bg-gray-[0-9]{3}/g, replace: 'bg-theme-bg' },
    { regex: /bg-cyan-[0-9]{3}/g, replace: 'bg-brand-primary' },
    { regex: /bg-blue-[0-9]{3}/g, replace: 'bg-brand-primary' },
    
    // Gradients
    { regex: /from-\[#[0-9A-Fa-f]{6}\]/g, replace: 'from-theme-bg' },
    { regex: /to-\[#[0-9A-Fa-f]{6}\]/g, replace: 'to-theme-secondary' },

    // Text Colors
    { regex: /text-\[#[0-9A-Fa-f]{6}\]/g, replace: 'text-theme-text' },
    { regex: /text-white/g, replace: 'text-theme-text' },
    { regex: /text-gray-[0-9]{3}/g, replace: 'text-theme-text-secondary' },
    { regex: /text-slate-[0-9]{3}/g, replace: 'text-theme-text-muted' },
    { regex: /text-cyan-[0-9]{3}/g, replace: 'text-brand-primary' },
    { regex: /text-blue-[0-9]{3}/g, replace: 'text-brand-primary' },

    // Border Colors
    { regex: /border-\[#[0-9A-Fa-f]{6}\]/g, replace: 'border-theme-border' },
    { regex: /border-white/g, replace: 'border-theme-border' },
    { regex: /border-slate-[0-9]{3}/g, replace: 'border-theme-border' },
    { regex: /border-gray-[0-9]{3}/g, replace: 'border-theme-border' },

    // Shadows
    { regex: /shadow-sm|shadow-md|shadow-lg|shadow-xl|shadow-2xl/g, replace: 'shadow-card hover:shadow-hover' },
    { regex: /shadow-\[#[0-9A-Fa-f]{6}\]/g, replace: 'shadow-glow' },

    // Hovers
    { regex: /hover:bg-\[#[0-9A-Fa-f]{6}\]/g, replace: 'hover:bg-brand-hover' },
    { regex: /hover:text-\[#[0-9A-Fa-f]{6}\]/g, replace: 'hover:text-brand-hover' },
    { regex: /hover:bg-cyan-[0-9]{3}/g, replace: 'hover:bg-brand-hover' },
    { regex: /hover:bg-blue-[0-9]{3}/g, replace: 'hover:bg-brand-hover' },
];

let filesModified = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    replacements.forEach(r => {
        content = content.replace(r.regex, r.replace);
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        filesModified++;
        console.log(`Modified ${file}`);
    }
});

console.log(`Total files modified: ${filesModified}`);
