const fs = require('fs');
let src = fs.readFileSync('uebung6/src/Uebung6Aufgabe1.elm', 'utf8');
let cars = fs.readFileSync('uebung6/src/Cars.elm', 'utf8');
src = src.replace('import Cars exposing (Car, CarType(..), cars, carTypeToString)', '');
cars = cars.split('\n').filter(l => !l.startsWith('module Cars')).join('\n');
fs.writeFileSync('uebung6/ellie/uebung6aufgabe1.ellie.elm', src + '\n' + cars);