
const {v1: uuidv1 } = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },
  //Check of het type van de maanden een object is en of de variabele niet null is
  //En of het geen array is, omdat objecten en arrays verward worden met elkaar
  checkYearlyAverages: (months) =>{
    if(typeof months === 'object' && months !== null && !Array.isArray(months)){
      return months
    }else{
      return false
    }
  },
  checkGeohashLength: (geohash) =>{
    if(geohash.length <= 10){
      return geohash
    }else{
      return false
    }
  },

}

module.exports = Helpers