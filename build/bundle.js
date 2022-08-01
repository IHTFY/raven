
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __pow = Math.pow;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };
  var __privateWrapper = (obj, member, setter, getter) => {
    return {
      set _(value) {
        __privateSet(obj, member, value, setter);
      },
      get _() {
        return __privateGet(obj, member, getter);
      }
    };
  };
  var __privateMethod = (obj, member, method) => {
    __accessCheck(obj, member, "access private method");
    return method;
  };
  var _draggedPositionX, _isAnimated, _children, _totalMediaToLoad, _loadedMediaCount, _isResizing, _isScrolling, _isPressed, _deltaX, _deltaY, _windowResizeRef, _arrowPrev, _arrowNext, _arrowNextRef, _arrowPrevRef, _touchStartRef, _touchMoveRef, _touchReleaseRef, _xStart, _yStart, _indicators, _autoplayInterval, _pointerType, _getChildren, getChildren_fn, _waitForLoad, waitForLoad_fn, _newItemLoaded, newItemLoaded_fn, _setItemsPosition, setItemsPosition_fn, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn, _handleDragStart, handleDragStart_fn, _handleDragMove, handleDragMove_fn, _handleDragRelease, handleDragRelease_fn, _enableIndicators, enableIndicators_fn, _handleIndicatorClick, handleIndicatorClick_fn, _resetIndicators, resetIndicators_fn, _getXPosition, getXPosition_fn, _getYPosition, getYPosition_fn, _setTransitionDuration, setTransitionDuration_fn, _emitSlideEvent, emitSlideEvent_fn, _triggers, _sidenavTriggers, _isInit, _isActive, _isAnimated2, _childIsActive, _listenerRef, _resizeRef, _sidenavId, _handleResize, handleResize_fn, _detectSidenav, detectSidenav_fn, _addActiveInSidenav, addActiveInSidenav_fn, _toggleTriggerActive, toggleTriggerActive_fn, _autoClose, autoClose_fn, _applyOverflow, applyOverflow_fn, _onClickTrigger, onClickTrigger_fn, _triggers2, _isActive2, _isAnimated3, _isFixed, _firstSidenavInit, _layoutEl, _overlayElement, _listenerRef2, _windowResizeRef2, _windowWidth, _resizeHandler, resizeHandler_fn, _cleanLayout, cleanLayout_fn, _handleMultipleSidenav, handleMultipleSidenav_fn, _toggleBodyScroll, toggleBodyScroll_fn, _onClickTrigger2, onClickTrigger_fn2, _dropdownContent, _trigger, _isAnimated4, _isActive3, _documentClickRef, _listenerRef3, _contentHeightRef, _setupAnimation, setupAnimation_fn, _onDocumentClick, onDocumentClick_fn, _onClickTrigger3, onClickTrigger_fn3, _autoClose2, autoClose_fn2, _setContentHeight, setContentHeight_fn, _isAnimated5, _isActive4, _trigger2, _fabMenu, _openRef, _closeRef, _documentClickRef2, _listenerRef4, _verifOptions, verifOptions_fn, _setProperties, setProperties_fn, _setMenuPosition, setMenuPosition_fn, _handleDocumentClick, handleDocumentClick_fn, _onClickTrigger4, onClickTrigger_fn4, _onClickRef, _transitionEndEventRef, _keyUpRef, _scrollRef, _resizeRef2, _overlay, _overlayClickEventRef, _overflowParents, _baseRect, _newHeight, _newWidth, _isActive5, _isResponsive, _container, _isClosing, _isOpening, _setOverlay, setOverlay_fn, _showOverlay, showOverlay_fn, _hideOverlay, hideOverlay_fn, _unsetOverlay, unsetOverlay_fn, _calculateRatio, calculateRatio_fn, _setOverflowParents, setOverflowParents_fn, _unsetOverflowParents, unsetOverflowParents_fn, _handleTransition, handleTransition_fn, _handleKeyUp, handleKeyUp_fn, _handleScroll, handleScroll_fn, _handleResize2, _clearLightbox, clearLightbox_fn, _onClickTrigger5, onClickTrigger_fn5, _triggers3, _isActive6, _isAnimated6, _listenerRef5, _toggleBodyScroll2, toggleBodyScroll_fn2, _setZIndex, setZIndex_fn, _onClickTrigger6, onClickTrigger_fn6, _tabArrow, _tabLinks, _tabMenu, _currentItemIndex, _leftArrow, _rightArrow, _scrollLeftRef, _scrollRightRef, _arrowRef, _caroulixSlideRef, _resizeTabRef, _tabItems, _tabCaroulix, _tabCaroulixInit, _caroulixInstance, _isAnimated7, _handleResizeEvent, handleResizeEvent_fn, _handleCaroulixSlide, handleCaroulixSlide_fn, _getItems, getItems_fn, _hideContent, hideContent_fn, _enableSlideAnimation, enableSlideAnimation_fn, _setActiveElement, setActiveElement_fn, _toggleArrowMode, toggleArrowMode_fn, _scrollLeft, scrollLeft_fn, _scrollRight, scrollRight_fn, _onClickItem, onClickItem_fn, _getPreviousItemIndex, getPreviousItemIndex_fn, _getNextItemIndex, getNextItemIndex_fn, _oldLink, _updateRef, _links, _elements, _setupBasic, setupBasic_fn, _setupAuto, setupAuto_fn, _getElement, getElement_fn, _removeOldLink, removeOldLink_fn, _getClosestElem, getClosestElem_fn, _update, update_fn, _content, _toasters, _createToaster, createToaster_fn, _removeToaster, removeToaster_fn, _fadeInToast, fadeInToast_fn, _fadeOutToast, fadeOutToast_fn, _animOut, animOut_fn, _createToast, createToast_fn, _hide, hide_fn, _tooltip, _positionList, _listenerEnterRef, _listenerLeaveRef, _listenerResizeRef, _timeoutRef, _elRect, _tooltipRect, _setProperties2, setProperties_fn2, _setBasicPosition, setBasicPosition_fn, _manualTransform, manualTransform_fn, _onHover, onHover_fn, _onHoverOut, onHoverOut_fn, _dropdownInstance, _container2, _input, _label, _clickRef, _setupDropdown, setupDropdown_fn, _createCheckbox, createCheckbox_fn, _setupContent, setupContent_fn, _setFocusedClass, setFocusedClass_fn, _onClick, onClick_fn, _select, select_fn, _unSelect, unSelect_fn;
  const instances = [];
  const config = {
    components: [],
    plugins: [],
    prefix: "ax",
    mode: ""
  };
  const getCssVar = (variable) => `--${config.prefix}-${variable}`;
  const getComponentClass = (component) => config.components.find((c) => c.name === component).class;
  const getDataElements = () => {
    const dataComponents = config.components.filter((component) => component.dataDetection);
    const dataPlugins = config.plugins.filter((plugin) => plugin.dataDetection);
    return [...dataComponents, ...dataPlugins].map((el) => el.name);
  };
  const register = (el, term) => {
    if (!el.name || !el.class) {
      console.error(`[Axentix] Error registering ${term} : Missing required parameters.`);
      return;
    }
    if (config[term].some((elem) => elem.name === el.name)) {
      console.error(`[Axentix] Error registering ${term} : Already exist.`);
      return;
    }
    if (el.autoInit)
      el.autoInit.selector = el.autoInit.selector += ":not(.no-axentix-init)";
    config[term].push(el);
  };
  const registerComponent = (component) => {
    register(component, "components");
  };
  const getFormattedName = (name) => {
    return name.replace(/[\w]([A-Z])/g, (s) => {
      return s[0] + "-" + s[1];
    }).toLowerCase();
  };
  const getName = (name, baseName = "") => {
    const fmtName = getFormattedName(name);
    return baseName ? baseName + "-" + fmtName : fmtName;
  };
  const getOptionsForObject = (obj, name, component, element, baseName = "") => {
    const tmpOptName = name[0].toUpperCase() + name.slice(1).toLowerCase();
    if (getDataElements().includes(tmpOptName) && component !== "Collapsible" && tmpOptName !== "Sidenav")
      obj[name] = getComponentClass(tmpOptName).getDefaultOptions();
    const fmtName = baseName ? baseName + "-" + name : name;
    const keys = getOptions(obj[name], component, element, fmtName);
    if (!(Object.keys(keys).length === 0 && obj.constructor === Object))
      return keys;
  };
  const getOptions = (obj, component, element, baseName = "") => {
    return Object.keys(obj).reduce((acc, name) => {
      if (typeof obj[name] === "object" && obj[name] !== null) {
        const opts = getOptionsForObject(obj, name, component, element, baseName);
        if (opts)
          acc[name] = opts;
      } else if (obj[name] !== null) {
        const dataAttribute = "data-" + component.toLowerCase() + "-" + getName(name, baseName);
        if (element.hasAttribute(dataAttribute)) {
          const attr = element.getAttribute(dataAttribute);
          acc[name] = typeof obj[name] === "number" ? Number(attr) : attr;
          if (typeof obj[name] === "boolean")
            acc[name] = attr === "true";
        }
      }
      return acc;
    }, {});
  };
  const formatOptions = (component, element) => {
    const defaultOptions = Object.assign({}, getComponentClass(component).getDefaultOptions());
    return getOptions(defaultOptions, component, element);
  };
  const setup = () => {
    const elements = document.querySelectorAll("[data-ax]");
    elements.forEach((el) => {
      let component = el.dataset.ax;
      component = component[0].toUpperCase() + component.slice(1).toLowerCase();
      if (!getDataElements().includes(component)) {
        console.error(`[Axentix] Error: ${component} component doesn't exist. 
 Did you forget to register him ?`, el);
        return;
      }
      try {
        const classDef = getComponentClass(component);
        new classDef(`#${el.id}`);
      } catch (error) {
        console.error("[Axentix] Data: Unable to load " + component, error);
      }
    });
  };
  const setupAll = () => {
    try {
      new Axentix.Axentix("all");
    } catch (error) {
      console.error("[Axentix] Unable to auto init.", error);
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    if (document.documentElement.dataset.axentix)
      setupAll();
    setup();
  });
  const extend = (...args) => {
    return args.reduce((acc, obj) => {
      for (let key in obj) {
        acc[key] = typeof obj[key] === "object" && obj[key] !== null ? extend(acc[key], obj[key]) : obj[key];
      }
      return acc;
    }, {});
  };
  const getComponentOptions = (component, options, el) => extend(getComponentClass(component).getDefaultOptions(), formatOptions(component, el), options);
  const wrap = (target, wrapper = document.createElement("div")) => {
    const parent = target[0].parentElement;
    parent.insertBefore(wrapper, target[0]);
    target.forEach((elem) => wrapper.appendChild(elem));
    return wrapper;
  };
  const unwrap = (wrapper) => wrapper.replaceWith(...wrapper.childNodes);
  const createEvent = (element, eventName, extraData) => {
    const event = new CustomEvent("ax." + eventName, {
      detail: extraData || {},
      bubbles: true
    });
    element.dispatchEvent(event);
  };
  const isTouchEnabled = () => "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  const isPointerEnabled = () => !!window.PointerEvent && "maxTouchPoints" in window.navigator && window.navigator.maxTouchPoints >= 0;
  const getPointerType = () => {
    if (isTouchEnabled())
      return "touch";
    else if (isPointerEnabled())
      return "pointer";
    return "mouse";
  };
  const getInstanceByType = (type) => instances.filter((ins) => ins.type === type).map((ins) => ins.instance);
  const getInstance = (element) => {
    const el = instances.find((ins) => ins.type !== "Toast" && "#" + ins.instance.el.id === element);
    if (el)
      return el.instance;
    return false;
  };
  const getUid = () => Math.random().toString().split(".")[1];
  const createOverlay = (isActive, overlay, id, animationDuration) => {
    const overlayElement = isActive && overlay ? document.querySelector(`.ax-overlay[data-target="${id}"]`) : document.createElement("div");
    overlayElement.classList.add("ax-overlay");
    overlayElement.style.transitionDuration = animationDuration + "ms";
    overlayElement.dataset.target = id;
    return overlayElement;
  };
  const updateOverlay = (overlay, overlayElement, listenerRef, state, animationDuration) => {
    if (!overlay)
      return;
    if (state) {
      overlayElement.addEventListener("click", listenerRef);
      document.body.appendChild(overlayElement);
      setTimeout(() => {
        overlayElement.classList.add("active");
      }, 50);
    } else {
      overlayElement.classList.remove("active");
      setTimeout(() => {
        overlayElement.removeEventListener("click", listenerRef);
        document.body.removeChild(overlayElement);
      }, animationDuration);
    }
  };
  const getTriggers = (id, query = '[data-target="{ID}"]') => Array.from(document.querySelectorAll(query.replace("{ID}", id)));
  class AxentixComponent {
    constructor() {
      __publicField(this, "el");
    }
    removeListeners() {
    }
    setupListeners() {
    }
    setup() {
    }
    preventDbInstance(element) {
      if (element && getInstance(element))
        throw new Error(`Instance already exist on ${element}`);
    }
    sync() {
      createEvent(this.el, "component.sync");
      this.removeListeners();
      this.setupListeners();
    }
    reset() {
      createEvent(this.el, "component.reset");
      this.removeListeners();
      this.setup();
    }
    destroy() {
      createEvent(this.el, "component.destroy");
      this.removeListeners();
      const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
      instances.splice(index, 1);
    }
  }
  const CaroulixOptions = {
    animationDuration: 500,
    height: "",
    backToOpposite: true,
    enableTouch: true,
    indicators: {
      enabled: false,
      isFlat: false,
      customClasses: ""
    },
    autoplay: {
      enabled: true,
      interval: 5e3,
      side: "right"
    }
  };
  class Caroulix extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _getChildren);
      __privateAdd(this, _waitForLoad);
      __privateAdd(this, _newItemLoaded);
      __privateAdd(this, _setItemsPosition);
      __privateAdd(this, _setBasicCaroulixHeight);
      __privateAdd(this, _handleDragStart);
      __privateAdd(this, _handleDragMove);
      __privateAdd(this, _handleDragRelease);
      __privateAdd(this, _enableIndicators);
      __privateAdd(this, _handleIndicatorClick);
      __privateAdd(this, _resetIndicators);
      __privateAdd(this, _getXPosition);
      __privateAdd(this, _getYPosition);
      __privateAdd(this, _setTransitionDuration);
      __privateAdd(this, _emitSlideEvent);
      __publicField(this, "options");
      __publicField(this, "activeIndex");
      __privateAdd(this, _draggedPositionX, 0);
      __privateAdd(this, _isAnimated, false);
      __privateAdd(this, _children, void 0);
      __privateAdd(this, _totalMediaToLoad, 0);
      __privateAdd(this, _loadedMediaCount, 0);
      __privateAdd(this, _isResizing, false);
      __privateAdd(this, _isScrolling, false);
      __privateAdd(this, _isPressed, false);
      __privateAdd(this, _deltaX, 0);
      __privateAdd(this, _deltaY, 0);
      __privateAdd(this, _windowResizeRef, void 0);
      __privateAdd(this, _arrowPrev, void 0);
      __privateAdd(this, _arrowNext, void 0);
      __privateAdd(this, _arrowNextRef, void 0);
      __privateAdd(this, _arrowPrevRef, void 0);
      __privateAdd(this, _touchStartRef, void 0);
      __privateAdd(this, _touchMoveRef, void 0);
      __privateAdd(this, _touchReleaseRef, void 0);
      __privateAdd(this, _xStart, 0);
      __privateAdd(this, _yStart, 0);
      __privateAdd(this, _indicators, void 0);
      __privateAdd(this, _autoplayInterval, void 0);
      __privateAdd(this, _pointerType, void 0);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Caroulix", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Caroulix", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Caroulix init error", error);
      }
    }
    setup() {
      createEvent(this.el, "caroulix.setup");
      this.options.autoplay.side = this.options.autoplay.side.toLowerCase();
      const sideList = ["right", "left"];
      if (!sideList.includes(this.options.autoplay.side))
        this.options.autoplay.side = "right";
      this.activeIndex = 0;
      __privateSet(this, _draggedPositionX, 0);
      __privateSet(this, _isAnimated, false);
      __privateSet(this, _pointerType, getPointerType());
      __privateSet(this, _children, __privateMethod(this, _getChildren, getChildren_fn).call(this));
      if (this.options.indicators.enabled)
        __privateMethod(this, _enableIndicators, enableIndicators_fn).call(this);
      const activeEl = this.el.querySelector(".active");
      if (activeEl)
        this.activeIndex = __privateGet(this, _children).indexOf(activeEl);
      else
        __privateGet(this, _children)[0].classList.add("active");
      __privateMethod(this, _waitForLoad, waitForLoad_fn).call(this);
      if (__privateGet(this, _totalMediaToLoad) === 0)
        __privateMethod(this, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn).call(this);
      this.setupListeners();
      if (this.options.autoplay.enabled)
        this.play();
    }
    setupListeners() {
      __privateSet(this, _windowResizeRef, __privateMethod(this, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn).bind(this));
      window.addEventListener("resize", __privateGet(this, _windowResizeRef));
      if (__privateGet(this, _arrowNext)) {
        __privateSet(this, _arrowNextRef, this.next.bind(this, 1));
        __privateGet(this, _arrowNext).addEventListener("click", __privateGet(this, _arrowNextRef));
      }
      if (__privateGet(this, _arrowPrev)) {
        __privateSet(this, _arrowPrevRef, this.prev.bind(this, 1));
        __privateGet(this, _arrowPrev).addEventListener("click", __privateGet(this, _arrowPrevRef));
      }
      if (this.options.enableTouch) {
        __privateSet(this, _touchStartRef, __privateMethod(this, _handleDragStart, handleDragStart_fn).bind(this));
        __privateSet(this, _touchMoveRef, __privateMethod(this, _handleDragMove, handleDragMove_fn).bind(this));
        __privateSet(this, _touchReleaseRef, __privateMethod(this, _handleDragRelease, handleDragRelease_fn).bind(this));
        this.el.addEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "touch" ? "start" : "down"}`, __privateGet(this, _touchStartRef));
        this.el.addEventListener(`${__privateGet(this, _pointerType)}move`, __privateGet(this, _touchMoveRef));
        this.el.addEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "touch" ? "end" : "up"}`, __privateGet(this, _touchReleaseRef));
        this.el.addEventListener(__privateGet(this, _pointerType) === "pointer" ? "pointerleave" : "mouseleave", __privateGet(this, _touchReleaseRef));
      }
    }
    removeListeners() {
      window.removeEventListener("resize", __privateGet(this, _windowResizeRef));
      __privateSet(this, _windowResizeRef, void 0);
      if (__privateGet(this, _arrowNext)) {
        __privateGet(this, _arrowNext).removeEventListener("click", __privateGet(this, _arrowNextRef));
        __privateSet(this, _arrowNextRef, void 0);
      }
      if (__privateGet(this, _arrowPrev)) {
        __privateGet(this, _arrowPrev).removeEventListener("click", __privateGet(this, _arrowPrevRef));
        __privateSet(this, _arrowPrevRef, void 0);
      }
      if (this.options.enableTouch) {
        this.el.removeEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "pointer" ? "down" : "start"}`, __privateGet(this, _touchStartRef));
        this.el.removeEventListener(`${__privateGet(this, _pointerType)}move`, __privateGet(this, _touchMoveRef));
        this.el.removeEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "touch" ? "end" : "up"}`, __privateGet(this, _touchReleaseRef));
        this.el.removeEventListener(__privateGet(this, _pointerType) === "pointer" ? "pointerleave" : "mouseleave", __privateGet(this, _touchReleaseRef));
        __privateSet(this, _touchStartRef, void 0);
        __privateSet(this, _touchMoveRef, void 0);
        __privateSet(this, _touchReleaseRef, void 0);
      }
    }
    goTo(number) {
      if (number === this.activeIndex)
        return;
      const side = number > this.activeIndex ? "right" : "left";
      if (side === "left")
        this.prev(Math.abs(this.activeIndex - number));
      else
        this.next(Math.abs(this.activeIndex - number));
      if (this.options.indicators.enabled)
        __privateMethod(this, _resetIndicators, resetIndicators_fn).call(this);
    }
    play() {
      if (!this.options.autoplay.enabled)
        return;
      this.stop();
      __privateSet(this, _autoplayInterval, setInterval(() => {
        if (this.options.autoplay.side === "right")
          this.next(1, false);
        else
          this.prev(1, false);
      }, this.options.autoplay.interval));
    }
    stop() {
      if (!this.options.autoplay.enabled)
        return;
      clearInterval(__privateGet(this, _autoplayInterval));
    }
    next(step = 1, resetAutoplay = true) {
      if (__privateGet(this, _isResizing) || this.activeIndex === __privateGet(this, _children).length - 1 && !this.options.backToOpposite)
        return;
      createEvent(this.el, "caroulix.next", { step });
      __privateSet(this, _isAnimated, true);
      if (resetAutoplay && this.options.autoplay.enabled)
        this.stop();
      if (this.activeIndex < __privateGet(this, _children).length - 1)
        this.activeIndex += step;
      else if (this.options.backToOpposite)
        this.activeIndex = 0;
      __privateMethod(this, _emitSlideEvent, emitSlideEvent_fn).call(this);
      __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
      if (resetAutoplay && this.options.autoplay.enabled)
        this.play();
    }
    prev(step = 1, resetAutoplay = true) {
      if (__privateGet(this, _isResizing) || this.activeIndex === 0 && !this.options.backToOpposite)
        return;
      createEvent(this.el, "caroulix.prev", { step });
      __privateSet(this, _isAnimated, true);
      if (resetAutoplay && this.options.autoplay.enabled)
        this.stop();
      if (this.activeIndex > 0)
        this.activeIndex -= step;
      else if (this.options.backToOpposite)
        this.activeIndex = __privateGet(this, _children).length - 1;
      __privateMethod(this, _emitSlideEvent, emitSlideEvent_fn).call(this);
      __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
      if (resetAutoplay && this.options.autoplay.enabled)
        this.play();
    }
  }
  _draggedPositionX = new WeakMap();
  _isAnimated = new WeakMap();
  _children = new WeakMap();
  _totalMediaToLoad = new WeakMap();
  _loadedMediaCount = new WeakMap();
  _isResizing = new WeakMap();
  _isScrolling = new WeakMap();
  _isPressed = new WeakMap();
  _deltaX = new WeakMap();
  _deltaY = new WeakMap();
  _windowResizeRef = new WeakMap();
  _arrowPrev = new WeakMap();
  _arrowNext = new WeakMap();
  _arrowNextRef = new WeakMap();
  _arrowPrevRef = new WeakMap();
  _touchStartRef = new WeakMap();
  _touchMoveRef = new WeakMap();
  _touchReleaseRef = new WeakMap();
  _xStart = new WeakMap();
  _yStart = new WeakMap();
  _indicators = new WeakMap();
  _autoplayInterval = new WeakMap();
  _pointerType = new WeakMap();
  _getChildren = new WeakSet();
  getChildren_fn = function() {
    return Array.from(this.el.children).reduce((acc, child) => {
      if (child.classList.contains("caroulix-item"))
        acc.push(child);
      if (child.classList.contains("caroulix-prev"))
        __privateSet(this, _arrowPrev, child);
      if (child.classList.contains("caroulix-next"))
        __privateSet(this, _arrowNext, child);
      return acc;
    }, []);
  };
  _waitForLoad = new WeakSet();
  waitForLoad_fn = function() {
    __privateSet(this, _totalMediaToLoad, 0);
    __privateSet(this, _loadedMediaCount, 0);
    __privateGet(this, _children).forEach((item) => {
      const media = item.querySelector("img, video");
      if (media) {
        __privateWrapper(this, _totalMediaToLoad)._++;
        if (media.complete) {
          __privateMethod(this, _newItemLoaded, newItemLoaded_fn).call(this, media, true);
        } else {
          media.loadRef = __privateMethod(this, _newItemLoaded, newItemLoaded_fn).bind(this, media);
          media.addEventListener("load", media.loadRef);
        }
      }
    });
  };
  _newItemLoaded = new WeakSet();
  newItemLoaded_fn = function(media, alreadyLoad) {
    __privateWrapper(this, _loadedMediaCount)._++;
    if (!alreadyLoad) {
      media.removeEventListener("load", media.loadRef);
      media.loadRef = void 0;
    }
    if (__privateGet(this, _totalMediaToLoad) == __privateGet(this, _loadedMediaCount)) {
      __privateMethod(this, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn).call(this);
      __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this, true);
    }
  };
  _setItemsPosition = new WeakSet();
  setItemsPosition_fn = function(init = false) {
    const caroulixWidth = this.el.getBoundingClientRect().width;
    __privateGet(this, _children).forEach((child, index) => {
      child.style.transform = `translateX(${caroulixWidth * index - caroulixWidth * this.activeIndex - __privateGet(this, _draggedPositionX)}px)`;
    });
    if (this.options.indicators.enabled)
      __privateMethod(this, _resetIndicators, resetIndicators_fn).call(this);
    const activeElement = __privateGet(this, _children).find((child) => child.classList.contains("active"));
    activeElement.classList.remove("active");
    __privateGet(this, _children)[this.activeIndex].classList.add("active");
    setTimeout(() => {
      __privateSet(this, _isAnimated, false);
    }, this.options.animationDuration);
    if (init)
      setTimeout(() => __privateMethod(this, _setTransitionDuration, setTransitionDuration_fn).call(this, this.options.animationDuration), 50);
  };
  _setBasicCaroulixHeight = new WeakSet();
  setBasicCaroulixHeight_fn = function() {
    __privateSet(this, _isResizing, true);
    this.el.style.transitionDuration = "";
    if (this.options.autoplay.enabled)
      this.play();
    if (this.options.height) {
      this.el.style.height = this.options.height;
    } else {
      const childrenHeight = __privateGet(this, _children).map((child) => child.offsetHeight);
      const maxHeight = Math.max(...childrenHeight);
      this.el.style.height = maxHeight + "px";
    }
    __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
    setTimeout(() => {
      this.el.style.transitionDuration = this.options.animationDuration + "ms";
      __privateSet(this, _isResizing, false);
    }, 50);
  };
  _handleDragStart = new WeakSet();
  handleDragStart_fn = function(e) {
    if (e.target.closest(".caroulix-arrow") || e.target.closest(".caroulix-indicators") || __privateGet(this, _isAnimated))
      return;
    if (e.type !== "touchstart")
      e.preventDefault();
    if (this.options.autoplay.enabled)
      this.stop();
    __privateMethod(this, _setTransitionDuration, setTransitionDuration_fn).call(this, 0);
    __privateSet(this, _isPressed, true);
    __privateSet(this, _isScrolling, false);
    __privateSet(this, _deltaX, 0);
    __privateSet(this, _deltaY, 0);
    __privateSet(this, _xStart, __privateMethod(this, _getXPosition, getXPosition_fn).call(this, e));
    __privateSet(this, _yStart, __privateMethod(this, _getYPosition, getYPosition_fn).call(this, e));
  };
  _handleDragMove = new WeakSet();
  handleDragMove_fn = function(e) {
    if (!__privateGet(this, _isPressed) || __privateGet(this, _isScrolling))
      return;
    let x = __privateMethod(this, _getXPosition, getXPosition_fn).call(this, e), y = __privateMethod(this, _getYPosition, getYPosition_fn).call(this, e);
    __privateSet(this, _deltaX, __privateGet(this, _xStart) - x);
    __privateSet(this, _deltaY, Math.abs(__privateGet(this, _yStart) - y));
    if (e.type === "touchmove" && __privateGet(this, _deltaY) > Math.abs(__privateGet(this, _deltaX))) {
      __privateSet(this, _isScrolling, true);
      __privateSet(this, _deltaX, 0);
      return false;
    }
    if (e.cancelable)
      e.preventDefault();
    __privateSet(this, _draggedPositionX, __privateGet(this, _deltaX));
    __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
  };
  _handleDragRelease = new WeakSet();
  handleDragRelease_fn = function(e) {
    if (e.target.closest(".caroulix-arrow") || e.target.closest(".caroulix-indicators"))
      return;
    if (e.cancelable)
      e.preventDefault();
    if (__privateGet(this, _isPressed)) {
      __privateMethod(this, _setTransitionDuration, setTransitionDuration_fn).call(this, this.options.animationDuration);
      let caroulixWidth = this.el.getBoundingClientRect().width;
      __privateSet(this, _isPressed, false);
      const percent = caroulixWidth * 15 / 100;
      if (this.activeIndex !== __privateGet(this, _children).length - 1 && __privateGet(this, _deltaX) > percent) {
        this.next();
      } else if (this.activeIndex !== 0 && __privateGet(this, _deltaX) < -percent) {
        this.prev();
      }
      __privateSet(this, _deltaX, 0);
      __privateSet(this, _draggedPositionX, 0);
      __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
      if (this.options.autoplay.enabled)
        this.play();
    }
  };
  _enableIndicators = new WeakSet();
  enableIndicators_fn = function() {
    __privateSet(this, _indicators, document.createElement("ul"));
    __privateGet(this, _indicators).classList.add("caroulix-indicators");
    if (this.options.indicators.isFlat)
      __privateGet(this, _indicators).classList.add("caroulix-flat");
    if (this.options.indicators.customClasses)
      __privateGet(this, _indicators).className = `${__privateGet(this, _indicators).className} ${this.options.indicators.customClasses}`;
    for (let i = 0; i < __privateGet(this, _children).length; i++) {
      const li = document.createElement("li");
      li.triggerRef = __privateMethod(this, _handleIndicatorClick, handleIndicatorClick_fn).bind(this, i);
      li.addEventListener("click", li.triggerRef);
      __privateGet(this, _indicators).appendChild(li);
    }
    this.el.appendChild(__privateGet(this, _indicators));
  };
  _handleIndicatorClick = new WeakSet();
  handleIndicatorClick_fn = function(i, e) {
    e.preventDefault();
    if (i === this.activeIndex)
      return;
    this.goTo(i);
  };
  _resetIndicators = new WeakSet();
  resetIndicators_fn = function() {
    Array.from(__privateGet(this, _indicators).children).forEach((li) => li.removeAttribute("class"));
    __privateGet(this, _indicators).children[this.activeIndex].classList.add("active");
  };
  _getXPosition = new WeakSet();
  getXPosition_fn = function(e) {
    if (e.targetTouches && e.targetTouches.length >= 1)
      return e.targetTouches[0].clientX;
    return e.clientX;
  };
  _getYPosition = new WeakSet();
  getYPosition_fn = function(e) {
    if (e.targetTouches && e.targetTouches.length >= 1)
      return e.targetTouches[0].clientY;
    return e.clientY;
  };
  _setTransitionDuration = new WeakSet();
  setTransitionDuration_fn = function(duration) {
    this.el.style.transitionDuration = duration + "ms";
  };
  _emitSlideEvent = new WeakSet();
  emitSlideEvent_fn = function() {
    createEvent(this.el, "caroulix.slide", {
      nextElement: __privateGet(this, _children)[this.activeIndex],
      currentElement: __privateGet(this, _children)[__privateGet(this, _children).findIndex((child) => child.classList.contains("active"))]
    });
  };
  __publicField(Caroulix, "getDefaultOptions", () => CaroulixOptions);
  registerComponent({
    class: Caroulix,
    name: "Caroulix",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".caroulix"
    }
  });
  const CollapsibleOptions = {
    animationDuration: 300,
    sidenav: {
      activeClass: true,
      activeWhenOpen: true,
      autoClose: true
    }
  };
  class Collapsible extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _handleResize);
      __privateAdd(this, _detectSidenav);
      __privateAdd(this, _addActiveInSidenav);
      __privateAdd(this, _toggleTriggerActive);
      __privateAdd(this, _autoClose);
      __privateAdd(this, _applyOverflow);
      __privateAdd(this, _onClickTrigger);
      __publicField(this, "options");
      __privateAdd(this, _triggers, void 0);
      __privateAdd(this, _sidenavTriggers, void 0);
      __privateAdd(this, _isInit, true);
      __privateAdd(this, _isActive, false);
      __privateAdd(this, _isAnimated2, false);
      __privateAdd(this, _childIsActive, false);
      __privateAdd(this, _listenerRef, void 0);
      __privateAdd(this, _resizeRef, void 0);
      __privateAdd(this, _sidenavId, void 0);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Collapsible", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Collapsible", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Collapsible init error", error);
      }
    }
    setup() {
      createEvent(this.el, "collapsible.setup");
      __privateSet(this, _triggers, getTriggers(this.el.id));
      __privateSet(this, _isInit, true);
      __privateSet(this, _isActive, this.el.classList.contains("active") ? true : false);
      __privateSet(this, _isAnimated2, false);
      __privateSet(this, _sidenavId, "");
      __privateSet(this, _childIsActive, false);
      this.setupListeners();
      this.el.style.transitionDuration = this.options.animationDuration + "ms";
      __privateMethod(this, _detectSidenav, detectSidenav_fn).call(this);
      __privateSet(this, _childIsActive, this.el.querySelector(".active") ? true : false);
      if (this.options.sidenav.activeClass)
        __privateMethod(this, _addActiveInSidenav, addActiveInSidenav_fn).call(this);
      if (__privateGet(this, _isActive))
        this.open();
      __privateSet(this, _isInit, false);
    }
    setupListeners() {
      __privateSet(this, _listenerRef, __privateMethod(this, _onClickTrigger, onClickTrigger_fn).bind(this));
      __privateGet(this, _triggers).forEach((trigger) => trigger.addEventListener("click", __privateGet(this, _listenerRef)));
      __privateSet(this, _resizeRef, __privateMethod(this, _handleResize, handleResize_fn).bind(this));
      window.addEventListener("resize", __privateGet(this, _resizeRef));
    }
    removeListeners() {
      __privateGet(this, _triggers).forEach((trigger) => trigger.removeEventListener("click", __privateGet(this, _listenerRef)));
      __privateSet(this, _listenerRef, void 0);
      window.removeEventListener("resize", __privateGet(this, _resizeRef));
      __privateSet(this, _resizeRef, void 0);
    }
    open() {
      if (__privateGet(this, _isActive) && !__privateGet(this, _isInit))
        return;
      createEvent(this.el, "collapsible.open");
      __privateSet(this, _isActive, true);
      __privateSet(this, _isAnimated2, true);
      this.el.style.display = "block";
      __privateMethod(this, _applyOverflow, applyOverflow_fn).call(this);
      this.el.style.maxHeight = this.el.scrollHeight + "px";
      if (this.options.sidenav.activeWhenOpen)
        __privateMethod(this, _toggleTriggerActive, toggleTriggerActive_fn).call(this, true);
      if (this.options.sidenav.autoClose)
        __privateMethod(this, _autoClose, autoClose_fn).call(this);
      setTimeout(() => {
        __privateSet(this, _isAnimated2, false);
      }, this.options.animationDuration);
    }
    close() {
      if (!__privateGet(this, _isActive))
        return;
      createEvent(this.el, "collapsible.close");
      __privateSet(this, _isAnimated2, true);
      this.el.style.maxHeight = "";
      __privateMethod(this, _applyOverflow, applyOverflow_fn).call(this);
      if (this.options.sidenav.activeWhenOpen)
        __privateMethod(this, _toggleTriggerActive, toggleTriggerActive_fn).call(this, false);
      setTimeout(() => {
        this.el.style.display = "";
        __privateSet(this, _isAnimated2, false);
        __privateSet(this, _isActive, false);
      }, this.options.animationDuration);
    }
  }
  _triggers = new WeakMap();
  _sidenavTriggers = new WeakMap();
  _isInit = new WeakMap();
  _isActive = new WeakMap();
  _isAnimated2 = new WeakMap();
  _childIsActive = new WeakMap();
  _listenerRef = new WeakMap();
  _resizeRef = new WeakMap();
  _sidenavId = new WeakMap();
  _handleResize = new WeakSet();
  handleResize_fn = function() {
    if (__privateGet(this, _isActive) && !__privateGet(this, _sidenavId))
      this.el.style.maxHeight = this.el.scrollHeight + "px";
  };
  _detectSidenav = new WeakSet();
  detectSidenav_fn = function() {
    const sidenavElem = this.el.closest(".sidenav");
    if (sidenavElem) {
      __privateSet(this, _sidenavId, sidenavElem.id);
      __privateSet(this, _sidenavTriggers, __privateGet(this, _triggers).filter((t) => {
        var _a;
        return ((_a = t.closest(".sidenav")) == null ? void 0 : _a.id) === sidenavElem.id;
      }));
    }
  };
  _addActiveInSidenav = new WeakSet();
  addActiveInSidenav_fn = function() {
    if (!__privateGet(this, _childIsActive) || !__privateGet(this, _sidenavId))
      return;
    __privateGet(this, _sidenavTriggers).forEach((trigger) => trigger.classList.add("active"));
    this.el.classList.add("active");
    this.open();
    __privateSet(this, _isActive, true);
  };
  _toggleTriggerActive = new WeakSet();
  toggleTriggerActive_fn = function(state) {
    if (!__privateGet(this, _sidenavId))
      return;
    __privateGet(this, _sidenavTriggers).forEach((trigger) => {
      if (state)
        trigger.classList.add("active");
      else
        trigger.classList.remove("active");
    });
  };
  _autoClose = new WeakSet();
  autoClose_fn = function() {
    if (!__privateGet(this, _isInit) && __privateGet(this, _sidenavId)) {
      getInstanceByType("Collapsible").forEach((collapsible2) => {
        if (__privateGet(collapsible2, _sidenavId) === __privateGet(this, _sidenavId) && collapsible2.el.id !== this.el.id)
          collapsible2.close();
      });
    }
  };
  _applyOverflow = new WeakSet();
  applyOverflow_fn = function() {
    this.el.style.overflow = "hidden";
    setTimeout(() => {
      this.el.style.overflow = "";
    }, this.options.animationDuration);
  };
  _onClickTrigger = new WeakSet();
  onClickTrigger_fn = function(e) {
    e.preventDefault();
    if (__privateGet(this, _isAnimated2))
      return;
    if (__privateGet(this, _isActive))
      this.close();
    else
      this.open();
  };
  __publicField(Collapsible, "getDefaultOptions", () => CollapsibleOptions);
  registerComponent({
    class: Collapsible,
    name: "Collapsible",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".collapsible"
    }
  });
  const SidenavOptions = {
    overlay: true,
    bodyScrolling: false,
    animationDuration: 300
  };
  class Sidenav extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _resizeHandler);
      __privateAdd(this, _cleanLayout);
      __privateAdd(this, _handleMultipleSidenav);
      __privateAdd(this, _toggleBodyScroll);
      __privateAdd(this, _onClickTrigger2);
      __publicField(this, "options");
      __privateAdd(this, _triggers2, void 0);
      __privateAdd(this, _isActive2, false);
      __privateAdd(this, _isAnimated3, false);
      __privateAdd(this, _isFixed, false);
      __privateAdd(this, _firstSidenavInit, false);
      __privateAdd(this, _layoutEl, void 0);
      __privateAdd(this, _overlayElement, void 0);
      __privateAdd(this, _listenerRef2, void 0);
      __privateAdd(this, _windowResizeRef2, void 0);
      __privateAdd(this, _windowWidth, void 0);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Sidenav", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Sidenav", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Sidenav init error", error);
      }
    }
    setup() {
      createEvent(this.el, "sidenav.setup");
      __privateSet(this, _triggers2, getTriggers(this.el.id));
      __privateSet(this, _isActive2, false);
      __privateSet(this, _isAnimated3, false);
      __privateSet(this, _windowWidth, window.innerWidth);
      __privateSet(this, _isFixed, this.el.classList.contains("sidenav-fixed"));
      const sidenavFixed = getInstanceByType("Sidenav").find((sidenav2) => __privateGet(sidenav2, _isFixed));
      __privateSet(this, _firstSidenavInit, sidenavFixed && sidenavFixed.el === this.el);
      __privateSet(this, _layoutEl, document.querySelector('.layout, [class*="layout-"]'));
      if (__privateGet(this, _layoutEl) && __privateGet(this, _firstSidenavInit))
        __privateMethod(this, _cleanLayout, cleanLayout_fn).call(this);
      this.setupListeners();
      if (this.options.overlay)
        __privateSet(this, _overlayElement, createOverlay(__privateGet(this, _isActive2), this.options.overlay, this.el.id, this.options.animationDuration));
      if (__privateGet(this, _layoutEl) && __privateGet(this, _isFixed))
        __privateMethod(this, _handleMultipleSidenav, handleMultipleSidenav_fn).call(this);
      this.el.style.transitionDuration = this.options.animationDuration + "ms";
    }
    setupListeners() {
      __privateSet(this, _listenerRef2, __privateMethod(this, _onClickTrigger2, onClickTrigger_fn2).bind(this));
      __privateGet(this, _triggers2).forEach((trigger) => trigger.addEventListener("click", __privateGet(this, _listenerRef2)));
      __privateSet(this, _windowResizeRef2, __privateMethod(this, _resizeHandler, resizeHandler_fn).bind(this));
      window.addEventListener("resize", __privateGet(this, _windowResizeRef2));
    }
    removeListeners() {
      __privateGet(this, _triggers2).forEach((trigger) => trigger.removeEventListener("click", __privateGet(this, _listenerRef2)));
      __privateSet(this, _listenerRef2, void 0);
      window.removeEventListener("resize", __privateGet(this, _windowResizeRef2));
      __privateSet(this, _windowResizeRef2, void 0);
    }
    destroy() {
      createEvent(this.el, "component.destroy");
      this.removeListeners();
      if (__privateGet(this, _layoutEl))
        __privateMethod(this, _cleanLayout, cleanLayout_fn).call(this);
      const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
      instances.splice(index, 1);
    }
    open() {
      if (__privateGet(this, _isActive2) || __privateGet(this, _isAnimated3))
        return;
      createEvent(this.el, "sidenav.open");
      __privateSet(this, _isActive2, true);
      __privateSet(this, _isAnimated3, true);
      this.el.classList.add("active");
      updateOverlay(this.options.overlay, __privateGet(this, _overlayElement), __privateGet(this, _listenerRef2), true, this.options.animationDuration);
      __privateMethod(this, _toggleBodyScroll, toggleBodyScroll_fn).call(this, false);
      setTimeout(() => {
        __privateSet(this, _isAnimated3, false);
        createEvent(this.el, "sidenav.opened");
      }, this.options.animationDuration);
    }
    close() {
      if (!__privateGet(this, _isActive2) || __privateGet(this, _isAnimated3))
        return;
      __privateSet(this, _isAnimated3, true);
      createEvent(this.el, "sidenav.close");
      this.el.classList.remove("active");
      updateOverlay(this.options.overlay, __privateGet(this, _overlayElement), __privateGet(this, _listenerRef2), false, this.options.animationDuration);
      setTimeout(() => {
        __privateMethod(this, _toggleBodyScroll, toggleBodyScroll_fn).call(this, true);
        __privateSet(this, _isActive2, false);
        __privateSet(this, _isAnimated3, false);
        createEvent(this.el, "sidenav.closed");
      }, this.options.animationDuration);
    }
  }
  _triggers2 = new WeakMap();
  _isActive2 = new WeakMap();
  _isAnimated3 = new WeakMap();
  _isFixed = new WeakMap();
  _firstSidenavInit = new WeakMap();
  _layoutEl = new WeakMap();
  _overlayElement = new WeakMap();
  _listenerRef2 = new WeakMap();
  _windowResizeRef2 = new WeakMap();
  _windowWidth = new WeakMap();
  _resizeHandler = new WeakSet();
  resizeHandler_fn = function(e) {
    const target = e.target;
    const width = target.innerWidth;
    if (__privateGet(this, _windowWidth) !== width)
      this.close();
    __privateSet(this, _windowWidth, width);
  };
  _cleanLayout = new WeakSet();
  cleanLayout_fn = function() {
    ["layout-sidenav-right", "layout-sidenav-both"].forEach((classes) => __privateGet(this, _layoutEl).classList.remove(classes));
  };
  _handleMultipleSidenav = new WeakSet();
  handleMultipleSidenav_fn = function() {
    if (!__privateGet(this, _firstSidenavInit))
      return;
    const sidenavs = Array.from(document.querySelectorAll(".sidenav")).filter((sidenav2) => sidenav2.classList.contains("sidenav-fixed"));
    const { sidenavsRight, sidenavsLeft } = sidenavs.reduce((acc, sidenav2) => {
      sidenav2.classList.contains("sidenav-right") ? acc.sidenavsRight.push(sidenav2) : acc.sidenavsLeft.push(sidenav2);
      return acc;
    }, { sidenavsRight: [], sidenavsLeft: [] });
    const isBoth = sidenavsLeft.length > 0 && sidenavsRight.length > 0;
    if (sidenavsRight.length > 0 && !isBoth)
      __privateGet(this, _layoutEl).classList.add("layout-sidenav-right");
    else if (isBoth)
      __privateGet(this, _layoutEl).classList.add("layout-sidenav-both");
  };
  _toggleBodyScroll = new WeakSet();
  toggleBodyScroll_fn = function(state) {
    if (!this.options.bodyScrolling)
      document.body.style.overflow = state ? "" : "hidden";
  };
  _onClickTrigger2 = new WeakSet();
  onClickTrigger_fn2 = function(e) {
    e.preventDefault();
    if (__privateGet(this, _isFixed) && window.innerWidth >= 960)
      return;
    if (__privateGet(this, _isActive2))
      this.close();
    else
      this.open();
  };
  __publicField(Sidenav, "getDefaultOptions", () => SidenavOptions);
  registerComponent({
    class: Sidenav,
    name: "Sidenav",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".sidenav"
    }
  });
  const DropdownOptions = {
    animationDuration: 300,
    animationType: "none",
    hover: false,
    autoClose: true,
    preventViewport: false,
    closeOnClick: true
  };
  class Dropdown extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _setupAnimation);
      __privateAdd(this, _onDocumentClick);
      __privateAdd(this, _onClickTrigger3);
      __privateAdd(this, _autoClose2);
      __privateAdd(this, _setContentHeight);
      __publicField(this, "options");
      __privateAdd(this, _dropdownContent, void 0);
      __privateAdd(this, _trigger, void 0);
      __privateAdd(this, _isAnimated4, false);
      __privateAdd(this, _isActive3, false);
      __privateAdd(this, _documentClickRef, void 0);
      __privateAdd(this, _listenerRef3, void 0);
      __privateAdd(this, _contentHeightRef, void 0);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Dropdown", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Dropdown", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Dropdown init error", error);
      }
    }
    setup() {
      createEvent(this.el, "dropdown.setup");
      __privateSet(this, _dropdownContent, this.el.querySelector(".dropdown-content"));
      __privateSet(this, _trigger, getTriggers(this.el.id)[0]);
      __privateSet(this, _isAnimated4, false);
      __privateSet(this, _isActive3, this.el.classList.contains("active") ? true : false);
      if (this.options.hover)
        this.el.classList.add("active-hover");
      else
        this.setupListeners();
      if (this.options.preventViewport)
        this.el.classList.add("dropdown-vp");
      __privateMethod(this, _setupAnimation, setupAnimation_fn).call(this);
    }
    setupListeners() {
      if (this.options.hover)
        return;
      __privateSet(this, _listenerRef3, __privateMethod(this, _onClickTrigger3, onClickTrigger_fn3).bind(this));
      __privateGet(this, _trigger).addEventListener("click", __privateGet(this, _listenerRef3));
      __privateSet(this, _documentClickRef, __privateMethod(this, _onDocumentClick, onDocumentClick_fn).bind(this));
      document.addEventListener("click", __privateGet(this, _documentClickRef), true);
      __privateSet(this, _contentHeightRef, __privateMethod(this, _setContentHeight, setContentHeight_fn).bind(this));
      if (this.options.preventViewport)
        window.addEventListener("scroll", __privateGet(this, _contentHeightRef));
    }
    removeListeners() {
      if (this.options.hover)
        return;
      __privateGet(this, _trigger).removeEventListener("click", __privateGet(this, _listenerRef3));
      __privateSet(this, _listenerRef3, void 0);
      document.removeEventListener("click", __privateGet(this, _documentClickRef), true);
      __privateSet(this, _documentClickRef, void 0);
      if (this.options.preventViewport)
        window.removeEventListener("scroll", __privateGet(this, _contentHeightRef));
      __privateSet(this, _contentHeightRef, void 0);
    }
    open() {
      if (__privateGet(this, _isActive3))
        return;
      createEvent(this.el, "dropdown.open");
      __privateGet(this, _dropdownContent).style.display = "flex";
      if (this.options.preventViewport)
        __privateMethod(this, _setContentHeight, setContentHeight_fn).call(this);
      setTimeout(() => {
        this.el.classList.add("active");
        __privateSet(this, _isActive3, true);
      }, 10);
      if (this.options.autoClose)
        __privateMethod(this, _autoClose2, autoClose_fn2).call(this);
      if (this.options.animationType !== "none") {
        __privateSet(this, _isAnimated4, true);
        setTimeout(() => {
          __privateSet(this, _isAnimated4, false);
          createEvent(this.el, "dropdown.opened");
        }, this.options.animationDuration);
      } else {
        createEvent(this.el, "dropdown.opened");
      }
    }
    close() {
      if (!__privateGet(this, _isActive3))
        return;
      createEvent(this.el, "dropdown.close");
      this.el.classList.remove("active");
      if (this.options.animationType !== "none") {
        __privateSet(this, _isAnimated4, true);
        setTimeout(() => {
          __privateGet(this, _dropdownContent).style.display = "";
          __privateSet(this, _isAnimated4, false);
          __privateSet(this, _isActive3, false);
          createEvent(this.el, "dropdown.closed");
        }, this.options.animationDuration);
      } else {
        __privateGet(this, _dropdownContent).style.display = "";
        __privateSet(this, _isActive3, false);
        createEvent(this.el, "dropdown.closed");
      }
    }
  }
  _dropdownContent = new WeakMap();
  _trigger = new WeakMap();
  _isAnimated4 = new WeakMap();
  _isActive3 = new WeakMap();
  _documentClickRef = new WeakMap();
  _listenerRef3 = new WeakMap();
  _contentHeightRef = new WeakMap();
  _setupAnimation = new WeakSet();
  setupAnimation_fn = function() {
    const animationList = ["none", "fade"];
    this.options.animationType = this.options.animationType.toLowerCase();
    if (!animationList.includes(this.options.animationType))
      this.options.animationType = "none";
    if (this.options.animationType === "fade" && !this.options.hover) {
      __privateGet(this, _dropdownContent).style.transitionDuration = this.options.animationDuration + "ms";
      this.el.classList.add("dropdown-anim-fade");
    }
  };
  _onDocumentClick = new WeakSet();
  onDocumentClick_fn = function(e) {
    if (e.target === __privateGet(this, _trigger) || __privateGet(this, _isAnimated4) || !__privateGet(this, _isActive3) || !this.options.closeOnClick && e.target.closest(".dropdown-content"))
      return;
    this.close();
  };
  _onClickTrigger3 = new WeakSet();
  onClickTrigger_fn3 = function(e) {
    e.preventDefault();
    if (__privateGet(this, _isAnimated4))
      return;
    if (__privateGet(this, _isActive3))
      this.close();
    else
      this.open();
  };
  _autoClose2 = new WeakSet();
  autoClose_fn2 = function() {
    getInstanceByType("Dropdown").forEach((dropdown2) => {
      if (dropdown2.el.id !== this.el.id)
        dropdown2.close();
    });
  };
  _setContentHeight = new WeakSet();
  setContentHeight_fn = function() {
    const elRect = __privateGet(this, _dropdownContent).getBoundingClientRect();
    const bottom = elRect.height - (elRect.bottom - (window.innerHeight || document.documentElement.clientHeight)) - 10;
    __privateGet(this, _dropdownContent).style.maxHeight = bottom + "px";
  };
  __publicField(Dropdown, "getDefaultOptions", () => DropdownOptions);
  registerComponent({
    class: Dropdown,
    name: "Dropdown",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".dropdown"
    }
  });
  const FabOptions = {
    animationDuration: 300,
    hover: true,
    direction: "top",
    position: "bottom-right",
    offsetX: "1rem",
    offsetY: "1.5rem"
  };
  class Fab extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _verifOptions);
      __privateAdd(this, _setProperties);
      __privateAdd(this, _setMenuPosition);
      __privateAdd(this, _handleDocumentClick);
      __privateAdd(this, _onClickTrigger4);
      __publicField(this, "options");
      __privateAdd(this, _isAnimated5, false);
      __privateAdd(this, _isActive4, false);
      __privateAdd(this, _trigger2, void 0);
      __privateAdd(this, _fabMenu, void 0);
      __privateAdd(this, _openRef, void 0);
      __privateAdd(this, _closeRef, void 0);
      __privateAdd(this, _documentClickRef2, void 0);
      __privateAdd(this, _listenerRef4, void 0);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Fab", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Fab", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Fab init error", error);
      }
    }
    setup() {
      createEvent(this.el, "fab.setup");
      __privateSet(this, _isAnimated5, false);
      __privateSet(this, _isActive4, false);
      __privateSet(this, _trigger2, getTriggers(this.el.id)[0]);
      __privateSet(this, _fabMenu, this.el.querySelector(".fab-menu"));
      __privateMethod(this, _verifOptions, verifOptions_fn).call(this);
      this.setupListeners();
      this.el.style.transitionDuration = this.options.animationDuration + "ms";
      __privateMethod(this, _setProperties, setProperties_fn).call(this);
    }
    setupListeners() {
      if (this.options.hover) {
        __privateSet(this, _openRef, this.open.bind(this));
        __privateSet(this, _closeRef, this.close.bind(this));
        this.el.addEventListener("mouseenter", __privateGet(this, _openRef));
        this.el.addEventListener("mouseleave", __privateGet(this, _closeRef));
      } else {
        __privateSet(this, _listenerRef4, __privateMethod(this, _onClickTrigger4, onClickTrigger_fn4).bind(this));
        this.el.addEventListener("click", __privateGet(this, _listenerRef4));
      }
      __privateSet(this, _documentClickRef2, __privateMethod(this, _handleDocumentClick, handleDocumentClick_fn).bind(this));
      document.addEventListener("click", __privateGet(this, _documentClickRef2), true);
    }
    removeListeners() {
      if (this.options.hover) {
        this.el.removeEventListener("mouseenter", __privateGet(this, _openRef));
        this.el.removeEventListener("mouseleave", __privateGet(this, _closeRef));
        __privateSet(this, _openRef, void 0);
        __privateSet(this, _closeRef, void 0);
      } else {
        this.el.removeEventListener("click", __privateGet(this, _listenerRef4));
        __privateSet(this, _listenerRef4, void 0);
      }
      document.removeEventListener("click", __privateGet(this, _documentClickRef2), true);
      __privateSet(this, _documentClickRef2, void 0);
    }
    open() {
      if (__privateGet(this, _isActive4))
        return;
      createEvent(this.el, "fab.open");
      __privateSet(this, _isAnimated5, true);
      __privateSet(this, _isActive4, true);
      this.el.classList.add("active");
      setTimeout(() => {
        __privateSet(this, _isAnimated5, false);
      }, this.options.animationDuration);
    }
    close() {
      if (!__privateGet(this, _isActive4))
        return;
      createEvent(this.el, "fab.close");
      __privateSet(this, _isAnimated5, true);
      __privateSet(this, _isActive4, false);
      this.el.classList.remove("active");
      setTimeout(() => {
        __privateSet(this, _isAnimated5, false);
      }, this.options.animationDuration);
    }
  }
  _isAnimated5 = new WeakMap();
  _isActive4 = new WeakMap();
  _trigger2 = new WeakMap();
  _fabMenu = new WeakMap();
  _openRef = new WeakMap();
  _closeRef = new WeakMap();
  _documentClickRef2 = new WeakMap();
  _listenerRef4 = new WeakMap();
  _verifOptions = new WeakSet();
  verifOptions_fn = function() {
    const directionList = ["right", "left", "top", "bottom"];
    if (!directionList.includes(this.options.direction))
      this.options.direction = "top";
    const positionList = ["top-right", "top-left", "bottom-right", "bottom-left"];
    if (!positionList.includes(this.options.position))
      this.options.position = "bottom-right";
  };
  _setProperties = new WeakSet();
  setProperties_fn = function() {
    if (this.options.position.split("-")[0] === "top")
      this.el.style.top = this.options.offsetY;
    else
      this.el.style.bottom = this.options.offsetY;
    if (this.options.position.split("-")[1] === "right")
      this.el.style.right = this.options.offsetX;
    else
      this.el.style.left = this.options.offsetX;
    if (this.options.direction === "right" || this.options.direction === "left")
      this.el.classList.add("fab-dir-x");
    __privateMethod(this, _setMenuPosition, setMenuPosition_fn).call(this);
  };
  _setMenuPosition = new WeakSet();
  setMenuPosition_fn = function() {
    if (this.options.direction === "top" || this.options.direction === "bottom") {
      const height = __privateGet(this, _trigger2).clientHeight;
      if (this.options.direction === "top")
        __privateGet(this, _fabMenu).style.bottom = height + "px";
      else
        __privateGet(this, _fabMenu).style.top = height + "px";
    } else {
      const width = __privateGet(this, _trigger2).clientWidth;
      if (this.options.direction === "right")
        __privateGet(this, _fabMenu).style.left = width + "px";
      else
        __privateGet(this, _fabMenu).style.right = width + "px";
    }
  };
  _handleDocumentClick = new WeakSet();
  handleDocumentClick_fn = function(e) {
    const isInside = this.el.contains(e.target);
    if (!isInside && __privateGet(this, _isActive4))
      this.close();
  };
  _onClickTrigger4 = new WeakSet();
  onClickTrigger_fn4 = function(e) {
    e.preventDefault();
    if (__privateGet(this, _isAnimated5))
      return;
    if (__privateGet(this, _isActive4))
      this.close();
    else
      this.open();
  };
  __publicField(Fab, "getDefaultOptions", () => FabOptions);
  registerComponent({
    class: Fab,
    name: "Fab",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".fab:not(i)"
    }
  });
  const LightboxOptions = {
    animationDuration: 400,
    overlayClass: "grey dark-4",
    offset: 150,
    mobileOffset: 80,
    caption: ""
  };
  class Lightbox extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _setOverlay);
      __privateAdd(this, _showOverlay);
      __privateAdd(this, _hideOverlay);
      __privateAdd(this, _unsetOverlay);
      __privateAdd(this, _calculateRatio);
      __privateAdd(this, _setOverflowParents);
      __privateAdd(this, _unsetOverflowParents);
      __privateAdd(this, _handleTransition);
      __privateAdd(this, _handleKeyUp);
      __privateAdd(this, _handleScroll);
      __privateAdd(this, _clearLightbox);
      __privateAdd(this, _onClickTrigger5);
      __publicField(this, "options");
      __privateAdd(this, _onClickRef, void 0);
      __privateAdd(this, _transitionEndEventRef, void 0);
      __privateAdd(this, _keyUpRef, void 0);
      __privateAdd(this, _scrollRef, void 0);
      __privateAdd(this, _resizeRef2, void 0);
      __privateAdd(this, _overlay, void 0);
      __privateAdd(this, _overlayClickEventRef, void 0);
      __privateAdd(this, _overflowParents, void 0);
      __privateAdd(this, _baseRect, void 0);
      __privateAdd(this, _newHeight, 0);
      __privateAdd(this, _newWidth, 0);
      __privateAdd(this, _isActive5, false);
      __privateAdd(this, _isResponsive, false);
      __privateAdd(this, _container, void 0);
      __privateAdd(this, _isClosing, false);
      __privateAdd(this, _isOpening, false);
      __privateAdd(this, _handleResize2, () => {
        if (__privateGet(this, _isActive5))
          this.close();
      });
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Lightbox", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Lightbox", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Lightbox init error", error);
      }
    }
    setup() {
      createEvent(this.el, "lightbox.setup");
      this.el.style.transitionDuration = this.options.animationDuration + "ms";
      __privateSet(this, _container, wrap([this.el]));
      this.setupListeners();
    }
    setupListeners() {
      __privateSet(this, _onClickRef, __privateMethod(this, _onClickTrigger5, onClickTrigger_fn5).bind(this));
      this.el.addEventListener("click", __privateGet(this, _onClickRef));
      __privateSet(this, _keyUpRef, __privateMethod(this, _handleKeyUp, handleKeyUp_fn).bind(this));
      __privateSet(this, _scrollRef, __privateMethod(this, _handleScroll, handleScroll_fn).bind(this));
      __privateSet(this, _resizeRef2, __privateGet(this, _handleResize2).bind(this));
      __privateSet(this, _transitionEndEventRef, __privateMethod(this, _handleTransition, handleTransition_fn).bind(this));
      window.addEventListener("keyup", __privateGet(this, _keyUpRef));
      window.addEventListener("scroll", __privateGet(this, _scrollRef));
      window.addEventListener("resize", __privateGet(this, _resizeRef2));
      this.el.addEventListener("transitionend", __privateGet(this, _transitionEndEventRef));
    }
    removeListeners() {
      this.el.removeEventListener("click", __privateGet(this, _onClickRef));
      this.el.removeEventListener("transitionend", __privateGet(this, _transitionEndEventRef));
      window.removeEventListener("keyup", __privateGet(this, _keyUpRef));
      window.removeEventListener("scroll", __privateGet(this, _scrollRef));
      window.removeEventListener("resize", __privateGet(this, _resizeRef2));
      __privateSet(this, _onClickRef, void 0);
      __privateSet(this, _keyUpRef, void 0);
      __privateSet(this, _scrollRef, void 0);
      __privateSet(this, _resizeRef2, void 0);
      __privateSet(this, _transitionEndEventRef, void 0);
    }
    open() {
      __privateSet(this, _isOpening, true);
      let rect, containerRect;
      if (__privateGet(this, _isClosing)) {
        rect = containerRect = __privateGet(this, _container).getBoundingClientRect();
      } else {
        rect = containerRect = this.el.getBoundingClientRect();
      }
      __privateSet(this, _isClosing, false);
      __privateMethod(this, _setOverlay, setOverlay_fn).call(this);
      __privateMethod(this, _showOverlay, showOverlay_fn).call(this);
      const centerTop = window.innerHeight / 2;
      const centerLeft = window.innerWidth / 2;
      __privateSet(this, _baseRect, rect);
      this.el.style.width = __privateGet(this, _baseRect).width + "px";
      this.el.style.height = __privateGet(this, _baseRect).height + "px";
      this.el.style.top = "0";
      this.el.style.left = "0";
      const newTop = centerTop + window.scrollY - (containerRect.top + window.scrollY);
      const newLeft = centerLeft + window.scrollX - (containerRect.left + window.scrollX);
      __privateMethod(this, _calculateRatio, calculateRatio_fn).call(this);
      __privateGet(this, _container).style.position = "relative";
      setTimeout(() => {
        createEvent(this.el, "lightbox.open");
        __privateSet(this, _isActive5, true);
        if (this.el.classList.contains("responsive-media")) {
          __privateSet(this, _isResponsive, true);
          this.el.classList.remove("responsive-media");
        }
        this.el.classList.add("active");
        __privateGet(this, _container).style.width = __privateGet(this, _baseRect).width + "px";
        __privateGet(this, _container).style.height = __privateGet(this, _baseRect).height + "px";
        this.el.style.width = __privateGet(this, _newWidth) + "px";
        this.el.style.height = __privateGet(this, _newHeight) + "px";
        this.el.style.top = newTop - __privateGet(this, _newHeight) / 2 + "px";
        this.el.style.left = newLeft - __privateGet(this, _newWidth) / 2 + "px";
      }, 50);
    }
    close(e) {
      if ((e == null ? void 0 : e.key) && e.key !== "Escape")
        return;
      __privateSet(this, _isActive5, false);
      __privateSet(this, _isClosing, true);
      __privateSet(this, _isOpening, false);
      createEvent(this.el, "lightbox.close");
      __privateMethod(this, _hideOverlay, hideOverlay_fn).call(this);
      this.el.style.position = "absolute";
      this.el.style.top = "0px";
      this.el.style.left = "0px";
      this.el.style.width = __privateGet(this, _baseRect).width + "px";
      this.el.style.height = __privateGet(this, _baseRect).height + "px";
    }
  }
  _onClickRef = new WeakMap();
  _transitionEndEventRef = new WeakMap();
  _keyUpRef = new WeakMap();
  _scrollRef = new WeakMap();
  _resizeRef2 = new WeakMap();
  _overlay = new WeakMap();
  _overlayClickEventRef = new WeakMap();
  _overflowParents = new WeakMap();
  _baseRect = new WeakMap();
  _newHeight = new WeakMap();
  _newWidth = new WeakMap();
  _isActive5 = new WeakMap();
  _isResponsive = new WeakMap();
  _container = new WeakMap();
  _isClosing = new WeakMap();
  _isOpening = new WeakMap();
  _setOverlay = new WeakSet();
  setOverlay_fn = function() {
    if (__privateGet(this, _overlay)) {
      return;
    }
    __privateMethod(this, _setOverflowParents, setOverflowParents_fn).call(this);
    __privateSet(this, _overlay, document.createElement("div"));
    __privateGet(this, _overlay).style.transitionDuration = this.options.animationDuration + "ms";
    __privateGet(this, _overlay).className = "lightbox-overlay " + this.options.overlayClass;
    __privateGet(this, _container).appendChild(__privateGet(this, _overlay));
    if (this.options.caption) {
      const caption = document.createElement("p");
      caption.className = "lightbox-caption";
      caption.innerHTML = this.options.caption;
      __privateGet(this, _overlay).appendChild(caption);
    }
    __privateSet(this, _overlayClickEventRef, this.close.bind(this));
    __privateGet(this, _overlay).addEventListener("click", __privateGet(this, _overlayClickEventRef));
  };
  _showOverlay = new WeakSet();
  showOverlay_fn = function() {
    setTimeout(() => {
      __privateGet(this, _overlay).style.opacity = "1";
    }, 50);
  };
  _hideOverlay = new WeakSet();
  hideOverlay_fn = function() {
    __privateGet(this, _overlay).style.opacity = "0";
  };
  _unsetOverlay = new WeakSet();
  unsetOverlay_fn = function() {
    __privateGet(this, _overlay).removeEventListener("click", __privateGet(this, _overlayClickEventRef));
    __privateGet(this, _overlay).remove();
    __privateSet(this, _overlay, null);
  };
  _calculateRatio = new WeakSet();
  calculateRatio_fn = function() {
    const offset = window.innerWidth >= 960 ? this.options.offset : this.options.mobileOffset;
    if (window.innerWidth / window.innerHeight >= __privateGet(this, _baseRect).width / __privateGet(this, _baseRect).height) {
      __privateSet(this, _newHeight, window.innerHeight - offset);
      __privateSet(this, _newWidth, __privateGet(this, _newHeight) * __privateGet(this, _baseRect).width / __privateGet(this, _baseRect).height);
    } else {
      __privateSet(this, _newWidth, window.innerWidth - offset);
      __privateSet(this, _newHeight, __privateGet(this, _newWidth) * __privateGet(this, _baseRect).height / __privateGet(this, _baseRect).width);
    }
  };
  _setOverflowParents = new WeakSet();
  setOverflowParents_fn = function() {
    __privateSet(this, _overflowParents, []);
    for (let elem = this.el; elem && elem !== document; elem = elem.parentNode) {
      const elementSyle = window.getComputedStyle(elem);
      if (elementSyle.overflow === "hidden" || elementSyle.overflowX === "hidden" || elementSyle.overflowY === "hidden") {
        __privateGet(this, _overflowParents).push(elem);
        if (elem !== document.body)
          elem.style.setProperty("overflow", "visible", "important");
        document.body.style.overflowX = "hidden";
      }
    }
  };
  _unsetOverflowParents = new WeakSet();
  unsetOverflowParents_fn = function() {
    __privateGet(this, _overflowParents).forEach((parent) => parent.style.overflow = "");
    document.body.style.overflowX = "";
  };
  _handleTransition = new WeakSet();
  handleTransition_fn = function(e) {
    if (!e.propertyName.includes("width") && !e.propertyName.includes("height")) {
      return;
    }
    if (__privateGet(this, _isClosing)) {
      __privateMethod(this, _clearLightbox, clearLightbox_fn).call(this);
      __privateSet(this, _isClosing, false);
      __privateSet(this, _isActive5, false);
      createEvent(this.el, "lightbox.closed");
    } else if (__privateGet(this, _isOpening)) {
      __privateSet(this, _isOpening, false);
      createEvent(this.el, "lightbox.opened");
    }
  };
  _handleKeyUp = new WeakSet();
  handleKeyUp_fn = function(e) {
    if (e.key === "Escape" && (__privateGet(this, _isOpening) || __privateGet(this, _isActive5)))
      this.close();
  };
  _handleScroll = new WeakSet();
  handleScroll_fn = function() {
    if (__privateGet(this, _isActive5) || __privateGet(this, _isOpening))
      this.close();
  };
  _handleResize2 = new WeakMap();
  _clearLightbox = new WeakSet();
  clearLightbox_fn = function() {
    this.el.classList.remove("active");
    __privateMethod(this, _unsetOverlay, unsetOverlay_fn).call(this);
    __privateMethod(this, _unsetOverflowParents, unsetOverflowParents_fn).call(this);
    if (__privateGet(this, _isResponsive))
      this.el.classList.add("responsive-media");
    __privateGet(this, _container).removeAttribute("style");
    this.el.style.position = "";
    this.el.style.left = "";
    this.el.style.top = "";
    this.el.style.width = "";
    this.el.style.height = "";
    this.el.style.transform = "";
  };
  _onClickTrigger5 = new WeakSet();
  onClickTrigger_fn5 = function() {
    if (__privateGet(this, _isOpening) || __privateGet(this, _isActive5)) {
      this.close();
      return;
    }
    this.open();
  };
  __publicField(Lightbox, "getDefaultOptions", () => LightboxOptions);
  registerComponent({
    class: Lightbox,
    name: "Lightbox",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".lightbox"
    }
  });
  const ModalOptions = {
    overlay: true,
    bodyScrolling: false,
    animationDuration: 400
  };
  class Modal extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _toggleBodyScroll2);
      __privateAdd(this, _setZIndex);
      __privateAdd(this, _onClickTrigger6);
      __publicField(this, "options");
      __publicField(this, "overlayElement");
      __privateAdd(this, _triggers3, void 0);
      __privateAdd(this, _isActive6, false);
      __privateAdd(this, _isAnimated6, false);
      __privateAdd(this, _listenerRef5, void 0);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Modal", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Modal", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Modal init error", error);
      }
    }
    setup() {
      createEvent(this.el, "modal.setup");
      __privateSet(this, _triggers3, getTriggers(this.el.id));
      __privateSet(this, _isActive6, this.el.classList.contains("active") ? true : false);
      __privateSet(this, _isAnimated6, false);
      this.setupListeners();
      if (this.options.overlay)
        this.overlayElement = createOverlay(__privateGet(this, _isActive6), this.options.overlay, this.el.id, this.options.animationDuration);
      this.el.style.transitionDuration = this.options.animationDuration + "ms";
      this.el.style.animationDuration = this.options.animationDuration + "ms";
    }
    setupListeners() {
      __privateSet(this, _listenerRef5, __privateMethod(this, _onClickTrigger6, onClickTrigger_fn6).bind(this));
      __privateGet(this, _triggers3).forEach((trigger) => trigger.addEventListener("click", __privateGet(this, _listenerRef5)));
    }
    removeListeners() {
      __privateGet(this, _triggers3).forEach((trigger) => trigger.removeEventListener("click", __privateGet(this, _listenerRef5)));
      __privateSet(this, _listenerRef5, void 0);
    }
    open() {
      if (__privateGet(this, _isActive6))
        return;
      createEvent(this.el, "modal.open");
      __privateSet(this, _isActive6, true);
      __privateSet(this, _isAnimated6, true);
      __privateMethod(this, _setZIndex, setZIndex_fn).call(this);
      this.el.style.display = "block";
      updateOverlay(this.options.overlay, this.overlayElement, __privateGet(this, _listenerRef5), true, this.options.animationDuration);
      __privateMethod(this, _toggleBodyScroll2, toggleBodyScroll_fn2).call(this, false);
      setTimeout(() => {
        this.el.classList.add("active");
      }, 50);
      setTimeout(() => {
        __privateSet(this, _isAnimated6, false);
        createEvent(this.el, "modal.opened");
      }, this.options.animationDuration);
    }
    close() {
      if (!__privateGet(this, _isActive6))
        return;
      createEvent(this.el, "modal.close");
      __privateSet(this, _isAnimated6, true);
      this.el.classList.remove("active");
      updateOverlay(this.options.overlay, this.overlayElement, __privateGet(this, _listenerRef5), false, this.options.animationDuration);
      setTimeout(() => {
        this.el.style.display = "";
        __privateSet(this, _isAnimated6, false);
        __privateSet(this, _isActive6, false);
        __privateMethod(this, _toggleBodyScroll2, toggleBodyScroll_fn2).call(this, true);
        createEvent(this.el, "modal.closed");
      }, this.options.animationDuration);
    }
  }
  _triggers3 = new WeakMap();
  _isActive6 = new WeakMap();
  _isAnimated6 = new WeakMap();
  _listenerRef5 = new WeakMap();
  _toggleBodyScroll2 = new WeakSet();
  toggleBodyScroll_fn2 = function(state) {
    if (!this.options.bodyScrolling)
      document.body.style.overflow = state ? "" : "hidden";
  };
  _setZIndex = new WeakSet();
  setZIndex_fn = function() {
    const totalModals = document.querySelectorAll(".modal.active").length + 1;
    if (this.options.overlay)
      this.overlayElement.style.zIndex = String(800 + totalModals * 10 - 2);
    this.el.style.zIndex = String(800 + totalModals * 10);
  };
  _onClickTrigger6 = new WeakSet();
  onClickTrigger_fn6 = function(e) {
    e.preventDefault();
    if (__privateGet(this, _isAnimated6))
      return;
    if (__privateGet(this, _isActive6))
      this.close();
    else
      this.open();
  };
  __publicField(Modal, "getDefaultOptions", () => ModalOptions);
  registerComponent({
    class: Modal,
    name: "Modal",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".modal"
    }
  });
  const TabOptions = {
    animationDuration: 300,
    animationType: "none",
    disableActiveBar: false,
    caroulix: {
      animationDuration: 300,
      backToOpposite: false,
      enableTouch: false,
      autoplay: {
        enabled: false
      }
    }
  };
  class Tab extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _handleResizeEvent);
      __privateAdd(this, _handleCaroulixSlide);
      __privateAdd(this, _getItems);
      __privateAdd(this, _hideContent);
      __privateAdd(this, _enableSlideAnimation);
      __privateAdd(this, _setActiveElement);
      __privateAdd(this, _toggleArrowMode);
      __privateAdd(this, _scrollLeft);
      __privateAdd(this, _scrollRight);
      __privateAdd(this, _onClickItem);
      __privateAdd(this, _getPreviousItemIndex);
      __privateAdd(this, _getNextItemIndex);
      __publicField(this, "options");
      __privateAdd(this, _tabArrow, void 0);
      __privateAdd(this, _tabLinks, void 0);
      __privateAdd(this, _tabMenu, void 0);
      __privateAdd(this, _currentItemIndex, 0);
      __privateAdd(this, _leftArrow, void 0);
      __privateAdd(this, _rightArrow, void 0);
      __privateAdd(this, _scrollLeftRef, void 0);
      __privateAdd(this, _scrollRightRef, void 0);
      __privateAdd(this, _arrowRef, void 0);
      __privateAdd(this, _caroulixSlideRef, void 0);
      __privateAdd(this, _resizeTabRef, void 0);
      __privateAdd(this, _tabItems, void 0);
      __privateAdd(this, _tabCaroulix, void 0);
      __privateAdd(this, _tabCaroulixInit, false);
      __privateAdd(this, _caroulixInstance, void 0);
      __privateAdd(this, _isAnimated7, false);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Tab", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Tab", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Tab init error", error);
      }
    }
    setup() {
      createEvent(this.el, "tab.setup");
      const animationList = ["none", "slide"];
      if (!animationList.includes(this.options.animationType))
        this.options.animationType = "none";
      __privateSet(this, _isAnimated7, false);
      __privateSet(this, _tabArrow, this.el.querySelector(".tab-arrow"));
      __privateSet(this, _tabLinks, this.el.querySelectorAll(".tab-menu .tab-link"));
      __privateSet(this, _tabMenu, this.el.querySelector(".tab-menu"));
      __privateSet(this, _currentItemIndex, 0);
      __privateSet(this, _tabItems, __privateMethod(this, _getItems, getItems_fn).call(this));
      if (__privateGet(this, _tabArrow)) {
        __privateMethod(this, _toggleArrowMode, toggleArrowMode_fn).call(this);
        __privateSet(this, _leftArrow, this.el.querySelector(".tab-arrow .tab-prev"));
        __privateSet(this, _rightArrow, this.el.querySelector(".tab-arrow .tab-next"));
      }
      this.setupListeners();
      __privateGet(this, _tabMenu).style.transitionDuration = this.options.animationDuration + "ms";
      if (this.options.animationType === "slide")
        __privateMethod(this, _enableSlideAnimation, enableSlideAnimation_fn).call(this);
      else
        this.updateActiveElement();
    }
    setupListeners() {
      __privateGet(this, _tabLinks).forEach((item) => {
        item.listenerRef = __privateMethod(this, _onClickItem, onClickItem_fn).bind(this, item);
        item.addEventListener("click", item.listenerRef);
      });
      __privateSet(this, _resizeTabRef, __privateMethod(this, _handleResizeEvent, handleResizeEvent_fn).bind(this));
      window.addEventListener("resize", __privateGet(this, _resizeTabRef));
      if (__privateGet(this, _tabArrow)) {
        __privateSet(this, _arrowRef, __privateMethod(this, _toggleArrowMode, toggleArrowMode_fn).bind(this));
        window.addEventListener("resize", __privateGet(this, _arrowRef));
        __privateSet(this, _scrollLeftRef, __privateMethod(this, _scrollLeft, scrollLeft_fn).bind(this));
        __privateSet(this, _scrollRightRef, __privateMethod(this, _scrollRight, scrollRight_fn).bind(this));
        __privateGet(this, _leftArrow).addEventListener("click", __privateGet(this, _scrollLeftRef));
        __privateGet(this, _rightArrow).addEventListener("click", __privateGet(this, _scrollRightRef));
      }
    }
    removeListeners() {
      __privateGet(this, _tabLinks).forEach((item) => {
        item.removeEventListener("click", item.listenerRef);
        item.listenerRef = void 0;
      });
      window.removeEventListener("resize", __privateGet(this, _resizeTabRef));
      __privateSet(this, _resizeTabRef, void 0);
      if (__privateGet(this, _tabArrow)) {
        window.removeEventListener("resize", __privateGet(this, _arrowRef));
        __privateSet(this, _arrowRef, void 0);
        __privateGet(this, _leftArrow).removeEventListener("click", __privateGet(this, _scrollLeftRef));
        __privateGet(this, _rightArrow).removeEventListener("click", __privateGet(this, _scrollRightRef));
        __privateSet(this, _scrollLeftRef, void 0);
        __privateSet(this, _scrollRightRef, void 0);
      }
      if (__privateGet(this, _caroulixSlideRef)) {
        this.el.removeEventListener("ax.caroulix.slide", __privateGet(this, _caroulixSlideRef));
        __privateSet(this, _caroulixSlideRef, void 0);
      }
    }
    select(itemId) {
      if (__privateGet(this, _isAnimated7))
        return;
      __privateSet(this, _isAnimated7, true);
      const menuItem = this.el.querySelector('.tab-menu a[href="#' + itemId + '"]');
      __privateSet(this, _currentItemIndex, Array.from(__privateGet(this, _tabLinks)).findIndex((item) => item.children[0] === menuItem));
      createEvent(menuItem, "tab.select", { currentIndex: __privateGet(this, _currentItemIndex) });
      __privateMethod(this, _setActiveElement, setActiveElement_fn).call(this, menuItem.parentElement);
      if (__privateGet(this, _tabCaroulixInit)) {
        __privateGet(this, _tabItems).forEach((item) => item.id === itemId ? item.classList.add("active") : "");
        const caroulixClass = getComponentClass("Caroulix");
        __privateSet(this, _caroulixInstance, new caroulixClass("#" + __privateGet(this, _tabCaroulix).id, this.options.caroulix, this.el, true));
        __privateSet(this, _caroulixSlideRef, __privateMethod(this, _handleCaroulixSlide, handleCaroulixSlide_fn).bind(this));
        this.el.addEventListener("ax.caroulix.slide", __privateGet(this, _caroulixSlideRef));
        __privateSet(this, _tabCaroulixInit, false);
        __privateSet(this, _isAnimated7, false);
        return;
      }
      if (this.options.animationType === "slide") {
        const nb = __privateGet(this, _tabItems).findIndex((item) => item.id === itemId);
        __privateGet(this, _caroulixInstance).goTo(nb);
        setTimeout(() => {
          __privateSet(this, _isAnimated7, false);
        }, this.options.animationDuration);
      } else {
        __privateMethod(this, _hideContent, hideContent_fn).call(this);
        __privateGet(this, _tabItems).forEach((item) => {
          if (item.id === itemId)
            item.style.display = "block";
        });
        __privateSet(this, _isAnimated7, false);
      }
    }
    updateActiveElement() {
      let itemSelected;
      __privateGet(this, _tabLinks).forEach((item, index) => {
        if (item.classList.contains("active")) {
          itemSelected = item;
          __privateSet(this, _currentItemIndex, index);
        }
      });
      if (!itemSelected) {
        itemSelected = __privateGet(this, _tabLinks).item(0);
        __privateSet(this, _currentItemIndex, 0);
      }
      const target = itemSelected.children[0].getAttribute("href");
      this.select(target.split("#")[1]);
    }
    prev(step = 1) {
      if (__privateGet(this, _isAnimated7))
        return;
      const previousItemIndex = __privateMethod(this, _getPreviousItemIndex, getPreviousItemIndex_fn).call(this, step);
      __privateSet(this, _currentItemIndex, previousItemIndex);
      createEvent(this.el, "tab.prev", { step });
      const target = __privateGet(this, _tabLinks)[previousItemIndex].children[0].getAttribute("href");
      this.select(target.split("#")[1]);
    }
    next(step = 1) {
      if (__privateGet(this, _isAnimated7))
        return;
      const nextItemIndex = __privateMethod(this, _getNextItemIndex, getNextItemIndex_fn).call(this, step);
      __privateSet(this, _currentItemIndex, nextItemIndex);
      createEvent(this.el, "tab.next", { step });
      const target = __privateGet(this, _tabLinks)[nextItemIndex].children[0].getAttribute("href");
      this.select(target.split("#")[1]);
    }
  }
  _tabArrow = new WeakMap();
  _tabLinks = new WeakMap();
  _tabMenu = new WeakMap();
  _currentItemIndex = new WeakMap();
  _leftArrow = new WeakMap();
  _rightArrow = new WeakMap();
  _scrollLeftRef = new WeakMap();
  _scrollRightRef = new WeakMap();
  _arrowRef = new WeakMap();
  _caroulixSlideRef = new WeakMap();
  _resizeTabRef = new WeakMap();
  _tabItems = new WeakMap();
  _tabCaroulix = new WeakMap();
  _tabCaroulixInit = new WeakMap();
  _caroulixInstance = new WeakMap();
  _isAnimated7 = new WeakMap();
  _handleResizeEvent = new WeakSet();
  handleResizeEvent_fn = function() {
    this.updateActiveElement();
    for (let i = 100; i < 500; i += 100) {
      setTimeout(() => {
        this.updateActiveElement();
      }, i);
    }
  };
  _handleCaroulixSlide = new WeakSet();
  handleCaroulixSlide_fn = function() {
    if (__privateGet(this, _currentItemIndex) !== __privateGet(this, _caroulixInstance).activeIndex) {
      __privateSet(this, _currentItemIndex, __privateGet(this, _caroulixInstance).activeIndex);
      __privateMethod(this, _setActiveElement, setActiveElement_fn).call(this, __privateGet(this, _tabLinks)[__privateGet(this, _currentItemIndex)]);
    }
  };
  _getItems = new WeakSet();
  getItems_fn = function() {
    return Array.from(__privateGet(this, _tabLinks)).map((link) => {
      const id = link.children[0].getAttribute("href");
      return this.el.querySelector(id);
    });
  };
  _hideContent = new WeakSet();
  hideContent_fn = function() {
    __privateGet(this, _tabItems).forEach((item) => item.style.display = "none");
  };
  _enableSlideAnimation = new WeakSet();
  enableSlideAnimation_fn = function() {
    __privateGet(this, _tabItems).forEach((item) => item.classList.add("caroulix-item"));
    __privateSet(this, _tabCaroulix, wrap(__privateGet(this, _tabItems)));
    __privateGet(this, _tabCaroulix).classList.add("caroulix");
    const nb = Math.random().toString().split(".")[1];
    __privateGet(this, _tabCaroulix).id = "tab-caroulix-" + nb;
    __privateSet(this, _tabCaroulixInit, true);
    if (this.options.animationDuration !== 300)
      this.options.caroulix.animationDuration = this.options.animationDuration;
    this.updateActiveElement();
  };
  _setActiveElement = new WeakSet();
  setActiveElement_fn = function(element) {
    __privateGet(this, _tabLinks).forEach((item) => item.classList.remove("active"));
    if (!this.options.disableActiveBar) {
      const elementRect = element.getBoundingClientRect();
      const elementPosLeft = elementRect.left;
      const menuPosLeft = __privateGet(this, _tabMenu).getBoundingClientRect().left;
      const left = elementPosLeft - menuPosLeft + __privateGet(this, _tabMenu).scrollLeft;
      const elementWidth = elementRect.width;
      const right = __privateGet(this, _tabMenu).clientWidth - left - elementWidth;
      __privateGet(this, _tabMenu).style.setProperty(getCssVar("tab-bar-left-offset"), Math.floor(left) + "px");
      __privateGet(this, _tabMenu).style.setProperty(getCssVar("tab-bar-right-offset"), Math.ceil(right) + "px");
    }
    element.classList.add("active");
  };
  _toggleArrowMode = new WeakSet();
  toggleArrowMode_fn = function() {
    const totalWidth = Array.from(__privateGet(this, _tabLinks)).reduce((acc, element) => {
      acc += element.clientWidth;
      return acc;
    }, 0);
    const arrowWidth = __privateGet(this, _tabArrow).clientWidth;
    if (totalWidth > arrowWidth) {
      if (!__privateGet(this, _tabArrow).classList.contains("tab-arrow-show"))
        __privateGet(this, _tabArrow).classList.add("tab-arrow-show");
    } else {
      if (__privateGet(this, _tabArrow).classList.contains("tab-arrow-show"))
        __privateGet(this, _tabArrow).classList.remove("tab-arrow-show");
    }
  };
  _scrollLeft = new WeakSet();
  scrollLeft_fn = function(e) {
    e.preventDefault();
    __privateGet(this, _tabMenu).scrollLeft -= 40;
  };
  _scrollRight = new WeakSet();
  scrollRight_fn = function(e) {
    e.preventDefault();
    __privateGet(this, _tabMenu).scrollLeft += 40;
  };
  _onClickItem = new WeakSet();
  onClickItem_fn = function(item, e) {
    e.preventDefault();
    if (__privateGet(this, _isAnimated7) || item.classList.contains("active"))
      return;
    const target = item.children[0].getAttribute("href");
    this.select(target.split("#")[1]);
  };
  _getPreviousItemIndex = new WeakSet();
  getPreviousItemIndex_fn = function(step) {
    let previousItemIndex = 0;
    let index = __privateGet(this, _currentItemIndex);
    for (let i = 0; i < step; i++) {
      if (index > 0) {
        previousItemIndex = index - 1;
        index--;
      } else {
        index = __privateGet(this, _tabLinks).length - 1;
        previousItemIndex = index;
      }
    }
    return previousItemIndex;
  };
  _getNextItemIndex = new WeakSet();
  getNextItemIndex_fn = function(step) {
    let nextItemIndex = 0;
    let index = __privateGet(this, _currentItemIndex);
    for (let i = 0; i < step; i++) {
      if (index < __privateGet(this, _tabLinks).length - 1) {
        nextItemIndex = index + 1;
        index++;
      } else {
        index = 0;
        nextItemIndex = index;
      }
    }
    return nextItemIndex;
  };
  __publicField(Tab, "getDefaultOptions", () => TabOptions);
  registerComponent({
    class: Tab,
    name: "Tab",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".tab"
    }
  });
  const ScrollSpyOptions = {
    offset: 200,
    linkSelector: "a",
    classes: "active",
    auto: {
      enabled: false,
      classes: "",
      selector: ""
    }
  };
  class ScrollSpy extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _setupBasic);
      __privateAdd(this, _setupAuto);
      __privateAdd(this, _getElement);
      __privateAdd(this, _removeOldLink);
      __privateAdd(this, _getClosestElem);
      __privateAdd(this, _update);
      __publicField(this, "options");
      __privateAdd(this, _oldLink, void 0);
      __privateAdd(this, _updateRef, void 0);
      __privateAdd(this, _links, void 0);
      __privateAdd(this, _elements, void 0);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "ScrollSpy", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("ScrollSpy", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] ScrollSpy init error", error);
      }
    }
    setup() {
      createEvent(this.el, "scrollspy.setup");
      if (this.options.auto.enabled)
        __privateMethod(this, _setupAuto, setupAuto_fn).call(this);
      else
        __privateMethod(this, _setupBasic, setupBasic_fn).call(this);
      if (typeof this.options.classes === "string")
        this.options.classes = this.options.classes.split(" ");
      __privateSet(this, _oldLink, "");
      this.setupListeners();
      __privateMethod(this, _update, update_fn).call(this);
    }
    setupListeners() {
      __privateSet(this, _updateRef, __privateMethod(this, _update, update_fn).bind(this));
      window.addEventListener("scroll", __privateGet(this, _updateRef));
      window.addEventListener("resize", __privateGet(this, _updateRef));
    }
    removeListeners() {
      window.removeEventListener("scroll", __privateGet(this, _updateRef));
      window.removeEventListener("resize", __privateGet(this, _updateRef));
      __privateSet(this, _updateRef, void 0);
    }
  }
  _oldLink = new WeakMap();
  _updateRef = new WeakMap();
  _links = new WeakMap();
  _elements = new WeakMap();
  _setupBasic = new WeakSet();
  setupBasic_fn = function() {
    __privateSet(this, _links, Array.from(this.el.querySelectorAll(this.options.linkSelector)));
    __privateSet(this, _elements, __privateGet(this, _links).map((link) => document.querySelector(link.getAttribute("href"))));
  };
  _setupAuto = new WeakSet();
  setupAuto_fn = function() {
    __privateSet(this, _elements, Array.from(document.querySelectorAll(this.options.auto.selector)));
    __privateSet(this, _links, __privateGet(this, _elements).map((el) => {
      const link = document.createElement("a");
      link.className = this.options.auto.classes;
      link.setAttribute("href", "#" + el.id);
      link.innerHTML = el.innerHTML;
      this.el.appendChild(link);
      return link;
    }));
  };
  _getElement = new WeakSet();
  getElement_fn = function() {
    const top = window.scrollY, left = window.scrollX, right = window.innerWidth, bottom = window.innerHeight, topBreakpoint = top + this.options.offset;
    if (bottom + top >= document.body.offsetHeight - 2)
      return __privateGet(this, _elements)[__privateGet(this, _elements).length - 1];
    return __privateGet(this, _elements).find((el) => {
      const elRect = el.getBoundingClientRect();
      return elRect.top + top >= top && elRect.left + left >= left && elRect.right <= right && elRect.bottom <= bottom && elRect.top + top <= topBreakpoint;
    });
  };
  _removeOldLink = new WeakSet();
  removeOldLink_fn = function() {
    if (!__privateGet(this, _oldLink))
      return;
    this.options.classes.forEach((cl) => __privateGet(this, _oldLink).classList.remove(cl));
  };
  _getClosestElem = new WeakSet();
  getClosestElem_fn = function() {
    const top = window.scrollY;
    return __privateGet(this, _elements).reduce((prev, curr) => {
      const currTop = curr.getBoundingClientRect().top + top;
      const prevTop = prev.getBoundingClientRect().top + top;
      if (currTop > top + this.options.offset)
        return prev;
      else if (Math.abs(currTop - top) < Math.abs(prevTop - top))
        return curr;
      return prev;
    });
  };
  _update = new WeakSet();
  update_fn = function() {
    let element = __privateMethod(this, _getElement, getElement_fn).call(this);
    if (!element)
      element = __privateMethod(this, _getClosestElem, getClosestElem_fn).call(this);
    const link = __privateGet(this, _links).find((l) => l.getAttribute("href").split("#")[1] === element.id);
    if (link === __privateGet(this, _oldLink))
      return;
    createEvent(this.el, "scrollspy.update");
    __privateMethod(this, _removeOldLink, removeOldLink_fn).call(this);
    this.options.classes.forEach((cl) => link.classList.add(cl));
    __privateSet(this, _oldLink, link);
  };
  __publicField(ScrollSpy, "getDefaultOptions", () => ScrollSpyOptions);
  registerComponent({
    class: ScrollSpy,
    name: "ScrollSpy",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".scrollspy"
    }
  });
  const ToastOptions = {
    animationDuration: 400,
    duration: 4e3,
    classes: "",
    position: "right",
    direction: "top",
    mobileDirection: "bottom",
    offset: { x: "5%", y: "0%", mobileX: "10%", mobileY: "0%" },
    isClosable: false,
    closableContent: "x",
    loading: {
      enabled: true,
      border: "2px solid #E2E2E2"
    }
  };
  const _Toast = class {
    constructor(content, options) {
      __privateAdd(this, _createToaster);
      __privateAdd(this, _removeToaster);
      __privateAdd(this, _fadeInToast);
      __privateAdd(this, _fadeOutToast);
      __privateAdd(this, _animOut);
      __privateAdd(this, _createToast);
      __privateAdd(this, _hide);
      __publicField(this, "options");
      __publicField(this, "id");
      __privateAdd(this, _content, void 0);
      __privateAdd(this, _toasters, void 0);
      if (getInstanceByType("Toast").length > 0) {
        console.error("[Axentix] Toast: Don't try to create multiple toast instances");
        return;
      }
      instances.push({ type: "Toast", instance: this });
      this.id = Math.random().toString().split(".")[1];
      __privateSet(this, _content, content);
      this.options = extend(_Toast.getDefaultOptions(), options);
      this.options.position = this.options.position.toLowerCase();
      this.options.direction = this.options.direction.toLowerCase();
      this.options.mobileDirection = this.options.mobileDirection.toLowerCase();
      __privateSet(this, _toasters, {});
    }
    destroy() {
      const index = instances.findIndex((ins) => ins.instance.id === this.id);
      instances.splice(index, 1);
    }
    show() {
      try {
        if (!Object.keys(__privateGet(this, _toasters)).includes(this.options.position))
          __privateMethod(this, _createToaster, createToaster_fn).call(this);
        __privateMethod(this, _createToast, createToast_fn).call(this);
      } catch (error) {
        console.error("[Axentix] Toast error", error);
      }
    }
    change(content, options) {
      __privateSet(this, _content, content);
      this.options = extend(this.options, options);
    }
  };
  let Toast = _Toast;
  _content = new WeakMap();
  _toasters = new WeakMap();
  _createToaster = new WeakSet();
  createToaster_fn = function() {
    let toaster = document.createElement("div");
    const positionList = ["right", "left"];
    if (!positionList.includes(this.options.position))
      this.options.position = "right";
    if (this.options.position === "right")
      toaster.style.right = this.options.offset.x;
    else
      toaster.style.left = this.options.offset.x;
    const directionList = ["bottom", "top"];
    if (!directionList.includes(this.options.direction))
      this.options.direction = "top";
    if (this.options.direction === "top")
      toaster.style.top = this.options.offset.y;
    else
      toaster.style.bottom = this.options.offset.y;
    if (!directionList.includes(this.options.mobileDirection))
      this.options.mobileDirection = "bottom";
    toaster.style.setProperty(getCssVar("toaster-m-width"), 100 - this.options.offset.mobileX.slice(0, -1) + "%");
    toaster.style.setProperty(getCssVar("toaster-m-offset"), this.options.offset.mobileY);
    if (this.options.loading.enabled)
      toaster.style.setProperty(getCssVar("toast-loading-border"), this.options.loading.border);
    toaster.className = `toaster toaster-${this.options.position} toast-${this.options.direction} toaster-m-${this.options.mobileDirection}`;
    __privateGet(this, _toasters)[this.options.position] = toaster;
    document.body.appendChild(toaster);
  };
  _removeToaster = new WeakSet();
  removeToaster_fn = function() {
    for (const key in __privateGet(this, _toasters)) {
      let toaster = __privateGet(this, _toasters)[key];
      if (toaster.childElementCount <= 0) {
        toaster.remove();
        delete __privateGet(this, _toasters)[key];
      }
    }
  };
  _fadeInToast = new WeakSet();
  fadeInToast_fn = function(toast2) {
    setTimeout(() => {
      createEvent(toast2, "toast.show");
      if (this.options.loading.enabled) {
        toast2.classList.add("toast-loading");
        toast2.style.setProperty(getCssVar("toast-loading-duration"), this.options.duration + "ms");
      }
      toast2.classList.add("toast-animated");
      setTimeout(() => {
        createEvent(toast2, "toast.shown");
        if (this.options.loading.enabled)
          toast2.classList.add("toast-load");
      }, this.options.animationDuration);
    }, 50);
  };
  _fadeOutToast = new WeakSet();
  fadeOutToast_fn = function(toast2) {
    setTimeout(() => {
      createEvent(toast2, "toast.hide");
      __privateMethod(this, _hide, hide_fn).call(this, toast2);
    }, this.options.duration + this.options.animationDuration);
  };
  _animOut = new WeakSet();
  animOut_fn = function(toast2) {
    toast2.style.transitionTimingFunction = "cubic-bezier(0.445, 0.05, 0.55, 0.95)";
    toast2.style.paddingTop = "0";
    toast2.style.paddingBottom = "0";
    toast2.style.margin = "0";
    toast2.style.height = "0";
  };
  _createToast = new WeakSet();
  createToast_fn = function() {
    let toast2 = document.createElement("div");
    toast2.className = "toast shadow-1 " + this.options.classes;
    toast2.innerHTML = __privateGet(this, _content);
    toast2.style.transitionDuration = this.options.animationDuration + "ms";
    if (this.options.isClosable) {
      let trigger = document.createElement("div");
      trigger.className = "toast-trigger";
      trigger.innerHTML = this.options.closableContent;
      trigger.listenerRef = __privateMethod(this, _hide, hide_fn).bind(this, toast2, trigger);
      trigger.addEventListener("click", trigger.listenerRef);
      toast2.appendChild(trigger);
    }
    __privateMethod(this, _fadeInToast, fadeInToast_fn).call(this, toast2);
    __privateGet(this, _toasters)[this.options.position].appendChild(toast2);
    __privateMethod(this, _fadeOutToast, fadeOutToast_fn).call(this, toast2);
    const height = toast2.clientHeight;
    toast2.style.height = height + "px";
  };
  _hide = new WeakSet();
  hide_fn = function(toast2, trigger, e) {
    if (toast2.isAnimated)
      return;
    let timer = 1;
    if (e) {
      e.preventDefault();
      timer = 0;
      if (this.options.isClosable)
        trigger.removeEventListener("click", trigger.listenerRef);
    }
    toast2.style.opacity = "0";
    toast2.isAnimated = true;
    const delay = timer * this.options.animationDuration + this.options.animationDuration;
    setTimeout(() => {
      __privateMethod(this, _animOut, animOut_fn).call(this, toast2);
    }, delay / 2);
    setTimeout(() => {
      toast2.remove();
      createEvent(toast2, "toast.remove");
      __privateMethod(this, _removeToaster, removeToaster_fn).call(this);
    }, delay * 1.45);
  };
  __publicField(Toast, "getDefaultOptions", () => ToastOptions);
  registerComponent({
    class: Toast,
    name: "Toast"
  });
  const TooltipOptions = {
    content: "",
    animationDelay: 0,
    offset: "10px",
    animationDuration: 200,
    classes: "grey dark-4 light-shadow-2 p-2",
    position: "top"
  };
  class Tooltip extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _setProperties2);
      __privateAdd(this, _setBasicPosition);
      __privateAdd(this, _manualTransform);
      __privateAdd(this, _onHover);
      __privateAdd(this, _onHoverOut);
      __publicField(this, "options");
      __privateAdd(this, _tooltip, void 0);
      __privateAdd(this, _positionList, void 0);
      __privateAdd(this, _listenerEnterRef, void 0);
      __privateAdd(this, _listenerLeaveRef, void 0);
      __privateAdd(this, _listenerResizeRef, void 0);
      __privateAdd(this, _timeoutRef, void 0);
      __privateAdd(this, _elRect, void 0);
      __privateAdd(this, _tooltipRect, void 0);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Tooltip", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Tooltip", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Tooltip init error", error);
      }
    }
    setup() {
      if (!this.options.content)
        return console.error(`Tooltip #${this.el.id} : empty content.`);
      createEvent(this.el, "tooltip.setup");
      this.options.position = this.options.position.toLowerCase();
      const tooltips = document.querySelectorAll(".tooltip");
      tooltips.forEach((tooltip2) => {
        if (tooltip2.dataset.tooltipId && tooltip2.dataset.tooltipId === this.el.id)
          __privateSet(this, _tooltip, tooltip2);
      });
      if (!__privateGet(this, _tooltip))
        __privateSet(this, _tooltip, document.createElement("div"));
      if (__privateGet(this, _tooltip).dataset.tooltipId !== this.el.id)
        __privateGet(this, _tooltip).dataset.tooltipId = this.el.id;
      __privateMethod(this, _setProperties2, setProperties_fn2).call(this);
      document.body.appendChild(__privateGet(this, _tooltip));
      __privateSet(this, _positionList, ["right", "left", "top", "bottom"]);
      if (!__privateGet(this, _positionList).includes(this.options.position))
        this.options.position = "top";
      this.setupListeners();
      this.updatePosition();
      __privateGet(this, _tooltip).style.display = "none";
    }
    setupListeners() {
      __privateSet(this, _listenerEnterRef, __privateMethod(this, _onHover, onHover_fn).bind(this));
      __privateSet(this, _listenerLeaveRef, __privateMethod(this, _onHoverOut, onHoverOut_fn).bind(this));
      __privateSet(this, _listenerResizeRef, this.updatePosition.bind(this));
      this.el.addEventListener("mouseenter", __privateGet(this, _listenerEnterRef));
      this.el.addEventListener("mouseleave", __privateGet(this, _listenerLeaveRef));
      window.addEventListener("resize", __privateGet(this, _listenerResizeRef));
    }
    removeListeners() {
      this.el.removeEventListener("mouseenter", __privateGet(this, _listenerEnterRef));
      this.el.removeEventListener("mouseleave", __privateGet(this, _listenerLeaveRef));
      window.removeEventListener("resize", __privateGet(this, _listenerResizeRef));
      __privateSet(this, _listenerEnterRef, void 0);
      __privateSet(this, _listenerLeaveRef, void 0);
      __privateSet(this, _listenerResizeRef, void 0);
    }
    updatePosition() {
      __privateSet(this, _elRect, this.el.getBoundingClientRect());
      __privateMethod(this, _setBasicPosition, setBasicPosition_fn).call(this);
      __privateSet(this, _tooltipRect, __privateGet(this, _tooltip).getBoundingClientRect());
      __privateMethod(this, _manualTransform, manualTransform_fn).call(this);
    }
    show() {
      __privateGet(this, _tooltip).style.display = "block";
      this.updatePosition();
      clearTimeout(__privateGet(this, _timeoutRef));
      __privateSet(this, _timeoutRef, setTimeout(() => {
        createEvent(this.el, "tooltip.show");
        const negativity = this.options.position == "top" || this.options.position == "left" ? "-" : "";
        const verticality = this.options.position == "top" || this.options.position == "bottom" ? "Y" : "X";
        __privateGet(this, _tooltip).style.transform = `translate${verticality}(${negativity}${this.options.offset})`;
        __privateGet(this, _tooltip).style.opacity = "1";
      }, this.options.animationDelay));
    }
    hide() {
      createEvent(this.el, "tooltip.hide");
      clearTimeout(__privateGet(this, _timeoutRef));
      __privateGet(this, _tooltip).style.transform = "translate(0)";
      __privateGet(this, _tooltip).style.opacity = "0";
      __privateSet(this, _timeoutRef, setTimeout(() => {
        __privateGet(this, _tooltip).style.display = "none";
      }, this.options.animationDuration));
    }
    change(options) {
      this.options = getComponentOptions("Tooltip", options, this.el);
      if (!__privateGet(this, _positionList).includes(this.options.position))
        this.options.position = "top";
      __privateMethod(this, _setProperties2, setProperties_fn2).call(this);
      this.updatePosition();
    }
  }
  _tooltip = new WeakMap();
  _positionList = new WeakMap();
  _listenerEnterRef = new WeakMap();
  _listenerLeaveRef = new WeakMap();
  _listenerResizeRef = new WeakMap();
  _timeoutRef = new WeakMap();
  _elRect = new WeakMap();
  _tooltipRect = new WeakMap();
  _setProperties2 = new WeakSet();
  setProperties_fn2 = function() {
    __privateGet(this, _tooltip).style.transform = "translate(0)";
    __privateGet(this, _tooltip).style.opacity = "0";
    __privateGet(this, _tooltip).className = "tooltip " + this.options.classes;
    __privateGet(this, _tooltip).style.transitionDuration = this.options.animationDuration + "ms";
    __privateGet(this, _tooltip).innerHTML = this.options.content;
  };
  _setBasicPosition = new WeakSet();
  setBasicPosition_fn = function() {
    const isVerticalSide = this.options.position == "top" || this.options.position == "bottom";
    if (isVerticalSide) {
      const top = this.options.position === "top" ? __privateGet(this, _elRect).top : __privateGet(this, _elRect).top + __privateGet(this, _elRect).height;
      __privateGet(this, _tooltip).style.top = top + "px";
    } else if (this.options.position == "right") {
      __privateGet(this, _tooltip).style.left = __privateGet(this, _elRect).left + __privateGet(this, _elRect).width + "px";
    }
  };
  _manualTransform = new WeakSet();
  manualTransform_fn = function() {
    const isVerticalSide = this.options.position == "top" || this.options.position == "bottom";
    if (isVerticalSide) {
      __privateGet(this, _tooltip).style.left = __privateGet(this, _elRect).left + __privateGet(this, _elRect).width / 2 - __privateGet(this, _tooltipRect).width / 2 + "px";
    } else {
      __privateGet(this, _tooltip).style.top = __privateGet(this, _elRect).top + __privateGet(this, _elRect).height / 2 - __privateGet(this, _tooltipRect).height / 2 + "px";
    }
    if (this.options.position == "top") {
      __privateGet(this, _tooltip).style.top = __privateGet(this, _tooltipRect).top - __privateGet(this, _tooltipRect).height + "px";
    } else if (this.options.position == "left") {
      __privateGet(this, _tooltip).style.left = __privateGet(this, _elRect).left - __privateGet(this, _tooltipRect).width + "px";
    }
    const scrollY = window.scrollY;
    const tooltipTop = parseFloat(__privateGet(this, _tooltip).style.top);
    if (this.options.position === "top")
      __privateGet(this, _tooltip).style.top = scrollY * 2 + tooltipTop + "px";
    else
      __privateGet(this, _tooltip).style.top = scrollY + tooltipTop + "px";
  };
  _onHover = new WeakSet();
  onHover_fn = function(e) {
    e.preventDefault();
    this.show();
  };
  _onHoverOut = new WeakSet();
  onHoverOut_fn = function(e) {
    e.preventDefault();
    this.hide();
  };
  __publicField(Tooltip, "getDefaultOptions", () => TooltipOptions);
  registerComponent({
    class: Tooltip,
    name: "Tooltip",
    dataDetection: true
  });
  let pointerType = "";
  const targetMap = {};
  const itemMap = {};
  const createWaveItem = (target) => {
    const id = getUid();
    const el = document.createElement("div");
    const container = document.createElement("div");
    const tagName = target.tagName.toLowerCase();
    target.setAttribute("data-waves-id", id);
    container.classList.add("data-waves-item-inner");
    container.setAttribute("data-waves-id", id);
    el.classList.add("data-waves-box");
    el.setAttribute("data-waves-id", id);
    el.appendChild(container);
    targetMap[id] = target;
    itemMap[id] = el;
    if (["img", "video"].includes(tagName))
      target.parentNode.appendChild(el);
    else
      target.appendChild(el);
    return el;
  };
  const createWaves = ({ id, size, x, y, container, item, target }, color) => {
    const waves2 = document.createElement("span");
    let style = `height:${size}px;
           width:${size}px;
           left:${x}px;
           top:${y}px;`;
    if (color)
      style += `${getCssVar("waves-color")}: ${color}`;
    waves2.setAttribute("data-waves-id", id);
    waves2.classList.add("data-waves-item");
    waves2.setAttribute("style", style);
    waves2.addEventListener("animationend", () => {
      container.removeChild(waves2);
      if (!container.children.length && item) {
        if (item.parentNode)
          item.parentNode.removeChild(item);
        target.removeAttribute("data-waves-id");
        delete itemMap[id];
        delete targetMap[id];
      }
    }, { once: true });
    return waves2;
  };
  const getWavesParams = (clientX, clientY, id, target) => {
    const { top, left, width, height } = target.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    let item = itemMap[id];
    if (!item)
      item = createWaveItem(target);
    id = item.getAttribute("data-waves-id") || getUid();
    const container = item.children[0];
    const size = __pow(__pow(Math.max(left + width - clientX, clientX - left), 2) + __pow(Math.max(top + height - clientY, clientY - top), 2), 0.5) * 2;
    return { id, size, x, y, container, item, target };
  };
  const getContainerStyle = (target, item) => {
    const { left, top, width, height } = target.getBoundingClientRect();
    const { left: itemLeft, top: itemTop } = item.getBoundingClientRect();
    const { borderRadius, zIndex } = window.getComputedStyle(target);
    return `left:${left - itemLeft}px;
          top:${top - itemTop}px;
          height:${height}px;
          width:${width}px;
          border-radius:${borderRadius || "0"};
          z-index:${zIndex};`;
  };
  const getTarget = (el, id) => {
    const target = targetMap[id];
    if (target)
      return target;
    if (el.getAttribute("data-waves") !== null)
      return el;
    return el.closest("[data-waves]") || null;
  };
  const handler = (e) => {
    const el = e.target;
    const id = el.getAttribute("data-waves-id") || "";
    const target = getTarget(el, id);
    if (!target || target.getAttribute("disabled"))
      return;
    const color = target.getAttribute("data-waves");
    let { clientX, clientY } = e;
    if (pointerType === "touch") {
      const click = e.touches[0];
      clientX = click.clientX;
      clientY = click.clientY;
    }
    const params = getWavesParams(clientX, clientY, id, target);
    const waves2 = createWaves(params, color);
    const { container, item } = params;
    container.setAttribute("style", getContainerStyle(target, item));
    container.appendChild(waves2);
  };
  const Waves = () => {
    pointerType = getPointerType();
    const eventType = `${pointerType}${pointerType === "touch" ? "start" : "down"}`;
    window.addEventListener(eventType, handler);
  };
  document.addEventListener("DOMContentLoaded", () => Waves());
  const checkBrowserValidity = (input) => {
    return input.checkValidity() || input.validationMessage;
  };
  const setAdvancedMode = (formField, content) => {
    const helper = document.createElement("div");
    helper.axGenerated = true;
    formField.appendChild(helper);
    helper.classList.add("form-helper-invalid");
    helper.innerHTML = content;
  };
  const clearAdvancedMode = (formField) => {
    const helper = formField.querySelector(".form-helper-invalid");
    if (!helper)
      return;
    if (helper.axGenerated)
      helper.remove();
  };
  const resetInputValidation = (formField) => {
    formField.classList.remove("form-valid", "form-invalid", "form-no-helper");
    clearAdvancedMode(formField);
  };
  const validateInput = (input, eType) => {
    const advancedMode = input.getAttribute("data-form-validate");
    let auto = false;
    if (advancedMode) {
      const advSplit = advancedMode.toLowerCase().split(",");
      auto = advSplit.includes("auto");
      if (advSplit.includes("lazy") && eType === "input")
        return;
    }
    const isValid = checkBrowserValidity(input);
    const formField = input.closest(".form-field, .form-file");
    resetInputValidation(formField);
    if (isValid !== true) {
      if (auto && typeof isValid === "string")
        setAdvancedMode(formField, isValid);
      else if (!formField.querySelector(".form-helper-invalid"))
        formField.classList.add("form-no-helper");
      formField.classList.add("form-invalid");
      return false;
    }
    formField.classList.add("form-valid");
    if (!formField.querySelector(".form-helper-valid"))
      formField.classList.add("form-no-helper");
    return true;
  };
  let isInit = true;
  const detectAllInputs = (inputElements) => {
    inputElements.forEach(detectInput);
  };
  const delayDetectionAllInputs = (inputElements) => {
    if (isInit) {
      isInit = false;
      return;
    }
    setTimeout(() => {
      detectAllInputs(inputElements);
    }, 10);
  };
  const detectInput = (input) => {
    const formField = input.closest(".form-field");
    const customSelect = formField.querySelector(".form-custom-select");
    const isActive = formField.classList.contains("active");
    const types = ["date", "month", "week", "time"];
    let hasContent = customSelect && input.tagName === "DIV" && input.innerText.length > 0;
    if (!customSelect)
      hasContent = input.value.length > 0 || input.tagName !== "SELECT" && input.placeholder.length > 0 || input.tagName === "SELECT" || types.some((type) => input.matches(`[type="${type}"]`));
    const isFocused = document.activeElement === input;
    const isDisabled = input.hasAttribute("disabled") || input.hasAttribute("readonly");
    if (input.firstInit) {
      updateInput(input, isActive, hasContent, isFocused, formField, customSelect);
      input.firstInit = false;
      input.isInit = true;
    } else {
      if (!isDisabled)
        updateInput(input, isActive, hasContent, isFocused, formField, customSelect);
    }
  };
  const updateInput = (input, isActive, hasContent, isFocused, formField, customSelect) => {
    const isTextArea = input.type === "textarea";
    const label = formField.querySelector("label:not(.form-check)");
    if (!isActive && (hasContent || isFocused)) {
      formField.classList.add("active");
    } else if (isActive && !(hasContent || isFocused)) {
      formField.classList.remove("active");
    }
    if (!isTextArea)
      setFormPosition(input, formField, customSelect, label);
    else if (label)
      label.style.backgroundColor = getLabelColor(label);
    if (isFocused && !isTextArea)
      formField.classList.add("is-focused");
    else if (!customSelect)
      formField.classList.remove("is-focused");
    if (isFocused && isTextArea)
      formField.classList.add("is-textarea-focused");
    else
      formField.classList.remove("is-textarea-focused");
  };
  const setFormPosition = (input, formField, customSelect, label) => {
    const inputWidth = input.clientWidth, inputLeftOffset = input.offsetLeft;
    const topOffset = input.clientHeight + (customSelect ? customSelect.offsetTop : input.offsetTop) + "px";
    const isBordered = input.closest(".form-material").classList.contains("form-material-bordered");
    formField.style.setProperty(getCssVar("form-material-position"), topOffset);
    let offset = inputLeftOffset, side = "left", width = inputWidth + "px", labelLeft = 0;
    if (formField.classList.contains("form-rtl")) {
      side = "right";
      offset = formField.clientWidth - inputWidth - inputLeftOffset;
    }
    formField.style.setProperty(getCssVar(`form-material-${side}-offset`), offset + "px");
    if (offset != 0)
      labelLeft = inputLeftOffset;
    formField.style.setProperty(getCssVar("form-material-width"), width);
    if (label) {
      label.style.left = labelLeft + "px";
      if (isBordered)
        label.style.backgroundColor = getLabelColor(label);
    }
  };
  const extractBgColor = (target) => {
    const bg = window.getComputedStyle(target).backgroundColor;
    if (bg && !["transparent", "rgba(0, 0, 0, 0)"].includes(bg))
      return bg;
  };
  const getLabelColor = (label) => {
    label.style.backgroundColor = "";
    let target = label;
    while (target.parentElement) {
      const bg = extractBgColor(target);
      if (bg)
        return bg;
      target = target.parentElement;
    }
    const htmlBg = extractBgColor(document.documentElement);
    if (htmlBg)
      return htmlBg;
    return "white";
  };
  const validate = (input, e) => {
    if (input.hasAttribute(`data-form-validate`))
      validateInput(input, e.type);
  };
  const handleListeners = (inputs, e) => {
    inputs.forEach((input) => {
      if (input === e.target)
        detectInput(input);
    });
  };
  const handleResetEvent = (inputs, e) => {
    if (e.target.tagName === "FORM" && e.target.classList.contains("form-material"))
      delayDetectionAllInputs(inputs);
  };
  const setupFormsListeners = (inputElements) => {
    inputElements.forEach((input) => {
      input.firstInit = true;
      input.validateRef = validate.bind(null, input);
      input.addEventListener("input", input.validateRef);
      input.addEventListener("change", input.validateRef);
    });
    detectAllInputs(inputElements);
    const handleListenersRef = handleListeners.bind(null, inputElements);
    document.addEventListener("focus", handleListenersRef, true);
    document.addEventListener("blur", handleListenersRef, true);
    const delayDetectionAllInputsRef = delayDetectionAllInputs.bind(null, inputElements);
    window.addEventListener("pageshow", delayDetectionAllInputsRef);
    const handleResetRef = handleResetEvent.bind(null, inputElements);
    document.addEventListener("reset", handleResetRef);
    const detectAllInputsRef = detectAllInputs.bind(null, inputElements);
    window.addEventListener("resize", detectAllInputsRef);
  };
  const handleFileInput = (input, filePath) => {
    const files = input.files;
    if (files.length > 1) {
      filePath.innerHTML = Array.from(files).map((file) => file.name).join(", ");
    } else if (files[0]) {
      filePath.innerHTML = files[0].name;
    }
  };
  const setupFormFile = (element) => {
    if (element.isInit)
      return;
    element.isInit = true;
    const input = element.querySelector('input[type="file"]');
    const filePath = element.querySelector(".form-file-path");
    input.handleRef = handleFileInput.bind(null, input, filePath);
    input.validateRef = validate.bind(null, input);
    input.addEventListener("change", input.handleRef);
    input.addEventListener("input", input.validateRef);
    input.addEventListener("change", input.validateRef);
  };
  const updateInputsFile = () => {
    const elements = Array.from(document.querySelectorAll(".form-file"));
    try {
      elements.forEach(setupFormFile);
    } catch (error) {
      console.error("[Axentix] Form file error", error);
    }
  };
  const updateInputs = (inputElements = document.querySelectorAll(".form-material .form-field:not(.form-default) .form-control:not(.form-custom-select)")) => {
    const { setupInputs, detectInputs } = Array.from(inputElements).reduce((acc, el) => {
      if (el.isInit)
        acc.detectInputs.push(el);
      else
        acc.setupInputs.push(el);
      return acc;
    }, { setupInputs: [], detectInputs: [] });
    updateInputsFile();
    try {
      if (setupInputs.length > 0)
        setupFormsListeners(setupInputs);
      if (detectInputs.length > 0)
        detectAllInputs(detectInputs);
    } catch (error) {
      console.error("[Axentix] Material forms error", error);
    }
  };
  document.addEventListener("DOMContentLoaded", () => updateInputs());
  const SelectOptions = {
    inputClasses: ""
  };
  class Select extends AxentixComponent {
    constructor(element, options) {
      super();
      __privateAdd(this, _setupDropdown);
      __privateAdd(this, _createCheckbox);
      __privateAdd(this, _setupContent);
      __privateAdd(this, _setFocusedClass);
      __privateAdd(this, _onClick);
      __privateAdd(this, _select);
      __privateAdd(this, _unSelect);
      __publicField(this, "options");
      __privateAdd(this, _dropdownInstance, void 0);
      __privateAdd(this, _container2, void 0);
      __privateAdd(this, _input, void 0);
      __privateAdd(this, _label, void 0);
      __privateAdd(this, _clickRef, void 0);
      try {
        this.preventDbInstance(element);
        instances.push({ type: "Select", instance: this });
        this.el = document.querySelector(element);
        this.options = getComponentOptions("Select", options, this.el);
        this.setup();
      } catch (error) {
        console.error("[Axentix] Select init error", error);
      }
    }
    setup() {
      this.el.style.display = "none";
      __privateSet(this, _container2, wrap([this.el]));
      __privateGet(this, _container2).className = "form-custom-select";
      __privateMethod(this, _setupDropdown, setupDropdown_fn).call(this);
    }
    reset() {
      this.destroy(true);
      super.reset();
    }
    destroy(withoutSuperCall) {
      if (!withoutSuperCall)
        super.destroy();
      if (__privateGet(this, _dropdownInstance)) {
        __privateGet(this, _dropdownInstance).el.removeEventListener("ax.dropdown.open", __privateGet(this, _clickRef));
        __privateGet(this, _dropdownInstance).el.removeEventListener("ax.dropdown.close", __privateGet(this, _clickRef));
        __privateSet(this, _clickRef, null);
        __privateGet(this, _dropdownInstance).destroy();
        __privateGet(this, _dropdownInstance).el.remove();
        __privateSet(this, _dropdownInstance, null);
      }
      unwrap(__privateGet(this, _container2));
      this.el.classList.add("form-custom-select");
      this.el.style.display = "";
    }
  }
  _dropdownInstance = new WeakMap();
  _container2 = new WeakMap();
  _input = new WeakMap();
  _label = new WeakMap();
  _clickRef = new WeakMap();
  _setupDropdown = new WeakSet();
  setupDropdown_fn = function() {
    const uid = `dropdown-${getUid()}`;
    __privateSet(this, _input, document.createElement("div"));
    __privateGet(this, _input).className = `form-control ${this.options.inputClasses}`;
    __privateGet(this, _input).dataset.target = uid;
    const dropdownContent = document.createElement("div");
    const classes = this.el.className.replace("form-control", "");
    dropdownContent.className = `dropdown-content ${classes}`;
    if (this.el.disabled) {
      __privateGet(this, _input).setAttribute("disabled", "");
      __privateGet(this, _container2).append(__privateGet(this, _input));
      __privateMethod(this, _setupContent, setupContent_fn).call(this, dropdownContent);
      return;
    }
    __privateSet(this, _clickRef, __privateMethod(this, _setFocusedClass, setFocusedClass_fn).bind(this));
    const dropdown2 = document.createElement("div");
    dropdown2.className = "dropdown";
    dropdown2.id = uid;
    dropdown2.addEventListener("ax.dropdown.open", __privateGet(this, _clickRef));
    dropdown2.addEventListener("ax.dropdown.close", __privateGet(this, _clickRef));
    Array.from(this.el.attributes).forEach((a) => {
      if (a.name.startsWith("data-dropdown"))
        dropdown2.setAttribute(a.name, a.value);
    });
    dropdown2.append(__privateGet(this, _input));
    dropdown2.append(dropdownContent);
    __privateGet(this, _container2).append(dropdown2);
    __privateMethod(this, _setupContent, setupContent_fn).call(this, dropdownContent);
    const dropdownClass = getComponentClass("Dropdown");
    __privateSet(this, _dropdownInstance, new dropdownClass(`#${uid}`, {
      closeOnClick: !this.el.multiple,
      preventViewport: true
    }));
    const zindex = window.getComputedStyle(dropdown2).zIndex;
    __privateSet(this, _label, this.el.closest(".form-field").querySelector("label:not(.form-check)"));
    if (__privateGet(this, _label))
      __privateGet(this, _label).style.zIndex = zindex + 5;
  };
  _createCheckbox = new WeakSet();
  createCheckbox_fn = function(content, isDisabled) {
    const formField = document.createElement("div");
    formField.className = "form-field";
    const label = document.createElement("label");
    label.className = "form-check";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    if (isDisabled)
      checkbox.setAttribute("disabled", "");
    const span = document.createElement("span");
    span.innerHTML = content;
    label.append(checkbox, span);
    formField.append(label);
    return formField;
  };
  _setupContent = new WeakSet();
  setupContent_fn = function(dropdownContent) {
    for (const option of this.el.options) {
      const isDisabled = option.hasAttribute("disabled");
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.innerHTML = this.el.multiple ? __privateMethod(this, _createCheckbox, createCheckbox_fn).call(this, option.text, isDisabled).innerHTML : option.text;
      item.axValue = option.value || option.text;
      if (!isDisabled) {
        item.axClickRef = __privateMethod(this, _onClick, onClick_fn).bind(this, item);
        item.addEventListener("click", item.axClickRef);
      } else
        item.classList.add("form-disabled");
      if (option.hasAttribute("selected") || !this.el.multiple && this.el.value === (option.value || option.text))
        __privateMethod(this, _select, select_fn).call(this, item);
      dropdownContent.append(item);
    }
  };
  _setFocusedClass = new WeakSet();
  setFocusedClass_fn = function() {
    __privateGet(this, _input).closest(".form-field").classList.toggle("is-focused");
  };
  _onClick = new WeakSet();
  onClick_fn = function(item, e) {
    e.preventDefault();
    if (!item.classList.contains("form-selected"))
      __privateMethod(this, _select, select_fn).call(this, item);
    else
      __privateMethod(this, _unSelect, unSelect_fn).call(this, item);
  };
  _select = new WeakSet();
  select_fn = function(item) {
    const value = item.axValue;
    if (this.el.multiple)
      item.querySelector("input").checked = true;
    else if (__privateGet(this, _dropdownInstance))
      __privateGet(this, _dropdownInstance).el.querySelectorAll(".dropdown-item").forEach((i) => i.classList.remove("form-selected"));
    item.classList.add("form-selected");
    const computedValue = this.el.multiple ? [...__privateGet(this, _input).innerText.split(", ").filter(Boolean), value].join(", ") : value;
    __privateGet(this, _input).innerText = computedValue;
    this.el.value = computedValue;
    updateInputs([__privateGet(this, _input)]);
  };
  _unSelect = new WeakSet();
  unSelect_fn = function(item) {
    const value = item.axValue;
    item.classList.remove("form-selected");
    let computedValue = "";
    if (this.el.multiple) {
      item.querySelector("input").checked = false;
      const values = __privateGet(this, _input).innerText.split(", ").filter(Boolean);
      const i = values.findIndex((v) => v === value);
      values.splice(i, 1);
      computedValue = values.join(", ");
    }
    __privateGet(this, _input).innerText = computedValue;
    this.el.value = computedValue;
    updateInputs([__privateGet(this, _input)]);
  };
  __publicField(Select, "getDefaultOptions", () => SelectOptions);
  registerComponent({
    class: Select,
    name: "Select",
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: ".form-custom-select"
    }
  });

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  createCommonjsModule(function (module, exports) {
  var Gr=Object.defineProperty;var ks=Math.pow,jr=(c,v,b)=>v in c?Gr(c,v,{enumerable:!0,configurable:!0,writable:!0,value:b}):c[v]=b;var f=(c,v,b)=>(jr(c,typeof v!="symbol"?v+"":v,b),b),_s=(c,v,b)=>{if(!v.has(c))throw TypeError("Cannot "+b)};var e=(c,v,b)=>(_s(c,v,"read from private field"),b?b.call(c):v.get(c)),n=(c,v,b)=>{if(v.has(c))throw TypeError("Cannot add the same private member more than once");v instanceof WeakSet?v.add(c):v.set(c,b);},o=(c,v,b,Me)=>(_s(c,v,"write to private field"),Me?Me.call(c,b):v.set(c,b),b),Ks=(c,v,b,Me)=>({set _(bo){o(c,v,bo,b);},get _(){return e(c,v,Me)}}),h=(c,v,b)=>(_s(c,v,"access private method"),b);(function(c,v){v(exports);})(commonjsGlobal,function(c){var Dt,ft,L,Ct,pe,Tt,ue,It,B,fe,At,mt,vt,St,kt,Rt,Ot,it,Ne,Be,k,We,x,fi,Po,mi,Ho,Ve,Js,st,ce,me,Rs,vi,zo,yi,No,gi,Bo,bi,Wo,Li,Vo,Xe,Qs,Ye,to,Fe,eo,ve,Os,Ue,io,Mt,ye,qt,R,ot,ge,$t,Pt,W,wi,Xo,xi,Yo,Ei,Fo,Ge,so,Di,Uo,je,oo,Ci,Go,be,X,Y,Ht,Le,F,we,nt,zt,xe,Ti,jo,Ze,no,Ii,Zo,_e,ro,Ai,_o,U,Nt,G,V,Bt,Wt,Vt,Si,Ko,ki,Jo,Ri,Qo,Oi,tn,Ke,ao,rt,j,Ee,yt,Xt,Yt,Ft,Ut,Mi,en,qi,sn,$i,on,Pi,nn,Hi,rn,Gt,jt,Zt,_t,Kt,C,De,Ce,E,gt,bt,Z,Je,_,Lt,K,zi,an,Ni,ln,Bi,hn,Wi,cn,Vi,dn,Xi,pn,Yi,un,Fi,fn,Ui,mn,Gi,vn,ji,Zi,yn,_i,gn,Te,J,at,lt,Qe,lo,Ki,bn,Ji,Ln,O,w,M,T,Ie,Ae,Jt,Qt,te,wt,ee,Q,ie,Se,se,q,Qi,wn,ts,xn,es,En,is,Dn,ss,Cn,ti,ho,ei,co,os,Tn,ns,In,rs,An,as,Sn,ls,kn,xt,ht,oe,tt,hs,Rn,cs,On,ds,Mn,ps,qn,us,$n,ii,po,ke,et,fs,Pn,ms,Hn,vs,zn,ys,Nn,gs,Bn,bs,Wn,si,uo,m,Re,ne,re,ae,le,I,ct,oi,fo,Ls,Vn,ws,Xn,xs,Yn,Es,Fn,$,Et,D,Oe,dt,Ds,Un,Cs,Gn,ni,mo,Ts,jn,Is,Zn,ri,vo,As,_n,Ss,Kn,ai,yo,li,go;const Jn="2.0.1",g=[],H={components:[],plugins:[],prefix:"ax",mode:""},z=r=>`--${H.prefix}-${r}`,ut=r=>H.components.find(s=>s.name===r).class,Ms=()=>{const r=H.components.filter(t=>t.dataDetection),s=H.plugins.filter(t=>t.dataDetection);return [...r,...s].map(t=>t.name)},Lo=()=>{const r=H.components.filter(t=>t.autoInit&&t.autoInit.enabled),s=H.plugins.filter(t=>t.autoInit&&t.autoInit.enabled);return [...r,...s].reduce((t,i)=>(t[i.name]=document.querySelectorAll(i.autoInit.selector),t),{})},wo=(r,s)=>{if(!r.name||!r.class){console.error(`[Axentix] Error registering ${s} : Missing required parameters.`);return}if(H[s].some(t=>t.name===r.name)){console.error(`[Axentix] Error registering ${s} : Already exist.`);return}r.autoInit&&(r.autoInit.selector=r.autoInit.selector+=":not(.no-axentix-init)"),H[s].push(r);},A=r=>{wo(r,"components");},Qn=r=>{wo(r,"plugins");},tr=()=>{!window||(window.Axentix||(window.Axentix={}),[...H.components,...H.plugins].forEach(r=>{window.Axentix[r.name]=r.class;}));},er=r=>r.replace(/[\w]([A-Z])/g,s=>s[0]+"-"+s[1]).toLowerCase(),ir=(r,s="")=>{const t=er(r);return s?s+"-"+t:t},sr=(r,s,t,i,a="")=>{const l=s[0].toUpperCase()+s.slice(1).toLowerCase();Ms().includes(l)&&t!=="Collapsible"&&l!=="Sidenav"&&(r[s]=ut(l).getDefaultOptions());const d=a?a+"-"+s:s,u=xo(r[s],t,i,d);if(!(Object.keys(u).length===0&&r.constructor===Object))return u},xo=(r,s,t,i="")=>Object.keys(r).reduce((a,l)=>{if(typeof r[l]=="object"&&r[l]!==null){const d=sr(r,l,s,t,i);d&&(a[l]=d);}else if(r[l]!==null){const d="data-"+s.toLowerCase()+"-"+ir(l,i);if(t.hasAttribute(d)){const u=t.getAttribute(d);a[l]=typeof r[l]=="number"?Number(u):u,typeof r[l]=="boolean"&&(a[l]=u==="true");}}return a},{}),or=(r,s)=>{const t=Object.assign({},ut(r).getDefaultOptions());return xo(t,r,s)},nr=()=>{document.querySelectorAll("[data-ax]").forEach(s=>{let t=s.dataset.ax;if(t=t[0].toUpperCase()+t.slice(1).toLowerCase(),!Ms().includes(t)){console.error(`[Axentix] Error: ${t} component doesn't exist. 
 Did you forget to register him ?`,s);return}try{const i=ut(t);new i(`#${s.id}`);}catch(i){console.error("[Axentix] Data: Unable to load "+t,i);}});},rr=()=>{try{new Axentix.Axentix("all");}catch(r){console.error("[Axentix] Unable to auto init.",r);}};document.addEventListener("DOMContentLoaded",()=>{document.documentElement.dataset.axentix&&rr(),nr();});const qe=(...r)=>r.reduce((s,t)=>{for(let i in t)s[i]=typeof t[i]=="object"&&t[i]!==null?qe(s[i],t[i]):t[i];return s},{}),S=(r,s,t)=>qe(ut(r).getDefaultOptions(),or(r,t),s),hi=(r,s=document.createElement("div"))=>(r[0].parentElement.insertBefore(s,r[0]),r.forEach(i=>s.appendChild(i)),s),Eo=r=>r.replaceWith(...r.childNodes),p=(r,s,t)=>{const i=new CustomEvent("ax."+s,{detail:t||{},bubbles:!0});r.dispatchEvent(i);},Do=()=>"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0,Co=()=>!!window.PointerEvent&&"maxTouchPoints"in window.navigator&&window.navigator.maxTouchPoints>=0,qs=()=>Do()?"touch":Co()?"pointer":"mouse",$e=r=>g.filter(s=>s.type===r).map(s=>s.instance),Pe=r=>{const s=g.find(t=>t.type!=="Toast"&&"#"+t.instance.el.id===r);return s?s.instance:!1},ci=()=>Math.random().toString().split(".")[1],ar=()=>g,lr=r=>Pe(r).sync(),hr=()=>g.map(r=>r.instance.sync()),cr=r=>Pe(r).reset(),dr=()=>g.map(r=>r.instance.reset()),pr=r=>Pe(r).destroy(),ur=()=>g.map(r=>r.instance.destroy()),$s=(r,s,t,i)=>{const a=r&&s?document.querySelector(`.ax-overlay[data-target="${t}"]`):document.createElement("div");return a.classList.add("ax-overlay"),a.style.transitionDuration=i+"ms",a.dataset.target=t,a},He=(r,s,t,i,a)=>{!r||(i?(s.addEventListener("click",t),document.body.appendChild(s),setTimeout(()=>{s.classList.add("active");},50)):(s.classList.remove("active"),setTimeout(()=>{s.removeEventListener("click",t),document.body.removeChild(s);},a)));},de=(r,s='[data-target="{ID}"]')=>Array.from(document.querySelectorAll(s.replace("{ID}",r)));class N{constructor(){f(this,"el");}removeListeners(){}setupListeners(){}setup(){}preventDbInstance(s){if(s&&Pe(s))throw new Error(`Instance already exist on ${s}`)}sync(){p(this.el,"component.sync"),this.removeListeners(),this.setupListeners();}reset(){p(this.el,"component.reset"),this.removeListeners(),this.setup();}destroy(){p(this.el,"component.destroy"),this.removeListeners();const s=g.findIndex(t=>t.instance.el.id===this.el.id);g.splice(s,1);}}const fr={animationDuration:500,height:"",backToOpposite:!0,enableTouch:!0,indicators:{enabled:!1,isFlat:!1,customClasses:""},autoplay:{enabled:!0,interval:5e3,side:"right"}};class Ps extends N{constructor(t,i){super();n(this,fi);n(this,mi);n(this,Ve);n(this,st);n(this,me);n(this,vi);n(this,yi);n(this,gi);n(this,bi);n(this,Li);n(this,Xe);n(this,Ye);n(this,Fe);n(this,ve);n(this,Ue);f(this,"options");f(this,"activeIndex");n(this,Dt,0);n(this,ft,!1);n(this,L,void 0);n(this,Ct,0);n(this,pe,0);n(this,Tt,!1);n(this,ue,!1);n(this,It,!1);n(this,B,0);n(this,fe,0);n(this,At,void 0);n(this,mt,void 0);n(this,vt,void 0);n(this,St,void 0);n(this,kt,void 0);n(this,Rt,void 0);n(this,Ot,void 0);n(this,it,void 0);n(this,Ne,0);n(this,Be,0);n(this,k,void 0);n(this,We,void 0);n(this,x,void 0);try{this.preventDbInstance(t),g.push({type:"Caroulix",instance:this}),this.el=document.querySelector(t),this.options=S("Caroulix",i,this.el),this.setup();}catch(a){console.error("[Axentix] Caroulix init error",a);}}setup(){p(this.el,"caroulix.setup"),this.options.autoplay.side=this.options.autoplay.side.toLowerCase(),["right","left"].includes(this.options.autoplay.side)||(this.options.autoplay.side="right"),this.activeIndex=0,o(this,Dt,0),o(this,ft,!1),o(this,x,qs()),o(this,L,h(this,fi,Po).call(this)),this.options.indicators.enabled&&h(this,bi,Wo).call(this);const i=this.el.querySelector(".active");i?this.activeIndex=e(this,L).indexOf(i):e(this,L)[0].classList.add("active"),h(this,mi,Ho).call(this),e(this,Ct)===0&&h(this,me,Rs).call(this),this.setupListeners(),this.options.autoplay.enabled&&this.play();}setupListeners(){o(this,At,h(this,me,Rs).bind(this)),window.addEventListener("resize",e(this,At)),e(this,vt)&&(o(this,St,this.next.bind(this,1)),e(this,vt).addEventListener("click",e(this,St))),e(this,mt)&&(o(this,kt,this.prev.bind(this,1)),e(this,mt).addEventListener("click",e(this,kt))),this.options.enableTouch&&(o(this,Rt,h(this,vi,zo).bind(this)),o(this,Ot,h(this,yi,No).bind(this)),o(this,it,h(this,gi,Bo).bind(this)),this.el.addEventListener(`${e(this,x)}${e(this,x)==="touch"?"start":"down"}`,e(this,Rt)),this.el.addEventListener(`${e(this,x)}move`,e(this,Ot)),this.el.addEventListener(`${e(this,x)}${e(this,x)==="touch"?"end":"up"}`,e(this,it)),this.el.addEventListener(e(this,x)==="pointer"?"pointerleave":"mouseleave",e(this,it)));}removeListeners(){window.removeEventListener("resize",e(this,At)),o(this,At,void 0),e(this,vt)&&(e(this,vt).removeEventListener("click",e(this,St)),o(this,St,void 0)),e(this,mt)&&(e(this,mt).removeEventListener("click",e(this,kt)),o(this,kt,void 0)),this.options.enableTouch&&(this.el.removeEventListener(`${e(this,x)}${e(this,x)==="pointer"?"down":"start"}`,e(this,Rt)),this.el.removeEventListener(`${e(this,x)}move`,e(this,Ot)),this.el.removeEventListener(`${e(this,x)}${e(this,x)==="touch"?"end":"up"}`,e(this,it)),this.el.removeEventListener(e(this,x)==="pointer"?"pointerleave":"mouseleave",e(this,it)),o(this,Rt,void 0),o(this,Ot,void 0),o(this,it,void 0));}goTo(t){if(t===this.activeIndex)return;(t>this.activeIndex?"right":"left")==="left"?this.prev(Math.abs(this.activeIndex-t)):this.next(Math.abs(this.activeIndex-t)),this.options.indicators.enabled&&h(this,Xe,Qs).call(this);}play(){!this.options.autoplay.enabled||(this.stop(),o(this,We,setInterval(()=>{this.options.autoplay.side==="right"?this.next(1,!1):this.prev(1,!1);},this.options.autoplay.interval)));}stop(){!this.options.autoplay.enabled||clearInterval(e(this,We));}next(t=1,i=!0){e(this,Tt)||this.activeIndex===e(this,L).length-1&&!this.options.backToOpposite||(p(this.el,"caroulix.next",{step:t}),o(this,ft,!0),i&&this.options.autoplay.enabled&&this.stop(),this.activeIndex<e(this,L).length-1?this.activeIndex+=t:this.options.backToOpposite&&(this.activeIndex=0),h(this,Ue,io).call(this),h(this,st,ce).call(this),i&&this.options.autoplay.enabled&&this.play());}prev(t=1,i=!0){e(this,Tt)||this.activeIndex===0&&!this.options.backToOpposite||(p(this.el,"caroulix.prev",{step:t}),o(this,ft,!0),i&&this.options.autoplay.enabled&&this.stop(),this.activeIndex>0?this.activeIndex-=t:this.options.backToOpposite&&(this.activeIndex=e(this,L).length-1),h(this,Ue,io).call(this),h(this,st,ce).call(this),i&&this.options.autoplay.enabled&&this.play());}}Dt=new WeakMap,ft=new WeakMap,L=new WeakMap,Ct=new WeakMap,pe=new WeakMap,Tt=new WeakMap,ue=new WeakMap,It=new WeakMap,B=new WeakMap,fe=new WeakMap,At=new WeakMap,mt=new WeakMap,vt=new WeakMap,St=new WeakMap,kt=new WeakMap,Rt=new WeakMap,Ot=new WeakMap,it=new WeakMap,Ne=new WeakMap,Be=new WeakMap,k=new WeakMap,We=new WeakMap,x=new WeakMap,fi=new WeakSet,Po=function(){return Array.from(this.el.children).reduce((t,i)=>(i.classList.contains("caroulix-item")&&t.push(i),i.classList.contains("caroulix-prev")&&o(this,mt,i),i.classList.contains("caroulix-next")&&o(this,vt,i),t),[])},mi=new WeakSet,Ho=function(){o(this,Ct,0),o(this,pe,0),e(this,L).forEach(t=>{const i=t.querySelector("img, video");i&&(Ks(this,Ct)._++,i.complete?h(this,Ve,Js).call(this,i,!0):(i.loadRef=h(this,Ve,Js).bind(this,i),i.addEventListener("load",i.loadRef)));});},Ve=new WeakSet,Js=function(t,i){Ks(this,pe)._++,i||(t.removeEventListener("load",t.loadRef),t.loadRef=void 0),e(this,Ct)==e(this,pe)&&(h(this,me,Rs).call(this),h(this,st,ce).call(this,!0));},st=new WeakSet,ce=function(t=!1){const i=this.el.getBoundingClientRect().width;e(this,L).forEach((l,d)=>{l.style.transform=`translateX(${i*d-i*this.activeIndex-e(this,Dt)}px)`;}),this.options.indicators.enabled&&h(this,Xe,Qs).call(this),e(this,L).find(l=>l.classList.contains("active")).classList.remove("active"),e(this,L)[this.activeIndex].classList.add("active"),setTimeout(()=>{o(this,ft,!1);},this.options.animationDuration),t&&setTimeout(()=>h(this,ve,Os).call(this,this.options.animationDuration),50);},me=new WeakSet,Rs=function(){if(o(this,Tt,!0),this.el.style.transitionDuration="",this.options.autoplay.enabled&&this.play(),this.options.height)this.el.style.height=this.options.height;else {const t=e(this,L).map(a=>a.offsetHeight),i=Math.max(...t);this.el.style.height=i+"px";}h(this,st,ce).call(this),setTimeout(()=>{this.el.style.transitionDuration=this.options.animationDuration+"ms",o(this,Tt,!1);},50);},vi=new WeakSet,zo=function(t){t.target.closest(".caroulix-arrow")||t.target.closest(".caroulix-indicators")||e(this,ft)||(t.type!=="touchstart"&&t.preventDefault(),this.options.autoplay.enabled&&this.stop(),h(this,ve,Os).call(this,0),o(this,It,!0),o(this,ue,!1),o(this,B,0),o(this,fe,0),o(this,Ne,h(this,Ye,to).call(this,t)),o(this,Be,h(this,Fe,eo).call(this,t)));},yi=new WeakSet,No=function(t){if(!e(this,It)||e(this,ue))return;let i=h(this,Ye,to).call(this,t),a=h(this,Fe,eo).call(this,t);if(o(this,B,e(this,Ne)-i),o(this,fe,Math.abs(e(this,Be)-a)),t.type==="touchmove"&&e(this,fe)>Math.abs(e(this,B)))return o(this,ue,!0),o(this,B,0),!1;t.cancelable&&t.preventDefault(),o(this,Dt,e(this,B)),h(this,st,ce).call(this);},gi=new WeakSet,Bo=function(t){if(!(t.target.closest(".caroulix-arrow")||t.target.closest(".caroulix-indicators"))&&(t.cancelable&&t.preventDefault(),e(this,It))){h(this,ve,Os).call(this,this.options.animationDuration);let i=this.el.getBoundingClientRect().width;o(this,It,!1);const a=i*15/100;this.activeIndex!==e(this,L).length-1&&e(this,B)>a?this.next():this.activeIndex!==0&&e(this,B)<-a&&this.prev(),o(this,B,0),o(this,Dt,0),h(this,st,ce).call(this),this.options.autoplay.enabled&&this.play();}},bi=new WeakSet,Wo=function(){o(this,k,document.createElement("ul")),e(this,k).classList.add("caroulix-indicators"),this.options.indicators.isFlat&&e(this,k).classList.add("caroulix-flat"),this.options.indicators.customClasses&&(e(this,k).className=`${e(this,k).className} ${this.options.indicators.customClasses}`);for(let t=0;t<e(this,L).length;t++){const i=document.createElement("li");i.triggerRef=h(this,Li,Vo).bind(this,t),i.addEventListener("click",i.triggerRef),e(this,k).appendChild(i);}this.el.appendChild(e(this,k));},Li=new WeakSet,Vo=function(t,i){i.preventDefault(),t!==this.activeIndex&&this.goTo(t);},Xe=new WeakSet,Qs=function(){Array.from(e(this,k).children).forEach(t=>t.removeAttribute("class")),e(this,k).children[this.activeIndex].classList.add("active");},Ye=new WeakSet,to=function(t){return t.targetTouches&&t.targetTouches.length>=1?t.targetTouches[0].clientX:t.clientX},Fe=new WeakSet,eo=function(t){return t.targetTouches&&t.targetTouches.length>=1?t.targetTouches[0].clientY:t.clientY},ve=new WeakSet,Os=function(t){this.el.style.transitionDuration=t+"ms";},Ue=new WeakSet,io=function(){p(this.el,"caroulix.slide",{nextElement:e(this,L)[this.activeIndex],currentElement:e(this,L)[e(this,L).findIndex(t=>t.classList.contains("active"))]});},f(Ps,"getDefaultOptions",()=>fr),A({class:Ps,name:"Caroulix",dataDetection:!0,autoInit:{enabled:!0,selector:".caroulix"}});const mr={animationDuration:300,sidenav:{activeClass:!0,activeWhenOpen:!0,autoClose:!0}};class Hs extends N{constructor(t,i){super();n(this,wi);n(this,xi);n(this,Ei);n(this,Ge);n(this,Di);n(this,je);n(this,Ci);f(this,"options");n(this,Mt,void 0);n(this,ye,void 0);n(this,qt,!0);n(this,R,!1);n(this,ot,!1);n(this,ge,!1);n(this,$t,void 0);n(this,Pt,void 0);n(this,W,void 0);try{this.preventDbInstance(t),g.push({type:"Collapsible",instance:this}),this.el=document.querySelector(t),this.options=S("Collapsible",i,this.el),this.setup();}catch(a){console.error("[Axentix] Collapsible init error",a);}}setup(){p(this.el,"collapsible.setup"),o(this,Mt,de(this.el.id)),o(this,qt,!0),o(this,R,!!this.el.classList.contains("active")),o(this,ot,!1),o(this,W,""),o(this,ge,!1),this.setupListeners(),this.el.style.transitionDuration=this.options.animationDuration+"ms",h(this,xi,Yo).call(this),o(this,ge,!!this.el.querySelector(".active")),this.options.sidenav.activeClass&&h(this,Ei,Fo).call(this),e(this,R)&&this.open(),o(this,qt,!1);}setupListeners(){o(this,$t,h(this,Ci,Go).bind(this)),e(this,Mt).forEach(t=>t.addEventListener("click",e(this,$t))),o(this,Pt,h(this,wi,Xo).bind(this)),window.addEventListener("resize",e(this,Pt));}removeListeners(){e(this,Mt).forEach(t=>t.removeEventListener("click",e(this,$t))),o(this,$t,void 0),window.removeEventListener("resize",e(this,Pt)),o(this,Pt,void 0);}open(){e(this,R)&&!e(this,qt)||(p(this.el,"collapsible.open"),o(this,R,!0),o(this,ot,!0),this.el.style.display="block",h(this,je,oo).call(this),this.el.style.maxHeight=this.el.scrollHeight+"px",this.options.sidenav.activeWhenOpen&&h(this,Ge,so).call(this,!0),this.options.sidenav.autoClose&&h(this,Di,Uo).call(this),setTimeout(()=>{o(this,ot,!1);},this.options.animationDuration));}close(){!e(this,R)||(p(this.el,"collapsible.close"),o(this,ot,!0),this.el.style.maxHeight="",h(this,je,oo).call(this),this.options.sidenav.activeWhenOpen&&h(this,Ge,so).call(this,!1),setTimeout(()=>{this.el.style.display="",o(this,ot,!1),o(this,R,!1);},this.options.animationDuration));}}Mt=new WeakMap,ye=new WeakMap,qt=new WeakMap,R=new WeakMap,ot=new WeakMap,ge=new WeakMap,$t=new WeakMap,Pt=new WeakMap,W=new WeakMap,wi=new WeakSet,Xo=function(){e(this,R)&&!e(this,W)&&(this.el.style.maxHeight=this.el.scrollHeight+"px");},xi=new WeakSet,Yo=function(){const t=this.el.closest(".sidenav");t&&(o(this,W,t.id),o(this,ye,e(this,Mt).filter(i=>{var a;return ((a=i.closest(".sidenav"))==null?void 0:a.id)===t.id})));},Ei=new WeakSet,Fo=function(){!e(this,ge)||!e(this,W)||(e(this,ye).forEach(t=>t.classList.add("active")),this.el.classList.add("active"),this.open(),o(this,R,!0));},Ge=new WeakSet,so=function(t){!e(this,W)||e(this,ye).forEach(i=>{t?i.classList.add("active"):i.classList.remove("active");});},Di=new WeakSet,Uo=function(){!e(this,qt)&&e(this,W)&&$e("Collapsible").forEach(t=>{e(t,W)===e(this,W)&&t.el.id!==this.el.id&&t.close();});},je=new WeakSet,oo=function(){this.el.style.overflow="hidden",setTimeout(()=>{this.el.style.overflow="";},this.options.animationDuration);},Ci=new WeakSet,Go=function(t){t.preventDefault(),!e(this,ot)&&(e(this,R)?this.close():this.open());},f(Hs,"getDefaultOptions",()=>mr),A({class:Hs,name:"Collapsible",dataDetection:!0,autoInit:{enabled:!0,selector:".collapsible"}});const vr={overlay:!0,bodyScrolling:!1,animationDuration:300};class zs extends N{constructor(t,i){super();n(this,Ti);n(this,Ze);n(this,Ii);n(this,_e);n(this,Ai);f(this,"options");n(this,be,void 0);n(this,X,!1);n(this,Y,!1);n(this,Ht,!1);n(this,Le,!1);n(this,F,void 0);n(this,we,void 0);n(this,nt,void 0);n(this,zt,void 0);n(this,xe,void 0);try{this.preventDbInstance(t),g.push({type:"Sidenav",instance:this}),this.el=document.querySelector(t),this.options=S("Sidenav",i,this.el),this.setup();}catch(a){console.error("[Axentix] Sidenav init error",a);}}setup(){p(this.el,"sidenav.setup"),o(this,be,de(this.el.id)),o(this,X,!1),o(this,Y,!1),o(this,xe,window.innerWidth),o(this,Ht,this.el.classList.contains("sidenav-fixed"));const t=$e("Sidenav").find(i=>e(i,Ht));o(this,Le,t&&t.el===this.el),o(this,F,document.querySelector('.layout, [class*="layout-"]')),e(this,F)&&e(this,Le)&&h(this,Ze,no).call(this),this.setupListeners(),this.options.overlay&&o(this,we,$s(e(this,X),this.options.overlay,this.el.id,this.options.animationDuration)),e(this,F)&&e(this,Ht)&&h(this,Ii,Zo).call(this),this.el.style.transitionDuration=this.options.animationDuration+"ms";}setupListeners(){o(this,nt,h(this,Ai,_o).bind(this)),e(this,be).forEach(t=>t.addEventListener("click",e(this,nt))),o(this,zt,h(this,Ti,jo).bind(this)),window.addEventListener("resize",e(this,zt));}removeListeners(){e(this,be).forEach(t=>t.removeEventListener("click",e(this,nt))),o(this,nt,void 0),window.removeEventListener("resize",e(this,zt)),o(this,zt,void 0);}destroy(){p(this.el,"component.destroy"),this.removeListeners(),e(this,F)&&h(this,Ze,no).call(this);const t=g.findIndex(i=>i.instance.el.id===this.el.id);g.splice(t,1);}open(){e(this,X)||e(this,Y)||(p(this.el,"sidenav.open"),o(this,X,!0),o(this,Y,!0),this.el.classList.add("active"),He(this.options.overlay,e(this,we),e(this,nt),!0,this.options.animationDuration),h(this,_e,ro).call(this,!1),setTimeout(()=>{o(this,Y,!1),p(this.el,"sidenav.opened");},this.options.animationDuration));}close(){!e(this,X)||e(this,Y)||(o(this,Y,!0),p(this.el,"sidenav.close"),this.el.classList.remove("active"),He(this.options.overlay,e(this,we),e(this,nt),!1,this.options.animationDuration),setTimeout(()=>{h(this,_e,ro).call(this,!0),o(this,X,!1),o(this,Y,!1),p(this.el,"sidenav.closed");},this.options.animationDuration));}}be=new WeakMap,X=new WeakMap,Y=new WeakMap,Ht=new WeakMap,Le=new WeakMap,F=new WeakMap,we=new WeakMap,nt=new WeakMap,zt=new WeakMap,xe=new WeakMap,Ti=new WeakSet,jo=function(t){const a=t.target.innerWidth;e(this,xe)!==a&&this.close(),o(this,xe,a);},Ze=new WeakSet,no=function(){["layout-sidenav-right","layout-sidenav-both"].forEach(t=>e(this,F).classList.remove(t));},Ii=new WeakSet,Zo=function(){if(!e(this,Le))return;const t=Array.from(document.querySelectorAll(".sidenav")).filter(d=>d.classList.contains("sidenav-fixed")),{sidenavsRight:i,sidenavsLeft:a}=t.reduce((d,u)=>(u.classList.contains("sidenav-right")?d.sidenavsRight.push(u):d.sidenavsLeft.push(u),d),{sidenavsRight:[],sidenavsLeft:[]}),l=a.length>0&&i.length>0;i.length>0&&!l?e(this,F).classList.add("layout-sidenav-right"):l&&e(this,F).classList.add("layout-sidenav-both");},_e=new WeakSet,ro=function(t){this.options.bodyScrolling||(document.body.style.overflow=t?"":"hidden");},Ai=new WeakSet,_o=function(t){t.preventDefault(),!(e(this,Ht)&&window.innerWidth>=960)&&(e(this,X)?this.close():this.open());},f(zs,"getDefaultOptions",()=>vr),A({class:zs,name:"Sidenav",dataDetection:!0,autoInit:{enabled:!0,selector:".sidenav"}});const yr={animationDuration:300,animationType:"none",hover:!1,autoClose:!0,preventViewport:!1,closeOnClick:!0};class Ns extends N{constructor(t,i){super();n(this,Si);n(this,ki);n(this,Ri);n(this,Oi);n(this,Ke);f(this,"options");n(this,U,void 0);n(this,Nt,void 0);n(this,G,!1);n(this,V,!1);n(this,Bt,void 0);n(this,Wt,void 0);n(this,Vt,void 0);try{this.preventDbInstance(t),g.push({type:"Dropdown",instance:this}),this.el=document.querySelector(t),this.options=S("Dropdown",i,this.el),this.setup();}catch(a){console.error("[Axentix] Dropdown init error",a);}}setup(){p(this.el,"dropdown.setup"),o(this,U,this.el.querySelector(".dropdown-content")),o(this,Nt,de(this.el.id)[0]),o(this,G,!1),o(this,V,!!this.el.classList.contains("active")),this.options.hover?this.el.classList.add("active-hover"):this.setupListeners(),this.options.preventViewport&&this.el.classList.add("dropdown-vp"),h(this,Si,Ko).call(this);}setupListeners(){this.options.hover||(o(this,Wt,h(this,Ri,Qo).bind(this)),e(this,Nt).addEventListener("click",e(this,Wt)),o(this,Bt,h(this,ki,Jo).bind(this)),document.addEventListener("click",e(this,Bt),!0),o(this,Vt,h(this,Ke,ao).bind(this)),this.options.preventViewport&&window.addEventListener("scroll",e(this,Vt)));}removeListeners(){this.options.hover||(e(this,Nt).removeEventListener("click",e(this,Wt)),o(this,Wt,void 0),document.removeEventListener("click",e(this,Bt),!0),o(this,Bt,void 0),this.options.preventViewport&&window.removeEventListener("scroll",e(this,Vt)),o(this,Vt,void 0));}open(){e(this,V)||(p(this.el,"dropdown.open"),e(this,U).style.display="flex",this.options.preventViewport&&h(this,Ke,ao).call(this),setTimeout(()=>{this.el.classList.add("active"),o(this,V,!0);},10),this.options.autoClose&&h(this,Oi,tn).call(this),this.options.animationType!=="none"?(o(this,G,!0),setTimeout(()=>{o(this,G,!1),p(this.el,"dropdown.opened");},this.options.animationDuration)):p(this.el,"dropdown.opened"));}close(){!e(this,V)||(p(this.el,"dropdown.close"),this.el.classList.remove("active"),this.options.animationType!=="none"?(o(this,G,!0),setTimeout(()=>{e(this,U).style.display="",o(this,G,!1),o(this,V,!1),p(this.el,"dropdown.closed");},this.options.animationDuration)):(e(this,U).style.display="",o(this,V,!1),p(this.el,"dropdown.closed")));}}U=new WeakMap,Nt=new WeakMap,G=new WeakMap,V=new WeakMap,Bt=new WeakMap,Wt=new WeakMap,Vt=new WeakMap,Si=new WeakSet,Ko=function(){const t=["none","fade"];this.options.animationType=this.options.animationType.toLowerCase(),t.includes(this.options.animationType)||(this.options.animationType="none"),this.options.animationType==="fade"&&!this.options.hover&&(e(this,U).style.transitionDuration=this.options.animationDuration+"ms",this.el.classList.add("dropdown-anim-fade"));},ki=new WeakSet,Jo=function(t){t.target===e(this,Nt)||e(this,G)||!e(this,V)||!this.options.closeOnClick&&t.target.closest(".dropdown-content")||this.close();},Ri=new WeakSet,Qo=function(t){t.preventDefault(),!e(this,G)&&(e(this,V)?this.close():this.open());},Oi=new WeakSet,tn=function(){$e("Dropdown").forEach(t=>{t.el.id!==this.el.id&&t.close();});},Ke=new WeakSet,ao=function(){const t=e(this,U).getBoundingClientRect(),i=t.height-(t.bottom-(window.innerHeight||document.documentElement.clientHeight))-10;e(this,U).style.maxHeight=i+"px";},f(Ns,"getDefaultOptions",()=>yr),A({class:Ns,name:"Dropdown",dataDetection:!0,autoInit:{enabled:!0,selector:".dropdown"}});const gr={animationDuration:300,hover:!0,direction:"top",position:"bottom-right",offsetX:"1rem",offsetY:"1.5rem"};class Bs extends N{constructor(t,i){super();n(this,Mi);n(this,qi);n(this,$i);n(this,Pi);n(this,Hi);f(this,"options");n(this,rt,!1);n(this,j,!1);n(this,Ee,void 0);n(this,yt,void 0);n(this,Xt,void 0);n(this,Yt,void 0);n(this,Ft,void 0);n(this,Ut,void 0);try{this.preventDbInstance(t),g.push({type:"Fab",instance:this}),this.el=document.querySelector(t),this.options=S("Fab",i,this.el),this.setup();}catch(a){console.error("[Axentix] Fab init error",a);}}setup(){p(this.el,"fab.setup"),o(this,rt,!1),o(this,j,!1),o(this,Ee,de(this.el.id)[0]),o(this,yt,this.el.querySelector(".fab-menu")),h(this,Mi,en).call(this),this.setupListeners(),this.el.style.transitionDuration=this.options.animationDuration+"ms",h(this,qi,sn).call(this);}setupListeners(){this.options.hover?(o(this,Xt,this.open.bind(this)),o(this,Yt,this.close.bind(this)),this.el.addEventListener("mouseenter",e(this,Xt)),this.el.addEventListener("mouseleave",e(this,Yt))):(o(this,Ut,h(this,Hi,rn).bind(this)),this.el.addEventListener("click",e(this,Ut))),o(this,Ft,h(this,Pi,nn).bind(this)),document.addEventListener("click",e(this,Ft),!0);}removeListeners(){this.options.hover?(this.el.removeEventListener("mouseenter",e(this,Xt)),this.el.removeEventListener("mouseleave",e(this,Yt)),o(this,Xt,void 0),o(this,Yt,void 0)):(this.el.removeEventListener("click",e(this,Ut)),o(this,Ut,void 0)),document.removeEventListener("click",e(this,Ft),!0),o(this,Ft,void 0);}open(){e(this,j)||(p(this.el,"fab.open"),o(this,rt,!0),o(this,j,!0),this.el.classList.add("active"),setTimeout(()=>{o(this,rt,!1);},this.options.animationDuration));}close(){!e(this,j)||(p(this.el,"fab.close"),o(this,rt,!0),o(this,j,!1),this.el.classList.remove("active"),setTimeout(()=>{o(this,rt,!1);},this.options.animationDuration));}}rt=new WeakMap,j=new WeakMap,Ee=new WeakMap,yt=new WeakMap,Xt=new WeakMap,Yt=new WeakMap,Ft=new WeakMap,Ut=new WeakMap,Mi=new WeakSet,en=function(){["right","left","top","bottom"].includes(this.options.direction)||(this.options.direction="top"),["top-right","top-left","bottom-right","bottom-left"].includes(this.options.position)||(this.options.position="bottom-right");},qi=new WeakSet,sn=function(){this.options.position.split("-")[0]==="top"?this.el.style.top=this.options.offsetY:this.el.style.bottom=this.options.offsetY,this.options.position.split("-")[1]==="right"?this.el.style.right=this.options.offsetX:this.el.style.left=this.options.offsetX,(this.options.direction==="right"||this.options.direction==="left")&&this.el.classList.add("fab-dir-x"),h(this,$i,on).call(this);},$i=new WeakSet,on=function(){if(this.options.direction==="top"||this.options.direction==="bottom"){const t=e(this,Ee).clientHeight;this.options.direction==="top"?e(this,yt).style.bottom=t+"px":e(this,yt).style.top=t+"px";}else {const t=e(this,Ee).clientWidth;this.options.direction==="right"?e(this,yt).style.left=t+"px":e(this,yt).style.right=t+"px";}},Pi=new WeakSet,nn=function(t){!this.el.contains(t.target)&&e(this,j)&&this.close();},Hi=new WeakSet,rn=function(t){t.preventDefault(),!e(this,rt)&&(e(this,j)?this.close():this.open());},f(Bs,"getDefaultOptions",()=>gr),A({class:Bs,name:"Fab",dataDetection:!0,autoInit:{enabled:!0,selector:".fab:not(i)"}});const br={animationDuration:400,overlayClass:"grey dark-4",offset:150,mobileOffset:80,caption:""};class Ws extends N{constructor(t,i){super();n(this,zi);n(this,Ni);n(this,Bi);n(this,Wi);n(this,Vi);n(this,Xi);n(this,Yi);n(this,Fi);n(this,Ui);n(this,Gi);n(this,Zi);n(this,_i);f(this,"options");n(this,Gt,void 0);n(this,jt,void 0);n(this,Zt,void 0);n(this,_t,void 0);n(this,Kt,void 0);n(this,C,void 0);n(this,De,void 0);n(this,Ce,void 0);n(this,E,void 0);n(this,gt,0);n(this,bt,0);n(this,Z,!1);n(this,Je,!1);n(this,_,void 0);n(this,Lt,!1);n(this,K,!1);n(this,ji,()=>{e(this,Z)&&this.close();});try{this.preventDbInstance(t),g.push({type:"Lightbox",instance:this}),this.el=document.querySelector(t),this.options=S("Lightbox",i,this.el),this.setup();}catch(a){console.error("[Axentix] Lightbox init error",a);}}setup(){p(this.el,"lightbox.setup"),this.el.style.transitionDuration=this.options.animationDuration+"ms",o(this,_,hi([this.el])),this.setupListeners();}setupListeners(){o(this,Gt,h(this,_i,gn).bind(this)),this.el.addEventListener("click",e(this,Gt)),o(this,Zt,h(this,Ui,mn).bind(this)),o(this,_t,h(this,Gi,vn).bind(this)),o(this,Kt,e(this,ji).bind(this)),o(this,jt,h(this,Fi,fn).bind(this)),window.addEventListener("keyup",e(this,Zt)),window.addEventListener("scroll",e(this,_t)),window.addEventListener("resize",e(this,Kt)),this.el.addEventListener("transitionend",e(this,jt));}removeListeners(){this.el.removeEventListener("click",e(this,Gt)),this.el.removeEventListener("transitionend",e(this,jt)),window.removeEventListener("keyup",e(this,Zt)),window.removeEventListener("scroll",e(this,_t)),window.removeEventListener("resize",e(this,Kt)),o(this,Gt,void 0),o(this,Zt,void 0),o(this,_t,void 0),o(this,Kt,void 0),o(this,jt,void 0);}open(){o(this,K,!0);let t,i;e(this,Lt)?t=i=e(this,_).getBoundingClientRect():t=i=this.el.getBoundingClientRect(),o(this,Lt,!1),h(this,zi,an).call(this),h(this,Ni,ln).call(this);const a=window.innerHeight/2,l=window.innerWidth/2;o(this,E,t),this.el.style.width=e(this,E).width+"px",this.el.style.height=e(this,E).height+"px",this.el.style.top="0",this.el.style.left="0";const d=a+window.scrollY-(i.top+window.scrollY),u=l+window.scrollX-(i.left+window.scrollX);h(this,Vi,dn).call(this),e(this,_).style.position="relative",setTimeout(()=>{p(this.el,"lightbox.open"),o(this,Z,!0),this.el.classList.contains("responsive-media")&&(o(this,Je,!0),this.el.classList.remove("responsive-media")),this.el.classList.add("active"),e(this,_).style.width=e(this,E).width+"px",e(this,_).style.height=e(this,E).height+"px",this.el.style.width=e(this,bt)+"px",this.el.style.height=e(this,gt)+"px",this.el.style.top=d-e(this,gt)/2+"px",this.el.style.left=u-e(this,bt)/2+"px";},50);}close(t){(t==null?void 0:t.key)&&t.key!=="Escape"||(o(this,Z,!1),o(this,Lt,!0),o(this,K,!1),p(this.el,"lightbox.close"),h(this,Bi,hn).call(this),this.el.style.position="absolute",this.el.style.top="0px",this.el.style.left="0px",this.el.style.width=e(this,E).width+"px",this.el.style.height=e(this,E).height+"px");}}Gt=new WeakMap,jt=new WeakMap,Zt=new WeakMap,_t=new WeakMap,Kt=new WeakMap,C=new WeakMap,De=new WeakMap,Ce=new WeakMap,E=new WeakMap,gt=new WeakMap,bt=new WeakMap,Z=new WeakMap,Je=new WeakMap,_=new WeakMap,Lt=new WeakMap,K=new WeakMap,zi=new WeakSet,an=function(){if(!e(this,C)){if(h(this,Xi,pn).call(this),o(this,C,document.createElement("div")),e(this,C).style.transitionDuration=this.options.animationDuration+"ms",e(this,C).className="lightbox-overlay "+this.options.overlayClass,e(this,_).appendChild(e(this,C)),this.options.caption){const t=document.createElement("p");t.className="lightbox-caption",t.innerHTML=this.options.caption,e(this,C).appendChild(t);}o(this,De,this.close.bind(this)),e(this,C).addEventListener("click",e(this,De));}},Ni=new WeakSet,ln=function(){setTimeout(()=>{e(this,C).style.opacity="1";},50);},Bi=new WeakSet,hn=function(){e(this,C).style.opacity="0";},Wi=new WeakSet,cn=function(){e(this,C).removeEventListener("click",e(this,De)),e(this,C).remove(),o(this,C,null);},Vi=new WeakSet,dn=function(){const t=window.innerWidth>=960?this.options.offset:this.options.mobileOffset;window.innerWidth/window.innerHeight>=e(this,E).width/e(this,E).height?(o(this,gt,window.innerHeight-t),o(this,bt,e(this,gt)*e(this,E).width/e(this,E).height)):(o(this,bt,window.innerWidth-t),o(this,gt,e(this,bt)*e(this,E).height/e(this,E).width));},Xi=new WeakSet,pn=function(){o(this,Ce,[]);for(let t=this.el;t&&t!==document;t=t.parentNode){const i=window.getComputedStyle(t);(i.overflow==="hidden"||i.overflowX==="hidden"||i.overflowY==="hidden")&&(e(this,Ce).push(t),t!==document.body&&t.style.setProperty("overflow","visible","important"),document.body.style.overflowX="hidden");}},Yi=new WeakSet,un=function(){e(this,Ce).forEach(t=>t.style.overflow=""),document.body.style.overflowX="";},Fi=new WeakSet,fn=function(t){!t.propertyName.includes("width")&&!t.propertyName.includes("height")||(e(this,Lt)?(h(this,Zi,yn).call(this),o(this,Lt,!1),o(this,Z,!1),p(this.el,"lightbox.closed")):e(this,K)&&(o(this,K,!1),p(this.el,"lightbox.opened")));},Ui=new WeakSet,mn=function(t){t.key==="Escape"&&(e(this,K)||e(this,Z))&&this.close();},Gi=new WeakSet,vn=function(){(e(this,Z)||e(this,K))&&this.close();},ji=new WeakMap,Zi=new WeakSet,yn=function(){this.el.classList.remove("active"),h(this,Wi,cn).call(this),h(this,Yi,un).call(this),e(this,Je)&&this.el.classList.add("responsive-media"),e(this,_).removeAttribute("style"),this.el.style.position="",this.el.style.left="",this.el.style.top="",this.el.style.width="",this.el.style.height="",this.el.style.transform="";},_i=new WeakSet,gn=function(){if(e(this,K)||e(this,Z)){this.close();return}this.open();},f(Ws,"getDefaultOptions",()=>br),A({class:Ws,name:"Lightbox",dataDetection:!0,autoInit:{enabled:!0,selector:".lightbox"}});const Lr={overlay:!0,bodyScrolling:!1,animationDuration:400};class Vs extends N{constructor(t,i){super();n(this,Qe);n(this,Ki);n(this,Ji);f(this,"options");f(this,"overlayElement");n(this,Te,void 0);n(this,J,!1);n(this,at,!1);n(this,lt,void 0);try{this.preventDbInstance(t),g.push({type:"Modal",instance:this}),this.el=document.querySelector(t),this.options=S("Modal",i,this.el),this.setup();}catch(a){console.error("[Axentix] Modal init error",a);}}setup(){p(this.el,"modal.setup"),o(this,Te,de(this.el.id)),o(this,J,!!this.el.classList.contains("active")),o(this,at,!1),this.setupListeners(),this.options.overlay&&(this.overlayElement=$s(e(this,J),this.options.overlay,this.el.id,this.options.animationDuration)),this.el.style.transitionDuration=this.options.animationDuration+"ms",this.el.style.animationDuration=this.options.animationDuration+"ms";}setupListeners(){o(this,lt,h(this,Ji,Ln).bind(this)),e(this,Te).forEach(t=>t.addEventListener("click",e(this,lt)));}removeListeners(){e(this,Te).forEach(t=>t.removeEventListener("click",e(this,lt))),o(this,lt,void 0);}open(){e(this,J)||(p(this.el,"modal.open"),o(this,J,!0),o(this,at,!0),h(this,Ki,bn).call(this),this.el.style.display="block",He(this.options.overlay,this.overlayElement,e(this,lt),!0,this.options.animationDuration),h(this,Qe,lo).call(this,!1),setTimeout(()=>{this.el.classList.add("active");},50),setTimeout(()=>{o(this,at,!1),p(this.el,"modal.opened");},this.options.animationDuration));}close(){!e(this,J)||(p(this.el,"modal.close"),o(this,at,!0),this.el.classList.remove("active"),He(this.options.overlay,this.overlayElement,e(this,lt),!1,this.options.animationDuration),setTimeout(()=>{this.el.style.display="",o(this,at,!1),o(this,J,!1),h(this,Qe,lo).call(this,!0),p(this.el,"modal.closed");},this.options.animationDuration));}}Te=new WeakMap,J=new WeakMap,at=new WeakMap,lt=new WeakMap,Qe=new WeakSet,lo=function(t){this.options.bodyScrolling||(document.body.style.overflow=t?"":"hidden");},Ki=new WeakSet,bn=function(){const t=document.querySelectorAll(".modal.active").length+1;this.options.overlay&&(this.overlayElement.style.zIndex=String(800+t*10-2)),this.el.style.zIndex=String(800+t*10);},Ji=new WeakSet,Ln=function(t){t.preventDefault(),!e(this,at)&&(e(this,J)?this.close():this.open());},f(Vs,"getDefaultOptions",()=>Lr),A({class:Vs,name:"Modal",dataDetection:!0,autoInit:{enabled:!0,selector:".modal"}});const wr={animationDuration:300,animationType:"none",disableActiveBar:!1,caroulix:{animationDuration:300,backToOpposite:!1,enableTouch:!1,autoplay:{enabled:!1}}};class Xs extends N{constructor(t,i){super();n(this,Qi);n(this,ts);n(this,es);n(this,is);n(this,ss);n(this,ti);n(this,ei);n(this,os);n(this,ns);n(this,rs);n(this,as);n(this,ls);f(this,"options");n(this,O,void 0);n(this,w,void 0);n(this,M,void 0);n(this,T,0);n(this,Ie,void 0);n(this,Ae,void 0);n(this,Jt,void 0);n(this,Qt,void 0);n(this,te,void 0);n(this,wt,void 0);n(this,ee,void 0);n(this,Q,void 0);n(this,ie,void 0);n(this,Se,!1);n(this,se,void 0);n(this,q,!1);try{this.preventDbInstance(t),g.push({type:"Tab",instance:this}),this.el=document.querySelector(t),this.options=S("Tab",i,this.el),this.setup();}catch(a){console.error("[Axentix] Tab init error",a);}}setup(){p(this.el,"tab.setup"),["none","slide"].includes(this.options.animationType)||(this.options.animationType="none"),o(this,q,!1),o(this,O,this.el.querySelector(".tab-arrow")),o(this,w,this.el.querySelectorAll(".tab-menu .tab-link")),o(this,M,this.el.querySelector(".tab-menu")),o(this,T,0),o(this,Q,h(this,es,En).call(this)),e(this,O)&&(h(this,ei,co).call(this),o(this,Ie,this.el.querySelector(".tab-arrow .tab-prev")),o(this,Ae,this.el.querySelector(".tab-arrow .tab-next"))),this.setupListeners(),e(this,M).style.transitionDuration=this.options.animationDuration+"ms",this.options.animationType==="slide"?h(this,ss,Cn).call(this):this.updateActiveElement();}setupListeners(){e(this,w).forEach(t=>{t.listenerRef=h(this,rs,An).bind(this,t),t.addEventListener("click",t.listenerRef);}),o(this,ee,h(this,Qi,wn).bind(this)),window.addEventListener("resize",e(this,ee)),e(this,O)&&(o(this,te,h(this,ei,co).bind(this)),window.addEventListener("resize",e(this,te)),o(this,Jt,h(this,os,Tn).bind(this)),o(this,Qt,h(this,ns,In).bind(this)),e(this,Ie).addEventListener("click",e(this,Jt)),e(this,Ae).addEventListener("click",e(this,Qt)));}removeListeners(){e(this,w).forEach(t=>{t.removeEventListener("click",t.listenerRef),t.listenerRef=void 0;}),window.removeEventListener("resize",e(this,ee)),o(this,ee,void 0),e(this,O)&&(window.removeEventListener("resize",e(this,te)),o(this,te,void 0),e(this,Ie).removeEventListener("click",e(this,Jt)),e(this,Ae).removeEventListener("click",e(this,Qt)),o(this,Jt,void 0),o(this,Qt,void 0)),e(this,wt)&&(this.el.removeEventListener("ax.caroulix.slide",e(this,wt)),o(this,wt,void 0));}select(t){if(e(this,q))return;o(this,q,!0);const i=this.el.querySelector('.tab-menu a[href="#'+t+'"]');if(o(this,T,Array.from(e(this,w)).findIndex(a=>a.children[0]===i)),p(i,"tab.select",{currentIndex:e(this,T)}),h(this,ti,ho).call(this,i.parentElement),e(this,Se)){e(this,Q).forEach(l=>l.id===t?l.classList.add("active"):"");const a=ut("Caroulix");o(this,se,new a("#"+e(this,ie).id,this.options.caroulix,this.el,!0)),o(this,wt,h(this,ts,xn).bind(this)),this.el.addEventListener("ax.caroulix.slide",e(this,wt)),o(this,Se,!1),o(this,q,!1);return}if(this.options.animationType==="slide"){const a=e(this,Q).findIndex(l=>l.id===t);e(this,se).goTo(a),setTimeout(()=>{o(this,q,!1);},this.options.animationDuration);}else h(this,is,Dn).call(this),e(this,Q).forEach(a=>{a.id===t&&(a.style.display="block");}),o(this,q,!1);}updateActiveElement(){let t;e(this,w).forEach((a,l)=>{a.classList.contains("active")&&(t=a,o(this,T,l));}),t||(t=e(this,w).item(0),o(this,T,0));const i=t.children[0].getAttribute("href");this.select(i.split("#")[1]);}prev(t=1){if(e(this,q))return;const i=h(this,as,Sn).call(this,t);o(this,T,i),p(this.el,"tab.prev",{step:t});const a=e(this,w)[i].children[0].getAttribute("href");this.select(a.split("#")[1]);}next(t=1){if(e(this,q))return;const i=h(this,ls,kn).call(this,t);o(this,T,i),p(this.el,"tab.next",{step:t});const a=e(this,w)[i].children[0].getAttribute("href");this.select(a.split("#")[1]);}}O=new WeakMap,w=new WeakMap,M=new WeakMap,T=new WeakMap,Ie=new WeakMap,Ae=new WeakMap,Jt=new WeakMap,Qt=new WeakMap,te=new WeakMap,wt=new WeakMap,ee=new WeakMap,Q=new WeakMap,ie=new WeakMap,Se=new WeakMap,se=new WeakMap,q=new WeakMap,Qi=new WeakSet,wn=function(){this.updateActiveElement();for(let t=100;t<500;t+=100)setTimeout(()=>{this.updateActiveElement();},t);},ts=new WeakSet,xn=function(){e(this,T)!==e(this,se).activeIndex&&(o(this,T,e(this,se).activeIndex),h(this,ti,ho).call(this,e(this,w)[e(this,T)]));},es=new WeakSet,En=function(){return Array.from(e(this,w)).map(t=>{const i=t.children[0].getAttribute("href");return this.el.querySelector(i)})},is=new WeakSet,Dn=function(){e(this,Q).forEach(t=>t.style.display="none");},ss=new WeakSet,Cn=function(){e(this,Q).forEach(i=>i.classList.add("caroulix-item")),o(this,ie,hi(e(this,Q))),e(this,ie).classList.add("caroulix");const t=Math.random().toString().split(".")[1];e(this,ie).id="tab-caroulix-"+t,o(this,Se,!0),this.options.animationDuration!==300&&(this.options.caroulix.animationDuration=this.options.animationDuration),this.updateActiveElement();},ti=new WeakSet,ho=function(t){if(e(this,w).forEach(i=>i.classList.remove("active")),!this.options.disableActiveBar){const i=t.getBoundingClientRect(),a=i.left,l=e(this,M).getBoundingClientRect().left,d=a-l+e(this,M).scrollLeft,u=i.width,y=e(this,M).clientWidth-d-u;e(this,M).style.setProperty(z("tab-bar-left-offset"),Math.floor(d)+"px"),e(this,M).style.setProperty(z("tab-bar-right-offset"),Math.ceil(y)+"px");}t.classList.add("active");},ei=new WeakSet,co=function(){const t=Array.from(e(this,w)).reduce((a,l)=>(a+=l.clientWidth,a),0),i=e(this,O).clientWidth;t>i?e(this,O).classList.contains("tab-arrow-show")||e(this,O).classList.add("tab-arrow-show"):e(this,O).classList.contains("tab-arrow-show")&&e(this,O).classList.remove("tab-arrow-show");},os=new WeakSet,Tn=function(t){t.preventDefault(),e(this,M).scrollLeft-=40;},ns=new WeakSet,In=function(t){t.preventDefault(),e(this,M).scrollLeft+=40;},rs=new WeakSet,An=function(t,i){if(i.preventDefault(),e(this,q)||t.classList.contains("active"))return;const a=t.children[0].getAttribute("href");this.select(a.split("#")[1]);},as=new WeakSet,Sn=function(t){let i=0,a=e(this,T);for(let l=0;l<t;l++)a>0?(i=a-1,a--):(a=e(this,w).length-1,i=a);return i},ls=new WeakSet,kn=function(t){let i=0,a=e(this,T);for(let l=0;l<t;l++)a<e(this,w).length-1?(i=a+1,a++):(a=0,i=a);return i},f(Xs,"getDefaultOptions",()=>wr),A({class:Xs,name:"Tab",dataDetection:!0,autoInit:{enabled:!0,selector:".tab"}});const xr={offset:200,linkSelector:"a",classes:"active",auto:{enabled:!1,classes:"",selector:""}};class Ys extends N{constructor(t,i){super();n(this,hs);n(this,cs);n(this,ds);n(this,ps);n(this,us);n(this,ii);f(this,"options");n(this,xt,void 0);n(this,ht,void 0);n(this,oe,void 0);n(this,tt,void 0);try{this.preventDbInstance(t),g.push({type:"ScrollSpy",instance:this}),this.el=document.querySelector(t),this.options=S("ScrollSpy",i,this.el),this.setup();}catch(a){console.error("[Axentix] ScrollSpy init error",a);}}setup(){p(this.el,"scrollspy.setup"),this.options.auto.enabled?h(this,cs,On).call(this):h(this,hs,Rn).call(this),typeof this.options.classes=="string"&&(this.options.classes=this.options.classes.split(" ")),o(this,xt,""),this.setupListeners(),h(this,ii,po).call(this);}setupListeners(){o(this,ht,h(this,ii,po).bind(this)),window.addEventListener("scroll",e(this,ht)),window.addEventListener("resize",e(this,ht));}removeListeners(){window.removeEventListener("scroll",e(this,ht)),window.removeEventListener("resize",e(this,ht)),o(this,ht,void 0);}}xt=new WeakMap,ht=new WeakMap,oe=new WeakMap,tt=new WeakMap,hs=new WeakSet,Rn=function(){o(this,oe,Array.from(this.el.querySelectorAll(this.options.linkSelector))),o(this,tt,e(this,oe).map(t=>document.querySelector(t.getAttribute("href"))));},cs=new WeakSet,On=function(){o(this,tt,Array.from(document.querySelectorAll(this.options.auto.selector))),o(this,oe,e(this,tt).map(t=>{const i=document.createElement("a");return i.className=this.options.auto.classes,i.setAttribute("href","#"+t.id),i.innerHTML=t.innerHTML,this.el.appendChild(i),i}));},ds=new WeakSet,Mn=function(){const t=window.scrollY,i=window.scrollX,a=window.innerWidth,l=window.innerHeight,d=t+this.options.offset;return l+t>=document.body.offsetHeight-2?e(this,tt)[e(this,tt).length-1]:e(this,tt).find(u=>{const y=u.getBoundingClientRect();return y.top+t>=t&&y.left+i>=i&&y.right<=a&&y.bottom<=l&&y.top+t<=d})},ps=new WeakSet,qn=function(){!e(this,xt)||this.options.classes.forEach(t=>e(this,xt).classList.remove(t));},us=new WeakSet,$n=function(){const t=window.scrollY;return e(this,tt).reduce((i,a)=>{const l=a.getBoundingClientRect().top+t,d=i.getBoundingClientRect().top+t;return l>t+this.options.offset?i:Math.abs(l-t)<Math.abs(d-t)?a:i})},ii=new WeakSet,po=function(){let t=h(this,ds,Mn).call(this);t||(t=h(this,us,$n).call(this));const i=e(this,oe).find(a=>a.getAttribute("href").split("#")[1]===t.id);i!==e(this,xt)&&(p(this.el,"scrollspy.update"),h(this,ps,qn).call(this),this.options.classes.forEach(a=>i.classList.add(a)),o(this,xt,i));},f(Ys,"getDefaultOptions",()=>xr),A({class:Ys,name:"ScrollSpy",dataDetection:!0,autoInit:{enabled:!0,selector:".scrollspy"}});const Er={animationDuration:400,duration:4e3,classes:"",position:"right",direction:"top",mobileDirection:"bottom",offset:{x:"5%",y:"0%",mobileX:"10%",mobileY:"0%"},isClosable:!1,closableContent:"x",loading:{enabled:!0,border:"2px solid #E2E2E2"}},Zs=class{constructor(s,t){n(this,fs);n(this,ms);n(this,vs);n(this,ys);n(this,gs);n(this,bs);n(this,si);f(this,"options");f(this,"id");n(this,ke,void 0);n(this,et,void 0);if($e("Toast").length>0){console.error("[Axentix] Toast: Don't try to create multiple toast instances");return}g.push({type:"Toast",instance:this}),this.id=Math.random().toString().split(".")[1],o(this,ke,s),this.options=qe(Zs.getDefaultOptions(),t),this.options.position=this.options.position.toLowerCase(),this.options.direction=this.options.direction.toLowerCase(),this.options.mobileDirection=this.options.mobileDirection.toLowerCase(),o(this,et,{});}destroy(){const s=g.findIndex(t=>t.instance.id===this.id);g.splice(s,1);}show(){try{Object.keys(e(this,et)).includes(this.options.position)||h(this,fs,Pn).call(this),h(this,bs,Wn).call(this);}catch(s){console.error("[Axentix] Toast error",s);}}change(s,t){o(this,ke,s),this.options=qe(this.options,t);}};let ze=Zs;ke=new WeakMap,et=new WeakMap,fs=new WeakSet,Pn=function(){let s=document.createElement("div");["right","left"].includes(this.options.position)||(this.options.position="right"),this.options.position==="right"?s.style.right=this.options.offset.x:s.style.left=this.options.offset.x;const i=["bottom","top"];i.includes(this.options.direction)||(this.options.direction="top"),this.options.direction==="top"?s.style.top=this.options.offset.y:s.style.bottom=this.options.offset.y,i.includes(this.options.mobileDirection)||(this.options.mobileDirection="bottom"),s.style.setProperty(z("toaster-m-width"),100-this.options.offset.mobileX.slice(0,-1)+"%"),s.style.setProperty(z("toaster-m-offset"),this.options.offset.mobileY),this.options.loading.enabled&&s.style.setProperty(z("toast-loading-border"),this.options.loading.border),s.className=`toaster toaster-${this.options.position} toast-${this.options.direction} toaster-m-${this.options.mobileDirection}`,e(this,et)[this.options.position]=s,document.body.appendChild(s);},ms=new WeakSet,Hn=function(){for(const s in e(this,et)){let t=e(this,et)[s];t.childElementCount<=0&&(t.remove(),delete e(this,et)[s]);}},vs=new WeakSet,zn=function(s){setTimeout(()=>{p(s,"toast.show"),this.options.loading.enabled&&(s.classList.add("toast-loading"),s.style.setProperty(z("toast-loading-duration"),this.options.duration+"ms")),s.classList.add("toast-animated"),setTimeout(()=>{p(s,"toast.shown"),this.options.loading.enabled&&s.classList.add("toast-load");},this.options.animationDuration);},50);},ys=new WeakSet,Nn=function(s){setTimeout(()=>{p(s,"toast.hide"),h(this,si,uo).call(this,s);},this.options.duration+this.options.animationDuration);},gs=new WeakSet,Bn=function(s){s.style.transitionTimingFunction="cubic-bezier(0.445, 0.05, 0.55, 0.95)",s.style.paddingTop="0",s.style.paddingBottom="0",s.style.margin="0",s.style.height="0";},bs=new WeakSet,Wn=function(){let s=document.createElement("div");if(s.className="toast shadow-1 "+this.options.classes,s.innerHTML=e(this,ke),s.style.transitionDuration=this.options.animationDuration+"ms",this.options.isClosable){let i=document.createElement("div");i.className="toast-trigger",i.innerHTML=this.options.closableContent,i.listenerRef=h(this,si,uo).bind(this,s,i),i.addEventListener("click",i.listenerRef),s.appendChild(i);}h(this,vs,zn).call(this,s),e(this,et)[this.options.position].appendChild(s),h(this,ys,Nn).call(this,s);const t=s.clientHeight;s.style.height=t+"px";},si=new WeakSet,uo=function(s,t,i){if(s.isAnimated)return;let a=1;i&&(i.preventDefault(),a=0,this.options.isClosable&&t.removeEventListener("click",t.listenerRef)),s.style.opacity="0",s.isAnimated=!0;const l=a*this.options.animationDuration+this.options.animationDuration;setTimeout(()=>{h(this,gs,Bn).call(this,s);},l/2),setTimeout(()=>{s.remove(),p(s,"toast.remove"),h(this,ms,Hn).call(this);},l*1.45);},f(ze,"getDefaultOptions",()=>Er),A({class:ze,name:"Toast"});const Dr={content:"",animationDelay:0,offset:"10px",animationDuration:200,classes:"grey dark-4 light-shadow-2 p-2",position:"top"};class Fs extends N{constructor(t,i){super();n(this,oi);n(this,Ls);n(this,ws);n(this,xs);n(this,Es);f(this,"options");n(this,m,void 0);n(this,Re,void 0);n(this,ne,void 0);n(this,re,void 0);n(this,ae,void 0);n(this,le,void 0);n(this,I,void 0);n(this,ct,void 0);try{this.preventDbInstance(t),g.push({type:"Tooltip",instance:this}),this.el=document.querySelector(t),this.options=S("Tooltip",i,this.el),this.setup();}catch(a){console.error("[Axentix] Tooltip init error",a);}}setup(){if(!this.options.content)return console.error(`Tooltip #${this.el.id} : empty content.`);p(this.el,"tooltip.setup"),this.options.position=this.options.position.toLowerCase(),document.querySelectorAll(".tooltip").forEach(i=>{i.dataset.tooltipId&&i.dataset.tooltipId===this.el.id&&o(this,m,i);}),e(this,m)||o(this,m,document.createElement("div")),e(this,m).dataset.tooltipId!==this.el.id&&(e(this,m).dataset.tooltipId=this.el.id),h(this,oi,fo).call(this),document.body.appendChild(e(this,m)),o(this,Re,["right","left","top","bottom"]),e(this,Re).includes(this.options.position)||(this.options.position="top"),this.setupListeners(),this.updatePosition(),e(this,m).style.display="none";}setupListeners(){o(this,ne,h(this,xs,Yn).bind(this)),o(this,re,h(this,Es,Fn).bind(this)),o(this,ae,this.updatePosition.bind(this)),this.el.addEventListener("mouseenter",e(this,ne)),this.el.addEventListener("mouseleave",e(this,re)),window.addEventListener("resize",e(this,ae));}removeListeners(){this.el.removeEventListener("mouseenter",e(this,ne)),this.el.removeEventListener("mouseleave",e(this,re)),window.removeEventListener("resize",e(this,ae)),o(this,ne,void 0),o(this,re,void 0),o(this,ae,void 0);}updatePosition(){o(this,I,this.el.getBoundingClientRect()),h(this,Ls,Vn).call(this),o(this,ct,e(this,m).getBoundingClientRect()),h(this,ws,Xn).call(this);}show(){e(this,m).style.display="block",this.updatePosition(),clearTimeout(e(this,le)),o(this,le,setTimeout(()=>{p(this.el,"tooltip.show");const t=this.options.position=="top"||this.options.position=="left"?"-":"",i=this.options.position=="top"||this.options.position=="bottom"?"Y":"X";e(this,m).style.transform=`translate${i}(${t}${this.options.offset})`,e(this,m).style.opacity="1";},this.options.animationDelay));}hide(){p(this.el,"tooltip.hide"),clearTimeout(e(this,le)),e(this,m).style.transform="translate(0)",e(this,m).style.opacity="0",o(this,le,setTimeout(()=>{e(this,m).style.display="none";},this.options.animationDuration));}change(t){this.options=S("Tooltip",t,this.el),e(this,Re).includes(this.options.position)||(this.options.position="top"),h(this,oi,fo).call(this),this.updatePosition();}}m=new WeakMap,Re=new WeakMap,ne=new WeakMap,re=new WeakMap,ae=new WeakMap,le=new WeakMap,I=new WeakMap,ct=new WeakMap,oi=new WeakSet,fo=function(){e(this,m).style.transform="translate(0)",e(this,m).style.opacity="0",e(this,m).className="tooltip "+this.options.classes,e(this,m).style.transitionDuration=this.options.animationDuration+"ms",e(this,m).innerHTML=this.options.content;},Ls=new WeakSet,Vn=function(){if(this.options.position=="top"||this.options.position=="bottom"){const i=this.options.position==="top"?e(this,I).top:e(this,I).top+e(this,I).height;e(this,m).style.top=i+"px";}else this.options.position=="right"&&(e(this,m).style.left=e(this,I).left+e(this,I).width+"px");},ws=new WeakSet,Xn=function(){this.options.position=="top"||this.options.position=="bottom"?e(this,m).style.left=e(this,I).left+e(this,I).width/2-e(this,ct).width/2+"px":e(this,m).style.top=e(this,I).top+e(this,I).height/2-e(this,ct).height/2+"px",this.options.position=="top"?e(this,m).style.top=e(this,ct).top-e(this,ct).height+"px":this.options.position=="left"&&(e(this,m).style.left=e(this,I).left-e(this,ct).width+"px");const i=window.scrollY,a=parseFloat(e(this,m).style.top);this.options.position==="top"?e(this,m).style.top=i*2+a+"px":e(this,m).style.top=i+a+"px";},xs=new WeakSet,Yn=function(t){t.preventDefault(),this.show();},Es=new WeakSet,Fn=function(t){t.preventDefault(),this.hide();},f(Fs,"getDefaultOptions",()=>Dr),A({class:Fs,name:"Tooltip",dataDetection:!0});let di="";const Us={},Gs={},Cr=r=>{const s=ci(),t=document.createElement("div"),i=document.createElement("div"),a=r.tagName.toLowerCase();return r.setAttribute("data-waves-id",s),i.classList.add("data-waves-item-inner"),i.setAttribute("data-waves-id",s),t.classList.add("data-waves-box"),t.setAttribute("data-waves-id",s),t.appendChild(i),Us[s]=r,Gs[s]=t,["img","video"].includes(a)?r.parentNode.appendChild(t):r.appendChild(t),t},Tr=({id:r,size:s,x:t,y:i,container:a,item:l,target:d},u)=>{const y=document.createElement("span");let P=`height:${s}px;
           width:${s}px;
           left:${t}px;
           top:${i}px;`;return u&&(P+=`${z("waves-color")}: ${u}`),y.setAttribute("data-waves-id",r),y.classList.add("data-waves-item"),y.setAttribute("style",P),y.addEventListener("animationend",()=>{a.removeChild(y),!a.children.length&&l&&(l.parentNode&&l.parentNode.removeChild(l),d.removeAttribute("data-waves-id"),delete Gs[r],delete Us[r]);},{once:!0}),y},Ir=(r,s,t,i)=>{const{top:a,left:l,width:d,height:u}=i.getBoundingClientRect(),y=r-l,P=s-a;let pt=Gs[t];pt||(pt=Cr(i)),t=pt.getAttribute("data-waves-id")||ci();const he=pt.children[0],Ur=ks(ks(Math.max(l+d-r,r-l),2)+ks(Math.max(a+u-s,s-a),2),.5)*2;return {id:t,size:Ur,x:y,y:P,container:he,item:pt,target:i}},Ar=(r,s)=>{const{left:t,top:i,width:a,height:l}=r.getBoundingClientRect(),{left:d,top:u}=s.getBoundingClientRect(),{borderRadius:y,zIndex:P}=window.getComputedStyle(r);return `left:${t-d}px;
          top:${i-u}px;
          height:${l}px;
          width:${a}px;
          border-radius:${y||"0"};
          z-index:${P};`},Sr=(r,s)=>{const t=Us[s];return t||(r.getAttribute("data-waves")!==null?r:r.closest("[data-waves]")||null)},kr=r=>{const s=r.target,t=s.getAttribute("data-waves-id")||"",i=Sr(s,t);if(!i||i.getAttribute("disabled"))return;const a=i.getAttribute("data-waves");let{clientX:l,clientY:d}=r;if(di==="touch"){const he=r.touches[0];l=he.clientX,d=he.clientY;}const u=Ir(l,d,t,i),y=Tr(u,a),{container:P,item:pt}=u;P.setAttribute("style",Ar(i,pt)),P.appendChild(y);},To=()=>{di=qs();const r=`${di}${di==="touch"?"start":"down"}`;window.addEventListener(r,kr);};document.addEventListener("DOMContentLoaded",()=>To());const Rr=r=>r.checkValidity()||r.validationMessage,Or=(r,s)=>{const t=document.createElement("div");t.axGenerated=!0,r.appendChild(t),t.classList.add("form-helper-invalid"),t.innerHTML=s;},Mr=r=>{const s=r.querySelector(".form-helper-invalid");!s||s.axGenerated&&s.remove();},Io=r=>{r.classList.remove("form-valid","form-invalid","form-no-helper"),Mr(r);},Ao=(r,s)=>{const t=r.getAttribute("data-form-validate");let i=!1;if(t){const d=t.toLowerCase().split(",");if(i=d.includes("auto"),d.includes("lazy")&&s==="input")return}const a=Rr(r),l=r.closest(".form-field, .form-file");return Io(l),a!==!0?(i&&typeof a=="string"?Or(l,a):l.querySelector(".form-helper-invalid")||l.classList.add("form-no-helper"),l.classList.add("form-invalid"),!1):(l.classList.add("form-valid"),l.querySelector(".form-helper-valid")||l.classList.add("form-no-helper"),!0)},qr=r=>{r.querySelectorAll("[data-form-validate]").forEach(t=>Io(t.closest(".form-field, .form-file")));},$r=r=>[...r.querySelectorAll("[data-form-validate]")].map(t=>Ao(t,"change")).every(t=>t);let So=!0;const pi=r=>{r.forEach(Ro);},ko=r=>{if(So){So=!1;return}setTimeout(()=>{pi(r);},10);},Ro=r=>{const s=r.closest(".form-field"),t=s.querySelector(".form-custom-select"),i=s.classList.contains("active"),a=["date","month","week","time"];let l=t&&r.tagName==="DIV"&&r.innerText.length>0;t||(l=r.value.length>0||r.tagName!=="SELECT"&&r.placeholder.length>0||r.tagName==="SELECT"||a.some(y=>r.matches(`[type="${y}"]`)));const d=document.activeElement===r,u=r.hasAttribute("disabled")||r.hasAttribute("readonly");r.firstInit?(Oo(r,i,l,d,s,t),r.firstInit=!1,r.isInit=!0):u||Oo(r,i,l,d,s,t);},Oo=(r,s,t,i,a,l)=>{const d=r.type==="textarea",u=a.querySelector("label:not(.form-check)");!s&&(t||i)?a.classList.add("active"):s&&!(t||i)&&a.classList.remove("active"),d?u&&(u.style.backgroundColor=qo(u)):Pr(r,a,l,u),i&&!d?a.classList.add("is-focused"):l||a.classList.remove("is-focused"),i&&d?a.classList.add("is-textarea-focused"):a.classList.remove("is-textarea-focused");},Pr=(r,s,t,i)=>{const a=r.clientWidth,l=r.offsetLeft,d=r.clientHeight+(t?t.offsetTop:r.offsetTop)+"px",u=r.closest(".form-material").classList.contains("form-material-bordered");s.style.setProperty(z("form-material-position"),d);let y=l,P="left",pt=a+"px",he=0;s.classList.contains("form-rtl")&&(P="right",y=s.clientWidth-a-l),s.style.setProperty(z(`form-material-${P}-offset`),y+"px"),y!=0&&(he=l),s.style.setProperty(z("form-material-width"),pt),i&&(i.style.left=he+"px",u&&(i.style.backgroundColor=qo(i)));},Mo=r=>{const s=window.getComputedStyle(r).backgroundColor;if(s&&!["transparent","rgba(0, 0, 0, 0)"].includes(s))return s},qo=r=>{r.style.backgroundColor="";let s=r;for(;s.parentElement;){const i=Mo(s);if(i)return i;s=s.parentElement;}const t=Mo(document.documentElement);return t||"white"},$o=(r,s)=>{r.hasAttribute("data-form-validate")&&Ao(r,s.type);},Hr=(r,s)=>{r.forEach(t=>{t===s.target&&Ro(t);});},zr=(r,s)=>{s.target.tagName==="FORM"&&s.target.classList.contains("form-material")&&ko(r);},Nr=r=>{r.forEach(l=>{l.firstInit=!0,l.validateRef=$o.bind(null,l),l.addEventListener("input",l.validateRef),l.addEventListener("change",l.validateRef);}),pi(r);const s=Hr.bind(null,r);document.addEventListener("focus",s,!0),document.addEventListener("blur",s,!0);const t=ko.bind(null,r);window.addEventListener("pageshow",t);const i=zr.bind(null,r);document.addEventListener("reset",i);const a=pi.bind(null,r);window.addEventListener("resize",a);},Br=(r,s)=>{const t=r.files;t.length>1?s.innerHTML=Array.from(t).map(i=>i.name).join(", "):t[0]&&(s.innerHTML=t[0].name);},Wr=r=>{if(r.isInit)return;r.isInit=!0;const s=r.querySelector('input[type="file"]'),t=r.querySelector(".form-file-path");s.handleRef=Br.bind(null,s,t),s.validateRef=$o.bind(null,s),s.addEventListener("change",s.handleRef),s.addEventListener("input",s.validateRef),s.addEventListener("change",s.validateRef);},Vr=()=>{const r=Array.from(document.querySelectorAll(".form-file"));try{r.forEach(Wr);}catch(s){console.error("[Axentix] Form file error",s);}},ui=(r=document.querySelectorAll(".form-material .form-field:not(.form-default) .form-control:not(.form-custom-select)"))=>{const{setupInputs:s,detectInputs:t}=Array.from(r).reduce((i,a)=>(a.isInit?i.detectInputs.push(a):i.setupInputs.push(a),i),{setupInputs:[],detectInputs:[]});Vr();try{s.length>0&&Nr(s),t.length>0&&pi(t);}catch(i){console.error("[Axentix] Material forms error",i);}};document.addEventListener("DOMContentLoaded",()=>ui());const Xr={updateInputs:ui,validate:$r,resetValidation:qr},Yr={inputClasses:""};class js extends N{constructor(t,i){super();n(this,Ds);n(this,Cs);n(this,ni);n(this,Ts);n(this,Is);n(this,ri);n(this,As);f(this,"options");n(this,$,void 0);n(this,Et,void 0);n(this,D,void 0);n(this,Oe,void 0);n(this,dt,void 0);try{this.preventDbInstance(t),g.push({type:"Select",instance:this}),this.el=document.querySelector(t),this.options=S("Select",i,this.el),this.setup();}catch(a){console.error("[Axentix] Select init error",a);}}setup(){this.el.style.display="none",o(this,Et,hi([this.el])),e(this,Et).className="form-custom-select",h(this,Ds,Un).call(this);}reset(){this.destroy(!0),super.reset();}destroy(t){t||super.destroy(),e(this,$)&&(e(this,$).el.removeEventListener("ax.dropdown.open",e(this,dt)),e(this,$).el.removeEventListener("ax.dropdown.close",e(this,dt)),o(this,dt,null),e(this,$).destroy(),e(this,$).el.remove(),o(this,$,null)),Eo(e(this,Et)),this.el.classList.add("form-custom-select"),this.el.style.display="";}}$=new WeakMap,Et=new WeakMap,D=new WeakMap,Oe=new WeakMap,dt=new WeakMap,Ds=new WeakSet,Un=function(){const t=`dropdown-${ci()}`;o(this,D,document.createElement("div")),e(this,D).className=`form-control ${this.options.inputClasses}`,e(this,D).dataset.target=t;const i=document.createElement("div"),a=this.el.className.replace("form-control","");if(i.className=`dropdown-content ${a}`,this.el.disabled){e(this,D).setAttribute("disabled",""),e(this,Et).append(e(this,D)),h(this,ni,mo).call(this,i);return}o(this,dt,h(this,Ts,jn).bind(this));const l=document.createElement("div");l.className="dropdown",l.id=t,l.addEventListener("ax.dropdown.open",e(this,dt)),l.addEventListener("ax.dropdown.close",e(this,dt)),Array.from(this.el.attributes).forEach(y=>{y.name.startsWith("data-dropdown")&&l.setAttribute(y.name,y.value);}),l.append(e(this,D)),l.append(i),e(this,Et).append(l),h(this,ni,mo).call(this,i);const d=ut("Dropdown");o(this,$,new d(`#${t}`,{closeOnClick:!this.el.multiple,preventViewport:!0}));const u=window.getComputedStyle(l).zIndex;o(this,Oe,this.el.closest(".form-field").querySelector("label:not(.form-check)")),e(this,Oe)&&(e(this,Oe).style.zIndex=u+5);},Cs=new WeakSet,Gn=function(t,i){const a=document.createElement("div");a.className="form-field";const l=document.createElement("label");l.className="form-check";const d=document.createElement("input");d.type="checkbox",i&&d.setAttribute("disabled","");const u=document.createElement("span");return u.innerHTML=t,l.append(d,u),a.append(l),a},ni=new WeakSet,mo=function(t){for(const i of this.el.options){const a=i.hasAttribute("disabled"),l=document.createElement("div");l.className="dropdown-item",l.innerHTML=this.el.multiple?h(this,Cs,Gn).call(this,i.text,a).innerHTML:i.text,l.axValue=i.value||i.text,a?l.classList.add("form-disabled"):(l.axClickRef=h(this,Is,Zn).bind(this,l),l.addEventListener("click",l.axClickRef)),(i.hasAttribute("selected")||!this.el.multiple&&this.el.value===(i.value||i.text))&&h(this,ri,vo).call(this,l),t.append(l);}},Ts=new WeakSet,jn=function(){e(this,D).closest(".form-field").classList.toggle("is-focused");},Is=new WeakSet,Zn=function(t,i){i.preventDefault(),t.classList.contains("form-selected")?h(this,As,_n).call(this,t):h(this,ri,vo).call(this,t);},ri=new WeakSet,vo=function(t){const i=t.axValue;this.el.multiple?t.querySelector("input").checked=!0:e(this,$)&&e(this,$).el.querySelectorAll(".dropdown-item").forEach(l=>l.classList.remove("form-selected")),t.classList.add("form-selected");const a=this.el.multiple?[...e(this,D).innerText.split(", ").filter(Boolean),i].join(", "):i;e(this,D).innerText=a,this.el.value=a,ui([e(this,D)]);},As=new WeakSet,_n=function(t){const i=t.axValue;t.classList.remove("form-selected");let a="";if(this.el.multiple){t.querySelector("input").checked=!1;const l=e(this,D).innerText.split(", ").filter(Boolean),d=l.findIndex(u=>u===i);l.splice(d,1),a=l.join(", ");}e(this,D).innerText=a,this.el.value=a,ui([e(this,D)]);},f(js,"getDefaultOptions",()=>Yr),A({class:js,name:"Select",dataDetection:!0,autoInit:{enabled:!0,selector:".form-custom-select"}});class Fr{constructor(s,t){n(this,Ss);n(this,ai);n(this,li);f(this,"component");f(this,"isAll");f(this,"options");this.component=s[0].toUpperCase()+s.slice(1).toLowerCase(),this.isAll=s==="all",this.options=this.isAll?{}:t,h(this,Ss,Kn).call(this);}}Ss=new WeakSet,Kn=function(){const s=Lo();if(s.hasOwnProperty(this.component)){const i=h(this,ai,yo).call(this,s[this.component]);h(this,li,go).call(this,i,this.component);}else this.isAll&&Object.keys(s).forEach(i=>{const a=h(this,ai,yo).call(this,s[i]);a.length>0&&h(this,li,go).call(this,a,i);});},ai=new WeakSet,yo=function(s){return Array.from(s).map(t=>"#"+t.id)},li=new WeakSet,go=function(s,t){s.forEach(i=>{const a=ut(t),l=[i,this.options];try{new a(...l);}catch(d){console.error("[Axentix] Unable to load "+t,d);}});},c.Axentix=Fr,c.Caroulix=Ps,c.Collapsible=Hs,c.Dropdown=Ns,c.Fab=Bs,c.Forms=Xr,c.Lightbox=Ws,c.Modal=Vs,c.ScrollSpy=Ys,c.Select=js,c.Sidenav=zs,c.Tab=Xs,c.Toast=ze,c.Tooltip=Fs,c.Waves=To,c.config=H,c.createEvent=p,c.createOverlay=$s,c.destroy=pr,c.destroyAll=ur,c.exportToWindow=tr,c.extend=qe,c.getAllInstances=ar,c.getAutoInitElements=Lo,c.getComponentClass=ut,c.getComponentOptions=S,c.getCssVar=z,c.getDataElements=Ms,c.getInstance=Pe,c.getInstanceByType=$e,c.getPointerType=qs,c.getTriggers=de,c.getUid=ci,c.instances=g,c.isPointerEnabled=Co,c.isTouchEnabled=Do,c.registerComponent=A,c.registerPlugin=Qn,c.reset=cr,c.resetAll=dr,c.sync=lr,c.syncAll=hr,c.unwrap=Eo,c.updateOverlay=He,c.version=Jn,c.wrap=hi,Object.defineProperties(c,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});});
  });

  var NeuAxentix=(()=>{function a(a,b){if(this.dataset[a]&&!i.includes(this.dataset[a]))return void console.error("Error: invalid classname in data-neu-...");if("neuClick"===a)if(this.neuActive){if("mousedown"===b.type||"touchstart"===b.type)return;this.neuActive=!1;}else {if("mouseup"===b.type||"mouseleave"===b.type||"touchend"===b.type||"touchmove"===b.type)return;this.neuActive=!0;}if("neuHover"===a)if(!this.neuActive&&"mouseenter"===b.type)this.neuActive=!0;else {if(!this.neuActive&&"mouseleave"===b.type)return;this.neuActive&&"mouseleave"===b.type&&(this.neuActive=!1);}var c=this.dataset[a];this.neuCurrClass?(this.classList.remove(this.neuCurrClass),this.dataset[a]=this.neuCurrClass):this.dataset[a]="",c?(this.classList.add(c),this.neuCurrClass=c):this.neuCurrClass="";}function b(a){var b=a.className.split(" "),c=b.filter(a=>i.includes(a));if(2<=c.length){var d=b.filter(a=>!c.includes(a));d.push(c[0]),a.className=d.join(" ");}a.neuCurrClass=c[0]||"";}function c(){e=document.querySelectorAll("[data-neu-click]"),f=document.querySelectorAll("[data-neu-focus]"),g=document.querySelectorAll("[data-neu-clicked]"),h=document.querySelectorAll("[data-neu-hover]"),g.forEach(c=>{b(c),c.toggleRef=a.bind(c,"neuClicked"),c.addEventListener("click",c.toggleRef);}),e.forEach(c=>{b(c),c.toggleRef=a.bind(c,"neuClick"),c.addEventListener("mousedown",c.toggleRef),c.addEventListener("mouseleave",c.toggleRef),c.addEventListener("mouseup",c.toggleRef),"ontouchstart"in document.documentElement&&(c.addEventListener("touchstart",c.toggleRef),c.addEventListener("touchend",c.toggleRef));}),f.forEach(c=>{b(c),c.toggleRef=a.bind(c,"neuFocus"),c.addEventListener("focus",c.toggleRef),c.addEventListener("blur",c.toggleRef);}),h.forEach(c=>{b(c),c.toggleRef=a.bind(c,"neuHover"),c.addEventListener("mouseenter",c.toggleRef),c.addEventListener("mouseleave",c.toggleRef);});}function d(){g&&g.forEach(a=>{a.removeEventListener("click",a.toggleRef),a.toggleRef=void 0;}),e&&e.forEach(a=>{a.removeEventListener("mousedown",a.toggleRef),a.removeEventListener("mouseleave",a.toggleRef),a.removeEventListener("mouseup",a.toggleRef),"ontouchstart"in document.documentElement&&(a.removeEventListener("touchstart",a.toggleRef),a.removeEventListener("touchend",a.toggleRef)),a.toggleRef=void 0;}),f&&f.forEach(a=>{a.removeEventListener("focus",a.toggleRef),a.removeEventListener("blur",a.toggleRef),a.toggleRef=void 0;}),h&&h.forEach(a=>{a.removeEventListener("mouseenter",a.toggleRef),a.removeEventListener("mouseleave",a.toggleRef),a.toggleRef=void 0;}),c();}var e,f,g,h,i=["neu-bordered","neu-flat","neu-pressed","neu-concave","neu-convex"];return {setup:c,reset:d}})();document.addEventListener("DOMContentLoaded",NeuAxentix.setup);

  function noop() { }
  function add_location(element, file, line, column, char) {
      element.__svelte_meta = {
          loc: { file, line, column, char }
      };
  }
  function run(fn) {
      return fn();
  }
  function blank_object() {
      return Object.create(null);
  }
  function run_all(fns) {
      fns.forEach(run);
  }
  function is_function(thing) {
      return typeof thing === 'function';
  }
  function safe_not_equal(a, b) {
      return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
  }
  function is_empty(obj) {
      return Object.keys(obj).length === 0;
  }
  function validate_store(store, name) {
      if (store != null && typeof store.subscribe !== 'function') {
          throw new Error(`'${name}' is not a store with a 'subscribe' method`);
      }
  }
  function subscribe(store, ...callbacks) {
      if (store == null) {
          return noop;
      }
      const unsub = store.subscribe(...callbacks);
      return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function component_subscribe(component, store, callback) {
      component.$$.on_destroy.push(subscribe(store, callback));
  }
  function append(target, node) {
      target.appendChild(node);
  }
  function insert(target, node, anchor) {
      target.insertBefore(node, anchor || null);
  }
  function detach(node) {
      node.parentNode.removeChild(node);
  }
  function destroy_each(iterations, detaching) {
      for (let i = 0; i < iterations.length; i += 1) {
          if (iterations[i])
              iterations[i].d(detaching);
      }
  }
  function element(name) {
      return document.createElement(name);
  }
  function svg_element(name) {
      return document.createElementNS('http://www.w3.org/2000/svg', name);
  }
  function text(data) {
      return document.createTextNode(data);
  }
  function space() {
      return text(' ');
  }
  function empty() {
      return text('');
  }
  function listen(node, event, handler, options) {
      node.addEventListener(event, handler, options);
      return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
      if (value == null)
          node.removeAttribute(attribute);
      else if (node.getAttribute(attribute) !== value)
          node.setAttribute(attribute, value);
  }
  function children(element) {
      return Array.from(element.childNodes);
  }
  function toggle_class(element, name, toggle) {
      element.classList[toggle ? 'add' : 'remove'](name);
  }
  function custom_event(type, detail, bubbles = false) {
      const e = document.createEvent('CustomEvent');
      e.initCustomEvent(type, bubbles, false, detail);
      return e;
  }

  let current_component;
  function set_current_component(component) {
      current_component = component;
  }
  function get_current_component() {
      if (!current_component)
          throw new Error('Function called outside component initialization');
      return current_component;
  }
  function onMount(fn) {
      get_current_component().$$.on_mount.push(fn);
  }

  const dirty_components = [];
  const binding_callbacks = [];
  const render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
      if (!update_scheduled) {
          update_scheduled = true;
          resolved_promise.then(flush);
      }
  }
  function add_render_callback(fn) {
      render_callbacks.push(fn);
  }
  // flush() calls callbacks in this order:
  // 1. All beforeUpdate callbacks, in order: parents before children
  // 2. All bind:this callbacks, in reverse order: children before parents.
  // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
  //    for afterUpdates called during the initial onMount, which are called in
  //    reverse order: children before parents.
  // Since callbacks might update component values, which could trigger another
  // call to flush(), the following steps guard against this:
  // 1. During beforeUpdate, any updated components will be added to the
  //    dirty_components array and will cause a reentrant call to flush(). Because
  //    the flush index is kept outside the function, the reentrant call will pick
  //    up where the earlier call left off and go through all dirty components. The
  //    current_component value is saved and restored so that the reentrant call will
  //    not interfere with the "parent" flush() call.
  // 2. bind:this callbacks cannot trigger new flush() calls.
  // 3. During afterUpdate, any updated components will NOT have their afterUpdate
  //    callback called a second time; the seen_callbacks set, outside the flush()
  //    function, guarantees this behavior.
  const seen_callbacks = new Set();
  let flushidx = 0; // Do *not* move this inside the flush() function
  function flush() {
      const saved_component = current_component;
      do {
          // first, call beforeUpdate functions
          // and update components
          while (flushidx < dirty_components.length) {
              const component = dirty_components[flushidx];
              flushidx++;
              set_current_component(component);
              update(component.$$);
          }
          set_current_component(null);
          dirty_components.length = 0;
          flushidx = 0;
          while (binding_callbacks.length)
              binding_callbacks.pop()();
          // then, once components are updated, call
          // afterUpdate functions. This may cause
          // subsequent updates...
          for (let i = 0; i < render_callbacks.length; i += 1) {
              const callback = render_callbacks[i];
              if (!seen_callbacks.has(callback)) {
                  // ...so guard against infinite loops
                  seen_callbacks.add(callback);
                  callback();
              }
          }
          render_callbacks.length = 0;
      } while (dirty_components.length);
      while (flush_callbacks.length) {
          flush_callbacks.pop()();
      }
      update_scheduled = false;
      seen_callbacks.clear();
      set_current_component(saved_component);
  }
  function update($$) {
      if ($$.fragment !== null) {
          $$.update();
          run_all($$.before_update);
          const dirty = $$.dirty;
          $$.dirty = [-1];
          $$.fragment && $$.fragment.p($$.ctx, dirty);
          $$.after_update.forEach(add_render_callback);
      }
  }
  const outroing = new Set();
  let outros;
  function group_outros() {
      outros = {
          r: 0,
          c: [],
          p: outros // parent group
      };
  }
  function check_outros() {
      if (!outros.r) {
          run_all(outros.c);
      }
      outros = outros.p;
  }
  function transition_in(block, local) {
      if (block && block.i) {
          outroing.delete(block);
          block.i(local);
      }
  }
  function transition_out(block, local, detach, callback) {
      if (block && block.o) {
          if (outroing.has(block))
              return;
          outroing.add(block);
          outros.c.push(() => {
              outroing.delete(block);
              if (callback) {
                  if (detach)
                      block.d(1);
                  callback();
              }
          });
          block.o(local);
      }
  }

  const globals = (typeof window !== 'undefined'
      ? window
      : typeof globalThis !== 'undefined'
          ? globalThis
          : global);
  function create_component(block) {
      block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
      const { fragment, on_mount, on_destroy, after_update } = component.$$;
      fragment && fragment.m(target, anchor);
      if (!customElement) {
          // onMount happens before the initial afterUpdate
          add_render_callback(() => {
              const new_on_destroy = on_mount.map(run).filter(is_function);
              if (on_destroy) {
                  on_destroy.push(...new_on_destroy);
              }
              else {
                  // Edge case - component was destroyed immediately,
                  // most likely as a result of a binding initialising
                  run_all(new_on_destroy);
              }
              component.$$.on_mount = [];
          });
      }
      after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
      const $$ = component.$$;
      if ($$.fragment !== null) {
          run_all($$.on_destroy);
          $$.fragment && $$.fragment.d(detaching);
          // TODO null out other refs, including component.$$ (but need to
          // preserve final state?)
          $$.on_destroy = $$.fragment = null;
          $$.ctx = [];
      }
  }
  function make_dirty(component, i) {
      if (component.$$.dirty[0] === -1) {
          dirty_components.push(component);
          schedule_update();
          component.$$.dirty.fill(0);
      }
      component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
  }
  function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
      const parent_component = current_component;
      set_current_component(component);
      const $$ = component.$$ = {
          fragment: null,
          ctx: null,
          // state
          props,
          update: noop,
          not_equal,
          bound: blank_object(),
          // lifecycle
          on_mount: [],
          on_destroy: [],
          on_disconnect: [],
          before_update: [],
          after_update: [],
          context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
          // everything else
          callbacks: blank_object(),
          dirty,
          skip_bound: false,
          root: options.target || parent_component.$$.root
      };
      append_styles && append_styles($$.root);
      let ready = false;
      $$.ctx = instance
          ? instance(component, options.props || {}, (i, ret, ...rest) => {
              const value = rest.length ? rest[0] : ret;
              if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                  if (!$$.skip_bound && $$.bound[i])
                      $$.bound[i](value);
                  if (ready)
                      make_dirty(component, i);
              }
              return ret;
          })
          : [];
      $$.update();
      ready = true;
      run_all($$.before_update);
      // `false` as a special case of no DOM component
      $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
      if (options.target) {
          if (options.hydrate) {
              const nodes = children(options.target);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.l(nodes);
              nodes.forEach(detach);
          }
          else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.c();
          }
          if (options.intro)
              transition_in(component.$$.fragment);
          mount_component(component, options.target, options.anchor, options.customElement);
          flush();
      }
      set_current_component(parent_component);
  }
  /**
   * Base class for Svelte components. Used when dev=false.
   */
  class SvelteComponent {
      $destroy() {
          destroy_component(this, 1);
          this.$destroy = noop;
      }
      $on(type, callback) {
          const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
          callbacks.push(callback);
          return () => {
              const index = callbacks.indexOf(callback);
              if (index !== -1)
                  callbacks.splice(index, 1);
          };
      }
      $set($$props) {
          if (this.$$set && !is_empty($$props)) {
              this.$$.skip_bound = true;
              this.$$set($$props);
              this.$$.skip_bound = false;
          }
      }
  }

  function dispatch_dev(type, detail) {
      document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
  }
  function append_dev(target, node) {
      dispatch_dev('SvelteDOMInsert', { target, node });
      append(target, node);
  }
  function insert_dev(target, node, anchor) {
      dispatch_dev('SvelteDOMInsert', { target, node, anchor });
      insert(target, node, anchor);
  }
  function detach_dev(node) {
      dispatch_dev('SvelteDOMRemove', { node });
      detach(node);
  }
  function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
      const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
      if (has_prevent_default)
          modifiers.push('preventDefault');
      if (has_stop_propagation)
          modifiers.push('stopPropagation');
      dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
      const dispose = listen(node, event, handler, options);
      return () => {
          dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
          dispose();
      };
  }
  function attr_dev(node, attribute, value) {
      attr(node, attribute, value);
      if (value == null)
          dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
      else
          dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
  }
  function set_data_dev(text, data) {
      data = '' + data;
      if (text.wholeText === data)
          return;
      dispatch_dev('SvelteDOMSetData', { node: text, data });
      text.data = data;
  }
  function validate_each_argument(arg) {
      if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
          let msg = '{#each} only iterates over array-like objects.';
          if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
              msg += ' You can use a spread to convert this iterable into an array.';
          }
          throw new Error(msg);
      }
  }
  function validate_slots(name, slot, keys) {
      for (const slot_key of Object.keys(slot)) {
          if (!~keys.indexOf(slot_key)) {
              console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
          }
      }
  }
  /**
   * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
   */
  class SvelteComponentDev extends SvelteComponent {
      constructor(options) {
          if (!options || (!options.target && !options.$$inline)) {
              throw new Error("'target' is a required option");
          }
          super();
      }
      $destroy() {
          super.$destroy();
          this.$destroy = () => {
              console.warn('Component was already destroyed'); // eslint-disable-line no-console
          };
      }
      $capture_state() { }
      $inject_state() { }
  }

  const subscriber_queue = [];
  /**
   * Create a `Writable` store that allows both updating and reading by subscription.
   * @param {*=}value initial value
   * @param {StartStopNotifier=}start start and stop notifications for subscriptions
   */
  function writable(value, start = noop) {
      let stop;
      const subscribers = new Set();
      function set(new_value) {
          if (safe_not_equal(value, new_value)) {
              value = new_value;
              if (stop) { // store is ready
                  const run_queue = !subscriber_queue.length;
                  for (const subscriber of subscribers) {
                      subscriber[1]();
                      subscriber_queue.push(subscriber, value);
                  }
                  if (run_queue) {
                      for (let i = 0; i < subscriber_queue.length; i += 2) {
                          subscriber_queue[i][0](subscriber_queue[i + 1]);
                      }
                      subscriber_queue.length = 0;
                  }
              }
          }
      }
      function update(fn) {
          set(fn(value));
      }
      function subscribe(run, invalidate = noop) {
          const subscriber = [run, invalidate];
          subscribers.add(subscriber);
          if (subscribers.size === 1) {
              stop = start(set) || noop;
          }
          run(value);
          return () => {
              subscribers.delete(subscriber);
              if (subscribers.size === 0) {
                  stop();
                  stop = null;
              }
          };
      }
      return { set, update, subscribe };
  }

  const currentQuestion = writable(1);
  writable(Array(3).fill(Array(3).fill(0)));
  const theme = writable("neu-light");

  /* src\components\DarkMode.svelte generated by Svelte v3.47.0 */
  const file$7 = "src\\components\\DarkMode.svelte";

  function create_fragment$7(ctx) {
  	let a;
  	let mounted;
  	let dispose;

  	const block = {
  		c: function create() {
  			a = element("a");
  			a.textContent = "Dark Mode";
  			attr_dev(a, "class", "navbar-link neu-flat rounded-1");
  			add_location(a, file$7, 21, 0, 662);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, a, anchor);

  			if (!mounted) {
  				dispose = listen_dev(a, "click", /*toggleDarkMode*/ ctx[0], false, false, false);
  				mounted = true;
  			}
  		},
  		p: noop,
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(a);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$7.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$7($$self, $$props, $$invalidate) {
  	let { $$slots: slots = {}, $$scope } = $$props;
  	validate_slots('DarkMode', slots, []);
  	theme.set(localStorage.getItem("theme") ?? "neu-light");

  	// update localStorage and html class whenever the theme writable changes
  	theme.subscribe(current => {
  		localStorage.setItem("theme", current);
  		document.documentElement.classList.remove("neu-light", "neu-dark");
  		document.documentElement.classList.add(current);
  	});

  	const toggleDarkMode = () => {
  		theme.update(current => current === "neu-light" ? "neu-dark" : "neu-light");
  	};

  	const writable_props = [];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DarkMode> was created with unknown prop '${key}'`);
  	});

  	$$self.$capture_state = () => ({ theme, toggleDarkMode });
  	return [toggleDarkMode];
  }

  class DarkMode extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "DarkMode",
  			options,
  			id: create_fragment$7.name
  		});
  	}
  }

  /* src\components\Header.svelte generated by Svelte v3.47.0 */
  const file$6 = "src\\components\\Header.svelte";

  function create_fragment$6(ctx) {
  	let nav;
  	let a0;
  	let t1;
  	let div;
  	let a1;
  	let t3;
  	let darkmode;
  	let current;
  	darkmode = new DarkMode({ $$inline: true });

  	const block = {
  		c: function create() {
  			nav = element("nav");
  			a0 = element("a");
  			a0.textContent = "IHTFY";
  			t1 = space();
  			div = element("div");
  			a1 = element("a");
  			a1.textContent = "Source";
  			t3 = space();
  			create_component(darkmode.$$.fragment);
  			attr_dev(a0, "href", "https://ihtfy.com");
  			attr_dev(a0, "class", "navbar-brand");
  			add_location(a0, file$6, 5, 2, 101);
  			attr_dev(a1, "class", "navbar-link neu-flat rounded-1");
  			attr_dev(a1, "target", "_blank");
  			attr_dev(a1, "href", "https://github.com/IHTFY/raven");
  			add_location(a1, file$6, 7, 4, 212);
  			attr_dev(div, "class", "navbar-menu ml-auto lh-normal");
  			add_location(div, file$6, 6, 2, 163);
  			attr_dev(nav, "class", "navbar neu-flat");
  			add_location(nav, file$6, 4, 0, 68);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, nav, anchor);
  			append_dev(nav, a0);
  			append_dev(nav, t1);
  			append_dev(nav, div);
  			append_dev(div, a1);
  			append_dev(div, t3);
  			mount_component(darkmode, div, null);
  			current = true;
  		},
  		p: noop,
  		i: function intro(local) {
  			if (current) return;
  			transition_in(darkmode.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(darkmode.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(nav);
  			destroy_component(darkmode);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$6.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$6($$self, $$props, $$invalidate) {
  	let { $$slots: slots = {}, $$scope } = $$props;
  	validate_slots('Header', slots, []);
  	const writable_props = [];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
  	});

  	$$self.$capture_state = () => ({ DarkMode });
  	return [];
  }

  class Header extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Header",
  			options,
  			id: create_fragment$6.name
  		});
  	}
  }

  /**
   * Rules can be applied to a grid of cells. 
   * f([[1,2,3],  ==>  [[f(1),f(2),f(3)],
   *    [4,5,6],        [f(4),f(5),f(6)],
   *    [7,8,9]])       [f(7),f(8),f(9)]]
   * 
   * Rules should be commutative under composition,
   * at least with respect to the flattened image output.
   */

  //TODO figure out how to structure these
  const constant = x => x;
  const increasing = x => x + 1;
  const decreasing = x => x - 1;

  var Rules = /*#__PURE__*/Object.freeze({
    __proto__: null,
    constant: constant,
    increasing: increasing,
    decreasing: decreasing
  });

  /* src\components\Graphics.svelte generated by Svelte v3.47.0 */
  const file$5 = "src\\components\\Graphics.svelte";

  function get_each_context$3(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[4] = list[i];
  	return child_ctx;
  }

  // (67:39) 
  function create_if_block_2(ctx) {
  	let rect0;
  	let rect1;

  	const block = {
  		c: function create() {
  			rect0 = svg_element("rect");
  			rect1 = svg_element("rect");
  			attr_dev(rect0, "width", "");
  			add_location(rect0, file$5, 69, 4, 1419);
  			add_location(rect1, file$5, 71, 4, 1462);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, rect0, anchor);
  			insert_dev(target, rect1, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(rect0);
  			if (detaching) detach_dev(rect1);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block_2.name,
  		type: "if",
  		source: "(67:39) ",
  		ctx
  	});

  	return block;
  }

  // (15:2) {#if config.grid}
  function create_if_block(ctx) {
  	let rect;
  	let line0;
  	let line1;
  	let line2;
  	let line3;
  	let each_1_anchor;
  	let each_value = /*config*/ ctx[0].grid.placement;
  	validate_each_argument(each_value);
  	let each_blocks = [];

  	for (let i = 0; i < each_value.length; i += 1) {
  		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
  	}

  	const block = {
  		c: function create() {
  			rect = svg_element("rect");
  			line0 = svg_element("line");
  			line1 = svg_element("line");
  			line2 = svg_element("line");
  			line3 = svg_element("line");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			each_1_anchor = empty();
  			attr_dev(rect, "width", "100%");
  			attr_dev(rect, "height", "100%");
  			attr_dev(rect, "fill", "none");
  			attr_dev(rect, "stroke", /*contrast*/ ctx[1]);
  			attr_dev(rect, "stroke-width", "4%");
  			add_location(rect, file$5, 15, 4, 286);
  			attr_dev(line0, "x1", "33.333%");
  			attr_dev(line0, "y1", "0%");
  			attr_dev(line0, "x2", "33.333%");
  			attr_dev(line0, "y2", "100%");
  			attr_dev(line0, "stroke", /*contrast*/ ctx[1]);
  			attr_dev(line0, "stroke-width", "2%");
  			add_location(line0, file$5, 22, 4, 415);
  			attr_dev(line1, "x1", "66.666%");
  			attr_dev(line1, "y1", "0%");
  			attr_dev(line1, "x2", "66.666%");
  			attr_dev(line1, "y2", "100%");
  			attr_dev(line1, "stroke", /*contrast*/ ctx[1]);
  			attr_dev(line1, "stroke-width", "2%");
  			add_location(line1, file$5, 30, 4, 556);
  			attr_dev(line2, "x1", "0%");
  			attr_dev(line2, "y1", "33.333%");
  			attr_dev(line2, "x2", "100%");
  			attr_dev(line2, "y2", "33.333%");
  			attr_dev(line2, "stroke", /*contrast*/ ctx[1]);
  			attr_dev(line2, "stroke-width", "2%");
  			add_location(line2, file$5, 38, 4, 697);
  			attr_dev(line3, "x1", "0%");
  			attr_dev(line3, "y1", "66.666%");
  			attr_dev(line3, "x2", "100%");
  			attr_dev(line3, "y2", "66.666%");
  			attr_dev(line3, "stroke", /*contrast*/ ctx[1]);
  			attr_dev(line3, "stroke-width", "2%");
  			add_location(line3, file$5, 46, 4, 838);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, rect, anchor);
  			insert_dev(target, line0, anchor);
  			insert_dev(target, line1, anchor);
  			insert_dev(target, line2, anchor);
  			insert_dev(target, line3, anchor);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(target, anchor);
  			}

  			insert_dev(target, each_1_anchor, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*contrast*/ 2) {
  				attr_dev(rect, "stroke", /*contrast*/ ctx[1]);
  			}

  			if (dirty & /*contrast*/ 2) {
  				attr_dev(line0, "stroke", /*contrast*/ ctx[1]);
  			}

  			if (dirty & /*contrast*/ 2) {
  				attr_dev(line1, "stroke", /*contrast*/ ctx[1]);
  			}

  			if (dirty & /*contrast*/ 2) {
  				attr_dev(line2, "stroke", /*contrast*/ ctx[1]);
  			}

  			if (dirty & /*contrast*/ 2) {
  				attr_dev(line3, "stroke", /*contrast*/ ctx[1]);
  			}

  			if (dirty & /*config, contrast*/ 3) {
  				each_value = /*config*/ ctx[0].grid.placement;
  				validate_each_argument(each_value);
  				let i;

  				for (i = 0; i < each_value.length; i += 1) {
  					const child_ctx = get_each_context$3(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  					} else {
  						each_blocks[i] = create_each_block$3(child_ctx);
  						each_blocks[i].c();
  						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
  					}
  				}

  				for (; i < each_blocks.length; i += 1) {
  					each_blocks[i].d(1);
  				}

  				each_blocks.length = each_value.length;
  			}
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(rect);
  			if (detaching) detach_dev(line0);
  			if (detaching) detach_dev(line1);
  			if (detaching) detach_dev(line2);
  			if (detaching) detach_dev(line3);
  			destroy_each(each_blocks, detaching);
  			if (detaching) detach_dev(each_1_anchor);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block.name,
  		type: "if",
  		source: "(15:2) {#if config.grid}",
  		ctx
  	});

  	return block;
  }

  // (56:6) {#if config.grid.fill === "rect"}
  function create_if_block_1(ctx) {
  	let rect;
  	let rect_x_value;
  	let rect_y_value;

  	const block = {
  		c: function create() {
  			rect = svg_element("rect");
  			attr_dev(rect, "x", rect_x_value = `${/*coords*/ ctx[4].x * 33.333}%`);
  			attr_dev(rect, "y", rect_y_value = `${/*coords*/ ctx[4].y * 33.333}%`);
  			attr_dev(rect, "width", "33.333%");
  			attr_dev(rect, "height", "33.333%");
  			attr_dev(rect, "stroke", /*contrast*/ ctx[1]);
  			attr_dev(rect, "fill", /*contrast*/ ctx[1]);
  			add_location(rect, file$5, 56, 8, 1069);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, rect, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*config*/ 1 && rect_x_value !== (rect_x_value = `${/*coords*/ ctx[4].x * 33.333}%`)) {
  				attr_dev(rect, "x", rect_x_value);
  			}

  			if (dirty & /*config*/ 1 && rect_y_value !== (rect_y_value = `${/*coords*/ ctx[4].y * 33.333}%`)) {
  				attr_dev(rect, "y", rect_y_value);
  			}

  			if (dirty & /*contrast*/ 2) {
  				attr_dev(rect, "stroke", /*contrast*/ ctx[1]);
  			}

  			if (dirty & /*contrast*/ 2) {
  				attr_dev(rect, "fill", /*contrast*/ ctx[1]);
  			}
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(rect);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block_1.name,
  		type: "if",
  		source: "(56:6) {#if config.grid.fill === \\\"rect\\\"}",
  		ctx
  	});

  	return block;
  }

  // (55:4) {#each config.grid.placement as coords}
  function create_each_block$3(ctx) {
  	let if_block_anchor;
  	let if_block = /*config*/ ctx[0].grid.fill === "rect" && create_if_block_1(ctx);

  	const block = {
  		c: function create() {
  			if (if_block) if_block.c();
  			if_block_anchor = empty();
  		},
  		m: function mount(target, anchor) {
  			if (if_block) if_block.m(target, anchor);
  			insert_dev(target, if_block_anchor, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (/*config*/ ctx[0].grid.fill === "rect") {
  				if (if_block) {
  					if_block.p(ctx, dirty);
  				} else {
  					if_block = create_if_block_1(ctx);
  					if_block.c();
  					if_block.m(if_block_anchor.parentNode, if_block_anchor);
  				}
  			} else if (if_block) {
  				if_block.d(1);
  				if_block = null;
  			}
  		},
  		d: function destroy(detaching) {
  			if (if_block) if_block.d(detaching);
  			if (detaching) detach_dev(if_block_anchor);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block$3.name,
  		type: "each",
  		source: "(55:4) {#each config.grid.placement as coords}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$5(ctx) {
  	let svg;

  	function select_block_type(ctx, dirty) {
  		if (/*config*/ ctx[0].grid) return create_if_block;
  		if (/*config*/ ctx[0].nested = "nested") return create_if_block_2;
  	}

  	let current_block_type = select_block_type(ctx);
  	let if_block = current_block_type && current_block_type(ctx);

  	const block = {
  		c: function create() {
  			svg = svg_element("svg");
  			if (if_block) if_block.c();
  			attr_dev(svg, "class", "svelte-tm32g6");
  			add_location(svg, file$5, 13, 0, 254);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, svg, anchor);
  			if (if_block) if_block.m(svg, null);
  		},
  		p: function update(ctx, [dirty]) {
  			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
  				if_block.p(ctx, dirty);
  			} else {
  				if (if_block) if_block.d(1);
  				if_block = current_block_type && current_block_type(ctx);

  				if (if_block) {
  					if_block.c();
  					if_block.m(svg, null);
  				}
  			}
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(svg);

  			if (if_block) {
  				if_block.d();
  			}
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$5.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$5($$self, $$props, $$invalidate) {
  	let $theme;
  	validate_store(theme, 'theme');
  	component_subscribe($$self, theme, $$value => $$invalidate(2, $theme = $$value));
  	let { $$slots: slots = {}, $$scope } = $$props;
  	validate_slots('Graphics', slots, []);
  	let same;
  	let contrast;
  	let { config } = $$props;
  	const writable_props = ['config'];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Graphics> was created with unknown prop '${key}'`);
  	});

  	$$self.$$set = $$props => {
  		if ('config' in $$props) $$invalidate(0, config = $$props.config);
  	};

  	$$self.$capture_state = () => ({ theme, same, contrast, config, $theme });

  	$$self.$inject_state = $$props => {
  		if ('same' in $$props) same = $$props.same;
  		if ('contrast' in $$props) $$invalidate(1, contrast = $$props.contrast);
  		if ('config' in $$props) $$invalidate(0, config = $$props.config);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*$theme*/ 4) {
  			$$invalidate(
  				1,
  				[same, contrast] = $theme === "neu-light"
  				? ["#e5e5e5", "#222"]
  				: ["#222", "#e5e5e5"],
  				contrast
  			);
  		}
  	};

  	return [config, contrast, $theme];
  }

  class Graphics extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$5, create_fragment$5, safe_not_equal, { config: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Graphics",
  			options,
  			id: create_fragment$5.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*config*/ ctx[0] === undefined && !('config' in props)) {
  			console.warn("<Graphics> was created without expected prop 'config'");
  		}
  	}

  	get config() {
  		throw new Error("<Graphics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set config(value) {
  		throw new Error("<Graphics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* src\components\Cell.svelte generated by Svelte v3.47.0 */
  const file$4 = "src\\components\\Cell.svelte";

  function create_fragment$4(ctx) {
  	let div;
  	let graphics;
  	let div_data_neu_click_value;
  	let current;

  	graphics = new Graphics({
  			props: { config: /*config*/ ctx[0] },
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			div = element("div");
  			create_component(graphics.$$.fragment);
  			attr_dev(div, "class", "cell neu-bordered rounded-2 svelte-1yt17fx");
  			attr_dev(div, "data-neu-click", div_data_neu_click_value = /*btn*/ ctx[1] ? "neu-pressed" : "neu-bordered");
  			toggle_class(div, "btn", /*btn*/ ctx[1]);
  			add_location(div, file$4, 7, 0, 158);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);
  			mount_component(graphics, div, null);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const graphics_changes = {};
  			if (dirty & /*config*/ 1) graphics_changes.config = /*config*/ ctx[0];
  			graphics.$set(graphics_changes);

  			if (!current || dirty & /*btn*/ 2 && div_data_neu_click_value !== (div_data_neu_click_value = /*btn*/ ctx[1] ? "neu-pressed" : "neu-bordered")) {
  				attr_dev(div, "data-neu-click", div_data_neu_click_value);
  			}

  			if (dirty & /*btn*/ 2) {
  				toggle_class(div, "btn", /*btn*/ ctx[1]);
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(graphics.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(graphics.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			destroy_component(graphics);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$4.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$4($$self, $$props, $$invalidate) {
  	let { $$slots: slots = {}, $$scope } = $$props;
  	validate_slots('Cell', slots, []);
  	let { config } = $$props;
  	let { btn = false } = $$props;
  	const writable_props = ['config', 'btn'];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cell> was created with unknown prop '${key}'`);
  	});

  	$$self.$$set = $$props => {
  		if ('config' in $$props) $$invalidate(0, config = $$props.config);
  		if ('btn' in $$props) $$invalidate(1, btn = $$props.btn);
  	};

  	$$self.$capture_state = () => ({ Rules, Graphics, config, btn });

  	$$self.$inject_state = $$props => {
  		if ('config' in $$props) $$invalidate(0, config = $$props.config);
  		if ('btn' in $$props) $$invalidate(1, btn = $$props.btn);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [config, btn];
  }

  class Cell extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$4, create_fragment$4, safe_not_equal, { config: 0, btn: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Cell",
  			options,
  			id: create_fragment$4.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*config*/ ctx[0] === undefined && !('config' in props)) {
  			console.warn("<Cell> was created without expected prop 'config'");
  		}
  	}

  	get config() {
  		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set config(value) {
  		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get btn() {
  		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set btn(value) {
  		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* src\components\Grid.svelte generated by Svelte v3.47.0 */
  const file$3 = "src\\components\\Grid.svelte";

  function get_each_context$2(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[1] = list[i];
  	return child_ctx;
  }

  function get_each_context_1(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[4] = list[i];
  	return child_ctx;
  }

  // (9:4) {#each row as cell}
  function create_each_block_1(ctx) {
  	let cell;
  	let current;

  	cell = new Cell({
  			props: { config: /*cell*/ ctx[4].config },
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cell.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cell, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cell_changes = {};
  			if (dirty & /*cells*/ 1) cell_changes.config = /*cell*/ ctx[4].config;
  			cell.$set(cell_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cell.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cell.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cell, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block_1.name,
  		type: "each",
  		source: "(9:4) {#each row as cell}",
  		ctx
  	});

  	return block;
  }

  // (8:2) {#each cells as row}
  function create_each_block$2(ctx) {
  	let each_1_anchor;
  	let current;
  	let each_value_1 = /*row*/ ctx[1];
  	validate_each_argument(each_value_1);
  	let each_blocks = [];

  	for (let i = 0; i < each_value_1.length; i += 1) {
  		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  	}

  	const out = i => transition_out(each_blocks[i], 1, 1, () => {
  		each_blocks[i] = null;
  	});

  	const block = {
  		c: function create() {
  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			each_1_anchor = empty();
  		},
  		m: function mount(target, anchor) {
  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(target, anchor);
  			}

  			insert_dev(target, each_1_anchor, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*cells*/ 1) {
  				each_value_1 = /*row*/ ctx[1];
  				validate_each_argument(each_value_1);
  				let i;

  				for (i = 0; i < each_value_1.length; i += 1) {
  					const child_ctx = get_each_context_1(ctx, each_value_1, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  						transition_in(each_blocks[i], 1);
  					} else {
  						each_blocks[i] = create_each_block_1(child_ctx);
  						each_blocks[i].c();
  						transition_in(each_blocks[i], 1);
  						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
  					}
  				}

  				group_outros();

  				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
  					out(i);
  				}

  				check_outros();
  			}
  		},
  		i: function intro(local) {
  			if (current) return;

  			for (let i = 0; i < each_value_1.length; i += 1) {
  				transition_in(each_blocks[i]);
  			}

  			current = true;
  		},
  		o: function outro(local) {
  			each_blocks = each_blocks.filter(Boolean);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				transition_out(each_blocks[i]);
  			}

  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_each(each_blocks, detaching);
  			if (detaching) detach_dev(each_1_anchor);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block$2.name,
  		type: "each",
  		source: "(8:2) {#each cells as row}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$3(ctx) {
  	let div1;
  	let t0;
  	let div0;
  	let current;
  	let each_value = /*cells*/ ctx[0];
  	validate_each_argument(each_value);
  	let each_blocks = [];

  	for (let i = 0; i < each_value.length; i += 1) {
  		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  	}

  	const out = i => transition_out(each_blocks[i], 1, 1, () => {
  		each_blocks[i] = null;
  	});

  	const block = {
  		c: function create() {
  			div1 = element("div");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			t0 = space();
  			div0 = element("div");
  			div0.textContent = "?";
  			attr_dev(div0, "class", "missing neu-pressed rounded-2 svelte-5lpqwg");
  			add_location(div0, file$3, 12, 2, 220);
  			attr_dev(div1, "class", "grid py-1 svelte-5lpqwg");
  			add_location(div1, file$3, 6, 0, 83);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div1, anchor);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(div1, null);
  			}

  			append_dev(div1, t0);
  			append_dev(div1, div0);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (dirty & /*cells*/ 1) {
  				each_value = /*cells*/ ctx[0];
  				validate_each_argument(each_value);
  				let i;

  				for (i = 0; i < each_value.length; i += 1) {
  					const child_ctx = get_each_context$2(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  						transition_in(each_blocks[i], 1);
  					} else {
  						each_blocks[i] = create_each_block$2(child_ctx);
  						each_blocks[i].c();
  						transition_in(each_blocks[i], 1);
  						each_blocks[i].m(div1, t0);
  					}
  				}

  				group_outros();

  				for (i = each_value.length; i < each_blocks.length; i += 1) {
  					out(i);
  				}

  				check_outros();
  			}
  		},
  		i: function intro(local) {
  			if (current) return;

  			for (let i = 0; i < each_value.length; i += 1) {
  				transition_in(each_blocks[i]);
  			}

  			current = true;
  		},
  		o: function outro(local) {
  			each_blocks = each_blocks.filter(Boolean);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				transition_out(each_blocks[i]);
  			}

  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div1);
  			destroy_each(each_blocks, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$3.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$3($$self, $$props, $$invalidate) {
  	let { $$slots: slots = {}, $$scope } = $$props;
  	validate_slots('Grid', slots, []);
  	let { cells } = $$props;
  	const writable_props = ['cells'];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grid> was created with unknown prop '${key}'`);
  	});

  	$$self.$$set = $$props => {
  		if ('cells' in $$props) $$invalidate(0, cells = $$props.cells);
  	};

  	$$self.$capture_state = () => ({ Cell, cells });

  	$$self.$inject_state = $$props => {
  		if ('cells' in $$props) $$invalidate(0, cells = $$props.cells);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [cells];
  }

  class Grid extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$3, create_fragment$3, safe_not_equal, { cells: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Grid",
  			options,
  			id: create_fragment$3.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*cells*/ ctx[0] === undefined && !('cells' in props)) {
  			console.warn("<Grid> was created without expected prop 'cells'");
  		}
  	}

  	get cells() {
  		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set cells(value) {
  		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* src\components\Answers.svelte generated by Svelte v3.47.0 */

  const { console: console_1 } = globals;
  const file$2 = "src\\components\\Answers.svelte";

  function get_each_context$1(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[4] = list[i];
  	return child_ctx;
  }

  // (44:2) {#each choices as choice}
  function create_each_block$1(ctx) {
  	let cell;
  	let current;

  	cell = new Cell({
  			props: {
  				config: /*choice*/ ctx[4].config,
  				btn: true
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cell.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cell, target, anchor);
  			current = true;
  		},
  		p: noop,
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cell.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cell.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cell, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block$1.name,
  		type: "each",
  		source: "(44:2) {#each choices as choice}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$2(ctx) {
  	let span;
  	let t1;
  	let div;
  	let current;
  	let each_value = /*choices*/ ctx[0];
  	validate_each_argument(each_value);
  	let each_blocks = [];

  	for (let i = 0; i < each_value.length; i += 1) {
  		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  	}

  	const out = i => transition_out(each_blocks[i], 1, 1, () => {
  		each_blocks[i] = null;
  	});

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = "Which best follows the pattern?";
  			t1 = space();
  			div = element("div");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			add_location(span, file$2, 40, 0, 856);
  			attr_dev(div, "class", "answers py-1 svelte-1289qyk");
  			add_location(div, file$2, 42, 0, 904);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  			insert_dev(target, t1, anchor);
  			insert_dev(target, div, anchor);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(div, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (dirty & /*choices*/ 1) {
  				each_value = /*choices*/ ctx[0];
  				validate_each_argument(each_value);
  				let i;

  				for (i = 0; i < each_value.length; i += 1) {
  					const child_ctx = get_each_context$1(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  						transition_in(each_blocks[i], 1);
  					} else {
  						each_blocks[i] = create_each_block$1(child_ctx);
  						each_blocks[i].c();
  						transition_in(each_blocks[i], 1);
  						each_blocks[i].m(div, null);
  					}
  				}

  				group_outros();

  				for (i = each_value.length; i < each_blocks.length; i += 1) {
  					out(i);
  				}

  				check_outros();
  			}
  		},
  		i: function intro(local) {
  			if (current) return;

  			for (let i = 0; i < each_value.length; i += 1) {
  				transition_in(each_blocks[i]);
  			}

  			current = true;
  		},
  		o: function outro(local) {
  			each_blocks = each_blocks.filter(Boolean);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				transition_out(each_blocks[i]);
  			}

  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  			if (detaching) detach_dev(t1);
  			if (detaching) detach_dev(div);
  			destroy_each(each_blocks, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$2.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$2($$self, $$props, $$invalidate) {
  	let { $$slots: slots = {}, $$scope } = $$props;
  	validate_slots('Answers', slots, []);
  	let { answer } = $$props;
  	let { wrong } = $$props;

  	const shuffle = array => {
  		for (let i = array.length - 1; i > 0; i--) {
  			const j = Math.floor(Math.random() * (i + 1));
  			[array[i], array[j]] = [array[j], array[i]];
  		}

  		return array;
  	};

  	const choices = shuffle([answer, ...wrong]);

  	// let config = {
  	//   grid: {
  	//     fill: "rect",
  	//     placement: [
  	//       {
  	//         // x: col,
  	//         // y: row,
  	//         x: 1,
  	//         y: 2,
  	//       },
  	//     ],
  	//   },
  	// };
  	onMount(() => {
  		document.querySelectorAll(".answers .cell").forEach((cell, i) => {
  			cell.addEventListener("click", () => {
  				console.log(`clicked ${i}`);
  			});
  		});
  	});

  	const writable_props = ['answer', 'wrong'];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Answers> was created with unknown prop '${key}'`);
  	});

  	$$self.$$set = $$props => {
  		if ('answer' in $$props) $$invalidate(1, answer = $$props.answer);
  		if ('wrong' in $$props) $$invalidate(2, wrong = $$props.wrong);
  	};

  	$$self.$capture_state = () => ({
  		Cell,
  		onMount,
  		answer,
  		wrong,
  		shuffle,
  		choices
  	});

  	$$self.$inject_state = $$props => {
  		if ('answer' in $$props) $$invalidate(1, answer = $$props.answer);
  		if ('wrong' in $$props) $$invalidate(2, wrong = $$props.wrong);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [choices, answer, wrong];
  }

  class Answers extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$2, create_fragment$2, safe_not_equal, { answer: 1, wrong: 2 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Answers",
  			options,
  			id: create_fragment$2.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*answer*/ ctx[1] === undefined && !('answer' in props)) {
  			console_1.warn("<Answers> was created without expected prop 'answer'");
  		}

  		if (/*wrong*/ ctx[2] === undefined && !('wrong' in props)) {
  			console_1.warn("<Answers> was created without expected prop 'wrong'");
  		}
  	}

  	get answer() {
  		throw new Error("<Answers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set answer(value) {
  		throw new Error("<Answers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get wrong() {
  		throw new Error("<Answers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set wrong(value) {
  		throw new Error("<Answers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* src\components\Pagination.svelte generated by Svelte v3.47.0 */
  const file$1 = "src\\components\\Pagination.svelte";

  function get_each_context(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[9] = list[i];
  	return child_ctx;
  }

  // (26:2) {#each [$currentQuestion - 1, $currentQuestion, $currentQuestion + 1] as i}
  function create_each_block(ctx) {
  	let li;
  	let button;
  	let t_value = /*i*/ ctx[9] + "";
  	let t;
  	let mounted;
  	let dispose;

  	function click_handler() {
  		return /*click_handler*/ ctx[6](/*i*/ ctx[9]);
  	}

  	const block = {
  		c: function create() {
  			li = element("li");
  			button = element("button");
  			t = text(t_value);
  			attr_dev(button, "class", "btn neu-flat rounded-1 svelte-1yr0nmv");
  			toggle_class(button, "neu-pressed", /*$currentQuestion*/ ctx[1] === /*i*/ ctx[9]);
  			add_location(button, file$1, 27, 6, 884);
  			attr_dev(li, "class", "neu-flat svelte-1yr0nmv");
  			toggle_class(li, "hidden", /*limit*/ ctx[2](/*i*/ ctx[9]) !== /*i*/ ctx[9]);
  			add_location(li, file$1, 26, 4, 825);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, li, anchor);
  			append_dev(li, button);
  			append_dev(button, t);

  			if (!mounted) {
  				dispose = listen_dev(button, "click", click_handler, false, false, false);
  				mounted = true;
  			}
  		},
  		p: function update(new_ctx, dirty) {
  			ctx = new_ctx;
  			if (dirty & /*$currentQuestion*/ 2 && t_value !== (t_value = /*i*/ ctx[9] + "")) set_data_dev(t, t_value);

  			if (dirty & /*$currentQuestion*/ 2) {
  				toggle_class(button, "neu-pressed", /*$currentQuestion*/ ctx[1] === /*i*/ ctx[9]);
  			}

  			if (dirty & /*limit, $currentQuestion*/ 6) {
  				toggle_class(li, "hidden", /*limit*/ ctx[2](/*i*/ ctx[9]) !== /*i*/ ctx[9]);
  			}
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(li);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block.name,
  		type: "each",
  		source: "(26:2) {#each [$currentQuestion - 1, $currentQuestion, $currentQuestion + 1] as i}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$1(ctx) {
  	let ul;
  	let li0;
  	let button0;
  	let t1;
  	let t2;
  	let li1;
  	let button1;
  	let mounted;
  	let dispose;

  	let each_value = [
  		/*$currentQuestion*/ ctx[1] - 1,
  		/*$currentQuestion*/ ctx[1],
  		/*$currentQuestion*/ ctx[1] + 1
  	];

  	validate_each_argument(each_value);
  	let each_blocks = [];

  	for (let i = 0; i < 3; i += 1) {
  		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  	}

  	const block = {
  		c: function create() {
  			ul = element("ul");
  			li0 = element("li");
  			button0 = element("button");
  			button0.textContent = "⟪";
  			t1 = space();

  			for (let i = 0; i < 3; i += 1) {
  				each_blocks[i].c();
  			}

  			t2 = space();
  			li1 = element("li");
  			button1 = element("button");
  			button1.textContent = "⟫";
  			attr_dev(button0, "class", "btn neu-flat rounded-1 svelte-1yr0nmv");
  			add_location(button0, file$1, 22, 4, 659);
  			attr_dev(li0, "class", "neu-flat");
  			toggle_class(li0, "disabled", /*$currentQuestion*/ ctx[1] <= 1);
  			toggle_class(li0, "pressed", /*$currentQuestion*/ ctx[1] <= 1);
  			add_location(li0, file$1, 17, 2, 536);
  			attr_dev(button1, "class", "btn neu-flat rounded-1 svelte-1yr0nmv");
  			add_location(button1, file$1, 40, 4, 1219);
  			attr_dev(li1, "class", "neu-flat");
  			toggle_class(li1, "disabled", /*$currentQuestion*/ ctx[1] >= /*totalQuestions*/ ctx[0]);
  			toggle_class(li1, "pressed", /*$currentQuestion*/ ctx[1] >= /*totalQuestions*/ ctx[0]);
  			add_location(li1, file$1, 35, 2, 1070);
  			attr_dev(ul, "class", "pagination svelte-1yr0nmv");
  			add_location(ul, file$1, 16, 0, 509);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, ul, anchor);
  			append_dev(ul, li0);
  			append_dev(li0, button0);
  			append_dev(ul, t1);

  			for (let i = 0; i < 3; i += 1) {
  				each_blocks[i].m(ul, null);
  			}

  			append_dev(ul, t2);
  			append_dev(ul, li1);
  			append_dev(li1, button1);

  			if (!mounted) {
  				dispose = [
  					listen_dev(button0, "click", /*gotoFirst*/ ctx[3], false, false, false),
  					listen_dev(button1, "click", /*gotoLast*/ ctx[4], false, false, false)
  				];

  				mounted = true;
  			}
  		},
  		p: function update(ctx, [dirty]) {
  			if (dirty & /*$currentQuestion*/ 2) {
  				toggle_class(li0, "disabled", /*$currentQuestion*/ ctx[1] <= 1);
  			}

  			if (dirty & /*$currentQuestion*/ 2) {
  				toggle_class(li0, "pressed", /*$currentQuestion*/ ctx[1] <= 1);
  			}

  			if (dirty & /*limit, $currentQuestion, gotoPage*/ 38) {
  				each_value = [
  					/*$currentQuestion*/ ctx[1] - 1,
  					/*$currentQuestion*/ ctx[1],
  					/*$currentQuestion*/ ctx[1] + 1
  				];

  				validate_each_argument(each_value);
  				let i;

  				for (i = 0; i < 3; i += 1) {
  					const child_ctx = get_each_context(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  					} else {
  						each_blocks[i] = create_each_block(child_ctx);
  						each_blocks[i].c();
  						each_blocks[i].m(ul, t2);
  					}
  				}

  				for (; i < 3; i += 1) {
  					each_blocks[i].d(1);
  				}
  			}

  			if (dirty & /*$currentQuestion, totalQuestions*/ 3) {
  				toggle_class(li1, "disabled", /*$currentQuestion*/ ctx[1] >= /*totalQuestions*/ ctx[0]);
  			}

  			if (dirty & /*$currentQuestion, totalQuestions*/ 3) {
  				toggle_class(li1, "pressed", /*$currentQuestion*/ ctx[1] >= /*totalQuestions*/ ctx[0]);
  			}
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(ul);
  			destroy_each(each_blocks, detaching);
  			mounted = false;
  			run_all(dispose);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$1.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$1($$self, $$props, $$invalidate) {
  	let $currentQuestion;
  	validate_store(currentQuestion, 'currentQuestion');
  	component_subscribe($$self, currentQuestion, $$value => $$invalidate(1, $currentQuestion = $$value));
  	let { $$slots: slots = {}, $$scope } = $$props;
  	validate_slots('Pagination', slots, []);
  	let { totalQuestions = 30 } = $$props;
  	const limit = val => Math.max(1, Math.min(val, totalQuestions));
  	const gotoFirst = () => currentQuestion.set(1);
  	const gotoLast = () => currentQuestion.set(totalQuestions);
  	const gotoNext = () => currentQuestion.update(n => limit(n + 1));
  	const gotoPrev = () => currentQuestion.update(n => limit(n - 1));
  	const gotoPage = page => currentQuestion.set(limit(page));
  	const writable_props = ['totalQuestions'];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pagination> was created with unknown prop '${key}'`);
  	});

  	const click_handler = i => gotoPage(i);

  	$$self.$$set = $$props => {
  		if ('totalQuestions' in $$props) $$invalidate(0, totalQuestions = $$props.totalQuestions);
  	};

  	$$self.$capture_state = () => ({
  		currentQuestion,
  		totalQuestions,
  		limit,
  		gotoFirst,
  		gotoLast,
  		gotoNext,
  		gotoPrev,
  		gotoPage,
  		$currentQuestion
  	});

  	$$self.$inject_state = $$props => {
  		if ('totalQuestions' in $$props) $$invalidate(0, totalQuestions = $$props.totalQuestions);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [
  		totalQuestions,
  		$currentQuestion,
  		limit,
  		gotoFirst,
  		gotoLast,
  		gotoPage,
  		click_handler
  	];
  }

  class Pagination extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$1, create_fragment$1, safe_not_equal, { totalQuestions: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Pagination",
  			options,
  			id: create_fragment$1.name
  		});
  	}

  	get totalQuestions() {
  		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set totalQuestions(value) {
  		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* src\components\App.svelte generated by Svelte v3.47.0 */
  const file = "src\\components\\App.svelte";

  function create_fragment(ctx) {
  	let main;
  	let header;
  	let t0;
  	let div;
  	let grid;
  	let t1;
  	let answers;
  	let t2;
  	let pagination;
  	let current;
  	header = new Header({ $$inline: true });

  	grid = new Grid({
  			props: { cells: /*cells*/ ctx[0] },
  			$$inline: true
  		});

  	answers = new Answers({
  			props: {
  				answer: /*answer*/ ctx[1],
  				wrong: /*wrong*/ ctx[2]
  			},
  			$$inline: true
  		});

  	pagination = new Pagination({
  			props: { totalQuestions: 35 },
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			main = element("main");
  			create_component(header.$$.fragment);
  			t0 = space();
  			div = element("div");
  			create_component(grid.$$.fragment);
  			t1 = space();
  			create_component(answers.$$.fragment);
  			t2 = space();
  			create_component(pagination.$$.fragment);
  			attr_dev(div, "class", "grix center");
  			add_location(div, file, 57, 2, 1365);
  			attr_dev(main, "class", "svelte-pbgjhb");
  			add_location(main, file, 55, 0, 1343);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, main, anchor);
  			mount_component(header, main, null);
  			append_dev(main, t0);
  			append_dev(main, div);
  			mount_component(grid, div, null);
  			append_dev(div, t1);
  			mount_component(answers, div, null);
  			append_dev(div, t2);
  			mount_component(pagination, div, null);
  			current = true;
  		},
  		p: noop,
  		i: function intro(local) {
  			if (current) return;
  			transition_in(header.$$.fragment, local);
  			transition_in(grid.$$.fragment, local);
  			transition_in(answers.$$.fragment, local);
  			transition_in(pagination.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(header.$$.fragment, local);
  			transition_out(grid.$$.fragment, local);
  			transition_out(answers.$$.fragment, local);
  			transition_out(pagination.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(main);
  			destroy_component(header);
  			destroy_component(grid);
  			destroy_component(answers);
  			destroy_component(pagination);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance($$self, $$props, $$invalidate) {
  	let { $$slots: slots = {}, $$scope } = $$props;
  	validate_slots('App', slots, []);

  	let cells = [
  		[{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
  		[{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
  		[{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }]
  	];

  	// TODO the grid should be mapped through an array of functions,
  	// and the final output should be the grid of cells with row, col, and config
  	// the config shouldn't have logic, just the static description of the graphic
  	// I guess I could use [fn1,fn2,fn3].reduce((g,f)=>f(g),grid)
  	// apply rules to each cell
  	for (let row = 0; row < cells.length; row++) {
  		for (let col = 0; col < cells[row].length; col++) {
  			let cell = cells[row][col];

  			// specify how to render the cell
  			cell.config = {
  				grid: {
  					fill: "rect",
  					placement: [{ x: cell.col, y: cell.row }]
  				}
  			};
  		}
  	}

  	let answer = cells[cells.length - 1].pop();

  	// TODO generate plausible wrong answers
  	let wrong = [answer, answer, answer, answer, answer];

  	const writable_props = [];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
  	});

  	$$self.$capture_state = () => ({
  		Header,
  		Grid,
  		Answers,
  		Pagination,
  		cells,
  		answer,
  		wrong
  	});

  	$$self.$inject_state = $$props => {
  		if ('cells' in $$props) $$invalidate(0, cells = $$props.cells);
  		if ('answer' in $$props) $$invalidate(1, answer = $$props.answer);
  		if ('wrong' in $$props) $$invalidate(2, wrong = $$props.wrong);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [cells, answer, wrong];
  }

  class App extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance, create_fragment, safe_not_equal, {});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "App",
  			options,
  			id: create_fragment.name
  		});
  	}
  }

  const app = new App({
  	target: document.body,
  	// props: {
  	// 	name: 'world'
  	// }
  });

  return app;

})();
//# sourceMappingURL=bundle.js.map
