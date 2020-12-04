
const {v1: uuidv1 } = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },
  checkTitleUppercase: title =>{
    if(title.charAt(0) == title.charAt(0).toUpperCase()){
      return title
    }else{
      return false
    }
  },
  checkTitleLength: title =>{
    if(title.length < 100){
      return true
    }else{
      return false
    }
  },
  checkTitleType: title =>{
    if(typeof(title) == 'string'){
      return title
    }else{
      return false
    }
  },
  checkUUID: data =>{
    if(data.hasOwnProperty('uuid')){
      return data.uuid
    }else{
      return false
    }
  }
}

module.exports = Helpers