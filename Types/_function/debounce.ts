const MIN_DELAY = 5;

interface IStates {
    firstCalled: boolean,
    sequentialCall: boolean
}

/**
 * Позволяет игноририровать вызовы функции до тех пор, пока пока они не перестанут повторяться в течение указанного периода.
 * @remark
 * <h2>Параметры функции</h2>
 * <ul>
 *      <li><b>original</b> {Function} - функция, вызов которой нужно игнорировать.</li>
 *      <li><b>delay</b> {Number} - период задержки в мс.</li>
 *      <li><b>[first=false]</b> {Boolean} - выполнить первый вызов без задержки.
 *      </li>
 * </ul>
 *
 * <h2>Возвращает</h2>
 * {Function} Результирующая функция.
 *
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
 * @class Types/_function/debounce
 * @public
 * @author Мальцев А.А.
 */
export default function debounce(
    original: Function,
    delay: number,
    first?: boolean,
    seriesStates?: IStates): Function
{
    let timer;
    const states = seriesStates || {
        firstCalled: false,
        sequentialCall: false
    }

    return function(...args: any[]): void {
        // Do the first call immediately if needed
        if (!states.firstCalled && first && !timer && delay > MIN_DELAY) {
            states.firstCalled = true;
            original.apply(this, args);
        }

        // Clear timeout if timer is still awaiting
        if (timer) {
            states.sequentialCall = true;
            clearTimeout(timer);
        }

        // Setup a new timer in which call the original function
        timer = setTimeout(() => {
            timer = null;

            if (states.sequentialCall || !states.firstCalled) {
                original.apply(this, args);
            }
        }, delay);
    };
}
