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