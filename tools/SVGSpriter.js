'use strict';
const fs = require('fs')
const path = require('path')
const SVGSpriter = require('svg-sprite')

// 1. Create and configure a spriter instance
// ====================================================================
const spriter = new SVGSpriter({
    dest: 'out', // Main output directory
    mode: {
        css: { // Create a CSS sprite
            render: {
                css: true // Render a CSS stylesheet
            }
        }
    }
});

// 2. Add some SVG files to process
// ====================================================================
spriter.add(path.resolve('svg/background1.svg'), 'background1.svg', fs.readFileSync('svg/background1.svg', 'utf-8'));
spriter.add(path.resolve('svg/background2.svg'), 'background2.svg', fs.readFileSync('svg/background2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/background3.svg'), 'background3.svg', fs.readFileSync('svg/background3.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/background4.svg'), 'background4.svg', fs.readFileSync('svg/background4.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/box1.svg'), 'box1.svg', fs.readFileSync('svg/box1.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/box2.svg'), 'box2.svg', fs.readFileSync('svg/box2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/box3.svg'), 'box3.svg', fs.readFileSync('svg/box3.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/box4.svg'), 'box4.svg', fs.readFileSync('svg/box4.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/icon1.svg'), 'icon1.svg', fs.readFileSync('svg/icon1.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/icon2.svg'), 'icon2.svg', fs.readFileSync('svg/icon2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/icon3.svg'), 'icon3.svg', fs.readFileSync('svg/icon3.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/icon4.svg'), 'icon4.svg', fs.readFileSync('svg/icon4.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/icon5.svg'), 'icon5.svg', fs.readFileSync('svg/icon5.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/icon6.svg'), 'icon6.svg', fs.readFileSync('svg/icon6.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/icon7.svg'), 'icon7.svg', fs.readFileSync('svg/icon7.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/icon8.svg'), 'icon8.svg', fs.readFileSync('svg/icon8.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/logo.svg'), 'logo.svg', fs.readFileSync('svg/logo.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/mark1.svg'), 'mark1.svg', fs.readFileSync('svg/mark1.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/mark2.svg'), 'mark2.svg', fs.readFileSync('svg/mark2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/picture1.svg'), 'picture1.svg', fs.readFileSync('svg/picture1.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/picture2.svg'), 'picture2.svg', fs.readFileSync('svg/picture2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/pig1.svg'), 'pig1.svg', fs.readFileSync('svg/pig1.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/pig2.svg'), 'pig2.svg', fs.readFileSync('svg/pig2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/pig3.svg'), 'pig3.svg', fs.readFileSync('svg/pig3.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/rectangle1.svg'), 'rectangle1.svg', fs.readFileSync('svg/rectangle1.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/rectangle2.svg'), 'rectangle2.svg', fs.readFileSync('svg/rectangle2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/selection1.svg'), 'selection1.svg', fs.readFileSync('svg/selection1.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/selection2.svg'), 'selection2.svg', fs.readFileSync('svg/selection2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/selection3.svg'), 'selection3.svg', fs.readFileSync('svg/selection3.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/sentence1.svg'), 'sentence1.svg', fs.readFileSync('svg/sentence1.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/sentence2.svg'), 'sentence2.svg', fs.readFileSync('svg/sentence2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/special_icon1.svg'), 'special_icon1.svg', fs.readFileSync('svg/special_icon1.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/special_icon2.svg'), 'special_icon2.svg', fs.readFileSync('svg/special_icon2.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/star_bg.svg'), 'star_bg.svg', fs.readFileSync('svg/star_bg.svg', {encoding: 'utf-8'}));
spriter.add(path.resolve('svg/star.svg'), 'star.svg', fs.readFileSync('svg/star.svg', {encoding: 'utf-8'}));

/* ... */


// 3. Trigger the (asynchronous) compilation process
// ====================================================================
spriter.compile((error, result, data) => {
    // Run through all files that have been created for the `css` mode
    for (const type in result.css) {
        // Recursively create directories as needed
        fs.mkdirSync(path.dirname(result.css[type].path), { recursive: true });
        // Write the generated resource to disk
        fs.writeFileSync(result.css[type].path, result.css[type].contents);
    }
});