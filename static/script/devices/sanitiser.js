/**
 * @fileOverview A base implementation for sanitisation strategies
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define('antie/devices/sanitiser', function () {
    'use strict';

    return function () {
        function Sanitiser (string) {
            this._string = string;
        }

        Sanitiser.prototype.setElementContent = function (el, enableHTML) {
            el[enableHTML? 'innerHTML' : 'textContent'] = this._string;
        };

        return Sanitiser;
    };
});
