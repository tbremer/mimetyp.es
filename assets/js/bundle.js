!function(){
  function argsToArray(args, slice) {
    slice = slice || 0;
    return Array.prototype.slice.call(args, slice);
  }
  var emitter = {
    _events: {},
    on: function(title) {
      var callbacks = argsToArray(arguments, 1);

      if (!(title in this._events)) this._events[title] = [];

      this._events[title] = this._events[title].concat(callbacks);
    },
    off: function() {},
    trigger: function(evtName) {
      if (!(evtName in this._events)) return;
      var additionalData = argsToArray(arguments, 1);

      var length = this._events[evtName].length;
      var c = 0;

      for (; c < length; c++) {
        this._events[evtName][c].apply(null, additionalData);
      }
    }
  };

  /**
   * SHOW AND HIDE LOADING ELEMENTS
   */
  emitter.on('data-loaded', function() {
    var loader = document.getElementById('loading');
    var search = document.getElementById('search');

    loading.setAttribute('class', 'hide');
    search.removeAttribute('class');
    search.removeAttribute('aria-hidden');
  });

  /**
   * ENABLE SEARCH
   */
  emitter.on('data-loaded', function() {
    var search = document.getElementById('search');

    search.addEventListener('keyup', function(evt) { console.log('change');emitter.trigger('search-change', evt); }, false);
  });

  /**
   * SEARCH
   */
  emitter.on('search-change', function(evt) {
    var target = evt.target;
    var value = target.value.toLowerCase().replace(/^\.?/, '');
    var holder = document.getElementById('data');

    if (holder.firstChild) {
      while (holder.firstChild) {
        holder.removeChild(holder.firstChild);
      }
    }

    if (!(value in types)) return;

    var type = types[value];
    var node = document.createElement('div');

    node.textContent = type;

    holder.appendChild(node);
  });

  var hasStorage = 'localStorage' in window;
  var types = hasStorage ? JSON.parse(localStorage.getItem('types')) : null;

  if (!types) {
    var x = new XMLHttpRequest();
    x.open('GET', '/assets/data/mime-by-ext.json');

    x.onreadystatechange = function() {
      if (x.readyState !== 4) return;
      var response = x.response
      types = JSON.parse(response);
      emitter.trigger('data-loaded');
      window.localStorage.setItem('types', x.response);
    };

    x.send();
  }
  else {
    emitter.trigger('data-loaded');
  }
}();
