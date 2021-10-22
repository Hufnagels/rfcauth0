// JSON helpers
export const tryParseJSONObject = (jsonString) => {
  try {
      var o = JSON.parse(jsonString);

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object", 
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === "object") {
          return o;
      }
  }
  catch (e) { }

  return false;
};

// Numeric helpers
export const isNumeric = (str) => {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

// String helpers
export const isEmpty = (str) => {
  return (!str || str.length === 0 );
}

//For checking if a variable is falsey or if the string only contains whitespace or is empty, I use:
export const isBlank = (str) => {
    return (!str || /^\s*$/.test(str));
}

// OBJECT helpers
export const nestedLoop = (obj,searchKey, searchValue) => {
  const res = {};
  function recurse(obj, current) {
      for (const key in obj) {
          let value = obj[key];
          if(value !== undefined) {
              if (value && typeof value === 'object') {
                  recurse(value, key);
              } else {
                  // Do your stuff here to var value
                  if (key === searchKey && value === searchValue) {
                    res[key] = value;
                    console.log(key, value, obj)
                    res[key] = obj.children;
                    break;
                  }
                  
              }
          }
      }
  }
  recurse(obj);
  return res;
}

export const findObjectByLabel = (obj, key, value) => {
  for(var elements in obj){
      if (elements === key && obj[elements] === value){
           console.log(obj[elements]);
           console.log(JSON.stringify(obj.children));
           return obj.children;
      }
      if(typeof obj[elements] === 'object'){
        findObjectByLabel(obj[elements], key, value );
      }
  }
};

// ARRAY helpers
// create new array where key is the key, and holds array of object with the given key
export const groupBy3 = (xs, key) => {
  return xs.reduce(function(rv, x) {
    
    (rv[x[key]] = rv[x[key]] || []).push(x);
    //console.log(rv, x, rv[x[key]])
    return rv;
  }, {});
};

// Time helpers
export const daydiff = (date, now) => {
  const diff = Math.floor((now-date)/60/60/24)
  switch (diff) {
    case 0:
        return 'Today'
      //break;
    case 1:
        return 'Yestreday'
      //break;
    default:
      return diff+' days before'
  }
  //return Math.floor((now-date)/60/60/24)
}

export const isToday = (date, now = Date.now()*1000) => {
  date=new Date(date)*1000

  const yearDate = date.getYear();
  const monthDate = date.getMonth();
  const dayDate = date.getDate();
  const yearNow = now.getYear();
  const monthNow = now.getMonth();
  const dayNow = now.getDate();
  if (yearDate === yearNow && monthDate === monthNow && dayDate === dayNow) {
    return true
  } 
  return false
}

export const beforeToday = (date, now) => {
  //this month
  const yearDate = date.getYear();
  const monthDate = date.getMonth();
  const dayDate = date.getDate();
  const yearNow = now.getYear();
  const monthNow = now.getMonth();
  const dayNow = now.getDate();
  if (yearDate === yearNow && monthDate === monthNow && dayDate === dayNow) {
    return 'Todasy'
  } else if (yearDate === yearNow && monthDate === monthNow && (dayNow - dayDate) === 1) {
    return 'Yesterday'
  } else if (yearDate === yearNow && monthDate === monthNow ) {
    return (dayNow - dayDate) + ' days ago'
  }
  return false
}