import { program } from 'commander';

import { start } from './start';

program
  .version('0.0.1')
  .description('DriveGram CLI');

program.command('start').action(() => {
  start();
});

program.parse(process.argv);
