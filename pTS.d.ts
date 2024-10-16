import * as cc from 'cc';

declare namespace pTS {


    namespace tween {

        /**
         * Full options for tween animation.
         */
        interface ITweenOption {
            /**
             * + The tween's unique identifier.
             *
             * [Optional]: - If provided, it allows for referencing 
             * or controlling the tween later using this ID.
             *
             * [Default]: Randrom generated
             */
            id?: string;

            /**
             * + The duration of the tween animation in seconds.
             * + This property defines how long the tween should run. 
             *
             * [Optional]
             *
             * [Default]: 1 second
             */
            duration?: number;

            /**
             * The step value for incremental tweening.
             * 
             * This property can be used to define how many discrete steps 
             * the tween should take during its animation. 
             * Default is often 1 if not specified.
             */
            step?: number;

            /**
             * Enable or disable logging for the tween's progress.
             * 
             * If set to true, logs will be produced to help with debugging 
             * the tween's execution. Default is false if not specified.
             */
            log?: boolean;
        }

        /**
         * Represents the options for a tween animation.
         * 
         * This type can be either a configuration object of type `ITweenOption`
         * or a numeric value representing the duration of the tween in seconds.
         * 
         * @example
         * ```ts
         * // Using a configuration object
         * const options: TFlexOption = {
         *     duration: 1,
         *     easing: "linear",
         *     // other properties...
         * };
         * 
         * // Using a duration directly
         * const duration: TFlexOption = 5;
         * ```
         */
        type TFlexOption = ITweenOption | number;

        type FUpdator = (current: number) => void;
        type FOnDone = () => void
        type FValueUpdator<T> = (step: number, total: number) => T;
        type FLogger = (opt: ITweenOption, total: number, id: number) => void

        interface IEaseTweenOption extends ITweenOption {
            easing?: cc.TweenEasing
        }

        type TNumberToOption = number | IEaseTweenOption

        /**
         * Stops the tween animation(s) associated with the specified ID(s).
         * 
         * @param id - The ID of the tween to stop. This can be a single ID as a string or an array of IDs.
         * @param ids - Additional IDs of tweens to stop. You can provide multiple IDs as separate arguments.
         * 
         * @example
         * // Stop a single tween
         * pTS.tween.stop("tween1");
         * 
         * // Stop multiple tweens
         * pTS.tween.stop("tween1", "tween2", "tween3");
         *
         * // Stop array of tween
         * pTS.tween.stop(['tween1', 'tween2'])
         *
         */
        function stop(id: string | string[], ...ids: string[]): void;
        function interval<T>(opt: TFlexOption, mechanic: FValueUpdator<T>, logger?: FLogger, update?: FUpdator, on_done?: FOnDone): string;
        function to_number(start: number, to: number, option: TNumberToOption, update?: FUpdator, on_done?: FOnDone): string;
        function spinning_text(text: string, option: TFlexOption, update?: FUpdator, on_done?: FOnDone): string;
    }
}
