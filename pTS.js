
const _g = globalThis;
function random_character(divided = false) {
    const rander = Math.random() * (26) >> 0;

    const step = divided ? (Math.random() < 0.5 ? 65: 97) : 65
    return String.fromCharCode(step + rander)
}
function char_replacer_at(str, index, char) {
    if (str.length <= index) {
       str = str.padEnd(index, ' ');
    }

    str = str.substring(0, index) + char + str.substring(index + 1)

    return str;
}
class pTween {
    constructor() {
        this._memory = {}
    }

    _opt(opt) {
        const rand_key = `__to_num_${Date.now()}_${Math.random() * 1000 >> 1}`
        return {
            id: (typeof opt == 'number') ? rand_key : opt.id || rand_key,
            duration: (typeof opt === 'number' ? opt : opt.duration || 1) * 1000,
            step: typeof opt === 'number' ? 16 : opt.step || 16,
            log: typeof opt === 'number' ? true : opt.log || true,
        };
    }

    stop(id, ...ids) {
        const fn = [id, ...ids].flat();
        for(const id of fn) {
            if(id != void 0 && this._memory[id] != void 0) {
                clearInterval(this._memory[id])
                delete this._memory[id]
            }
        }
    }

    interval(opt, value_updator, logger = undefined, update = undefined, on_done = undefined ) {
        opt = this._opt(opt);

        this.stop(opt.id)

        const total = Math.max(1, Math.round(opt.duration / opt.step))
        let cstep = 0;

        this._memory[opt.id] = setInterval(() => {
            cstep ++;
            const cvalue = value_updator(cstep, total);

            update && update(cvalue);

            if(cstep >= total) {
                this.stop(opt.id)
                update && update(cvalue);
                on_done && on_done();
            }
        }, opt.step)

        opt.log && !!logger && logger(opt, total, this._memory[opt.id]);

        return opt.id
    }

    to_number(start, to, opt, update = undefined, on_done = undefined) {
        const range = to - start;
        const logger = (o, t, i) => {
            console.log("pTween >>> To Number: ", start, " -> ", to, "\n\t\t>> OPTs: ", o, '\n\t\t>> Total:', t, '\n\t\t>> Id:', i)
        }

        const mechanic = (step, total) => start + range / total * step;

        return this.interval(opt, mechanic, logger, update, on_done)
    }

    spinning_text(content, opt, update, on_done) {
        if(content == undefined) return

        opt = this._opt(opt)
        const l = content.length;
        const duper = opt.duration / (l) / 1000;
        let i = 0;
        let v = '';

        const uc = (txt) => {
            v = char_replacer_at(v, i, txt)
            update && update(v);
        };

        const doner = () => {
            uc(content[i]);
            i++;
            if (i >= l) {
                on_done && on_done();
            } else {
                this.spinning_char({ duration: duper, key: `__spining_text_${opt.key}__` }, uc, doner);
            }
        };

        this.spinning_char({ duration: duper, key: `__spining_text_${opt.key}__` }, uc, doner);
    }

    spinning_char(opt, update = undefined, on_done = undefined) {
        const logger = (o, t, i) => {
            console.log("pTween >>> Spining Char:\n\t\t>> OPTs: ", o, '\n\t\t>> Total:', t, '\n\t\t>> Id:', i)
        }
        return this.interval(opt, random_character, logger, update, on_done)
    }
}

class pTS {
    constructor() {
        this.tween = new pTween();
    }
}

_g.pTS = new pTS();
