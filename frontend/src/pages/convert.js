const fs = require('fs');
const path = require('path');

const files = ['dashboard.tsx', 'home.tsx', 'not-found.tsx', 'sign-in.tsx', 'verify-otp.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove TypeScript type annotations
  content = content
    // Remove type declarations like: type AgentState = "idle" | ...
    .replace(/^type\s+\w+\s*=\s*[^;]+;/gm, '')
    // Remove interface declarations
    .replace(/^interface\s+\w+\s*\{[^}]*\}[\s\n]*/gms, '')
    // Remove React.ChangeEvent type parameters
    .replace(/:\s*React\.ChangeEvent<HTMLInputElement>/g, '')
    // Remove other React types
    .replace(/:\s*React\.FormEvent/g, '')
    // Remove generic type parameters like useRef<HTMLDivElement>
    .replace(/<HTML\w+Element>/g, '')
    // Remove type assertions: as HTMLElement
    .replace(/\s+as\s+\w+/g, '')
    // Remove: unknown type casts
    .replace(/:\s*unknown/g, '')
    // Remove Error type cast
    .replace(/\(err:\s*Error\)/g, '(err)')
    // Remove error with unknown
    .replace(/err:\s*unknown/g, 'err')
    // Remove ?: optional markers but keep the colon patterns we want
    .replace(/\?:\s*/g, ': ')
    // Remove trailing semicolons from type imports
    .replace(/from\s+"[^"]+";/g, match => match.replace(';', ';'))
    // Clean up multiple blank lines
    .replace(/\n\n\n+/g, '\n\n');
  
  const newFile = file.replace('.tsx', '.jsx');
  fs.writeFileSync(newFile, content, 'utf8');
  console.log(`✓ Created ${newFile}`);
});

console.log('Conversion complete!');
