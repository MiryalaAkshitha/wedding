// Builds the site and publishes it to https://theakstudio.in/wedding/ through the AK-studio repo,
// whose own workflow deploys theakstudio.in whenever master is pushed.
import {execSync} from 'node:child_process';
import {cpSync,existsSync,rmSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const studio=join(root,'..','AK','AK-studio');
const target=join(studio,'public','wedding');

const run=(command,cwd=root)=>execSync(command,{cwd,stdio:'inherit'});
const read=command=>execSync(command,{cwd:studio}).toString().trim();
const stop=message=>{console.error(`Not published: ${message}`);process.exit(1);};

if(!existsSync(join(studio,'.git')))stop(`AK-studio repo not found at ${studio}`);
if(read('git branch --show-current')!=='master')stop('switch AK-studio to the master branch first.');
if(read('git status --porcelain'))stop('AK-studio has uncommitted changes. Commit or discard them first.');

run('git pull --ff-only',studio);
run('npm run build');
rmSync(target,{recursive:true,force:true});
cpSync(join(root,'dist'),target,{recursive:true});
run('git add public/wedding',studio);

if(!read('git status --porcelain')){
  console.log('Nothing changed, so there is nothing to publish.');
  process.exit(0);
}
run('git commit -q -m "Update wedding invitation" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"',studio);
run('git push origin master',studio);
console.log('Published to https://theakstudio.in/wedding/ - it usually updates within a minute or two.');
