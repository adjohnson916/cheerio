var _ = require("underscore"),
    soupselect = require("cheerio-soupselect"),
    $ = require("../cheerio");

var find = exports.find = function(selector) {
  if(!selector) return this;

  var elem = soupselect.select(this.toArray(), selector);
  return $(elem);
};

var parent = exports.parent = function(elem) {
  if(this[0] && this[0].parent)
    return $(this[0].parent);
  else
    return $();
};

var is = exports.is = function(selector) {
  if(!selector) return true;
  
  result = true;
  dom = this.clone().toArray();
  for(i=0; i<dom.length; ++i) {
    dom[i].children = [];
    var elem = soupselect.select(dom, selector);
    result = result && (elem.length !== 0);
  }
  return result;
};

var not = exports.not = function(selector) {
  these = this.toArray()
  those = []
  $.each(these, function (index, elem) {
    $elem = $(elem)
    if (! $elem.is(selector)) {
      those.push($elem);
    }
  });
  return $(those);
};

var next = exports.next = function(elem) {
  if(!this[0]) return $();

  var nextSibling = this[0].next;
  while(nextSibling) {
    if($.isTag(nextSibling)) return $(nextSibling);
    nextSibling = nextSibling.next;
  }
  return $();
};

var prev = exports.prev = function(elem) {
  if(!this[0]) return $();

  var prevSibling = this[0].prev;
  while(prevSibling) {
    if($.isTag(prevSibling)) return $(prevSibling);
    prevSibling = prevSibling.prev;
  }
  return $();
};

var siblings = exports.siblings = function(elem) {
  if(!this[0]) return $();

  var self = this,
      siblings = (this.parent()) ? this.parent().children()
                                 : this.siblingsAndMe();

  siblings = _.filter(siblings, function(elem) {
    return (elem !== self[0] && $.isTag(elem));
  });

  return $(siblings);
};

var children = exports.children = function(selector) {
  if(!this[0] || !this[0].children) return $();

  var children = _.filter(this[0].children, function(elem) {
    return ($.isTag(elem));
  });

  if(selector === undefined) return $(children);
  else if(_.isNumber(selector)) return $(children[selector]);

  return $(children).find(selector);
};


var closest = exports.closest = function(selector) {
  var $elem;
  $elem = this.parent();
  while ( $elem.size() > 0 ) {
    if ($elem.is(selector)) {
      return $elem;
    }
    else {
      $elem = $elem.parent();
    }
  }
  return $();
  /*
  var $elem, matches;
  $elem = this.parent();
  while ( $elem.size() > 0 ) {
  	console.log($elem.parent().size());
    matches = $elem.parent().children(selector);
    if ( matches.size() > 0 && $.inArray( $elem, matches ) ) {
      return $elem;
    }
    else {
      $elem = $elem.parent();
    }
  }
  return $();
  */
};
/*
** CoffeeScript source **
closest = exports.closest = (selector) ->
	$elem = this
	while $elem.size() > 0
		matches = $elem.parent().children(selector)
		if cheerio.inArray( $elem, matches )
			return $elem.parent()
		else
			$elem = $elem.parent()
	return $()
*/

var each = exports.each = function(callback, args) {
  return $.each(this, callback, args);
};

var first = exports.first = function() {
    return this[0] ? $(this[0]) : $();
};

var last = exports.last = function() {
    return this[0] ? $(this[this.length - 1]) : $();
};

module.exports = $.fn.extend(exports);
