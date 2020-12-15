const MIN_DELAY = 5;

/**
 * Позволяет игноририровать вызовы функции до тех пор, пока пока они не перестанут повторяться в течение указанного периода.
 * @remark
 * Алгоритм работы:
 * <ol>
 *     <li>При каждом вызове функции её выполнение откладывается на время, заданное параметром delay. Если за это время происходит повторный вызов функции, то предыдущий вызов отменяется, а новый откладывается на время delay. И так далее по аналогии.</li>
 *     <li>Если параметр first=true, то первый вызов функции в каждой серии будет выполнен в любом случае.</li>
 * </ol>
 *
 * См. также функцию {@link Types/_function/throttle throttle}, которая позволяет ограничивать частоту вызовов функции.
 *
 * <h2>Пример использования</h2>
 * Будем рассчитывать итоги по корзине покупателя не при каждом добавлении товара, а только один раз:
 * <pre>
 *     import {debounce} from 'Types/function';
 *     const cart = {
 *         items: [
 *             {name: 'Milk', price: 1.99, qty: 2},
 *             {name: 'Butter', price: 2.99, qty: 1},
 *             {name: 'Ice Cream', price: 0.49, qty: 2}
 *         ],
 *         totals: {},
 *         calc: () => {
 *             this.totals = {
 *                 amount: 0,
 *                 qty: 0
 *             };
 *             this.items.forEach((item) => {
 *                 this.totals.amount += item.price * item.qty;
 *                 this.totals.qty += item.qty;
 *             });
 *             console.log('Cart totals:', this.totals);
 *         },
 *     };
 *     const calcCartDebounced = debounce(cart.calc, 200);
 *
 *     const interval = setInterval(() => {
 *         cart.items.push({name: 'Something else', price: 1.05, qty: 1});
 *         console.log('Cart items count: ' + cart.items.length);
 *         calcCartDebounced.call(cart);
 *         if (cart.items.length > 9) {
 *             clearInterval(interval);
 *         }
 *     }, 100);
 * </pre>
 *
 * @param original Функция, вызов которой нужно игнорировать
 * @param delay Период задержки в мс
 * @param first Выполнить первый вызов без задержки
 * @returns Результирующая функция
 * @public
 * @author Мальцев А.А.
 */
export default function debounce(original: Function, delay: number, first?: boolean): Function {
    let timers;
    let firstCalled = false;
    let sequentialCall = false;

    return function(...args: any[]): void {
        // Do the first call immediately if needed
        if (first && !timers && delay > MIN_DELAY) {
            firstCalled = true;
            original.apply(this, args);
        }

        // Clear timeout if timer is still awaiting
        if (timers) {
            sequentialCall = true;
            clearTimeout(timers);
        }

        // Setup a new timer in which call the original function
        timers = setTimeout(() => {
            timers = null;
            if (sequentialCall || !firstCalled) {
                original.apply(this, args);
            }
        }, delay);
    };
}
