
const {v1: uuidv1 } = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },
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
  checkGeohashFormat: (geohash) =>{
    if(geohash.match("^[A-​Za-z0-9]+$") !== null){
      return geohash
    }else{
      return false
    }
  }

}

module.exports = Helpers