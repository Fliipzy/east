const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const jsonfile = require('jsonfile');
const mergePackages = require('merge-packages');

const splash = `
███████╗ █████╗ ███████╗████████╗
██╔════╝██╔══██╗██╔════╝╚══██╔══╝
█████╗  ███████║███████╗   ██║   
██╔══╝  ██╔══██║╚════██║   ██║   
███████╗██║  ██║███████║   ██║   
╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   
                by KnowIt CPHX 💡
`;

console.log(splash);

inquirer
    .prompt([
        {
            type: 'list',
            name: 'language',
            message: 'What language would you like to use? 📜',
            choices: [
                { name: 'JavaScript', value: 'js' },
                { name: 'TypeScript', value: 'ts' }
            ],
        },
        {
            type: 'list',
            name: 'style',
            message: 'What styling do you want to use? 🎨🖌️',
            choices: ['CSS', 'SCSS', 'Tailwind'],
        },
        {
            type: 'input',
            name: 'name',
            message: 'Give your frontend project a name:',
            default: 'interface-project'
        },
        {
            type: 'input',
            name: 'path',
            message: 'Where do you want your frontend project?',
            default: './'
        }
    ])
    .then((answers) => {
        const language = answers.language.toLowerCase();
        const style = answers.style.toLowerCase();
        const name = answers.name;
        const dest = answers.path;

        copyTemplate({
            lang: language,
            style: style,
            name: name,
            destination: dest
        });
    })
    .catch((err) => console.error(err));

const templatePath = './templates';
const templateBasePath = path.join(templatePath, 'base');
const excludedFilenames = ['package.json']

function copyTemplate(options) {
    const destination = path.join(options.destination, options.name);
    const languagePath = path.join(templatePath, 'languages', options.lang);
    const stylePath = path.join(templatePath, 'styles', options.style);

    let mergedPackage = jsonfile.readFileSync(path.join(templateBasePath, 'package.json'));
    mergedPackage.name = options.name;

    // First, copy base template folder to destination
    fs.copySync(templateBasePath, destination, {
        filter: (src) => {
            const filename = path.basename(src);
            return !excludedFilenames.includes(filename);
        }
    });

    // Append language package.json, if it exists
    if (fs.existsSync(path.join(languagePath, 'package.json'))) {
        const languagePackage = jsonfile.readFileSync(path.join(languagePath, 'package.json'));
        mergedPackage = mergePackages.mergeJson(mergedPackage, languagePackage);
    }

    // Do the same for style package.json
    if (fs.existsSync(path.join(stylePath, 'package.json'))) {
        const stylePackage = jsonfile.readFileSync(path.join(stylePath, 'package.json'));
        mergedPackage = mergePackages.mergeJson(mergedPackage, stylePackage);
    }

    // Copy all language files over to project destination
    fs.copySync(languagePath, destination, {
        filter: (src) => {
            const filename = path.basename(src);
            return !excludedFilenames.includes(filename);
        },
        recursive: true,
        overwrite: false
    });

    // Copy all style files over to project destination
    fs.copySync(stylePath, destination, {
        filter: (src) => {
            const filename = path.basename(src);
            return !excludedFilenames.includes(filename);
        },
        recursive: true,
        overwrite: false
    });

    // Write the merged package.json to the new project folder
    jsonfile.writeFileSync(path.join(destination, 'package.json'), mergedPackage, { spaces: 2 });
}