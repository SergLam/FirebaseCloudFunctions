"use strict";

exports.is_undefined = function(param) {
  return (typeof param === 'undefined') ? null : param;
}
