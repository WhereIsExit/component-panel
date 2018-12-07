/**
 * @license The MIT License (MIT)
 * @copyright Boris Aleynikov <aleynikov.boris@gmail.com>
 */

/* eslint no-path-concat: 0 */

'use strict';

var Component = require('stb-component'),
    Layout = require('mag-component-layout');


/**
 * Extended panel implementation.
 *
 * @constructor
 * @extends Component
 * @param {Object} [config={}] - init parameters (all inherited from the parent)
 * @param {boolean} [config.main=false] - set panel as main
 * @param {boolean} [config.size=1] - size of panel width
 *
 * @example
 * main = new Panel({
 *     size: 1,
 *     title: ['Left Panel', {className: 'info'}],
 *     main: true,
 *     children: [
 *         new List({
 *             data: ['1 bla', '2 bro', '3 car', '4 hoho', 'Search'],
 *             size: 5
 *         })
 *     ]
 * });
 */
function Panel ( config ) {
    var $overlay;

    config = config || {};

    /**
     * Size of panel.
     *
     * @type {number}
     */
    this.size = 1;

    /**
     * Set panel as main.
     *
     * @type {boolean}
     */
    this.main = false;

    /**
     * Index in panel set.
     *
     * @type {number}
     */
    this.index = 0;

    if ( DEVELOP ) {
        if ( typeof config !== 'object' ) {
            throw new Error(__filename + ': wrong config type');
        }
        // init parameters checks
        if ( 'className' in config && (!config.className || typeof config.className !== 'string') ) {
            throw new Error(__filename + ': wrong or empty config.className');
        }
    }

    // set default className if classList property empty or undefined
    //config.className = 'Panel ' + (config.className || '');

    config.$body = document.createElement('div');
    config.$body.className = 'body';

    // parent constructor call
    Component.call(this, config);

    //this.$node.classList.add('theme-main');
    //this.$node.classList.add('theme-panel');

    // add special class to set component size
    if ( config.size ) {
        this.size = config.size;
        this.$node.classList.add('size' + config.size);
    }

    // add special class to set main panel
    if ( config.main ) {
        this.main = true;
        this.$node.classList.add('main');
    }

    // create elements to set as component shadows
    this.shadows = {
        $left: document.createElement('div'),
        $right: document.createElement('div')
    };

    this.shadows.$left.className = 'shadow left';
    this.$node.appendChild(this.shadows.$left);

    this.shadows.$right.className = 'shadow right';
    this.$node.appendChild(this.shadows.$right);

    // add title to panel
    if ( config.title ) {
        if ( !Array.isArray(config.title) ) {
            config.title = [config.title];
        }

        this.title = new Layout({
            //className: 'title theme-header theme-title',
            className: 'title',
            data: config.title,
            focusable: false
        });
        this.$node.appendChild(this.title.$node);
    }

    this.$node.appendChild(this.$body);

    $overlay = document.createElement('div');
    $overlay.className = 'overlay';
    this.$node.appendChild($overlay);
}


// inheritance
Panel.prototype = Object.create(Component.prototype);
Panel.prototype.constructor = Panel;

// set component name
Panel.prototype.name = 'mag-component-panel';


/**
 * Define default events.
 *
 * @type {{focus: Function}} try to focus first child component if it present
 */
Panel.prototype.defaultEvents = {
    focus: function () {
        if ( this.children.length ) {
            this.children[0].focus();
        }
    }
};


/**
 * Redefine default component focus to set panel as active even when give focus to children components.
 */
Panel.prototype.focus = function () {
    if ( this.focusable ) {
        this.parent.panels[this.parent.focusIndex].$node.classList.remove('active');
        this.parent.panels[this.parent.focusIndex].$node.classList.remove('top');

        Component.prototype.focus.call(this);

        this.parent.focusIndex = this.index;
        this.$node.classList.add('active');
        this.$node.classList.add('top');

        if ( this.index === 0 && this.parent.panels[1] && this.parent.panels[1].main ) {
            this.parent.panels[1].$node.classList.remove('position-left');
            this.parent.panels[1].$node.classList.add('position-right');

            if ( this.parent.panels[2] ) {
                this.parent.panels[2].$node.classList.remove('expand');
            }

            this.$node.classList.add('expand');
        } else if ( this.index === 2 && this.parent.panels[1].main ) {
            this.parent.panels[1].$node.classList.remove('position-right');
            this.parent.panels[1].$node.classList.add('position-left');
            this.parent.panels[0].$node.classList.remove('expand');
            this.$node.classList.add('expand');
        }
    }
};


/**
 * Blur panel.
 */
Panel.prototype.blur = function () {
    this.parent.panels[this.parent.focusIndex].$node.classList.remove('active');
    Component.prototype.blur.call(this);
};


// public
module.exports = Panel;
