/// <amd-module name="Types/_chain/Mapped" />
/**
 * Преобразующее звено цепочки.
 * @class Types/Chain/Mapped
 * @extends Types/Chain/Abstract
 * @public
 * @author Мальцев А.А.
 */

import Abstract from './Abstract';
import MappedEnumerator from './MappedEnumerator';
import {IEnumerator} from '../collection';

interface MapFunc {
   (item: any, index: number): any;
}

export default class Mapped<T> extends Abstract<T> /** @lends Types/Chain/Mapped.prototype */{
   /**
    * @property {Function(*, Number): *} Функция, возвращающая новый элемент
    */
   protected _callback: MapFunc;

   /**
    * @property {Object} Контекст вызова _callback
    */
   protected _callbackContext: Object;

   /**
    * Конструктор преобразующего звена цепочки.
    * @param {Types/Chain/Abstract} source Предыдущее звено.
    * @param {Function(*, Number): *} callback Функция, возвращающая новый элемент.
    * @param {Object} [callbackContext] Контекст вызова callback
    */
   constructor(source: Abstract<T>, callback: MapFunc, callbackContext: Object) {
      super(source);
      this._callback = callback;
      this._callbackContext = callbackContext;
   }

   destroy() {
      this._callback = null;
      this._callbackContext = null;
      super.destroy();
   }

   // region Types/_collection/IEnumerable

   getEnumerator(): IEnumerator<T> {
      return new MappedEnumerator(
         this._previous,
         this._callback,
         this._callbackContext
      );
   }

   // endregion Types/_collection/IEnumerable
}

Mapped.prototype['[Types/_chain/Mapped]'] = true;
// @ts-ignore
Mapped.prototype._callback = null;
// @ts-ignore
Mapped.prototype._callbackContext = null;
