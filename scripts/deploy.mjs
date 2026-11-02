// Builds the site and publishes dist/ to the gh-pages branch, which GitHub Pages serves.
import {execSync} from 'node:child_process';
import {rmSync,writeFileSync} from 'node:fs';

const run=(command,cwd='.')=>execSync(command,{cwd,stdio:'inherit'});
const remote=execSync('git remote get-url origin').toString().trim();

run('npm run build');
writeFileSync('dist/.nojekyll','');
rmSync('dist/.git',{recursive:true,force:true});
run('git init -q -b gh-pages','dist');
run('git add -A','dist');
run('git commit -q -m "Deploy site" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"','dist');
run(`git push -f ${remote} gh-pages`,'dist');
rmSync('dist/.git',{recursive:true,force:true});
console.log('Published. GitHub Pages usually updates within a minute or two.');
