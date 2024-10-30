
/**
 * @typedef { 'Float' | 'Integer' | 'String' } TPrimitiveType
 *
 * @typedef { Object } IPrimitiveType
 * @property { TPrimitiveType } name
 * @property { number | string } default
 *
 * @typedef { IPrimitiveType | 'Object' } TCCPropertyType
 * 
 * @typedef { Object } ICCObject
 * @property { null | string | number } [default]
 * @property { TCCPropertyType } [type]
 * @property { boolean } [hasGetter]
 * @property { boolean } [hasSetter]
 * @property { boolean } [serializable]
 * @property { Function } [ctor]
 *
 */

(
    function(global) {
        const gcc = global.cc;

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

        const cc_attrs_list = [
            'default',
            'ctor',
            'hasGetter',
            'hasSetter',
            'serializable',
            'type',
            'visible',
            'displayName',
            'displayOrder',
            'tooltip',
            'group',
            'multiline',
            'readonly',
            'min',
            'max',
            'step',
            'range',
            'slide',
            'serializable',
            'formerlySerializedAs',
            'editorOnly',
            'override',
            'animatable',
            'unit',
            'radian',
            'userData',
            'radioGroup',
        ]

        function cc_attrs_getter(_prototype) {
            const prototype = _prototype.prototype || _prototype;
            const constructor = prototype.constructor || prototype;
            return constructor.__attrs__;
        }

        function cc_props_getter(_prototype) {
            const prototype = _prototype.prototype || _prototype;
            const constructor = prototype.constructor || prototype;
            return constructor.__props__;
        }

        function _cc_attribute(_attr, _property) {
            const data = {}

            cc_attrs_list.forEach( k => {
                const key = `${_property}$_$${k}`;
                (_attr[key] !== undefined) && (data[k] = _attr[key]);
            })

            return data;
        }

        function cc_attribute(_prototype, _property) {
            const attrs = cc_attrs_getter(_prototype);

            if(!attrs) return {};

            return _cc_attribute(attrs, _property);
        }

        function cc_attributes(_prototype) {
            const attrs = cc_attrs_getter(_prototype);
            const props = cc_props_getter(_prototype);

            const dataz = {};

            for(const i in props) {
                const prop = props[i];

                dataz[prop] = _cc_attribute(attrs, prop);
            }

            return dataz;
        }

        function is_ccclass(target) {
            return target.__classname__ != undefined;
        }

        function getset_getter(obj) {
            const dess = Object.getOwnPropertyDescriptors(obj);
            const data = {};
            for(const [key, des] of Object.entries(dess)) {
                if(des.get || des.set) {
                    data[key] = {
                        get: des.get,
                        set: des.set,
                    }
                }
            }

            return data;
        }

        /**
         * @param { Record<string, ICCObject> } _target_attrs
         */
        function reflect_attrs_from_ccclass(_this_prototype, _target_attrs) {

            const ccproperty = gcc._decorator.property;
            for(const [key, value] of Object.entries(_target_attrs)) {
                const data = {
                    writable: true,
                    configurable: true,
                    enumerable: true
                };

                const { type, hasGetter, hasSetter, ctor } = value;

                if(!!value.default) data.value = value.default;

                Reflect.defineProperty(_this_prototype, key, data);

                delete value.default;

                if(type === 'Object') value.type = ctor;
                if(hasGetter && !hasSetter) value.readonly = true;
                ccproperty(value)(_this_prototype, key);
            }
        }

        function attrs_primitive_getter(property) {

        }

        function attrs_object_getter(property) {

        }

        function attrs_getset_getter(property) {

        }

        const _attrs = {
            primitive_getter: attrs_getset_getter,
            object_getter: attrs_object_getter,
            getset_getter: attrs_getset_getter,
        }

        const cc = {
            attribute: cc_attribute,
            attributes: cc_attributes,
            is_ccclass,
            attrs: _attrs
        }

        function copy_properties(_this, _source, ..._excepts) {
            _excepts = [..._excepts].flat();

            const _tproto = _this.prototype;
            const _sproto = _source.prototype;

            const instance = new _sproto.constructor();

            console.log("INST", instance)

            const result = Object.keys(instance).filter(item => !_excepts.includes(item));

            for(const ret of result) _tproto[ret] = instance[ret];
        }

        function copy_functions(_this, ..._sources) {
            _sources = [..._sources].flat();
            const _tproto = _this.prototype;

            for(const _source of _sources) {
                const _sproto = _source.prototype;

                Object.getOwnPropertyNames(_sproto).forEach( property => {
                    if(property === 'constructor') return;

                    const descriptor = Object.getOwnPropertyDescriptor(_sproto, property);
                    if(!descriptor) return;

                    if(typeof descriptor.value === 'function') _tproto[property] = descriptor.value;
                } )
            }
        }

        function copy_getset(_this, ..._sources) {
            _sources = [..._sources].flat();
            const _tproto = _this.prototype;

            for(const _source of _sources) {
                const _sproto = _source.prototype;

                Object.getOwnPropertyNames(_sproto).forEach( property => {
                    if(property === 'constructor') return;

                    const descriptor = Object.getOwnPropertyDescriptor(_sproto, property);
                    if(!descriptor) return;
                    const { get, set, enumerable, configurable } = descriptor;

                    if(get || set) {
                        Object.defineProperty(_tproto, property, {
                            get: get ? get.bind(_tproto) : undefined,
                            set: set ? set.bind(_tproto) : undefined,
                            enumerable,
                            configurable,
                        })
                    }
                } )
            }
        }

        function coppy_object_functions(_this, ..._sources) {
            _sources = [..._sources].flat();
            const _tproto = _this.prototype;

            for(const _source of _sources) {
                const _sproto = _source.prototype;
                const _name = gcc.js.getClassName(_sproto)
                console.log("---------------------------------");

                Object.getOwnPropertyNames(_sproto).forEach( property => {
                    if(property === 'constructor') return;
                    const descriptor = Object.getOwnPropertyDescriptor(_sproto, property);
                    if(!descriptor) return;

                    console.log(`${_name} > ${property} >`, descriptor.value, descriptor.get);
                    if(typeof descriptor.value === 'function') {
                        _tproto[property] = descriptor.value;
                    } else {
                        const { get, set, enumerable, configurable } = descriptor;

                        if(get || set) {
                            Object.defineProperty(_tproto, property, {
                                get: get ? get.bind(_tproto) : undefined,
                                set: set ? set.bind(_tproto) : undefined,
                                enumerable,
                                configurable,
                            })
                        }
                    }
                } );
            }
        }

        function mixins(..._classes) {
            return function(_this) {
                _classes.forEach( _class => {

                    const { prototype } = _class;
                    const props = cc_props_getter(prototype);
                    if(is_ccclass(prototype)) {
                        const attrs = cc_attributes(prototype);
                        reflect_attrs_from_ccclass(_this.prototype, attrs);
                    }

                    coppy_object_functions(_this, _class);
                    copy_properties(_this, _class, props || []);

            } )


                return _this
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
