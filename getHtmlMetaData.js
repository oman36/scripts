(function() {
  var metas = [];
  for(var i in document.getElementsByTagName('meta')) {
    var meta = {};
    if (isNaN(parseInt(i))) {
      continue;
      }
    elem = document.getElementsByTagName('meta').item(i);
    for(var j in elem.attributes) {
          if (isNaN(parseInt(j))) {
              continue;
          }
          meta[elem.attributes[j].name] = elem.attributes[j].value;
    }
    metas.push(meta);
  }

  return metas.sort( function (a,b) {
    if( !a.hasOwnProperty('name')) return -1
    if( !b.hasOwnProperty('name')) return 1
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  });
})();
