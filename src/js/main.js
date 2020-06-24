import * as PIXI from 'pixi.js';
import '../styles/main.scss';
import { Graphics } from 'pixi.js/lib/core';

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Textures = PIXI.utils.TextureCache

let app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    resolution: 1
});

app.renderer.backgroundColor = 0x061639;

document.body.appendChild(app.view);

loader
    .add('src/images/engrySlots.json')
    .add('src/images/eggBird.png')
    .add('src/images/bombBird.png')
    .add('src/images/kingPig.png')
    .add('src/images/yelowBird.png')
    .add('src/images/igorBird.png')
    .load(setup);

// center of display
let centerX = window.innerWidth / 2,
    centerY = window.innerHeight / 2;

const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
});

function setup() {

    // Background
    let bacground = Textures['fon.png'];
    let bg = new PIXI.Sprite(bacground);
    bg.position.set(0, 0);

    // Transparent box for slots
    let transparentBox = new Graphics();
    transparentBox.lineStyle(5, 0xffffff, 0.6);
    transparentBox.beginFill(0xffffff, 0.5);
    transparentBox.drawRoundedRect(-9, 0, 650, 270, 8);
    transparentBox.endFill();

    // Slots images
    let slotsImages = [
        PIXI.Texture.from('src/images/eggBird.png'),
        PIXI.Texture.from('src/images/bombBird.png'),
        PIXI.Texture.from('src/images/kingPig.png'),
        PIXI.Texture.from('src/images/yelowBird.png'),
        PIXI.Texture.from('src/images/igorBird.png')
    ]

    // Slots container
    let slots = [];
    let slotsBox = new PIXI.Container();
    slotsBox.position.set(50, 65);
    slotsBox.addChild(transparentBox);

    for(let i = 0; i < 5; i++) {
        let sc = new PIXI.Container();
        sc.position.set(10, 9)
        sc.x = i * 135;
        slotsBox.addChild(sc);

        const slot = {
            container: sc,
            symbols: [],
            position: 0,
            previouPosition: 0,
            blur: new PIXI.filters.BlurFilter()
        };

        slot.blur.blurX = 0;
        slot.blur.blurY = 0;
        sc.filters = [slot.blur];

        // Random symbol in each slot
        for(let j = 0; j < 3; j++) {
            let symbol = new PIXI.Sprite(slotsImages[Math.floor(Math.random() * slotsImages.length)]);
            symbol.y = j * 83;
            symbol.scale.x = symbol.scale.y = Math.min(83 / symbol.width, 83 / symbol.height);
            symbol.x  = Math.round((83 - symbol.width) / 2);
            slot.symbols.push(symbol);
            sc.addChild(symbol);
        };
        slots.push(slot);
    }

    // Top text box
    let header = new Graphics();
    header.beginFill(0x1099bb);
    header.drawRect(0, -59, 740, 60)
    header.endFill();

    let headerText = new PIXI.Text('ENGRY SLOTS!', style);
    headerText.position.set((header.width - headerText.width) / 2, (header.height - headerText.height) / 2);

    // Bottom text box with button
    let footer = new Graphics();
    footer.beginFill(0x1099bb);
    footer.drawRect(0, bg.height, 740, 60);
    footer.endFill();

    let footerText = new PIXI.Text('SPIN IT!', style);
    footerText.position.set((footer.width - footerText.width) / 2, (footer.height - footerText.height) / 2);
    footerText.y = bg.height + (footer.height - footerText.height) / 2;

    // Create a button
    footer.interactive = true;
    footer.buttonMode = true;

    // Strt game
    footer.addListener('pointerdown', () => {
        startGame()
    });


    // Game container
    let game = new PIXI.Container();
    game.addChild(bg);
    game.addChild(slotsBox);
    game.addChild(headerText);
    game.addChild(footer);
    game.addChild(footerText);
    game.position.set(centerX - game.width / 2, centerY - game.height / 2);
    // game.position.set(centerY - game.height / 2);

    app.stage.addChild(game);
}









// const app = new PIXI.Application({ backgroundColor: 0x1099bb });
// document.body.appendChild(app.view);

// app.loader
//     .add('src/images/eggBird.png', 'src/images/eggBird.png')
//     .add('src/images/bombBird.png', 'src/images/bombBird.png')
//     .add('src/images/kingPig.png', 'src/images/kingPig.png')
//     .add('src/images/yelowBird.png', 'src/images/yelowBird.png')
//     .load(onAssetsLoaded);

// const REEL_WIDTH = 160;
// const SYMBOL_SIZE = 150;

// // onAssetsLoaded handler builds the example.
// function onAssetsLoaded() {
//     // Create different slot symbols.
//     const slotTextures = [
//         PIXI.Texture.from('src/images/eggBird.png'),
//         PIXI.Texture.from('src/images/bombBird.png'),
//         PIXI.Texture.from('src/images/kingPig.png'),
//         PIXI.Texture.from('src/images/yelowBird.png'),
//     ];

//     // Build the reels
//     const reels = [];
//     const reelContainer = new PIXI.Container();
//     for (let i = 0; i < 5; i++) {
//         const rc = new PIXI.Container();
//         rc.x = i * REEL_WIDTH;
//         reelContainer.addChild(rc);

//         const reel = {
//             container: rc,
//             symbols: [],
//             position: 0,
//             previousPosition: 0,
//             blur: new PIXI.filters.BlurFilter(),
//         };
//         reel.blur.blurX = 0;
//         reel.blur.blurY = 0;
//         rc.filters = [reel.blur];

//         // Build the symbols
//         for (let j = 0; j < 4; j++) {
//             const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
//             // Scale the symbol to fit symbol area.
//             symbol.y = j * SYMBOL_SIZE;
//             symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
//             symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
//             reel.symbols.push(symbol);
//             rc.addChild(symbol);
//         }
//         reels.push(reel);
//     }
//     app.stage.addChild(reelContainer);

//     // Build top & bottom covers and position reelContainer
//     const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
//     reelContainer.y = margin;
//     reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
//     const top = new PIXI.Graphics();
//     top.beginFill(0, 1);
//     top.drawRect(0, 0, app.screen.width, margin);

//     const bottom = new PIXI.Graphics();
//     bottom.beginFill(0, 1);
//     bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

//     // Add play text
//     const style = new PIXI.TextStyle({
//         fontFamily: 'Arial',
//         fontSize: 36,
//         fontStyle: 'italic',
//         fontWeight: 'bold',
//         fill: ['#ffffff', '#00ff99'], // gradient
//         stroke: '#4a1850',
//         strokeThickness: 5,
//         dropShadow: true,
//         dropShadowColor: '#000000',
//         dropShadowBlur: 4,
//         dropShadowAngle: Math.PI / 6,
//         dropShadowDistance: 6,
//         wordWrap: true,
//         wordWrapWidth: 440,
//     });

//     const playText = new PIXI.Text('Spin the wheels!', style);
//     playText.x = Math.round((bottom.width - playText.width) / 2);
//     playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
//     bottom.addChild(playText);

//     // Add header text
//     const headerText = new PIXI.Text('PIXI MONSTER SLOTS!', style);
//     headerText.x = Math.round((top.width - headerText.width) / 2);
//     headerText.y = Math.round((margin - headerText.height) / 2);
//     top.addChild(headerText);

//     app.stage.addChild(top);
//     app.stage.addChild(bottom);

//     // Set the interactivity.
//     bottom.interactive = true;
//     bottom.buttonMode = true;
//     bottom.addListener('pointerdown', () => {
//         startPlay();
//     });

//     let running = false;

//     // Function to start playing.
//     function startPlay() {
//         if (running) return;
//         running = true;

//         for (let i = 0; i < reels.length; i++) {
//             const r = reels[i];
//             const extra = Math.floor(Math.random() * 3);
//             const target = r.position + 10 + i * 5 + extra;
//             const time = 2500 + i * 600 + extra * 600;
//             tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
//         }
//     }

//     // Reels done handler.
//     function reelsComplete() {
//         running = false;
//     }

//     // Listen for animate update.
//     app.ticker.add((delta) => {
//     // Update the slots.
//         for (let i = 0; i < reels.length; i++) {
//             const r = reels[i];
//             // Update blur filter y amount based on speed.
//             // This would be better if calculated with time in mind also. Now blur depends on frame rate.
//             r.blur.blurY = (r.position - r.previousPosition) * 8;
//             r.previousPosition = r.position;

//             // Update symbol positions on reel.
//             for (let j = 0; j < r.symbols.length; j++) {
//                 const s = r.symbols[j];
//                 const prevy = s.y;
//                 s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
//                 if (s.y < 0 && prevy > SYMBOL_SIZE) {
//                     // Detect going over and swap a texture.
//                     // This should in proper product be determined from some logical reel.
//                     s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
//                     s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
//                     s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
//                 }
//             }
//         }
//     });
// }

// // Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
// const tweening = [];
// function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
//     const tween = {
//         object,
//         property,
//         propertyBeginValue: object[property],
//         target,
//         easing,
//         time,
//         change: onchange,
//         complete: oncomplete,
//         start: Date.now(),
//     };

//     tweening.push(tween);
//     return tween;
// }
// // Listen for animate update.
// app.ticker.add((delta) => {
//     const now = Date.now();
//     const remove = [];
//     for (let i = 0; i < tweening.length; i++) {
//         const t = tweening[i];
//         const phase = Math.min(1, (now - t.start) / t.time);

//         t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
//         if (t.change) t.change(t);
//         if (phase === 1) {
//             t.object[t.property] = t.target;
//             if (t.complete) t.complete(t);
//             remove.push(t);
//         }
//     }
//     for (let i = 0; i < remove.length; i++) {
//         tweening.splice(tweening.indexOf(remove[i]), 1);
//     }
// });

// // Basic lerp funtion.
// function lerp(a1, a2, t) {
//     return a1 * (1 - t) + a2 * t;
// }

// // Backout function from tweenjs.
// // https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
// function backout(amount) {
//     return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
// }
