(
    function(global) {

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

        function mark_singleton(constructor) {
            console.log(constructor)
        }

        function mixins(...classes) {

            return function(ctor) {
                classes.forEach( e => {
                    Object.getOwnPropertyNames(e.prototype).forEach( k => {
                        const ret = e.prototype[k];
                        if(typeof ret === 'function' && k != 'constructor') {
                            ctor.prototype[k] = ret;
                        }
                    } );
                    console.log('-------------------\n')
                    console.log(JSON.stringify(e.prototype))
                    const info = e.prototype;
                    console.log("\t\tINFOR >>", Object.keys(info))
                    const is_c = info.__classname__ != undefined;
                    console.log("Is CCCLASS: ", is_c);
                    const cont = info.constructor;
                    const ccc = global.cc;
                    const ccd = ccc._decorator;
                    if(is_c) {
                        const att = cont.__attrs__;
                        console.log("ATTRIBUTE: >>", att)
                        for(const ret of cont.__props__) {
                            //console.log("PROP:", ret, " >> DEFAULT:", att[`${ret}$_$default`], " >> TYPE: ", att[`${ret}$_$type`]);
                            Reflect.defineProperty(ctor.prototype, ret, {
                                value: att[`${ret}$_$default`],
                                writable: true,
                                configurable: true,
                                enumerable: true,
                            })
                            const _ctor = att[`${ret}$_$ctor`];
                            const _type = att[`${ret}$_$type`];
                            if(_type === 'Object') {
                                ccd.type(_ctor)(ctor.prototype, ret);
                            } else {
                                switch(_type.name) {
                                    case 'String': {
                                        ccd.type(ccc.CCString)(ctor.prototype, ret);
                                        break;
                                    }
                                    case 'Float': {
                                        ccd.type(ccc.CCFloat)(ctor.prototype, ret);
                                        break;
                                    }
                                    case 'Integer': {
                                        ccd.type(ccc.CCInteger)(ctor.prototype, ret);
                                        break;
                                    }
                                }
                            }
                        }
                    }
            } )


                return ctor
            }
        }

        const decorator = {
            mark_singleton,
            mixins
        }

        class pSingleton {
            constructor() {
            }
        }

        class pScheduler {
            constructor() {
                this._data = {}
            }
        }

        class pNumber {
        }

        class pEasing {

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
                return this.interval(opt, random_character, logger, update, on_done)
                }
            }
        }


        const tween = new pTween();
        global.pTS = {
            tween,
            decorator
        }
    }
)(this);
