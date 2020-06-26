export default class Game {
    constructor() {
        this.start = false,
        this.spining = [],
        this.spin = {}
    }

    startGame(slots) {
        if(this.start) return;

        this.start = true;
        
        for(let i = 0; i < slots.length; i++) {
            let random = Math.floor(Math.random() * 3);
            let result = slots[i].position + 10 + i * 5 + random;
            let spinTime = 2500 + i * 600 + random * 600;
            this.startSpin = {
                object: slots[i],
                property: 'position',
                target: result,
                time: spinTime,
                easing: this.backout(0.5),
                onchange: null,
                oncomplete: i === slots.length - 1 ? this.stopSpin : null
            };
        }
    }

    listenForAnimate(slots, slotsImages) {
        for(let i = 0; i < slots.length; i++) {
            slots[i].blur.blurY = (slots[i].position - slots[i].previousPosition) * 8;
            slots[i].previousPosition = slots[i].position;

            // Update symbols
            for(let j = 0; j < slots[i].symbols.length; j++) {
                let symb = slots[i].symbols[j];
                let prev = symb.y;
                symb.y = ((slots[i].position + j) % slots[i].symbols.length) * 83 - 83;

                if(symb.y < 0 && prev > 83) {
                    symb.texture = slotsImages[Math.floor(Math.random() * slotsImages.length)];
                    symb.scale.x = symb.scale.y = Math.min(83 / symb.texture.width, 83 / symb.texture.height);
                    symb.x = Math.round((83 - symb.width) / 2);
                }
            }
        }
    }

    stopSpin() {
        this.start = false
    }

    /**
     * @param {{ object: any; property: any; target: any; easing: any; time: any; }} options
     */

    set startSpin(options) {
        this.spin = {
            object: options.object,
            property: options.property,
            propertyBeginValue: options.object[options.property],
            target: options.target,
            easing: options.easing,
            time: options.time,
            change: onchange,
            complete: options.oncomplete,
            start: Date.now(),
        };

        this.spining.push(this.spin);
        return this.spin;
    }

    get startSpin() {
        return this.spin
    }
 
    backout(amount) {
        return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
    }

    animationListener() {
        let now = Date.now();
        let remove = [];
        for (let i = 0; i < this.spining.length; i++) {
            let t = this.spining[i];
            let phase = Math.min(1, (now - t.start) / t.time);
    
            t.object[t.property] = t.propertyBeginValue * (1 - t.easing(phase)) + t.target * t.easing(phase);

            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            this.spining.splice(this.spining.indexOf(remove[i]), 1);
        }
    }
}