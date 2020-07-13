import fs from 'fs';
import yargs from 'yargs';
import YAML from 'yaml';
import Generator from './generator.mjs';

const DEFAULT_FILENAME = './sample.yaml';
const DEFAULT_OUTPUT = './price-list.txt';

const argv = yargs
    .option('watch', {
        description: 'Watch for changes to the yaml file',
        boolean: true,
        default: false,
        demand: false,
    })
    .option('filename', {
        alias: 'f',
        description:
            'Path and filename of the yaml file containing the crafts list.',
        default: DEFAULT_FILENAME,
        demand: false,
    })
    .option('output', {
        alias: 'o',
        description: 'Path and filename of where to output the result',
        default: DEFAULT_OUTPUT,
        demand: false,
    }).argv;

createPriceList(argv.filename, argv.output);

if (argv.watch) {
    startWatching(argv.filename, argv.output);
}

function startWatching(filename, output) {
    fs.watch(filename, (_, file) => {
        if (file) {
            console.log(`${file} Changed`);
            createPriceList(file, output);
        }
    });
    console.log('Watching...');
}

function createPriceList(filename, output) {
    process.stdout.write('Generating price list...');

    const sourceFile = fs.readFileSync(filename, 'utf8');

    const data = YAML.parse(sourceFile);

    const generator = new Generator();
    const priceList = generator.generate(data);

    fs.writeFileSync(output, priceList);

    process.stdout.write('Done!\n');
}
